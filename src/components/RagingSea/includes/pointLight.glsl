vec3 pointLight(
    vec3 lightColor, 
    float lightIntensity, 
    vec3 normal,
    vec3 lightPosition,
    vec3 viewDirection,
    float specularPower,
    vec3 position,
    float decayFactor
)
{
    //light direction does not depend on model
    //it is constant
    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);

    //shading
    float shading = dot(lightDirection, normal);
    shading = max(0.0, shading);

    //specular
    //get the reflection
    vec3 lightReflection = reflect( - lightDirection, normal);
    
    //decay
    float decay = 1.0 - lightDistance * decayFactor;
    decay = max(0.0, decay);

    //compare with the view direction
    float specular = -dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    return (lightColor * lightIntensity * decay) * (shading + specular);
}

struct PointLight { 
	vec3 position; 
	vec3 color; 
    float intensity;
    float specularPower;
    float decay;
};