import * as THREE from 'three'

import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { useControls } from "leva"
import { useRef } from "react"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { useState } from "react"
import { useEffect } from "react"

import HalftoneMaterial from "./material/HaltoneMaterial"
import DirectionalLightGizmo from "../LightShading/gizmos/DirectionalLightGizmo"
import PointLightGizmo from "../LightShading/gizmos/PointLightGizmo"

import { useReducer } from "react"
import { useGlobalContext } from "../../providers/GlobalProvider"

const lightsInit = [
    {
        id: 20,
        type: 'directional',
        position: new THREE.Vector3(-2.0, 3.0, 2.0),
        color: new THREE.Color("#ffffff"),
        intensity: 1,
        specularPower: 1.0
    }
]


const reducer = (state, actions) =>{
    const newState = [...state]
    switch (actions.type) {
        case "changeLightColor":
            newState[actions.id].color = new THREE.Color(actions.value);
            return newState
            break;
        case "changeLightIntensity":
            newState[actions.id].intensity = actions.value;
            return newState
            break;
        case "changeLightPosition":
            newState[actions.id].position = actions.value;
            return newState
            break;
        case "changeLightDecay":
            if (newState[actions.id].type == "point")
                newState[actions.id].decay = actions.value;
            return newState
            break;
        default:
            break;
    }
}

const HalftoneScene = () =>{
    
    const [lights, dispatchLights] = useReducer(reducer, lightsInit)
    const [globals, dispatchGlobals] = useGlobalContext()
    
    const {nodes} = useLoader(GLTFLoader, '/suzanne.glb')
    const [activeGizmos, setActiveGizmos] = useState(-1)

    const {
        uHalftoneIntensity,
        modelColor, 
        uShadowRepetitions, 
        uPointShadowColor,
        uShadowColor, 
        uPointLightColor, 
        uLightRepetitions,
    
    } = useControls('HalftoneLight', 
    {
        uHalftoneIntensity:
        {
            value: 0.3,
            min: 0.0,
            max: 1.0
        },
        modelColor: '#ff794d',
        uShadowColor: 
        {
            value: "#ff794d"
        },
        uShadowRepetitions: 
        {
            value: 100,
            min: 1.0,
            max: 300
        },
        uPointShadowColor:
        {
            value: "#8e19b8"
        },
        uLightRepetitions: 
        {
            value: 130,
            min: 1.0,
            max: 300
        },
        uPointLightColor:
        {
            value: "#e5ffe0"
        },

       
       
    }
    )

    const suzanne = useRef()
    const sphere = useRef()
    const torus = useRef()

    useFrame((state, delta)=>{
        suzanne.current.rotation.y += delta * 0.4
        sphere.current.rotation.y += delta * 0.4
        torus.current.rotation.y += delta * 0.2
        torus.current.rotation.x += delta * 0.2
    })

    const handlePointerClick = (e, id, visible) =>
    {
        e.stopPropagation()
        if (visible)
        setActiveGizmos(id)
    }

    useEffect(()=>{
        if (globals.pointerMissed)
        {
            setActiveGizmos(-1)
            dispatchGlobals({type: "cancelMissPointer"})
        }
    }, [globals])

    useEffect(()=>{
        dispatchGlobals({type: "changeBackgroundColor", value: "#8e19b8"})
    }, [])



    return (
    <>
        <mesh geometry={nodes.Suzanne.geometry} ref={suzanne}>
            <HalftoneMaterial 
                color={modelColor} 
                lights={lights}
                shadowRepetitions={uShadowRepetitions}
                lightRepetitions={uLightRepetitions}
                pointShadowColor={uPointShadowColor}
                pointLightColor={uPointLightColor}
                shadowColor = {uShadowColor}
                halftoneIntensity = {uHalftoneIntensity}

            
            />
        </mesh>

        <mesh position-x= {-3} ref={sphere}>
            <sphereGeometry />
            <HalftoneMaterial 
                color={modelColor} 
                lights={lights}
                shadowRepetitions={uShadowRepetitions}
                lightRepetitions={uLightRepetitions}
                pointShadowColor={uPointShadowColor}
                pointLightColor={uPointLightColor}
                shadowColor = {uShadowColor}
                halftoneIntensity = {uHalftoneIntensity}
                
                />
        </mesh>

        <mesh position-x= {3} ref={torus}>
            <torusKnotGeometry args={[0.6,0.25,128,16,2,3]}/>
            <HalftoneMaterial 
                color={modelColor} 
                lights={lights}
                shadowRepetitions={uShadowRepetitions}
                lightRepetitions={uLightRepetitions}
                pointShadowColor={uPointShadowColor}
                pointLightColor={uPointLightColor}
                shadowColor = {uShadowColor}
                halftoneIntensity = {uHalftoneIntensity}
            
            
            />
        </mesh>

        {lights.map((el, id)=>{
            
            if (el.type == "directional")
                return <DirectionalLightGizmo 
                position={el.position} 
                handlePointerClick={handlePointerClick} 
                active={activeGizmos == id} 
                id={id}
                color={el.color.getHexString()}
                intensity={el.intensity}
                dispatch={dispatchLights}
                key={el.id}
                identifier={el.id}
                />
            else{
                return <PointLightGizmo 
                position={el.position} 
                handlePointerClick={handlePointerClick} 
                active={activeGizmos == id} 
                id={id}
                color={el.color.getHexString()}
                intensity={el.intensity}
                dispatch={dispatchLights}
                decay={el.decay}
                key={el.id}
                identifier={el.id}
                />
            }
        })}

    </>
    )
}

export default HalftoneScene