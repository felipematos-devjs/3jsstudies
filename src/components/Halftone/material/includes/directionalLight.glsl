vec3 directionalLight(
    vec3 lightColor, 
    float lightIntensity, 
    vec3 normal,
    vec3 lightPosition,
    vec3 viewDirection,
    float specularPower
)
{
    //light direction does not depend on model
    //it is constant
    vec3 lightDirection = normalize(lightPosition);

    //shading
    float shading = dot(lightDirection, normal);
    shading = max(0.0, shading);

    //specular
    //get the reflection
    vec3 lightReflection = reflect( - lightDirection, normal);
    
    //compare with the view direction
    float specular = -dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    return (lightColor * lightIntensity) * (shading + specular);
}

struct DirectionalLight { 
	vec3 position; 
	vec3 color; 
    float intensity;
    float specularPower;
};