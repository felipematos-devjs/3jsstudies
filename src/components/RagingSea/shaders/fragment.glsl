#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

uniform PointLight uPointLights[ 1 ];
uniform DirectionalLight uDirLights[ 1 ];

void main()
{
    vec3 viewDirecton = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    //base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    
    //light
    vec3 light = vec3(0.0);

    for(int i = 0; i < 1; i++)
    {

        light += pointLight(
            uPointLights[i].color,           //light color
            uPointLights[i].intensity,       //light intensity
            normal,                          //model normal
            uPointLights[i].position,        //light position,
            viewDirecton,                   //view direction
            uPointLights[i].specularPower,   //specularPower
            vPosition,                       //modelPosition
            uPointLights[i].decay
        );

        light += directionalLight(
            uDirLights[i].color,           //light color
            uDirLights[i].intensity,       //light intensity
            normal,                          //model normal
            uDirLights[i].position,        //light position,
            viewDirecton,                   //view direction
            uDirLights[i].specularPower  //specularPower
        );

    }





    color *= light;
    //final color
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}