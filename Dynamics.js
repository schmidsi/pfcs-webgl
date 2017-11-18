//  ---------  Dynamische Systeme  ------------------

function Dynamics(vectorField)
{
   this.f = vectorField;

   this.euler = function(x, dt)            // Euler-Algorithmus
   {  var y = f(x);
      var xx = new Array(x.length);
      for (var i=0; i < x.length; i++)     //  xx = x + y*dt
        xx[i] = x[i] + y[i]*dt;
      return xx;
   }


   this.runge = function(x, dt)            // Runge-Kutta 
   {  var n = x.length;
      var y1 = f(x);                       // erster Hilfsvektor
      var xx = new Array(n);
      for (var i=0; i < n; i++)
        xx[i] = x[i] + y1[i]*dt/2;         // xx = x + y1*dt/2
      var y2 = f(xx);                      // zweiter Hilfsvektor
      for (var i=0; i < n; i++)
        xx[i] = x[i] + y2[i]*dt/2;         // xx = x + y2*dt/2
      var y3 = f(xx);                      // dritter Hilfsvektor
      for (var i=0; i < n; i++)
        xx[i] = x[i] + y3[i]*dt;           // xx = x + y3*dt  ohne 1/2
      var y4 = f(xx);                      // vierter Hilfsvektor
      var ym = new Array(n);               // gemittelter Vektor
      for (var i=0; i < n; i++)
        ym[i] = (y1[i] + 2*y2[i] + 2*y3[i] + y4[i])/6;
      for (var i=0; i < n; i++)
        xx[i] = x[i] + ym[i]*dt;           // xx = x + ym*dt
      return xx;
   }

}
