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

var maxVerts = 2028; // max. Anzahl Vertices im Buffer
var programId; // Programm-Id

let r = 0.2;
let lines = 51;

//  --------  Funktionen  -----------------------------------

const f1 = (x, y, r) =>
  1 + r ** 2 / (x ** 2 + y ** 2) - 2 * r ** 2 * x ** 2 / (x ** 2 + y ** 2) ** 2;

const f2 = (x, y, r) => -(2 * r ** 2 * x * y / (x ** 2 + y ** 2) ** 2);

function CylinderDynamics() {
  function f(v) {
    const x = v[0];
    const y = v[1];

    return [f1(x, y, r), f2(x, y, r), 0];
  }

  this.dynamics = new Dynamics(f);

  this.drawStream = (mygl, gl, xStart, yStart, dt, steps) => {
    mygl.rewindBuffer(gl);
    let x = [xStart, yStart, 0];

    for (var i = 0; i < steps; i++) {
      x = this.dynamics.runge(x, dt);
      mygl.setColor(1, Math.sin(i), 0);
      mygl.putVertex(x[0], x[1], 0);
    }

    mygl.copyBuffer(gl);
    mygl.drawArrays(gl, gl.LINE_STRIP);
  };
}

const cylinderDynamics = new CylinderDynamics();

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

  drawCircle(gl, r, 0, 0, 100);

  const topY = 1;
  const bottomY = -1;
  const stepSize = (topY - bottomY) / lines;
  for (var i = 1; i <= lines; i++) {
    // drawFieldLine(gl, topY - i * stepSize, lines, 0.2);
    cylinderDynamics.drawStream(mygl, gl, -1, topY - i * stepSize, 0.01, 2000);
  }

  if (!stopped) t++;

  requestAnimFrame(render); // next frame
}

// ------  Button-Verarbeitung  ------------------

function bigger() {
  r += 0.01;
}

function smaller() {
  r -= 0.01;
}

const setLines = event => {
  lines = parseInt(event.target.value, 10);
};

document.getElementById("changelines").addEventListener("change", setLines);
document.getElementById("changelines").addEventListener("click", setLines);
