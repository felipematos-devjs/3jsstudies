#include ./../includes/ambientLight.glsl
#include ./../includes/directionalLight.glsl
#include ./../includes/pointLight.glsl

uniform vec3 uColor;
uniform vec2 uResolution;
uniform DirectionalLight uDirLights[ 1 ];
uniform PointLight uPointLights[ 1 ];
uniform float uShadowRepetitions;
uniform float uLightRepetitions;
uniform vec3 uPointShadowColor;
uniform vec3 uPointLightColor;
uniform vec3 uShadowColor;
uniform float uHalftoneIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
)
{
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv = fract(uv * repetitions);

    float point = distance(uv, vec2(0.5));
    point = step(0.5 * intensity, point);
    point = 1.0- point;

    return mix(color, pointColor, point * uHalftoneIntensity);
}

void main(){
    vec3 position = normalize(vPosition);
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(position - cameraPosition);
    
    vec3 color = uColor;

    //lights
    
    vec3 light = vec3(0.0);
     
    light += ambientLight(
        vec3(1.0), 
        0.5
    );
 
    for(int i = 0; i < 1; i++)
    {
        light += directionalLight(
            uDirLights[i].color,
            uDirLights[i].intensity,
            normal,
            uDirLights[i].position,
            viewDirection,
            uDirLights[i].specularPower
        );
    }

    color*= light;

    color = halftone(
        color,
        uShadowRepetitions,
        -uDirLights[0].position,
        -0.8,
        1.5,
        uPointShadowColor,
        normal
    );

    color = halftone(
        color,
        uLightRepetitions,
        uDirLights[0].position,
        0.5,
        3.0,
        uPointLightColor,
        normal
    );
 
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>

}