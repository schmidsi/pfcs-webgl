//  ---------   Dreieck (WebGL/Javascript)  ----------------------------
//                                          E.Gutknecht, Nov.2017

"use strict"                                                 // Javascript strict mode

//  ---------  Globale Variabeln  -------------------------

var canvas;                                                  // OpenGl-Window
var gl;                                                      // OpenGl-Context
var mygl;

var M = Mat4.ID;                                             // ModelMatrix
var P = Mat4.ID;                                             // Projektionsmatrix

var phi=30;                                                  // Drehwinkel
var stopped = false;                                         // Animation stoppen

var maxVerts = 1024;                                         // max. Anzahl Vertices im Buffer
var programId;                                               // Programm-Id


//  --------  Funktionen  -----------------------------------


// ------  Dreieck zeichnen  --------
function zeichneDreieck(gl,x1,y1,x2,y2,x3,y3)  
{  mygl.rewindBuffer(gl);  
   mygl.putVertex(x1,y1,0);           // Eckpunkte in VertexArray speichern
   mygl.putVertex(x2,y2,0);
   mygl.putVertex(x3,y3,0);
   mygl.copyBuffer(gl);
   mygl.drawArrays(gl,gl.TRIANGLES)                                          // Figur zeichnen
}


// ------  Initialisierung  --------
window.onload = function init()
{  canvas = document.getElementById( "gl-canvas" );
   gl = WebGLUtils.setupWebGL(canvas);                       // OpenGL-Kontext erzeugen
   if (!gl)  alert( "WebGL isn't available" );
   programId = MyShaders.initShaders(gl,                     // Compile und Link Shaders
                              MyShaders.vShader1,            // Vertex-Shader
                              MyShaders.fShader0);           // Fragment-Shader
   mygl = new MyGLBase1(gl, programId,maxVerts);             // eigene Hilfsfunktionen
   gl.viewport( 0, 0, canvas.width, canvas.height);          // Bild-Rechteck waehlen
   gl.clearColor( 0.1, 0.4, 0.8, 1.0 );                      // Hintergrund-Farbe
   render();                                                 // Bild zeichnen
}


// ------  Bild zeichnen  --------
function render()
{   gl.clear( gl.COLOR_BUFFER_BIT );                         // Bild loeschen
    M = Mat4.translate(0.4,0,0);                             // ModelMatrix
    M = M.preMultiply(Mat4.rotate(phi,0,0,1));
    mygl.setM(gl,M);
    var a = 0.2;
    mygl.setColor(1,0,0);
    zeichneDreieck(gl,-a,-a,a,-a,0,a);
    if (!stopped)
      phi++;
    requestAnimFrame(render);                                // next frame
}


// ------  Button-Verarbeitung  ------------------

function button1()                // Button-Funktion
{  stopped = !stopped;
}
