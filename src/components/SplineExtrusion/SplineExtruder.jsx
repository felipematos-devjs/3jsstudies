import * as THREE from 'three'

import { useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"

//generation constants
import { MAX_SEGMENTS } from "./SplineExtrusionScene"
import { getBezierPoint, getBezierLength } from "./Bezier"

import { memo } from 'react'

const SplineExtruder = ({
    //4 spline points
    points = [],

    //Cross Section data
    //only do stuff after it is loaded
    xSectionData = null,

    //textures
    map =  null,
    orm = null,
    normalMap = null,

    //segments to divide the mesh into
    segments = 8,
    wireframe = false,
    scale = [0.3, 0.3],
    offset=[0,0,0],
    color='white'
}) =>{
    console.log('render')

    //only generates mesh if the memory for buffer geometry was allocated
    const ready = useRef(false)

    //geometry data for procedural stuff
    const [count, setCount] = useState(0)
    const [vertices, setVertices] = useState()
    const [indices, setIndices] = useState()
    const [normals, setNormals] = useState()
    const [uvs, setUvs] = useState()

    //a reference to buffer geometry
    const geoRef = useRef()

    //memory allocation
    useEffect(()=>{
        if (xSectionData)
        {
            const ROADPOINTS = xSectionData.vertices.length
            //allocate memory to the buffer geometry
            setCount(ROADPOINTS * (MAX_SEGMENTS) * 3)
            setVertices(new Float32Array(ROADPOINTS * (MAX_SEGMENTS) * 3))
            setIndices(new Uint32Array(ROADPOINTS * (MAX_SEGMENTS) * 3))
            setNormals(new Float32Array(ROADPOINTS * (MAX_SEGMENTS) * 3))
            setUvs(new Float32Array(ROADPOINTS * (MAX_SEGMENTS) * 2))
            ready.current = true
        }
    }, [xSectionData])

    //Generate the mesh
    useEffect(()=>{
        if (ready.current)
        {
            generateMesh()
        }
    }, [ready.current, segments, points])

    //update mesh after generation
    useEffect(()=>{
        if (geoRef.current)
        {
            geoRef.current.setDrawRange(0, count)
            geoRef.current.attributes.position.needsUpdate = true
            geoRef.current.attributes.normal.needsUpdate = true
            geoRef.current.attributes.uv.needsUpdate = true
            geoRef.current.index.needsUpdate = true
        }
        //roadMesh.current.attributes.position.needsUpdate = true
    }, [vertices, count])

    //generates mesh if the mesh data exists
    const generateMesh = () =>{
        if (xSectionData)
        {
            
            const verts = []
            const normals = []
            const uvs = []

            //generate vertices
            for (let ring = 0; ring < segments; ring++) {

                const t  = ring / (segments - 1.0)

                const op = getBezierPoint(points, t)

                for (let i = 0; i < xSectionData.vertices.length; i++) {
                    const point2D = new THREE.Vector3(
                        xSectionData.vertices[i].position[0] * scale[0] + offset[0],
                        xSectionData.vertices[i].position[1] * scale[1] + offset[1],
                        0)
                    const normal2D = new THREE.Vector3(
                        xSectionData.vertices[i].normal[0],
                        xSectionData.vertices[i].normal[1],
                        0)

                    normal2D.normalize()
                    
                    verts.push(...op.localToWorld(point2D))
                    normals.push(...op.localToWorldDirection(normal2D))
                    uvs.push(xSectionData.vertices[i].u, t * getBezierLength(points) / 10)
                }
            }

            //generate triangles
            const triIndices = []
            for (let ring = 0; ring < segments-1; ring++) {
                const rootIndex = ring * xSectionData.vertices.length
                const rootIndexNext = (ring + 1) * xSectionData.vertices.length
                
                for (let line = 0; line < xSectionData.lineIndices.length; line+=2) {
                    const lineIndexA = xSectionData.lineIndices[line];
                    const lineIndexB = xSectionData.lineIndices[line + 1];

                    const currentA = rootIndex + lineIndexA;
                    const currentB = rootIndex + lineIndexB;

                    const nextA = rootIndexNext + lineIndexA;
                    const nextB = rootIndexNext + lineIndexB;

                    triIndices.push(currentA)
                    triIndices.push(nextA)
                    triIndices.push(nextB)

                    triIndices.push(currentA)
                    triIndices.push(nextB)
                    triIndices.push(currentB)
                }
            }

            const positionArray = new Float32Array(xSectionData.vertices.length * (MAX_SEGMENTS) * 3) 
            const normalArray = new Float32Array(xSectionData.vertices.length * (MAX_SEGMENTS) * 3) 
            const indicesArray = new Uint32Array(xSectionData.vertices.length * (MAX_SEGMENTS) * 3) 
            const uvArray = new Float32Array(xSectionData.vertices.length * (MAX_SEGMENTS) * 2) 

            for (let i = 0; i < triIndices.length; i++) {
                indicesArray[i] = triIndices[i]
            }

            for (let i = 0; i < verts.length; i++) {
                positionArray[i] = verts[i]
                normalArray[i] = normals[i]
            }

            for (let i = 0; i < uvs.length; i++) {
                uvArray[i] = uvs[i]
            }


            setCount(positionArray.length)
            setVertices(positionArray)
            setNormals(normalArray)
            setIndices(indicesArray)
            setUvs(uvArray)

            console.log(geoRef.current)

        }
    }

    return (
    <mesh receiveShadow castShadow>
        {count != 0 && 
        <>
            <bufferGeometry ref={geoRef}>
                <bufferAttribute attach={"index"} itemSize={1} array={indices} count={indices.length}/>
                <bufferAttribute attach={"attributes-position"} itemSize={3} array={vertices} count={vertices.length}/>
                <bufferAttribute attach={"attributes-normal"} itemSize={3} array={normals} count={normals.length}/>
                <bufferAttribute attach={"attributes-uv"} itemSize={2} array={uvs} count={uvs.length}/>
            </bufferGeometry>
            <meshStandardMaterial 
                map={map} 
                roughnessMap={orm} 
                metalnessMap={orm} 
                aoMap={orm}
                bumpMap={normalMap}
                wireframe={wireframe}
                color={color}
            />
        </>
        } 
    </mesh>
    )
}

export default memo(SplineExtruder)