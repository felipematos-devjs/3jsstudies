import * as THREE from 'three'

import { shaderMaterial } from "@react-three/drei"
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import { extend, useLoader } from "@react-three/fiber"
import { useMemo } from "react"

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

import PropTypes from 'prop-types'

const EarthMaterial = (
    {
        sunDirection = new THREE.Vector3(1,0,0),
        atmosphereDayColor = "#00aaff",
        atmosphereTwilightColor = "#ff6600",
    }) =>{

    //textures
    const [
        earthDayTexture,
        earthNightTexture,
        earthSpecularCloudsTexture
    ] = useLoader(TextureLoader, [
        '/textures/earth/day.jpg',
        '/textures/earth/night.jpg',
        '/textures/earth/specularClouds.jpg',     
        ])

    earthDayTexture.colorSpace = THREE.SRGBColorSpace
    earthNightTexture.colorSpace = THREE.SRGBColorSpace

    earthDayTexture.anisotropy = 8 
    earthNightTexture.anisotropy = 8 
    earthSpecularCloudsTexture.anisotropy = 8 
        
    const EarthMaterial = useMemo(()=>{
        return shaderMaterial(
            {
                uDayTexture: earthDayTexture,
                uNightTexture: earthNightTexture,
                uSpecularCloudsTexture: earthSpecularCloudsTexture,
                uSunDirection: sunDirection,
                uAtmosphereDayColor: new THREE.Color(atmosphereDayColor),
                uAtmosphereTwilightColor: new THREE.Color(atmosphereTwilightColor),
            },
            vertex,
            fragment
            )
    }, [sunDirection, atmosphereDayColor, atmosphereTwilightColor])

    extend ({EarthMaterial})

    return (
    <earthMaterial 
        //uniforms go here
        uSunDirection={sunDirection}
        uAtmosphereDayColor={new THREE.Color(atmosphereDayColor)}
        uAtmosphereTwilightColor={new THREE.Color(atmosphereTwilightColor)}
        //key={EarthMaterial.key}
        />
    )
}

EarthMaterial.propTypes = {
    sunDirection: PropTypes.object,
    atmosphereDayColor: PropTypes.string,
    atmosphereTwilightColor: PropTypes.string
}

export default EarthMaterial