import * as THREE from 'three'

import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react"

import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'
import { useRef } from 'react'


const RagingSeaMaterial = ({
    depthColor ="#ff4000", 
    surfaceColor= "#151c37" ,

    bigWavesElevation = 0.2,
    bigWavesFrequency = new THREE.Vector2(4, 1.5),
    bigWavesSpeed = 0.75,

    smallWavesElevation= 0.15,
    smallWavesFrequency = 3,
    smallWavesSpeed = 0.2,
    smallWavesIterations = 4,

    colorOffset= 0.08,
    colorMultiplier = 5,
    shift = 0.01,
    lights=[]
}) =>{

    const dirLights = lights.filter((el)=>{
        return el.type == "directional"
    })

    const pointLights = lights.filter((el)=>{
        return el.type == "point"
    })

    const seaRef = useRef()

    const RagingSeaMaterial = useMemo(()=>{

        return shaderMaterial(
            {
                uTime: 0 ,
        
                uBigWavesElevation: bigWavesElevation ,
                uBigWavesFrequency: bigWavesFrequency ,
                uBigWavesSpeed: bigWavesSpeed ,

                uSmallWavesElevation: smallWavesElevation ,
                uSmallWavesFrequency: smallWavesFrequency ,
                uSmallWavesSpeed: smallWavesSpeed ,
                uSmallIterations: smallWavesIterations ,

                uDepthColor: new THREE.Color(depthColor),
                uSurfaceColor: new THREE.Color(surfaceColor),
                uColorOffset: colorOffset ,
                uColorMultiplier: colorMultiplier,
                uShift: shift,
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

    useFrame(({clock})=>{
        seaRef.current.uniforms.uTime.value = clock.elapsedTime
    })



    extend({RagingSeaMaterial})

    return (
    <ragingSeaMaterial 
        ref={seaRef}
        uDepthColor = {depthColor}
        uSurfaceColor = {surfaceColor} 

        uBigWavesElevation = {bigWavesElevation}
        uBigWavesFrequency = {bigWavesFrequency}
        uBigWavesSpeed = {bigWavesSpeed}

        uSmallWavesElevation = {smallWavesElevation}
        uSmallWavesFrequency = {smallWavesFrequency}
        uSmallWavesSpeed = {smallWavesSpeed}
        uSmallIterations = {smallWavesIterations}

        uColorOffset = {colorOffset}
        uColorMultiplier = {colorMultiplier}
        uShift = {shift}
    />)
}

export default RagingSeaMaterial