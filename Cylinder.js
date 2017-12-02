//  ---------   Dreieck (WebGL/Javascript)  ----------------------------
//                                          E.Gutknecht, Nov.2017

"use strict"; // Javascript strict mode

//  ---------  Globale Variabeln  -------------------------

var canvas; // OpenGl-Window
var gl; // OpenGl-Context
var mygl;

var M = Mat4.ID; // ModelMatrix
var P = Mat4.ID; // Projektionsmatrix

let t = 0;
var stopped = false; // Animation stoppen

var maxVerts = 1024; // max. Anzahl Vertices im Buffer
var programId; // Programm-Id

//  --------  Funktionen  -----------------------------------

function zeichneDreieck(gl, x1, y1, x2, y2, x3, y3) {
  mygl.rewindBuffer(gl);
  mygl.putVertex(x1, y1, 0); // Eckpunkte in VertexArray speichern
  mygl.putVertex(x2, y2, 0);
  mygl.putVertex(x3, y3, 0);
  mygl.copyBuffer(gl);
  mygl.drawArrays(gl, gl.TRIANGLES); // Figur zeichnen
}

function drawCircle(gl, r, xm, ym, pts) {
  const phi = 2 * Math.PI / pts;
  let x, y;
  mygl.rewindBuffer(gl);
  mygl.putVertex(xm, ym, 0);
  for (var i = 0; i <= pts; i++) {
    x = xm + r * Math.cos(i * phi);
    y = ym + r * Math.sin(i * phi);
    mygl.putVertex(x, y, 0);
  }
  mygl.copyBuffer(gl);
  mygl.drawArrays(gl, gl.TRIANGLE_FAN);
}

function drawLine(gl, rootVector, directionVector) {
  const endPosVector = rootVector.add(directionVector);

  // console.log(rootVector, endPosVector);

  mygl.rewindBuffer(gl);
  mygl.putVertex(rootVector.x, rootVector.y, 0);
  mygl.putVertex(endPosVector.x, endPosVector.y, 0);
  mygl.copyBuffer(gl);
  mygl.drawArrays(gl, gl.LINES);
}

// Gemäss Newtonsche Mechanik s. 35
function radialField(vector) {
  const r = vector.length();
  return vector.scale(r * 10);
}

// Gemäss Newton'sche Mechanik s. 36
function linearField(vector) {
  const a = 0;
  const b = -1;
  const c = 1;
  const d = 0;

  const x = a * vector.x + b * vector.y;
  const y = c * vector.x + d * vector.y;
  return new Vec3(x, y, 0);
}

// Integralkurve gemäss Newton'sche Mechanik s. 38
function integralCurve(r, t) {
  return new Vec3(r * Math.cos(t), r * Math.sin(t), 0);
}

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
  gl.viewport(0, 0, canvas.width, canvas.height); // Bild-Rechteck waehlen
  gl.clearColor(0, 0, 0, 1); // Hintergrund-Farbe
  render(); // Bild zeichnen
};

// ------  Bild zeichnen  --------
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT); // Bild loeschen
  M = Mat4.translate(0, 0, 0); // ModelMatrix

  mygl.setM(gl, M);
  mygl.setColor(1, 0, 0);
  // zeichneDreieck(gl, -a, -a, a, -a, 0, a);

  drawCircle(gl, 0.2, 0, 0, 100);
  const rootVector = integralCurve(0.2, t / 20);
  const directionVector = linearField(rootVector);
  drawLine(gl, rootVector, directionVector);

  if (!stopped) t++;

  requestAnimFrame(render); // next frame
}

// ------  Button-Verarbeitung  ------------------

function button1() {
  // Button-Funktion
  stopped = !stopped;
}
