import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { useControls } from "leva"
import { useRef } from "react"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import LightShadingMaterial from "./material/LightShadingMaterial"
import { useState } from "react"
import { useEffect } from "react"
import DirectionalLightGizmo from "./gizmos/DirectionalLightGizmo"
import PointLightGizmo from "./gizmos/PointLightGizmo"

import * as THREE from 'three'
import { useReducer } from "react"
import { useGlobalContext } from "../../providers/GlobalProvider"

const lightsInit = [
    {
        id: 0,
        type: 'directional',
        position: new THREE.Vector3(3, 1.5, 1.5),
        color: new THREE.Color("#0000ff"),
        intensity: 1,
        specularPower: 20.0
    },
    {
        id: 1,
        type: 'directional',
        position: new THREE.Vector3(-3, -1.5, -1.5),
        color: new THREE.Color("#ff0000"),
        intensity: 0.5,
        specularPower: 20.0
    },
    {
        id: 2,
        type: 'point',
        position: new THREE.Vector3(0,3,-3),
        color: new THREE.Color("#ffffff"),
        intensity: 0.5,
        specularPower: 20.0,
        decay: 0.3
    },
    {
        id: 3,
        type: 'point',
        position: new THREE.Vector3(0,3,3),
        color: new THREE.Color("#ffff00"),
        intensity: 0.2,
        specularPower: 20.0,
        decay: 0.1
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

const LightShadingScene = () =>{
    
    const [lights, dispatchLights] = useReducer(reducer, lightsInit)
    
    const [globals, dispatchGlobals] = useGlobalContext()
    
    const {nodes} = useLoader(GLTFLoader, '/suzanne.glb')
    const [activeGizmos, setActiveGizmos] = useState(-1)

    const {modelColor} = useControls('lightShading', {modelColor: '#ffffff'})

    const {ambientLightColor, ambientLightIntensity} = useControls('Ambient Light', {ambientLightColor: "#ffffff", ambientLightIntensity: 0.05})

    const suzanne = useRef()
    const sphere = useRef()
    const torus = useRef()

    useFrame((state, delta)=>{
        suzanne.current.rotation.y += delta * 0.4
        sphere.current.rotation.y += delta * 0.4
        torus.current.rotation.y += delta * 0.2
        torus.current.rotation.x += delta * 0.2
    })

    const handlePointerClick = (e, id) =>
    {
        e.stopPropagation()
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
        dispatchGlobals({type: "changeBackgroundColor", value: "#1e1d21"})
    }, [])

    return (
    <>
        <mesh geometry={nodes.Suzanne.geometry} ref={suzanne}>
            <LightShadingMaterial color={modelColor} ambientLightColor={ambientLightColor} ambientLightIntensity={ambientLightIntensity} lights={lights}/>
        </mesh>

        <mesh position-x= {-3} ref={sphere}>
            <sphereGeometry />
            <LightShadingMaterial color={modelColor} ambientLightColor={ambientLightColor} ambientLightIntensity={ambientLightIntensity} lights={lights}/>
        </mesh>

        <mesh position-x= {3} ref={torus}>
            <torusKnotGeometry args={[0.6,0.25,128,16,2,3]}/>
            <LightShadingMaterial color={modelColor} ambientLightColor={ambientLightColor} ambientLightIntensity={ambientLightIntensity} lights={lights}/>
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

export default LightShadingScene