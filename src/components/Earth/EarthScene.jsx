import * as THREE from 'three'

import EarthMaterial from "./EarthMaterial/EarthMaterial"
import { useControls } from "leva"
import { useEffect, useMemo, useRef } from "react"
import { useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGlobalContext } from '../../providers/GlobalProvider'
import AtmosphereMaterial from './AtmosphereMaterial/AtmosphereMaterial'
import { Environment, Stars, useEnvironment } from '@react-three/drei'
import Flares from './Flares/Flares'

const EarthScene = () =>{
    const [sunDirection, setSunDirection] = useState(new THREE.Vector3())
    const [globals, dispatchGlobals] = useGlobalContext()

    const earthRef = useRef()

    /* Sun */
    const {phi, theta} = useControls('Sun', {
        phi: {
            value: Math.PI/2,
            min: 0.0,
            max: Math.PI
        },
        theta: {
            value: 0.0,
            min: 0.0,
            max: Math.PI * 2.0
        }
    })
    
    /* earth */
    const {atmosphereDayColor, atmosphereTwilightColor} = useControls('Earth', {
        atmosphereDayColor:{
            value: "#00aaff"
        },
        atmosphereTwilightColor:{
            value: "#ff6600"
        },
    })

    useEffect(()=>{
        const sunSpherical = new THREE.Spherical(1, phi, theta)
        const newSunDirection = new THREE.Vector3().setFromSpherical(sunSpherical)
        setSunDirection(newSunDirection);
    }, [phi, theta])

    useEffect(()=>{
        dispatchGlobals({type: "changeBackgroundColor", value: "#000011"})
    }, [])

    useFrame((state, delta)=>{
        if (earthRef)
        {
            earthRef.current.rotation.y += delta * 0.05
        }
    })

    return (<>
        <mesh position={
            sunDirection
            ?[sunDirection.x * 7, sunDirection.y * 7, sunDirection.z * 7]
            :[0,0,0]
            }
            visible={false}
            
            
            >
            <icosahedronGeometry args={[0.3, 2]}/>
            <meshBasicMaterial color={'white'}/>
        </mesh>

        <mesh ref={earthRef}>
            <sphereGeometry args={[3, 64, 64]}/>
            <EarthMaterial 
                sunDirection={sunDirection} 
                atmosphereDayColor={atmosphereDayColor}
                atmosphereTwilightColor={atmosphereTwilightColor}
            />
        </mesh>

        <mesh scale={1.04}>
            <sphereGeometry args={[3, 64, 64]}/>
            <AtmosphereMaterial 
                sunDirection={sunDirection} 
                atmosphereDayColor={atmosphereDayColor}
                atmosphereTwilightColor={atmosphereTwilightColor}
            />
        </mesh>
        <Stars />
        <Flares sunPosition={sunDirection}/>
        

    </>)
}

export default EarthScene