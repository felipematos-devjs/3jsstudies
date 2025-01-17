varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform vec3 uColor;

uniform float uStripeGap;
uniform float uFalloffPosition;

void main(){
    // normal
    // normalize vNormal. Since it interpolates when passing to the fragment shader
    // it may be "= 1 altough may be unnoticeable
    vec3 normal = normalize(vNormal);

    //gl_FrontFacing is true for the front side of our mesh
    //we invert the normal so that it goes from 0-1 range
    if (!gl_FrontFacing)
    {
        normal *= -1.0;
    }

    //stripes
    float stripes = fract((vPosition.y - uTime * 0.02) * uStripeGap);
    stripes = pow(stripes,  3.0);

    //fresnel
    vec3 viewDirection = vPosition - cameraPosition;
    viewDirection = normalize(viewDirection);

    //fresnel
    float fresnel = 1.0-dot(-viewDirection, normal);
    fresnel = pow(fresnel, 2.0);

    // falloff
    // we want a slight falloff in the edges, It is the opposite of the fresnes
    // but only on he very edges
    //smoothstep inverts and remaps it
    float falloff = smoothstep(0.8, 0.0, fresnel);

    //vertical falloff
    float vFalloff = smoothstep(1.0+ uFalloffPosition, 0.5+ uFalloffPosition, vPosition.y);




    //holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;
    holographic *= vFalloff;

    gl_FragColor = vec4(uColor, holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}