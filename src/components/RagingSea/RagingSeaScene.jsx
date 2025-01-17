import * as THREE from 'three'

import { useControls } from "leva"
import RagingSeaMaterial from "./material/RagingSeaMaterial"
import { useEffect, useReducer, useRef } from 'react'
import PointLightGizmo from '../LightShading/gizmos/PointLightGizmo'
import DirectionalLightGizmo from '../LightShading/gizmos/DirectionalLightGizmo'
import { useGlobalContext } from '../../providers/GlobalProvider'
import { useState } from 'react'

const lightsInit = [
    {
        id: 10,
        type: 'point',
        position: new THREE.Vector3(0,0.25,0),
        color: new THREE.Color("#ffffff"),
        intensity: 10.0,
        specularPower: 30.0,
        decay: 0.9
    },
    {
        id: 11,
        type: 'directional',
        position: new THREE.Vector3(1, 0.5, 0.5),
        color: new THREE.Color("#ffffff"),
        intensity: 0.2,
        specularPower: 20.0
    },
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

const RagingSeaScene = () =>{

    const [lights, dispatchLights] = useReducer(reducer, lightsInit)
    const [activeGizmos, setActiveGizmos] = useState(-1)
    const [globals, dispatchGlobals] = useGlobalContext()

    const seaGeometryRef = useRef()

    const {
        depthColor, 
        surfaceColor,

        bigWavesElevation,
        bigWavesFrequency,
        bigWavesSpeed,

        smallWavesElevation,
        smallWavesFrequency,
        smallWavesSpeed,
        smallWavesIterations,
        colorOffset,
        colorMultiplier,
        uShift

    } = useControls('SeaColors', {
        depthColor: {
            value: "#ff4000"
        },
        surfaceColor: {
            value: "#151c37"
        },

        bigWavesElevation : {
            value: 0.2} ,
        bigWavesFrequency : {
            value: {
                x: 4, y: 1.5
            }
        },
        bigWavesSpeed : {
            value: 0.75
        },
        smallWavesElevation: {
            value: 0.15
        },
        smallWavesFrequency : {
            value: 3
        },
        smallWavesSpeed : {
            value: 0.2
        },
        smallWavesIterations : {
            value: 4
        },
        colorOffset: {
            value: 0.925
        },
        colorMultiplier : {
            value: 1
        },
        uShift: {
            value: 0.01
        }
    })

    useEffect(()=>{
        if (seaGeometryRef.current)
        {
            seaGeometryRef.current.deleteAttribute('normal')
            seaGeometryRef.current.deleteAttribute('uv')
        }

    }, [seaGeometryRef.current])

    const handlePointerClick = (e, id, visible = true) =>
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
        dispatchGlobals({type: "changeBackgroundColor", value: "#1e1d21"})
    }, [])

    return(<>
        <mesh rotation-x = {-Math.PI * 0.5} scale={2}>
            <planeGeometry args={[2,2,512,512]} ref={seaGeometryRef}/>
            <RagingSeaMaterial 
                depthColor={depthColor}
                surfaceColor={surfaceColor}

                bigWavesElevation ={bigWavesElevation}
                bigWavesFrequency ={bigWavesFrequency}
                bigWavesSpeed ={bigWavesSpeed}
        
                smallWavesElevation ={smallWavesElevation}
                smallWavesFrequency ={smallWavesFrequency}
                smallWavesSpeed ={smallWavesSpeed}
                smallWavesIterations ={smallWavesIterations}

                colorOffset ={colorOffset}
                colorMultiplier ={colorMultiplier}

                shift={uShift}
                lights={lights}
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
    </>)
}

export default RagingSeaScene