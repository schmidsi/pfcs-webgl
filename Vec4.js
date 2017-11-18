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


  function  Vec4(x, y, z, w)   // Constructor
  {
    this.x = x;             // Components
    this.y = y;
    this.z = z;
    this.w = w;


   // --------------  Methods  ------------

   this.length = function()        // Norm
   {  return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
   }


   this.fromArray = function(a)
   {  return new Vec4(a[0], a[1], a[2], a[3]);
   }


   this.toArray = function()
   {  return [ this.x, this.y, this.z, this.w];
   }


  function fx(x)                             // fixe Anzahl Dezimalstellen
  {  return x.toFixed(4);
  }


   this.toString = function()
   {     return "[" + fx(this.x) + ", " + fx(this.y) + ", " + fx(this.z) + ", " + fx(this.w) + "]";
   }

}
