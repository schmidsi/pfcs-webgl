/*
 * Copyright (c) 2013 - 2014 Stefan Muller Arisona, Simon Schubiger, Samuel von Stachelski
 * Copyright (c) 2013 - 2014 FHNW & ETH Zurich
 * All rights reserved.
 *
/**
 * 3D vector for basic vector algebra. Instances are immutable.
 *
 * @author radar, adapted to Javascript by E.Gutknecht, Jan 2017
 */


  function  Vec3(x, y, z)   // Constructor
  {
    this.x = x;             // Components
    this.y = y;
    this.z = z;


   // --------------  Methods  ------------

   this.fromArray = function(a)                // create Vec3 from Array
   {  return new Vec4(a[0], a[1], a[2]);
   }


   this.length = function()        // Norm
   {  return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
   }

   this.distance = function(v)
   {  var dx = v.x - this.x;
      var dy = v.y - this.y;
      var dz = v.z - this.z;
      return Math.sqrt(dx*dx+dy*dy+dz*dz);
   }


   this.add = function(v)
   {  return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
   }


   this.subtract = function(v)
   {  return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
   }


   this.scale = function(s)
   {  return new Vec3(this.x * s, this.y * s, this.z * s);
   }


   this.negate = function()
   {  return this.scale(-1);
   }


   this.normalize = function()
   {  var len = this.length();
      if (Math.abs(len) <= 0.000001 || len == 1)
        return this;
      return new Vec3(this.x / len, this.y / len, this.z / len);
   }


   this.dot = function(a)
   {  return this.x*a.x + this.y*a.y + this.z*a.z;
   }


   this.cross = function(a)
   {  return new Vec3(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
   }


   this.toArray = function()
   {  return [ this.x, this.y, this.z];
   }



  function fx(x)                             // fixe Anzahl Dezimalstellen
  {  return x.toFixed(4);
  }


   this.toString = function()
   {     return "[" + fx(this.x) + ", " + fx(this.y) + ", " + fx(this.z) + "]";
   }

}
