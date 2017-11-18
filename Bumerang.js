//  -------------   WEBGL 3D-Programm  (rotierender Torus mit Beleuchtung) -------------------
//                                                   E.Gutknecht, Nov.2017

"use strict"; // Javascript strict mode

//  ---------  globale Daten  ---------------------------

var maxVerts = 2048; // max. Anzahl Vertices im Vertex-Array
var gl;
var canvas; // OpenGL Window
var mygl; // OpenGL Basis-Funktionen
var programId;

var elevation = 10;
var azimut = 30;

var M = Mat4.ID; // ModelView-Matrix
var P = Mat4.ID; // Projektions-Matrix

var rotk; // Rotationskoerper

//  -------- Viewing-Volume  ---------------
var left = -4,
  right = 4;
var ybottom, ytop; // Achtung: 'top' ist Browservariable
var near = -10,
  far = 1000;

// LookAt-Parameter fuer Kamera-System
var A = new Vec3(0, 0, 4); // Kamera-Pos. (Auge)
var B = new Vec3(0, 0, 0); // Zielpunkt
var up = new Vec3(0, 1, 0); // up-Richtung

// Startpunkt
const start = new Vec3(1, 0.2, 0);

// Schussrichtung
const direction = new Vec3(0, 0, -0.1);

// Auftrieb
const buoyancy = new Vec3(-0.01, 0.01, 0);
// assert(buoyancy.angle(direction) === Math.PI / 2);

// Erdanzieung
const gravitation = new Vec3(0, -0.001, 0);

let rotation = buoyancy.angle(new Vec3(1, 0, 0));
let currentPosition = start;
let currentDirection = direction;

var phi = 0; // Drehwinkel Torus
var dPhi = 0.5; // Zuwachs Drehwinkel
var stopped = false; // Animation stoppen

let step = 0;
const dStep = 0.1;

// ------  Initialisierung  --------

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas); // OpenGL-Kontext erzeugen
  if (!gl) alert("WebGL isn't available");
  programId = MyShaders.initShaders(
    gl, // Compile und Link Shaders
    MyShaders.vShader2, // Vertex-Shader
    MyShaders.fShader0
  ); // Fragment-Shader
  mygl = new MyGLBase1(gl, programId, maxVerts); // eigene Hilfsfunktionen
  var aspect = canvas.height / canvas.width;
  ybottom = aspect * left;
  ytop = aspect * right;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.1, 0.4, 0.8, 1.0); // Hintergrund-Farbe
  gl.enable(gl.DEPTH_TEST); // Sichtbarkeits-Test
  rotk = new RotKoerper(mygl);
  gl.enable(gl.POLYGON_OFFSET_FILL); // Polygon OffsetFill Mode
  gl.polygonOffset(1, 1);
  render(); // Bild zeichnen
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //  ------  Projektionsmatrix  ------
  P = Mat4.ortho(left, right, ybottom, ytop, near, far);
  mygl.setP(gl, P);

  //  ------  Kamera-System (ViewMatrix)  ------
  var R1 = Mat4.rotate(-elevation, 1, 0, 0);
  var R2 = Mat4.rotate(azimut, 0, 1, 0);
  var R = R1.preMultiply(R2);
  M = Mat4.lookAt(R.transform3(A), B, R.transform3(up));
  mygl.setM(gl, M);

  var light = new Vec3(0, 1, 4); // Koord. der Lichtquelle im abs. System
  mygl.setLightPosition(gl, light.x, light.y, light.z);

  // ------  absolute Koordinatenachsen  ----------
  mygl.setColor(1, 1, 1);
  mygl.setShadingLevel(gl, 0); // ohne Beleuchtung
  mygl.drawAxis(gl, 2, 2, 2);

  //  ------  Objekt-System (ModelMatrix)  ------
  /*
  M = M.postMultiply(Mat4.rotate(phi, 0, 1, 0));
  mygl.setM(gl, M);
  */

  //  ------  Torus zeichnen  ------
  /*
  mygl.setColor(0, 0.4, 1);
  mygl.setShadingParam(gl, 0.2, 0.8); // Parameter ambient und diffuse
  mygl.setShadingLevel(gl, 1); // Beleuchtung ein
  rotk.zeichneTorus(gl, 0.5, 2, 20, 40, true); // Torus zeichnen
  mygl.setShadingLevel(gl, 0); // Beleuchtung aus
  mygl.setColor(0, 1, 1);
  rotk.zeichneTorus(gl, 0.5, 2, 20, 40, false); // Gitterlinien des Torus
  if (!stopped) phi += dPhi; // Drehwinkel erhoehen
  */

  M = M.postMultiply(
    Mat4.translate(currentPosition.x, currentPosition.y, currentPosition.z)
  ).postMultiply(
    Mat4.rotate(
      rotation * 180 / Math.PI,
      currentDirection.x,
      currentDirection.y,
      currentDirection.z
    )
  );
  mygl.setM(gl, M);

  mygl.setColor(0.8, 0.2, 0.2);
  rotk.zeichneZylinder(gl, 0.2, 0.05, 20, 40, true);

  currentPosition = currentPosition
    .add(currentDirection)
    .add(buoyancy)
    .add(gravitation);
  /*
  currentDirection = currentDirection.add(gravitation).add(buoyancy);
  */

  step += dStep;

  requestAnimFrame(render); // next frame
}

function charCode(
  s // ASCII-Code des ersten Char. in s
) {
  return s.charCodeAt(0);
}

// ------  Tastenverarbeitung  ------------------
window.onkeydown = function(event) {
  switch (event.keyCode) {
    case 38: // up arrow
    case charCode("U"):
      elevation++;
      break;
    case 40: // down arrow
    case charCode("D"):
      elevation--;
      break;
    case 37: // left arrow
    case charCode("L"):
      azimut--;
      break;
    case 39: // right arrow
    case charCode("R"):
      azimut++;
      break;
    case charCode("V"):
      if (event.shiftKey == 1)
        dPhi += 0.2; // 'V'
      else dPhi -= 0.1; // 'v'
      break;
    case 190: // .
      dPhi -= 0.1;
      break;
    case 188: // .
      dPhi += 0.2;
      break;
  }
};

// ------  Button-Verarbeitung  ------------------

function button1() {
  // Button-Funktion
  stopped = !stopped;
}
