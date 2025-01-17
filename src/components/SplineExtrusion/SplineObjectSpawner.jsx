import * as THREE from 'three'

import { useRef } from "react"
import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { getBezierPoint } from './Bezier'
import { memo } from 'react'

const SplineObjectSpawner = (
    {
    //4 spline points
    points = [],

    //segments to divide the mesh into
    scale = [1,1,1],
    offset=[0,0,0],
    random=[0,0,0],
    amount= 10,
    spawnChance = 1.0,
    start = 0.05,
    end = 0.95,
    geometry = null,
    primitive = null,
    materialProps = {}
    }
) =>{

    console.log('render')
    const objectRef = useRef()
    const ready = useRef(false)

    useEffect(()=>{
        updateMatrix()
    }, [objectRef.current])

    const updateMatrix = () =>{
        for (let i = 0; i < amount; i++) {
            const tempMatrix = new THREE.Matrix4()
            const t = ((i / (amount-1)) * (1.0 - start) + start) * end
            const op = getBezierPoint(points, t)

            const point2D = new THREE.Vector3(
                offset[0],
                offset[1],
                0
            )

            const instancePosition = op.localToWorld(point2D)
            const instanceRot = op.quaternion

            if (Math.random() < spawnChance)
                tempMatrix.compose(instancePosition, instanceRot, new THREE.Vector3(scale[0], scale[1], scale[2]))
            else
            {
                tempMatrix.compose(instancePosition, instanceRot, new THREE.Vector3(0,0,0))
            }
            objectRef.current.setMatrixAt(i, tempMatrix)

            ready.current = true
        }
        objectRef.current.instanceMatrix.needsUpdate = true;
    }



    const material = new THREE.MeshStandardMaterial({...materialProps})
    if (!geometry && !primitive)
        geometry = new THREE.BoxGeometry(1,1,1)
    else if (primitive)
    {
        geometry = primitive
    }

    return <instancedMesh 
    castShadow
    receiveShadow
        ref={objectRef}
        args={[geometry, material, amount]}
    />
}
export default memo(SplineObjectSpawner)