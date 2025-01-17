varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;

uniform vec3 uSunDirection;

uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;



void main()
{
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 color = vec3(0.0);

    //Sun orientation. clamp it 
    float sunOrientation = dot(uSunDirection, normal);

    //day / night color
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = mix(nightColor, dayColor, dayMix);
 
    //Specular clouds color
    //r is specular
    //g is clouds
    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

    //clouds
    //we mix the initial color with white, acoording to the green channel

    //remap it for less clouds
    float cloudsMix = smoothstep(0.3, 1.0, specularCloudsColor.g);
    //mix with the day mix to get clouds on the bright side, and darker clouds on the darker side
    cloudsMix = mix(0.025 * cloudsMix, cloudsMix, dayMix);
    //mix it with the color
    color = mix(color, vec3(1.0), cloudsMix);

    //fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    //atmosphere
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    //specular
    vec3 reflection = reflect(-uSunDirection, normal);
    float specular = - dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);
    specular *= specularCloudsColor.r;

    //the specular will have the color of the atmosphere on the edges
    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);

    color += specular * specularColor;


    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}