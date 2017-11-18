/**
 * 4x4 matrix for dealing with WEBGL 4x4 matrices (column major). Mat 4 is immutable.
 *
 * @author radar, adapted to Javascript by E.Gutknecht, Jan 2017
 */


function Mat4(m00, m10, m20, m30,           // Constructor
              m01, m11, m21, m31,
              m02, m12, m22, m32,
              m03, m13, m23, m33)
{
  this.m00 = m00;                           // Matrix-Elements
  this.m10 = m10;
  this.m20 = m20;
  this.m30 = m30;
  this.m01 = m01;
  this.m11 = m11;
  this.m21 = m21;
  this.m31 = m31;
  this.m02 = m02;
  this.m12 = m12;
  this.m22 = m22;
  this.m32 = m32;
  this.m03 = m03;
  this.m13 = m13;
  this.m23 = m23;
  this.m33 = m33;


  // ----------  Methods  ------------


  this.postMultiply = function(mat)           // result = this * mat
  {  return Mat4.multiply(this, mat);
  }

  this.preMultiply = function(mat)            // result = mat * this
  {  return Mat4.multiply(mat, this);
  }


  //  -----  matrix times vector (Vec4)
  this.transform = function(vec)              // result = this * vec 
  {  var t = this;                            // Abkuerzung
     var x = t.m00 * vec.x + t.m01 * vec.y + t.m02 * vec.z + t.m03 * vec.w;
     var y = t.m10 * vec.x + t.m11 * vec.y + t.m12 * vec.z + t.m13 * vec.w;
     var z = t.m20 * vec.x + t.m21 * vec.y + t.m22 * vec.z + t.m23 * vec.w;
     var w = t.m30 * vec.x + t.m31 * vec.y + t.m32 * vec.z + t.m33 * vec.w;
     return new Vec4(x, y, z, w);
  }


  //  -----  matrix times vector (Vec3)
  this.transform3 = function(vec)              // result = this * vec 
  {  var t = this;                            // Abkuerzung
     var vecw = 1;                              // homogene Komponente
     var x = t.m00 * vec.x + t.m01 * vec.y + t.m02 * vec.z + t.m03 * vecw;
     var y = t.m10 * vec.x + t.m11 * vec.y + t.m12 * vec.z + t.m13 * vecw;
     var z = t.m20 * vec.x + t.m21 * vec.y + t.m22 * vec.z + t.m23 * vecw;
     var w = t.m30 * vec.x + t.m31 * vec.y + t.m32 * vec.z + t.m33 * vecw;
     return new Vec3(x, y, z);
  }


  this.transpose = function()                 // result = transposed matrix
  {  var t = this;                            // Abkuerzung
     return new Mat4(t.m00, t.m01, t.m02, t.m03,
                    t.m10, t.m11, t.m12, t.m13,
                    t.m20, t.m21, t.m22, t.m23,
                    t.m30, t.m31, t.m32, t.m33);
  }

  this.determinant = function()               // determinant
  { var t = this;                             // Abkuerzung
    return t.m30 * t.m21 * t.m12 * t.m03 - t.m20 * t.m31 * t.m12 * t.m03 - t.m30 * t.m11 * t.m22 * t.m03
        + t.m10 * t.m31 * t.m22 * t.m03 + t.m20 * t.m11 * t.m32 * t.m03 - t.m10 * t.m21 * t.m32 * t.m03
        - t.m30 * t.m21 * t.m02 * t.m13 + t.m20 * t.m31 * t.m02 * t.m13 + t.m30 * t.m01 * t.m22 * t.m13
        - t.m00 * t.m31 * t.m22 * t.m13 - t.m20 * t.m01 * t.m32 * t.m13 + t.m00 * t.m21 * t.m32 * t.m13
        + t.m30 * t.m11 * t.m02 * t.m23 - t.m10 * t.m31 * t.m02 * t.m23 - t.m30 * t.m01 * t.m12 * t.m23
        + t.m00 * t.m31 * t.m12 * t.m23 + t.m10 * t.m01 * t.m32 * t.m23 - t.m00 * t.m11 * t.m32 * t.m23
        - t.m20 * t.m11 * t.m02 * t.m33 + t.m10 * t.m21 * t.m02 * t.m33 + t.m20 * t.m01 * t.m12 * t.m33
        - t.m00 * t.m21 * t.m12 * t.m33 - t.m10 * t.m01 * t.m22 * t.m33 + t.m00 * t.m11 * t.m22 * t.m33;
  }


  this.inverse = function()                  // inverse matrix
  { var t = this;                            // Abkuerzung
    var d = this.determinant();
    if (d == 0)
     return undefined;

    var v00 = (t.m12 * t.m23 * t.m31 - t.m13 * t.m22 * t.m31 + t.m13 * t.m21 * t.m32 - t.m11 * t.m23 * t.m32 - t.m12 * t.m21 * t.m33 + t.m11 * t.m22 * t.m33) / d;
    var v01 = (t.m03 * t.m22 * t.m31 - t.m02 * t.m23 * t.m31 - t.m03 * t.m21 * t.m32 + t.m01 * t.m23 * t.m32 + t.m02 * t.m21 * t.m33 - t.m01 * t.m22 * t.m33) / d;
    var v02 = (t.m02 * t.m13 * t.m31 - t.m03 * t.m12 * t.m31 + t.m03 * t.m11 * t.m32 - t.m01 * t.m13 * t.m32 - t.m02 * t.m11 * t.m33 + t.m01 * t.m12 * t.m33) / d;
    var v03 = (t.m03 * t.m12 * t.m21 - t.m02 * t.m13 * t.m21 - t.m03 * t.m11 * t.m22 + t.m01 * t.m13 * t.m22 + t.m02 * t.m11 * t.m23 - t.m01 * t.m12 * t.m23) / d;
    var v10 = (t.m13 * t.m22 * t.m30 - t.m12 * t.m23 * t.m30 - t.m13 * t.m20 * t.m32 + t.m10 * t.m23 * t.m32 + t.m12 * t.m20 * t.m33 - t.m10 * t.m22 * t.m33) / d;
    var v11 = (t.m02 * t.m23 * t.m30 - t.m03 * t.m22 * t.m30 + t.m03 * t.m20 * t.m32 - t.m00 * t.m23 * t.m32 - t.m02 * t.m20 * t.m33 + t.m00 * t.m22 * t.m33) / d;
    var v12 = (t.m03 * t.m12 * t.m30 - t.m02 * t.m13 * t.m30 - t.m03 * t.m10 * t.m32 + t.m00 * t.m13 * t.m32 + t.m02 * t.m10 * t.m33 - t.m00 * t.m12 * t.m33) / d;
    var v13 = (t.m02 * t.m13 * t.m20 - t.m03 * t.m12 * t.m20 + t.m03 * t.m10 * t.m22 - t.m00 * t.m13 * t.m22 - t.m02 * t.m10 * t.m23 + t.m00 * t.m12 * t.m23) / d;
    var v20 = (t.m11 * t.m23 * t.m30 - t.m13 * t.m21 * t.m30 + t.m13 * t.m20 * t.m31 - t.m10 * t.m23 * t.m31 - t.m11 * t.m20 * t.m33 + t.m10 * t.m21 * t.m33) / d;
    var v21 = (t.m03 * t.m21 * t.m30 - t.m01 * t.m23 * t.m30 - t.m03 * t.m20 * t.m31 + t.m00 * t.m23 * t.m31 + t.m01 * t.m20 * t.m33 - t.m00 * t.m21 * t.m33) / d;
    var v22 = (t.m01 * t.m13 * t.m30 - t.m03 * t.m11 * t.m30 + t.m03 * t.m10 * t.m31 - t.m00 * t.m13 * t.m31 - t.m01 * t.m10 * t.m33 + t.m00 * t.m11 * t.m33) / d;
    var v23 = (t.m03 * t.m11 * t.m20 - t.m01 * t.m13 * t.m20 - t.m03 * t.m10 * t.m21 + t.m00 * t.m13 * t.m21 + t.m01 * t.m10 * t.m23 - t.m00 * t.m11 * t.m23) / d;
    var v30 = (t.m12 * t.m21 * t.m30 - t.m11 * t.m22 * t.m30 - t.m12 * t.m20 * t.m31 + t.m10 * t.m22 * t.m31 + t.m11 * t.m20 * t.m32 - t.m10 * t.m21 * t.m32) / d;
    var v31 = (t.m01 * t.m22 * t.m30 - t.m02 * t.m21 * t.m30 + t.m02 * t.m20 * t.m31 - t.m00 * t.m22 * t.m31 - t.m01 * t.m20 * t.m32 + t.m00 * t.m21 * t.m32) / d;
    var v32 = (t.m02 * t.m11 * t.m30 - t.m01 * t.m12 * t.m30 - t.m02 * t.m10 * t.m31 + t.m00 * t.m12 * t.m31 + t.m01 * t.m10 * t.m32 - t.m00 * t.m11 * t.m32) / d;
    var v33 = (t.m01 * t.m12 * t.m20 - t.m02 * t.m11 * t.m20 + t.m02 * t.m10 * t.m21 - t.m00 * t.m12 * t.m21 - t.m01 * t.m10 * t.m22 + t.m00 * t.m11 * t.m22) / d;

    return new Mat4(v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33);
  }


  this.toArray = function()
  {  var t = this;                            // Abkuerzung
     return [ t.m00, t.m10, t.m20, t.m30, t.m01, t.m11, t.m21, t.m31, t.m02, t.m12, t.m22, t.m32, t.m03, t.m13, t.m23, t.m33 ];
  }


  function fx(x)                             // fixe Anzahl Dezimalstellen
  {  return x.toFixed(4);
  }

  this.toString = function()
  {  var t = this;                            // Abkuerzung
     return "[" + fx(t.m00) + ", " + fx(t.m01) + ", " + fx(t.m02) + ", " + fx(t.m03) + ", " +
                  fx(t.m10) + ", " + fx(t.m11) + ", " + fx(t.m12) + ", " + fx(t.m13) + ", " +
                  fx(t.m20) + ", " + fx(t.m21) + ", " + fx(t.m22) + ", " + fx(t.m23) + ", " +
                  fx(t.m30) + ", " + fx(t.m31) + ", " + fx(t.m32) + ", " + fx(t.m33) + "]";
  }

 }


  // ---------  Static elements -----------

  Mat4.ZERO = new Mat4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);                                            // zero matrix
  Mat4.ID = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

  Mat4.fromArray = function(m)                                     // Create 4x4 matrix from array of 16 float values
  {
     return new Mat4(m[0], m[1], m[2], m[3],      // col0
                     m[4], m[5], m[6], m[7],      // col1
                     m[8], m[9], m[10], m[11],    // col2
                     m[12], m[13], m[14], m[15]); // col3

  }


  Mat4.multiply = function(a, b)                        // result = a * b
  {
     var m00 = a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20 + a.m03 * b.m30;
     var m10 = a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20 + a.m13 * b.m30;
     var m20 = a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20 + a.m23 * b.m30;
     var m30 = a.m30 * b.m00 + a.m31 * b.m10 + a.m32 * b.m20 + a.m33 * b.m30;

     var m01 = a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21 + a.m03 * b.m31;
     var m11 = a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31;
     var m21 = a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31;
     var m31 = a.m30 * b.m01 + a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31;

     var m02 = a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22 + a.m03 * b.m32;
     var m12 = a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32;
     var m22 = a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32;
     var m32 = a.m30 * b.m02 + a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32;

     var m03 = a.m00 * b.m03 + a.m01 * b.m13 + a.m02 * b.m23 + a.m03 * b.m33;
     var m13 = a.m10 * b.m03 + a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33;
     var m23 = a.m20 * b.m03 + a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33;
     var m33 = a.m30 * b.m03 + a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33;

     return new Mat4(m00, m10, m20, m30,
                     m01, m11, m21, m31,
                     m02, m12, m22, m32,
                     m03, m13, m23, m33);

  }


  Mat4.translate = function(tx, ty, tz)                 // Create translation matrix
  {
     return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
  }


  Mat4.rotate = function(angle, x, y, z)                // Create rotation matrix
  {
    var len = Math.sqrt(x * x + y * y + z * z);
    if (len != 0 && len != 1)
    { len = 1.0 / len;
      x *= len;
      y *= len;
      z *= len;
    }
    var radians = angle * Math.PI/180;
    var c = Math.cos(radians);
    var ic = 1.0 - c;
    var s =  Math.sin(radians);
    var xy = x * y;
    var xz = x * z;
    var xs = x * s;
    var ys = y * s;
    var yz = y * z;
    var zs = z * s;
    var m00 = x * x * ic + c;
    var m10 = xy * ic + zs;
    var m20 = xz * ic - ys;
    var m01 = xy * ic - zs;
    var m11 = y * y * ic + c;
    var m21 = yz * ic + xs;
    var m02 = xz * ic + ys;
    var m12 = yz * ic - xs;
    var m22 = z * z * ic + c;
    return new Mat4(m00, m10, m20, 0, m01, m11, m21, 0, m02, m12, m22, 0, 0, 0, 0, 1);
  }


  Mat4.scale = function(sx,sy,sz)               // Skalierung
  {
    return new Mat4(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
  }


  Mat4.lookAt = function(position, target, up)          // Create lookAt view matrix
  {
    up = up.normalize();
    var f = target.subtract(position).normalize();
    var s = f.cross(up).normalize();
    var u = s.cross(f);
    var t = position.negate();
    var m00 = s.x;
    var m10 = u.x;
    var m20 = -f.x;
    var m01 = s.y;
    var m11 = u.y;
    var m21 = -f.y;
    var m02 = s.z;
    var m12 = u.z;
    var m22 = -f.z;
    var m03 = s.x * t.x + s.y * t.y + s.z * t.z;
    var m13 = u.x * t.x + u.y * t.y + u.z * t.z;
    var m23 = -f.x * t.x - f.y * t.y - f.z * t.z;
    var m33 = 1;
    return new Mat4(m00, m10, m20, 0, m01, m11, m21, 0, m02, m12, m22, 0, m03, m13, m23, m33);
   }


  Mat4.perspective = function(left, right,
                              bottom, top, near, far)   // Create perspective projection matrix
  {
     var m00 = 2 * near / (right - left);
     var m11 = 2 * near / (top - bottom);
     var m02 = (right + left) / (right - left);
     var m12 = (top + bottom) / (top - bottom);
     var m22 =  -(far + near) / (far - near);
     var m32 = -1;
     var m23 =  -2 * far * near / (far - near);
     return new Mat4(m00, 0, 0, 0, 0, m11, 0, 0, m02, m12, m22, m32, 0, 0, m23, 0);
  }


  Mat4.ortho = function (left, right,
                              bottom, top, near, far)   // Create an orthographic projection matrix
  { var dx = right - left;
    var dy = top - bottom;
    var dz = far - near;
    var tx = - (right + left) / dx;
    var ty = - (top + bottom) / dy;
    var tz = - (far + near) / dz;
    var m00 = 2.0 / dx;
    var m11 = 2.0 / dy;
    var m22 = -2.0 / dz;
    var m03 = tx;
    var m13 = ty;
    var m23 = tz;
    var m33 = 1;
    return new Mat4(m00, 0, 0, 0, 0, m11, 0, 0, 0, 0, m22, 0, m03, m13, m23, m33);
 }
