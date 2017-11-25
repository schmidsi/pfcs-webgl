//  ---------   Vertex- und Fragment-Shaders mit Compile und Link  ----------------------------

var MyShaders = new Object();

//  --------  statische Daten  ------------------------------

// ------  minimaler Vertex-Shader (PassThru)  ------
MyShaders.vShader0 =
  "attribute vec4 vPosition; \n" +
  "attribute vec4 vColor;  \n" +
  "varying vec4 fColor; \n" +
  "void main() \n" +
  "{ gl_PointSize = 1.0; \n" +
  "  gl_Position = vPosition; \n" +
  "  fColor = vColor; \n" +
  "}";

// ------  Vertex-Shader mit ModelView-Transformation  ------
MyShaders.vShader1 =
  "attribute vec4 vPosition; \n" +
  "attribute vec4 vColor; \n" +
  "uniform mat4 M;   /* ModelView-Matrix */ \n" +
  "uniform mat4 P;   /* Projection-Matrix */ \n" +
  "varying vec4 fColor; \n" +
  "void main() \n" +
  "{ gl_PointSize = 1.0; \n" +
  "  gl_Position = P*M*vPosition; \n" +
  "  fColor = vColor; \n" +
  "}";

// ------  Vertex-Shader mit MV-Transform. und diffuser Beleucht.  ------
MyShaders.vShader2 =
  "attribute vec4 vPosition; \n" +
  "attribute vec4 vColor; \n" +
  "attribute vec4 vNormal; \n" +
  "uniform mat4 M; /* ModelView-Matrix */ \n" +
  "uniform mat4 P; /* Projection-Matrix */ \n" +
  "uniform int shadingLevel; \n" +
  "uniform vec4 lightPosition; \n" +
  "varying vec4 fColor; \n" +
  "uniform float ambient; \n" +
  "uniform float diffuse; \n" +
  "void main() \n" +
  "{  gl_PointSize = 1.0; \n" +
  "   vec4 vertex = M*vPosition; \n" +
  "   gl_Position = P*vertex; \n" +
  "   fColor = vColor; \n" +
  "   if ( shadingLevel > 0 )    \n" +
  "   {  vec3 normal = normalize((M * vNormal).xyz); \n" +
  "      vec3 toLight = normalize(lightPosition.xyz - vertex.xyz); \n" +
  "      float Id = diffuse * dot(toLight, normal);    \n" +
  "      if ( Id < 0.0 ) Id = 0.0; \n" +
  "      vec3 whiteColor = vec3(1,1,1); \n" +
  "      vec3 reflectedLight =  (ambient + Id) * vColor.rgb; \n" +
  "      fColor.rgb = min(reflectedLight, whiteColor); \n" +
  "    } \n" +
  "} ";

// ------  Vertex-Shader mit MV-Transform. sowie diffuser und spiegelnder  Beleucht.  ------
MyShaders.vShader3 =
  "attribute vec4 vPosition; \n" +
  "attribute vec4 vColor; \n" +
  "attribute vec4 vNormal; \n" +
  "uniform mat4 M; /* ModelView-Matrix */ \n" +
  "uniform mat4 P; /* Projection-Matrix */ \n" +
  "uniform int shadingLevel; \n" +
  "uniform vec4 lightPosition; \n" +
  "uniform vec4 lightParam; \n" +
  "varying vec4 fColor; \n" +
  "float ambient=lightParam.x, diffuse=lightParam.y, specular=lightParam.z, specExp=lightParam.w; \n" +
  "void main() \n" +
  "{  gl_PointSize = 1.0; \n" +
  "   vec4 vertex = M*vPosition; \n" +
  "   gl_Position = P*vertex; \n" +
  "   fColor = vColor; \n" +
  "   if ( shadingLevel > 0 )    \n" +
  "   {  vec3 normal = normalize((M * vNormal).xyz); \n" +
  "      vec3 toLight = normalize(lightPosition.xyz - vertex.xyz); \n" +
  "      float cosAlpha = dot(toLight, normal);    \n" +
  "      if ( cosAlpha < 0.0 )                     \n" +
  "      { fColor.rgb = ambient * vColor.rgb;      \n" +
  "        return;                                 \n" +
  "      }                                         \n" +
  "      float Id = diffuse * cosAlpha;            \n" +
  "      float Is;                                 \n" +
  "      vec3 toEye = normalize(-vertex.xyz);      \n" +
  "      vec3 halfBetween = normalize(toLight + toEye); \n" +
  "      float cosBeta = dot(halfBetween, normal);      \n" +
  "      if ( cosBeta < 0.0 )                      \n" +
  "        Is = 0.0;                               \n" +
  "      else                                      \n" +
  "        Is = specular * pow(cosBeta,specExp);   \n" +
  "      vec3 whiteColor = vec3(1,1,1);            \n" +
  "      vec3 reflectedLight =  (ambient + Id) * vColor.rgb + Is * whiteColor; \n" +
  "      fColor.rgb = min(reflectedLight, whiteColor); \n" +
  "    } \n" +
  "} ";

//  -------  Vertex-Shader wie vShader3 fuer Textur  -----------------------------
MyShaders.vShaderTx =
  "attribute vec4 vPosition; \n" +
  "attribute vec4 vColor; \n" +
  "attribute vec4 vNormal; \n" +
  "attribute vec4 vTexCoord; \n" +
  "uniform mat4 M; /* ModelView-Matrix */ \n" +
  "uniform mat4 P; /* Projection-Matrix */ \n" +
  "uniform int shadingLevel; \n" +
  "uniform vec4 lightPosition; \n" +
  "uniform vec4 lightParam; \n" +
  "varying vec4 fColor; \n" +
  "varying vec4 texCoord; \n" +
  "float ambient=lightParam.x, diffuse=lightParam.y, specular=lightParam.z, specExp=lightParam.w; \n" +
  "void main() \n" +
  "{  gl_PointSize = 1.0; \n" +
  "   vec4 vertex = M*vPosition; \n" +
  "   gl_Position = P*vertex; \n" +
  "   fColor = vColor; \n" +
  "   texCoord = vTexCoord; \n" +
  "   if ( shadingLevel > 0 )    \n" +
  "   {  vec3 normal = normalize((M * vNormal).xyz); \n" +
  "      vec3 toLight = normalize(lightPosition.xyz - vertex.xyz); \n" +
  "      float cosAlpha = dot(toLight, normal);    \n" +
  "      if ( cosAlpha < 0.0 )                     \n" +
  "      { fColor.rgb = ambient * vColor.rgb;      \n" +
  "        return;                                 \n" +
  "      }                                         \n" +
  "      float Id = diffuse * cosAlpha;            \n" +
  "      float Is;                                 \n" +
  "      vec3 toEye = normalize(-vertex.xyz);      \n" +
  "      vec3 halfBetween = normalize(toLight + toEye); \n" +
  "      float cosBeta = dot(halfBetween, normal);      \n" +
  "      if ( cosBeta < 0.0 )                      \n" +
  "        Is = 0.0;                               \n" +
  "      else                                      \n" +
  "        Is = specular * pow(cosBeta,specExp);   \n" +
  "      vec3 whiteColor = vec3(1,1,1);            \n" +
  "      vec3 reflectedLight =  (ambient + Id) * vColor.rgb + Is * whiteColor; \n" +
  "      fColor.rgb = min(reflectedLight, whiteColor); \n" +
  "    } \n" +
  "} ";

//  -------   PassThru Fragment Shader -----------------------------
MyShaders.fShader0 =
  "precision mediump float;\n" +
  "varying vec4 fColor;\n" +
  "void main()\n" +
  "{  gl_FragColor = fColor;\n" +
  "}";

//  -------   Fragment-Shader mit Textur  -----------------------------

MyShaders.fShaderTx =
  "precision mediump float;    \n\n" +
  "precision highp int; \n\n" +
  "varying vec4 fColor, texCoord;      \n\n" +
  "uniform int shadingLevel;           \n\n" +
  "uniform sampler2D myTexture;        \n\n" +
  "void main()                         \n\n" +
  "{  if ( shadingLevel == 2 )         \n\n" +
  "      gl_FragColor = min(fColor * texture2D(myTexture, texCoord.xy).rgba, vec4(1,1,1,1)); \n\n" +
  "   else                             \n\n" +
  "      gl_FragColor = fColor;        \n\n" +
  "}                                   \n";

//  -------- statische Methoden  ---------------------------------

// ------  Compile and Link  -------
MyShaders.initShaders = function(gl, vShader, fShader) {
  //  ----------  Compile Shaders  --------------
  var vShaderId = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vShaderId, vShader);
  gl.compileShader(vShaderId);
  if (!gl.getShaderParameter(vShaderId, gl.COMPILE_STATUS)) {
    var msg =
      "Vertex shader failed to compile.  The error log is: \n" +
      gl.getShaderInfoLog(vShaderId);
    alert(msg);
    return -1;
  }
  var fShaderId = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fShaderId, fShader);
  gl.compileShader(fShaderId);
  if (!gl.getShaderParameter(fShaderId, gl.COMPILE_STATUS)) {
    var msg =
      "Fragment shader failed to compile.  The error log is: \n" +
      gl.getShaderInfoLog(fShaderId);
    alert(msg);
    return -1;
  }

  //  ---------  Link Program  ------------------
  var programId = gl.createProgram();
  gl.attachShader(programId, vShaderId);
  gl.attachShader(programId, fShaderId);
  gl.linkProgram(programId);
  if (!gl.getProgramParameter(programId, gl.LINK_STATUS)) {
    var msg =
      "Shader program failed to link.  The error log is: \n" +
      gl.getProgramInfoLog(programId);
    alert(msg);
    return -1;
  }
  gl.useProgram(programId);
  return programId;
};
