import * as THREE from 'three'

import { shaderMaterial } from "@react-three/drei"
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import { extend, useLoader } from "@react-three/fiber"
import { useMemo } from "react"

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

import PropTypes from 'prop-types'

const AtmosphereMaterial = (
    {
        sunDirection = new THREE.Vector3(1,0,0),
        atmosphereDayColor = "#00aaff",
        atmosphereTwilightColor = "#ff6600",
    }) =>{

    const AtmosphereMaterial = useMemo(()=>{
        return shaderMaterial(
            {
                uSunDirection: sunDirection,
                uAtmosphereDayColor: new THREE.Color(atmosphereDayColor),
                uAtmosphereTwilightColor: new THREE.Color(atmosphereTwilightColor),
            },
            vertex,
            fragment
            )
    }, [sunDirection, atmosphereDayColor, atmosphereTwilightColor])

    extend ({AtmosphereMaterial})

    return (
    <atmosphereMaterial 
        //uniforms go here
        uSunDirection={sunDirection}
        uAtmosphereDayColor={new THREE.Color(atmosphereDayColor)}
        uAtmosphereTwilightColor={new THREE.Color(atmosphereTwilightColor)}
        //key={EarthMaterial.key}
        side={THREE.BackSide}
        transparent
        />
    )
}

AtmosphereMaterial.propTypes = {
    sunDirection: PropTypes.object,
    atmosphereDayColor: PropTypes.string,
    atmosphereTwilightColor: PropTypes.string
}

export default AtmosphereMaterial