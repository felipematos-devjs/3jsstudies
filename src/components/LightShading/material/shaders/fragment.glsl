#include ./../includes/ambientLight.glsl
#include ./../includes/directionalLight.glsl
#include ./../includes/pointLight.glsl

uniform vec3 uColor;

//ambientLight
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

uniform DirectionalLight uDirLights[ 2 ];
uniform PointLight uPointLights[ 2 ];

void main(){
    vec3 normal = normalize(vNormal);
    vec3 position = normalize(vPosition);
    vec3 lightColor = uColor;

    vec3 viewDirection = normalize(position - cameraPosition);

    //lights
    //contains every light of the scene
    vec3 light = vec3(0.0);
    
    light += ambientLight(
        uAmbientColor, 
        uAmbientIntensity
    );
   
    for(int i = 0; i < 2; i++)
    {
        light += directionalLight(
            uDirLights[i].color,           //light color
            uDirLights[i].intensity,       //light intensity
            normal,                        //model normal
            uDirLights[i].position,        //light position,
            viewDirection,                 //view direction
            uDirLights[i].specularPower
        );
    }

    for(int i = 0; i < 2; i++)
    {
        light += pointLight(
            uPointLights[i].color,           //light color
            uPointLights[i].intensity,       //light intensity
            normal,                          //model normal
            uPointLights[i].position,        //light position,
            viewDirection,                   //view direction
            uPointLights[i].specularPower,   //specularPower
            vPosition,                       //modelPosition
            uPointLights[i].decay
        );
    }

    //color is multiplied in real life
    //if light is zero, we see nothing!
    lightColor *= light;

    gl_FragColor = vec4(lightColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>

}