//  -------------   WEBGL 3D-Programm  (Lorenz-Attraktor ) -------------------
//  E.Gutknecht, Nov.2017

"use strict"; // Javascript strict mode

//  ---------  globale Daten  ---------------------------

var maxVerts = 10000; // max. Anzahl Vertices im Vertex-Array
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
var left = -60,
  right = 60;
var ybottom, ytop;
var near = -10,
  far = 1000;

// LookAt-Parameter fuer Kamera-System
var A = new Vec3(0, 0, 100); // Kamera-Pos. (Auge)
var B = new Vec3(0, 0, 0); // Zielpunkt
var up = new Vec3(0, 1, 0); // up-Richtung

function LorenzDynamics() {
  function f(x) {
    var x1 = x[0],
      x2 = x[1],
      x3 = x[2];
    var y = [10 * x2 - 10 * x1, 28 * x1 - x2 - x1 * x3, x1 * x2 - 8 / 3 * x3];
    return y;
  }

  this.dynamics = new Dynamics(f);

  this.zeichneBahn = function(mygl, gl, xStart, yStart, zStart, dt, nSchritte) {
    mygl.rewindBuffer(gl);
    var x = [xStart, yStart, zStart];

    for (var i = 0; i < 50; i++) {
      x = this.dynamics.runge(x, dt);
    }
    for (var i = 0; i < nSchritte; i++) {
      x = this.dynamics.runge(x, dt);
      mygl.putVertex(x[0], x[1], x[2]);
    }
    mygl.copyBuffer(gl);
    mygl.drawArrays(gl, gl.LINE_STRIP);
  };
}

var lorenz = new LorenzDynamics();
//  ---------  Methoden  ----------------------------------

// ------  Initialisierung  --------

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas); // OpenGL-Kontext erzeugen
  if (!gl) alert("WebGL isn't available");
  programId = MyShaders.initShaders(
    gl, // Compile und Link Shaders
    MyShaders.vShader1, // Vertex-Shader
    MyShaders.fShader0
  ); // Fragment-Shader
  mygl = new MyGLBase1(gl, programId, maxVerts); // eigene Hilfsfunktionen
  var aspect = canvas.height / canvas.width;
  ybottom = aspect * left;
  ytop = aspect * right;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.1, 0.4, 0.8, 1.0); // Hintergrund-Farbe
  gl.enable(gl.DEPTH_TEST); // Sichtbarkeits-Test
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

  mygl.setColor(1, 1, 1);
  mygl.drawAxis(gl, 100, 100, 100); // Koordinatenachsen
  mygl.setColor(0, 1, 1);
  lorenz.zeichneBahn(mygl, gl, 10, 10, 10, 0.01, 5000);
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
