varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;

#include ../includes/random2D.glsl


void main(){

    //model position is "Global"
    //it is a global position. For stripes in global space
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //glitch
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 2.45) + sin(glitchTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.25;
    
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    //also apply transformation to the normal
    //so that the normals dont rotate with the object
    //so the normal will be "global"
    //the 4th value tells if the vector is homogeneus. All transforms are applied
    //position, rotation, and scale
    //we don't want to translate the normals! it is a direction
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;

}