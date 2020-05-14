// Modifiable light stuff
//----
const int lightLen = 1;
uniform vec3 lightPosition1;
//----
// End light stuff

uniform mat4 pTransform;
uniform mat4 vTransform;
uniform mat4 mTransform;
uniform mat4 fTransform;

attribute vec3 position;
attribute vec3 normal;

varying lowp vec3 eyePosition;
varying lowp vec3 eyeNormal;
varying lowp vec3 eyeLights[lightLen];

vec3 lights[lightLen];

void main(void) {
  // Modifiable light stuff
  //====
  lights[0] = lightPosition1;
  //====
  // End light stuff

  eyePosition = (vec4(position, 1.0) * fTransform * mTransform * vTransform).xyz;
  eyeNormal = (vec4(normal, 0.0) * fTransform * mTransform * vTransform).xyz;

  for(int i = 0; i < lightLen; i++){
    eyeLights[i] = (vec4(lights[i], 1.0) * vTransform).xyz;
  }
  
  gl_Position = vec4(eyePosition, 1.0) * pTransform;
}

