//  -------------   Rotations-Koerper  (Kugel, Torus, Zylinder)  ------------
//                                                            E.Gutknecht, Juli 2015

function RotKoerper(
  mygl // mygl: MyGLBase1-Objekt
) {
  // Konstruktor-Code siehe unten (am Ende)

  //  --------------  globale Daten  -----------------
  this.mygl;

  //  ------------------  Methoden  ------------------

  function matrix(
    rows,
    columns // zweidimensionalen Array erzeugen
  ) {
    var a = new Array(rows);
    for (var i = 0; i < rows; i++) {
      a[i] = new Array(columns);
      for (var j = 0; j < columns; j++) a[i][j] = 0;
    }
    return a;
  }

  // ----  n1 x n2 Punkte-Gitternetz einer Rotationsflaeche berechnen  ---------
  //
  //       Die gegebene Kurve in der xy-Ebene wird um die y-Achse gedreht

  function berechnePunkte(
    x,
    y, // Kurve in xy-Ebene
    nx,
    ny, // Normalen in xy-Ebene
    xa,
    ya,
    za, // Gitternetz
    nxa,
    nya,
    nza // gedrehte Normalen
  ) {
    var n1 = xa.length; // Anzahl Zeilen
    var n2 = xa[0].length; // Anzahl Spalten
    var todeg = 180 / Math.PI;
    var dtheta = 2 * Math.PI / n2; // Drehwinkel
    var c = Math.cos(dtheta); // Koeff. der Drehmatrix
    var s = Math.sin(dtheta);

    for (
      var i = 0;
      i < n1;
      i++ // erste Nord-Sued Linie
    ) {
      xa[i][0] = x[i];
      ya[i][0] = y[i];
      nxa[i][0] = nx[i];
      nya[i][0] = ny[i];
    }
    // ------  alle Vertices der Rotationsflaeche berechnen -----
    var j2;
    for (
      var j = 0;
      j < n2 - 1;
      j++ // n2-1 Nord-Sued Linien
    )
      for (var i = 0; i < n1; i++) {
        j2 = j + 1;
        xa[i][j2] = c * xa[i][j] + s * za[i][j]; // Drehung um y-Achse
        ya[i][j2] = ya[i][j];
        za[i][j2] = -s * xa[i][j] + c * za[i][j];
        nxa[i][j2] = c * nxa[i][j] + s * nza[i][j]; // gedrehter Normalenvektor
        nya[i][j2] = nya[i][j];
        nza[i][j2] = -s * nxa[i][j] + c * nza[i][j];
      }
  }

  this.zeichneRotFlaeche = function(
    gl, // Rotationsflaeche (Rotation um y-Achse)
    x,
    y, // Kurve in xy-Ebene
    nx,
    ny, // Normalenvektoren
    n2 // Anzahl Drehungen um y-Achse
  ) {
    var n1 = x.length; // Anzahl Breitenlinien
    var xa = matrix(n1, n2); // Vertex-Koordinaten
    var ya = matrix(n1, n2);
    var za = matrix(n1, n2);
    var nxa = matrix(n1, n2); // Normalen
    var nya = matrix(n1, n2);
    var nza = matrix(n1, n2);

    berechnePunkte(x, y, nx, ny, xa, ya, za, nxa, nya, nza);

    // ------  Streifen zeichnen   ------
    var j2;
    mygl.rewindBuffer(gl);
    for (
      var j = 0;
      j < n2;
      j++ // n2 Streifen von Norden nach Sueden
    )
      for (var i = 0; i < n1; i++) {
        mygl.setNormal(nxa[i][j], nya[i][j], nza[i][j]);
        mygl.putVertex(xa[i][j], ya[i][j], za[i][j]);
        j2 = (j + 1) % n2;
        mygl.setNormal(nxa[i][j2], nya[i][j2], nza[i][j2]);
        mygl.putVertex(xa[i][j2], ya[i][j2], za[i][j2]);
      }

    mygl.copyBuffer(gl);
    var nVerticesStreifen = 2 * n1; // Anzahl Vertices eines Streifens
    for (
      var j = 0;
      j < n2;
      j++ // die Streifen muessen einzeln gezeichnet werden
    )
      gl.drawArrays(
        gl.TRIANGLE_STRIP,
        j * nVerticesStreifen,
        nVerticesStreifen
      ); // Streifen von Norden nach Sueden
  };

  this.zeichneRotGitternetz = function(
    gl, // Rotationsflaeche (Rotation um y-Achse)
    x,
    y, // Kurve in xy-Ebene
    nx,
    ny, // Normalenvektoren
    n2 // Anzahl Drehungen um y-Achse
  ) {
    var n1 = x.length; // Anzahl Breitenlinien
    var xa = matrix(n1, n2); // Vertex-Koordinaten
    var ya = matrix(n1, n2);
    var za = matrix(n1, n2);
    var nxa = matrix(n1, n2); // Normalen
    var nya = matrix(n1, n2);
    var nza = matrix(n1, n2);
    var j2;
    berechnePunkte(x, y, nx, ny, xa, ya, za, nxa, nya, nza);

    mygl.rewindBuffer(gl);
    for (
      var i = 0;
      i < n1;
      i++ // n1 Breitenlinien (Kreise um y-Achse)
    )
      for (var j = 0; j <= n2; j++) {
        j2 = j % n2;
        mygl.setNormal(nxa[i][j2], nya[i][j2], nza[i][j2]);
        mygl.putVertex(xa[i][j2], ya[i][j2], za[i][j2]);
      }
    mygl.copyBuffer(gl);
    var nVerticesOffset = n2 + 1; // Anzahl Vertices einer Breitenlinie
    for (
      var i = 0;
      i < n1;
      i++ // die Linien muessen einzeln gezeichnet werden
    )
      gl.drawArrays(gl.LINE_STRIP, i * nVerticesOffset, n2 + 1); // Breitenlinie

    mygl.rewindBuffer(gl);
    for (
      var j = 0;
      j < n2;
      j++ // n2 Laengslinien
    )
      for (var i = 0; i < n1; i++) {
        mygl.setNormal(nxa[i][j], nya[i][j], nza[i][j]);
        mygl.putVertex(xa[i][j], ya[i][j], za[i][j]);
      }
    mygl.copyBuffer(gl);
    nVerticesOffset = n1; // Anzahl Vertices einer Laengslinie
    for (
      var j = 0;
      j < n2;
      j++ // die Linien muessen einzeln gezeichnet werden
    )
      gl.drawArrays(gl.LINE_STRIP, j * nVerticesOffset, n1); // Laengslinie
  };

  this.zeichneKugel = function(gl, r, n1, n2, solid) {
    var x = new Array(n1); // Halbkreis in xy-Ebene von Nord- zum Suedpol
    var y = new Array(n1);
    var nx = new Array(n1); // Normalenvektoren
    var ny = new Array(n1);
    var dphi = Math.PI / (n1 - 1),
      phi;
    for (var i = 0; i < n1; i++) {
      phi = 0.5 * Math.PI - i * dphi;
      x[i] = r * Math.cos(phi);
      y[i] = r * Math.sin(phi);
      nx[i] = x[i];
      ny[i] = y[i];
    }
    if (solid) this.zeichneRotFlaeche(gl, x, y, nx, ny, n2);
    else this.zeichneRotGitternetz(gl, x, y, nx, ny, n2);
  };

  this.zeichneTorus = function(gl, r, R, n1, n2, solid) {
    var nn1 = n1 + 1;
    var x = new Array(nn1); // Kreis in xy-Ebene
    var y = new Array(nn1);
    var nx = new Array(nn1); // Normalenvektoren
    var ny = new Array(nn1);
    var dphi = 2 * Math.PI / n1,
      phi;
    for (var i = 0; i <= n1; i++) {
      phi = i * dphi;
      x[i] = r * Math.cos(phi);
      y[i] = r * Math.sin(phi);
      nx[i] = x[i];
      ny[i] = y[i];
      x[i] += R;
    }
    if (solid) this.zeichneRotFlaeche(gl, x, y, nx, ny, n2);
    else this.zeichneRotGitternetz(gl, x, y, nx, ny, n2);
  };

  this.zeichneZylinder = function(gl, r, s, n1, n2, solid) {
    var x = new Array(n1); // Mantellinie in xy-Ebene
    var y = new Array(n1);
    var nx = new Array(n1); // Normalenvektoren
    var ny = new Array(n1);
    var dy = s / (n1 - 1);
    for (var i = 0; i < n1; i++) {
      x[i] = r;
      y[i] = i * dy;
      nx[i] = 1;
      ny[i] = 0;
    }
    if (solid) this.zeichneRotFlaeche(gl, x, y, nx, ny, n2);
    else this.zeichneRotGitternetz(gl, x, y, nx, ny, n2);

    //  ------  Grund-Kreis (y=0) -------
    var nPkte = n2;
    var xx = new Array(nPkte + 1);
    var zz = new Array(nPkte + 1);
    var phi = 2 * Math.PI / nPkte;
    for (var i = 0; i <= nPkte; i++) {
      zz[i] = r * Math.cos(i * phi);
      xx[i] = r * Math.sin(i * phi);
    }
    mygl.rewindBuffer(gl);
    mygl.setNormal(0, -1, 0);
    mygl.putVertex(0, 0, 0);
    for (var i = 0; i <= nPkte; i++) mygl.putVertex(xx[i], 0, zz[i]);
    mygl.copyBuffer(gl);
    mygl.drawArrays(gl, gl.TRIANGLE_FAN);

    //  ------  Deck-Kreis  (y=s) -------
    mygl.rewindBuffer(gl);
    mygl.setNormal(0, 1, 0);
    mygl.putVertex(0, s, 0);
    for (var i = 0; i <= nPkte; i++) mygl.putVertex(xx[i], s, zz[i]);
    mygl.copyBuffer(gl);
    mygl.drawArrays(gl, gl.TRIANGLE_FAN);
  };

  // --------  Konstruktor-Code  ---------------

  this.mygl = mygl;
}
