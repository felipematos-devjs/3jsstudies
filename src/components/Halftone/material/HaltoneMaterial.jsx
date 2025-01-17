import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { useMemo, useEffect, useState } from "react"
import * as THREE from 'three'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import { useRef } from "react"

const HalftoneMaterial = (
    {color = "#ffffff", 
    lights=[],
    pointShadowColor = "#000000",
    pointLightColor = "#ffffff",
    shadowColor = "#000000",
    shadowRepetitions = 100,
    lightRepetitions = 130,
    halftoneIntensity = 0.5
}) =>{

    const materialRef = useRef()


    const HalftoneMaterial = useMemo(()=>{

        console.log('render')

        const dirLights = lights.filter((el)=>{
            return el.type == "directional"
        })

        const pointLights = lights.filter((el)=>{
            return el.type == "point"
        })

        return shaderMaterial(
            {
                uColor: new THREE.Color(color),
                uResolution: new THREE.Vector2(),
                uShadowRepetitions: shadowRepetitions,
                uLightRepetitions: lightRepetitions,
                uPointShadowColor: new THREE.Color(pointShadowColor),
                uPointLightColor: new THREE.Color(pointLightColor),
                uShadowColor: new THREE.Color(shadowColor),
                uHalftoneIntensity: halftoneIntensity,

                uDirLights: 
                [
                    ...dirLights
                ],
                uPointLights: 
                [
                    ...pointLights
                ],
            },
            vertex,
            fragment
        )
    }, [])
    
    const handleResize = () =>{
        materialRef.current.uniforms.uResolution.value.set(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
    }


    useEffect(()=>{
        window.addEventListener('resize', handleResize)

        handleResize()

        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    }, [])




    extend({HalftoneMaterial})
    
    return <halftoneMaterial 
            uColor={color}
            ref={materialRef}
            uPointShadowColor={pointShadowColor}
            uPointLightColor={pointLightColor}
            uShadowRepetitions={shadowRepetitions}
            uLightRepetitions={lightRepetitions}
            uShadowColor={shadowColor}
            uHalftoneIntensity={halftoneIntensity}
        />
}

export default HalftoneMaterial