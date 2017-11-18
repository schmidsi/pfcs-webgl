function Quader(mygl)              // mygl: MyGLBase1-Objekt
 { 
    // Konstruktor-Code siehe unten (am Ende)
 
    //  ----------------  globale Daten  -------------------------

    this.mygl;
    this.e1 = new Vec3(1,0,0);               // Normalenvektoren
    this.e2 = new Vec3(0,1,0);
    this.e3 = new Vec3(0,0,1);
    this.e1n = new Vec3(-1,0,0);             // negative Richtung
    this.e2n = new Vec3(0,-1,0);
    this.e3n = new Vec3(0,0,-1);


    //  ---------------------  Methoden  --------------------------

    this.viereck = function(gl, A, B,  C,  D, n)      // n=Normale
    {  mygl.setNormal(n.x, n.y, n.z);
       mygl.putVertex(A.x, A.y, A.z);          // Dreieck 1
       mygl.putVertex(B.x, B.y, B.z);
       mygl.putVertex(C.x, C.y, C.z);
       mygl.putVertex(C.x, C.y, C.z);          // Dreieck 2
       mygl.putVertex(D.x, D.y, D.z);
       mygl.putVertex(A.x, A.y, A.z);
    }


    this.kante = function(a, b)
    {  mygl.putVertex(a.x, a.y, a.z);
       mygl.putVertex(b.x, b.y, b.z);
    }


    this.zeichne = function(gl,
                        a, b, c,   // Kantenlaengen
                        solid)
    {  a *= 0.5;
       b *= 0.5;
       c *= 0.5;
       var A = new Vec3( a,-b, c);           // Bodenpunkte
       var B = new Vec3( a,-b,-c);
       var C = new Vec3(-a,-b,-c);
       var D = new Vec3(-a,-b, c);
       var E = new Vec3( a, b, c);           // Deckpunkte
       var F = new Vec3( a, b,-c);
       var G = new Vec3(-a, b,-c);
       var H = new Vec3(-a, b, c);
       mygl.rewindBuffer(gl);
       if ( solid )
       {  this.viereck(gl,D,C,B,A,this.e2n);            // Boden
          this.viereck(gl,E,F,G,H,this.e2);             // Deckflaeche
          this.viereck(gl,A,B,F,E,this.e1);             // Seitenflaechen
          this.viereck(gl,B,C,G,F,this.e3n);
          this.viereck(gl,D,H,G,C,this.e1n);
          this.viereck(gl,A,E,H,D,this.e3);
          mygl.copyBuffer(gl);
          mygl.drawArrays(gl,gl.TRIANGLES);
       }
       else
       {  this.kante(A,B);                         // Boden
          this.kante(B,C);
          this.kante(C,D);
          this.kante(D,A);
          this.kante(E,F);                         // Decke
          this.kante(F,G);
          this.kante(G,H);
          this.kante(H,E);
          this.kante(A,E);                         // Kanten
          this.kante(B,F);
          this.kante(C,G);
          this.kante(D,H);
          mygl.copyBuffer(gl);
          mygl.drawArrays(gl,gl.LINES);
        }
    }


// ------  Konstruktor-Code

this.mygl = mygl;

}