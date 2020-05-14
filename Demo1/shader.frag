// Modifiable light stuff
//----
const int lightLen = 1;
uniform lowp vec3 lightColor1;
uniform lowp float lightBrightness1;
//----
// End light stuff

uniform lowp vec3 color;
uniform lowp float glossy;

varying lowp vec3 eyePosition;
varying lowp vec3 eyeNormal;
varying lowp vec3 eyeLights[lightLen];

lowp vec3 diffuse[lightLen];
lowp vec3 specular[lightLen];
lowp vec3 L[lightLen];
lowp float str[lightLen];
lowp vec3 H[lightLen];
lowp vec3 lightColors[lightLen];
lowp float lightBrightness[lightLen];

void main(void) {
  // Modifiable light stuff
  //====

  //====
  // End light stuff
  lowp vec3 N = normalize(eyeNormal);
  lowp vec3 finalColor = vec3(0.1, 0.1, 0.1) + 0.4 * color;

  for(int i = 0; i < lightLen; i++){
    diffuse[i] = 0.4 * color + 0.4 * lightColors[i] * lightBrightness[i];
    specular[i] = lightColors[i] * 0.25 * lightBrightness[i];
    L[i] = eyeLights[i] - eyePosition;
    str[i] = pow(sqrt(dot(L[i], L[i])), -0.5);
    L[i] = normalize(L[i]) * str[i];
    H[i] = normalize(normalize(L[i]) - normalize(eyePosition));

    diffuse[i] *= max(0.0, dot(N, L[i]));
    specular[i] *= pow(max(0.0, dot(N, H[i])), 256.0 / str[i]) * glossy;

    finalColor += diffuse[i] + specular[i];
  }

  gl_FragColor = vec4(finalColor, 1.0);
}

