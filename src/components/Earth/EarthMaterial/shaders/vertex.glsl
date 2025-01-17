varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    //position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    //normals
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    gl_Position = projectionPosition;

    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
    vUv = uv;
}