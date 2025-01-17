#include ../includes/perlinClassic3D.glsl

uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uShift;

float computeElevation(vec3 position)
{
    float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                    sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                    uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++)
    {
        elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main()
{
    //base position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    //neighboor positions
    vec3 modelPositionA = modelPosition.xyz + vec3(uShift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -uShift);

    // Elevation
    float elevation = computeElevation(modelPosition.xyz);    
    modelPosition.y += elevation;

    //neighboor elevations
    float elevationA = computeElevation(modelPositionA);
    modelPositionA.y += elevationA;

    float elevationB = computeElevation(modelPositionB);
    modelPositionB.y += elevationB;

    //normal computing
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);

    vec3 computedNormal = cross(toA, toB);

    //final position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    //varyings
    vElevation = elevation;
    vNormal = computedNormal;
    vPosition = modelPosition.xyz;
}