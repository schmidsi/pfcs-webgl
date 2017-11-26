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

var stopped = true; // Animation stoppen

let step = 0;
let dStep = 0.05;

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
  gl.clearColor(0, 0, 0, 1.0); // Hintergrund-Farbe
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

  for (var i = 0; i < 10; i++) {
    drawBumerang(step + i * 0.6);
  }

  if (!stopped) step += dStep;

  requestAnimFrame(render); // next frame
}

function drawBumerang(step) {
  var thisM = M.postMultiply(
    Mat4.translate(
      2.5 * Math.cos(step),
      0.5 + 0.5 * Math.sin(step),
      2 * Math.sin(step)
    )
  ).postMultiply(Mat4.rotate(-45, Math.sin(step), 0, -Math.cos(step)));

  mygl.setM(gl, thisM);

  mygl.setColor(0.8, 0.2, 0.2);
  rotk.zeichneZylinder(gl, 0.3, 0.05, 20, 40, true);
  mygl.setColor(1, 1, 1, 0.8);
  rotk.zeichneZylinder(gl, 0.3, 0.05, 20, 6, false);
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
        dStep += 0.02; // 'V'
      else dStep -= 0.01; // 'v'
      break;
    case 190: // .
      dStep -= 0.01;
      break;
    case 188: // .
      dStep += 0.01;
      break;
    case 32:
      stopped = !stopped;
      break;
  }
};

// ------  Button-Verarbeitung  ------------------

function button1() {
  // Button-Funktion
  stopped = !stopped;
}
