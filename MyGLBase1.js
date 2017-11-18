//  ---------   WebGL Basis-Funktionen (ModelView-Transf., Beleuchtung)  -------------

"use strict"

function MyGLBase1(gl, programId, maxVerts)  
{  
  // Konstruktor-Code siehe unten (am Ende)   

  //  ---------  Globale Variabeln  -------------------------

  this.maxVerts = 0;                 // max. Anzahl Vertices im Vertex-Array
  this.nVertices = 0;                // momentane Anzahl Vertices im Vertex-Array

  // ------  Transformations-Matrizen  -----
  this.M = Mat4.ID;                                             // ModelView-Matrix
  this.P = Mat4.ID;                                             // Projektionsmatrix

  // ------  Beleuchtung  ----
  this.shadingLevel = 0;                                        // Beleuchtungs-Stufe 0=aus, 1=ambient u. diffus
  this.lightPosition = [0, 0, 10, 1];                           // Lichtquelle
  this.ambient = 0.2;                                           // ambientes Licht
  this.diffuse = 0.8;                                           // diffuse Reflexion


  // ------ Identifiers fuer OpenGL-Objekte und Shader-Variablen  ------
  this.vertexBufId;                                             //  OpenGL Vertex Buffer
  this.vPositionId, this.vColorId, this.vNormalId;              //  Vertex Attribute 
  this.MId, this.PId;                                           //  Uniform Shader Variables
  this.shadingLevelId, this.lightPositionId, this.ambientId, this.diffuseId;   // Uniform Shader Variables


  //  --------  Vertex-Array (fuer die Attribute Position, Color, Normal)  ------------
  this.vertexBuf;                                               // Vertex-Array
  this.attribSize = 4*4;                                        // Anz. Bytes eines Attributes (4 Float-Werte)
  this.nAttrib = 3;                                             // Anz. Attribute eines Vertex
  this.vertexSize = this.nAttrib * this.attribSize;             // Anz. Bytes eines Vertex

  this.currentColor = [ 1,1,1,1];                               // aktuelle Farbe fuer Vertices
  this.currentNormal = [ 1,0,0,0];                              // aktuelle Normale Vertices


  //  ---------  Methoden  ----------------------------

  this.setColor = function(r,g,b)
  {  this.currentColor[0]=r;
     this.currentColor[1]=g;
     this.currentColor[2]=b;
  }

  this.setNormal = function(x,y,z)
  {  this.currentNormal[0]=x;
     this.currentNormal[1]=y;
     this.currentNormal[2]=z;
  }


  // ------  Vertex in Buffer speichern  --------
  this.putVertex = function(x,y,z)                                  // Vertex in Buffer speichern
  {  var i = this.nVertices*this.nAttrib*this.attribSize/4;         // Einfuege-Position (in Anz. float-Werten) 
     var vertex = [x,y,z,1,
                   this.currentColor[0],this.currentColor[1],this.currentColor[2],1,
                   this.currentNormal[0],this.currentNormal[1],this.currentNormal[2],0];
     this.vertexBuf.set(vertex,i);
     this.nVertices++;
  }


  this.rewindBuffer = function()
  {  this.nVertices = 0;
  }


  this.copyBuffer = function(gl)
  {  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufId);                   // OpenGL-Buffer selektieren
     gl.bufferData(gl.ARRAY_BUFFER, this.vertexBuf.subarray(0, this.nVertices*this.vertexSize/4), gl.STATIC_DRAW);  // Daten kopieren
  }

  this.drawArrays = function(gl,figureType)                          // draw vertex array
  {    gl.drawArrays(figureType, 0, this.nVertices);
  }



  // -----  ModelView- und Projektionsmatrix  -------

  this.loadIdentity = function(gl)
  { this.M = Mat4.ID;
    gl.uniformMatrix4fv( this.MId, false, this.M.toArray() );
  }

  this.setM = function(gl, A)
  {  this.M = A;
     gl.uniformMatrix4fv( this.MId, false, this.M.toArray() );
  }

  this.setP = function(gl, A)
  {  this.P = A;
     gl.uniformMatrix4fv( this.PId, false, this.P.toArray() );
  }



  // -----  Beleuchtung  -------

  this.setShadingLevel = function(gl,level)                         // 0: ohne Beleuchtung, 1: diffuse Reflexion , 2 diffuse u. spiegelnde Refl.
  {  gl.uniform1i( this.shadingLevelId, level);
  }

  this.setLightPosition = function(gl,x,y,z)
  {  this.lightPosition = [x,y,z,1];
     var pos = new Vec4(x,y,z,1);
     var pp = this.M.transform(pos);                              // ModelView-Transf
     gl.uniform4fv(this.lightPositionId, pp.toArray());
  }

  this.setShadingParam = function (gl,ambient,diffuse)
  { this.anbient = ambient;
    this.diffuse = diffuse;
    gl.uniform1f(this.ambientId, ambient);
    gl.uniform1f(this.diffuseId, diffuse);
  }


  // ------  Abfrage-Methoden  -------------
  this.getCurrentColor = function()
  {  var c = [ this.currentColor[0],
           this.currentColor[1], this.currentColor[2]];
     return c;      
  }


  this.getCurrentNormal = function()
  {  var n = [ this.currentNormal[0],
               this.currentNormal[1], this.currentNormal[2]];
     return n;
  }

  this.getM = function()                                         // ModelView-Matrix
  {  return this.M;
  }

  this.getP = function()                                         // Projektions-Matrix
  {  return this.P;
  }

  this.getShadingLevel = function()                                         // Projektions-Matrix
  {  return this.shadingLevel;
  }

  this.getAmbient = function()                                         // Projektions-Matrix
  {  return this.ambient;
  }

  this.getDiffuse = function()                                         // Projektions-Matrix
  {  return this.diffuse;
  }

  this.getLightPosition = function()
  {  return this.lightPosition;
  }


  // -----  Hilfs-Funktionen  --------------------

  this.enableAttribute = function(gl, attribId, attribName)           // Aktivierung eines Vertex-Attributes
  {  if (attribId >= 0)
     {  gl.enableVertexAttribArray( attribId, attribName );
        console.log("Attribute " + attribName + " enabled");
     }
     else
        console.log("Attribute " + attribName + " not enabled");         // Attribut-Var. im Vertex-Shader nicht definiert
  }


  // ------  Erzeugung des Vertex-Buffers  --------
  
  this.setupBuffer = function(programId, gl, maxVerts)
  {   
     this.vertexBuf = new Float32Array(maxVerts*this.vertexSize/4);      // Vertex-Array fuer Attribute Position und Color (je 4 Float-Werte)
     this.vertexBufId = gl.createBuffer();                               // OpenGL-Buffer erzeugen
     gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBufId );                 // Buffer aktivieren

     // ------  Identifikationen der Shader-Variabeln fuer die Vertex-Attribute
     var vPositionId = gl.getAttribLocation( programId, "vPosition");
     var vColorId = gl.getAttribLocation( programId, "vColor");
     var vNormalId = gl.getAttribLocation( programId, "vNormal");

    // ------  Aktivierung der Vertex-Attribute  -------
     this.enableAttribute(gl, vPositionId, "vPosition");
     this.enableAttribute(gl, vColorId, "vColor");
     this.enableAttribute(gl, vNormalId, "vNormal");

     if (vPositionId >= 0)
       gl.vertexAttribPointer( vPositionId, 4, gl.FLOAT, false, this.vertexSize, 0 );            // Offset 0
     if (vColorId >= 0)
       gl.vertexAttribPointer( vColorId, 4, gl.FLOAT, false, this.vertexSize, this.attribSize );      // Offset
     if (vNormalId >= 0)
       gl.vertexAttribPointer( vNormalId, 4, gl.FLOAT, false, this.vertexSize, 2*this.attribSize );   // Offset
  }



   this.setupUniforms = function(programId,gl)         // uniform Shader-Variabeln
   {
      this.MId = gl.getUniformLocation( programId, "M" );
      this.PId = gl.getUniformLocation( programId, "P" );
      this.shadingLevelId = gl.getUniformLocation( this.programId, "shadingLevel" );
      this.lightPositionId = gl.getUniformLocation( programId, "lightPosition" );
      this.ambientId = gl.getUniformLocation( programId, "ambient" );
      this.diffuseId = gl.getUniformLocation( programId, "diffuse" );
      gl.uniformMatrix4fv( this.MId, false, this.M.toArray() );
      gl.uniformMatrix4fv( this.PId, false, this.P.toArray() );
      gl.uniform1i( this.shadingLevelId, this.shadingLevel );
      gl.uniform4fv( this.lightPositionId, this.lightPosition );
      gl.uniform1f( this.ambientId, this.ambient);   
      gl.uniform1f( this.diffuseId, this.diffuse);   
   }


    //  ---------  Zeichenmethoden  ------------------------------

    this.drawAxis = function(gl, a, b, c)                   // Koordinatenachsen zeichnen
    {  this.rewindBuffer(gl);
       this.putVertex(0,0,0);           // Eckpunkte in VertexArray speichern
       this.putVertex(a,0,0);
       this.putVertex(0,0,0);
       this.putVertex(0,b,0);
       this.putVertex(0,0,0);
       this.putVertex(0,0,c);
       this.copyBuffer(gl);
       this.drawArrays(gl, gl.LINES);
    }



  //  --------  Konstruktor-Code --------------

  this.programId = programId;
  this.maxVerts = maxVerts;
  this.setupBuffer(programId,gl,maxVerts);              // Erzeugung OpenGL-Buffer
  this.setupUniforms(programId,gl)

}
