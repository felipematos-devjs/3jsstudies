import { useFrame } from "@react-three/fiber"
import { useEffect } from "react"
import { useRef } from "react"

import { useGSAP } from '@gsap/react'
import {gsap} from 'gsap'
let tl = gsap.timeline({ defaults: { overwrite: "auto" }, repeat: -1});

import * as THREE from 'three'
const SmokeSpawner = (
    {
        numParticles= 12,
        fadeTime = 2.0,
        stagger = 0.2,
        particleSize = 0.075,
        offset = [0.1,0.05,-0.45]
    }
) =>{
    const particleArray = [...Array(numParticles)]

    const groupRef = useRef()

    useGSAP(()=>{
        tl.kill()
        tl = gsap.timeline({ repeat: -1});
        groupRef.current.children[0].visible = false
        for (let i = 0; i < numParticles; i++) {
            const particle = groupRef.current.children[i]
            particle.scale.set(0,0,0)
            let particleInterval = fadeTime / numParticles

            tl.fromTo(particle.position, 
                {x: offset[0], y: offset[1], z: offset[2]}, 
                {x: offset[0] + (Math.random() - 0.5) * 0.3, y: offset[1] + 0.5, z: offset[2] - Math.random() * 0.5, duration: fadeTime, repeat:-1,ease: "power2.out",}, `=-${1000 - particleInterval - stagger}`)
            tl.fromTo(particle.scale, {x: 1, y: 1, z: 1}, {x: 0, y: 0, z: 0, duration: fadeTime, repeat: -1, ease: "power2.inOut"}, '=-1000.0')
            tl.fromTo(particle.material.color, {r: 1, g: 1, b: 1}, {r: 0, g: 0, b: 0, duration: fadeTime, repeat: -1}, '=-1000.0')
        }

    }, [numParticles])

    useEffect(()=>{
        console.log(groupRef.current)
    }, [numParticles])

    
    return(
    <group ref={groupRef}>
        {particleArray.map((item, i)=>{
            return(
                <mesh position={offset} scale={[0, 0, 0]} key={i} castShadow receiveShadow>
                    <sphereGeometry args={[particleSize,8,8]}/>
                    <meshStandardMaterial color={'white'}/>
                </mesh>
            )
        })}    
    </group>
    )
}

export default SmokeSpawner