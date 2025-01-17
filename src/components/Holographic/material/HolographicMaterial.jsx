import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'

import * as THREE from 'three'
import { useRef } from "react"

const HolographicMaterial = ({color = "#70c1ff", stripeGap = 20.0, falloffPosition = 0.0}) =>{

    const materialRef = useRef()

    const HolographicMaterial = useMemo(()=>{
        return shaderMaterial(
            {
                uColor: new THREE.Color(color),
                uStripeGap: stripeGap,
                uTime: 0,
                uFalloffPosition: 0.0
            },
            vertex,
            fragment
            )
    }, [color, stripeGap, falloffPosition])

    useFrame(({clock})=>{
        const elapsedTime = clock.elapsedTime
        materialRef.current.uniforms.uTime.value = elapsedTime
    })

    extend({HolographicMaterial})

    return (
    <holographicMaterial
        ref = {materialRef}
        transparent
        side = {THREE.DoubleSide}
        depthWrite = {false}
        blending  = {THREE.AdditiveBlending}
        uColor = {color}
        uStripeGap = {stripeGap}
        uFalloffPosition = {falloffPosition}
    />)
}

export default HolographicMaterial