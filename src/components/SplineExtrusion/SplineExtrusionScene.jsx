import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Environment, SoftShadows, TransformControls, useHelper } from '@react-three/drei'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useGlobalContext } from '../../providers/GlobalProvider'
import { useControls } from 'leva'

import { OrientedPoint, getBezierPoint, getBezierLength} from './Bezier'
import { useFrame, useLoader } from '@react-three/fiber'
import SplineExtruder from './SplineExtruder'

import { memo } from 'react'
import { useGSAP } from '@gsap/react'
import {gsap} from 'gsap'
import { CameraHelper, DirectionalLightHelper } from 'three'
import SplineObjectSpawner from './SplineObjectSpawner'
let tl = gsap.timeline({ defaults: { overwrite: "auto" }, repeat: -1});

import {fenceBottomProps, fenceTopProps, fencePostsProps, treeBottomProps, treeTopProps, hydrantProps} from './Constants'
import SmokeSpawner from './SmokeSpawner'

//generation constants
export const MAX_SEGMENTS = 64
const ROADPOINTS = 18


const o = [1.95,0.15,0]
const s = [0.2,0.2,0.2]



const SplineExtrusionScene = () =>{
    
    //variable declaration
    const carRef = useRef()
    const shadowCameraRef = useRef()
    const lightRef = useRef()
    const [activeTransform, setActiveTransform] = useState(-1)
    const [globals, dispatchGlobals] = useGlobalContext()

    //data for road and fences
    const [roadData, setRoadData] = useState()
    const [fenceData, setFenceData] = useState()
    const [bezierCenter, setBezierCenter] = useState([0,0,0])

    //control points position
    const [points, setPoints] = useState(
    [
        new THREE.Vector3(6,0,6 - 1),
        new THREE.Vector3(3,0,0 - 1),
        new THREE.Vector3(-1.5,0,3 - 1),
        new THREE.Vector3(-4,2,2 - 1),
    ])

    const [pathLength, setPathLength] = useState(getBezierLength(points, 16))

    //debug
    const {segments, debug, wireframe} = useControls("road", {
        segments:{
            value: 32,
            min: 8,
            max: MAX_SEGMENTS,
            step: 1
        },
        debug: {
            value: false
        },
        wireframe: {
            value: false
        }
    })
    
    //car
    const carModel = useLoader(GLTFLoader, '/models/stylizedcar.glb')

    carModel.scene.traverse((child)=>{
        if (child.isMesh)
        {
            child.castShadow = true
        }
    })
    carModel.castShadow = true;
    carModel.scene.castShadow = true;

    //fence
    const fenceModel = useLoader(GLTFLoader, '/models/fence.glb')
    const fenceGeo = fenceModel.nodes.Cube.geometry

    //tree
    const treeModel = useLoader(GLTFLoader, '/models/tree.glb')
    const treeGeoBottom = treeModel.nodes.Bottom.geometry
    const treeGeoTop = treeModel.nodes.Top.geometry

    //tree
    const hydrantModel = useLoader(GLTFLoader, '/models/hydrant.glb')
    const hydrantGeo = hydrantModel.nodes.Hydrant.geometry

    const [map, normalMap, ormMap] = useLoader(THREE.TextureLoader, ['/textures/road/road_baseColor.png', '/textures/road/road_normal.png', '/textures/road/road_occlusionRoughnessMetallic.png'])
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8

    map.wrapS = THREE.RepeatWrapping
    map.wrapT = THREE.RepeatWrapping

    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.anisotropy = 8


    ormMap.wrapS = THREE.RepeatWrapping
    ormMap.wrapT = THREE.RepeatWrapping
    ormMap.anisotropy = 8

    normalMap.flipY = true

    const handleSelectTransform = (ev, id) =>{
        setActiveTransform(id)
        dispatchGlobals({type: "cancelMissPointer"})
    }

    const handleUpdatePoints = (ev, id) =>{
        let newPoints = []
        if (ev.target.object)
        {
            newPoints = [...points]

            if (
                newPoints[id].distanceTo(ev.target.object.position) > 0.1
                )
            {
                newPoints[id] = new THREE.Vector3().copy(ev.target.object.position)
                setPoints(newPoints)
                const newCenter = getBezierPoint(newPoints, 0.5)
                setBezierCenter([newCenter.position.x-3, newCenter.position.y + 10, newCenter.position.z]) 
                setPathLength(getBezierLength(newPoints, 16))
            }
        }
    }

    useEffect(()=>{
        setActiveTransform(-1)
        dispatchGlobals({type: "cancelMissPointer"})
    }, [globals.pointerMissed])

    //fetch road data from json
    useEffect(()=>{
        fetch('/json/roadData.json')
        .then(res => res.json())
        .then(data =>{
            setRoadData(data)
        })
    }, [])

    //fetch fence data from json
    useEffect(()=>{
        fetch('/json/fenceData.json')
        .then(res => res.json())
        .then(data =>{
            setFenceData(data)
        })
    }, [])

    const helper1 = useHelper(lightRef, DirectionalLightHelper, 1, 'red')
    const helper2 = useHelper(shadowCameraRef, CameraHelper)

    useEffect(()=>{
        const newCenter = getBezierPoint(points, 0.5)
        setBezierCenter([newCenter.position.x-3, newCenter.position.y + 10, newCenter.position.z])

        helper1.current.visible = false
        helper2.current.visible = false
    }, [])

    //car animations
    const animT = useRef(0.0)
    const animS = useRef(0.0)
    
    useGSAP(()=>{
        tl.kill()
        tl = gsap.timeline({ defaults: { overwrite: "auto" }, repeat: -1});
        tl.fromTo(animS, {current: 0}, {current: 1, duration: 2, ease: "elastic.inOut(1,0.3)"})
        tl.fromTo(animT, {current: 0}, {current: 1, duration: 7.5 * pathLength * 0.05, ease: 'none', delay: -1})
        tl.fromTo(animS, {current: 1}, {current: 0, duration: 2, ease: "elastic.inOut(1,0.3)", delay: -1})
        console.log(pathLength)
    }, [pathLength])

    useFrame(({clock})=>{
        
        const carPoint = getBezierPoint(points, animT.current)
        const offsetPosition = carPoint.localToWorld(new THREE.Vector3(0,0,0))
    
        carRef.current.scale.set(animS.current, animS.current, animS.current)

        carRef.current.position.copy(offsetPosition)
        carRef.current.quaternion.copy(carPoint.quaternion)
    })

    return (
     <>   
        <Environment preset='dawn' background blur={0.5}/>
        <primitive object={ carModel.scene } ref={carRef} castShadow>
            <SmokeSpawner />
        </primitive>

        {debug && <>

            {points.map((el, id)=>{
            return (       
                <TransformControls 
                enabled={ id == activeTransform? true : false}
                position={[el.x, el.y, el.z]}
                size={id == activeTransform? 1 : 0}
                key={id}

                onMouseUp={(ev)=>{
                    if (id == activeTransform)
                    {
                        handleUpdatePoints(ev, id)
                    }
                }}>
                    <mesh 
                    onClick={(ev)=>handleSelectTransform(ev, id)}
                    renderOrder={10}
                    >
                        <sphereGeometry args={[0.1]}/>
                        <meshBasicMaterial 
                            depthWrite={false}
                            depthTest={false}
                            color={'red'}
                        />
                    </mesh>
                </TransformControls>
            )})}

            <Line 
            start={[points[0].x, points[0].y, points[0].z]} 
            end={[points[1].x, points[1].y, points[1].z]}
            />

            <Line 
            start={[points[2].x, points[2].y, points[2].z]} 
            end={[points[3].x, points[3].y, points[3].z]}
            />

            <BezierCurve 
                p0={[points[0].x, points[0].y, points[0].z]}
                p1={[points[1].x, points[1].y, points[1].z]}
                p2={[points[2].x, points[2].y, points[2].z]}
                p3={[points[3].x, points[3].y, points[3].z]}
            />
        </>
        }

        {/* Road */}
        <SplineExtruder 
            points = {points}
        
            xSectionData={roadData}

            map={map}
            orm={ormMap}
            normalMap={normalMap}

            segments={segments}
            wireframe={wireframe}
        />

        {/* fence top */}



        <SplineExtruder 
            points = {points}
        
            xSectionData={fenceData}

            segments={segments}
            wireframe={wireframe}
            color={'#A1662F'}
            {...fenceTopProps}
        />
        {/* fence bottom */}
        <SplineExtruder 
            points = {points}
        
            xSectionData={fenceData}

            segments={segments}
            wireframe={wireframe}
            {...fenceBottomProps}
            color={'#A1662F'}
        />

        {/* fence objects */}
        <SplineObjectSpawner 
            amount={Math.floor(pathLength)}
            points={points}
            {...fencePostsProps}
            start={0.05}
            end={0.95}
            spawnChance={1}
            randomNuber={1}
            geometry={fenceGeo}
        />

        {/* tree objects */}
        <SplineObjectSpawner 
            amount={Math.floor(pathLength * 0.3)}
            points={points}
            start={0.05}
            end={0.95}
            spawnChance={1}
            randomNuber={1}
            {...treeBottomProps}
            geometry={treeGeoBottom}
        />

        {/* tree objects */}
        <SplineObjectSpawner 
            amount={Math.floor(pathLength * 0.3)}
            points={points}
            start={0.05}
            end={0.95}
            spawnChance={1}
            randomNuber={1}
            geometry={treeGeoTop}
            {...treeTopProps}
        />

        {/* hydrant objects */}
        <SplineObjectSpawner 
            amount={Math.max(Math.floor(pathLength * 0.15), 2)}
            points={points}
            start={0.05}
            end={0.95}
            spawnChance={1}
            randomNuber={1}
            geometry={hydrantGeo}
            {...hydrantProps}
        />

        <directionalLight 
            ref={lightRef}
            position={bezierCenter} 
            castShadow
            shadow-mapSize={[2048, 2048]}
            target-position={[bezierCenter[0] + 3, bezierCenter[1] - 10, bezierCenter[2]]}
        >
            <orthographicCamera ref={shadowCameraRef} attach="shadow-camera" 
            left={-10}
            right={10}
            top={10}
            bottom={-10} 
            map
            far={40}
            />
        </directionalLight>
     </>
    )
}

function Line({ start, end }) {
    const ref = useRef()
    useEffect(() => {
      ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
    }, [start, end])
    return (
      <line ref={ref}
      renderOrder={10}
      
      >
        <bufferGeometry />
        <lineDashedMaterial color="hotpink" gapSize={1} dashSize={3}
        depthTest={false}
        depthWrite={false}
        
        />
      </line>
    )
}

function BezierCurve({ p0, p1, p2, p3 }) {
    const ref = useRef()
    const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(...p0), new THREE.Vector3(...p1), new THREE.Vector3(...p2), new THREE.Vector3(...p3))
    const points = curve.getPoints(50)

    useEffect(() => {
      ref.current.geometry.setFromPoints(points)
    }, [ p0, p1, p2, p3])
    
    return (
      <line ref={ref}
      renderOrder={10}
      >
        <bufferGeometry />
        <lineBasicMaterial color="cyan"
                depthTest={false}
                depthWrite={false}
        
        />
      </line>
    )
}

export default SplineExtrusionScene