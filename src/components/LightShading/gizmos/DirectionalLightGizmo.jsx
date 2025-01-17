import { PivotControls, Html } from "@react-three/drei"
import { useState } from "react"
import { FaSun } from "react-icons/fa"
import { useControls } from "leva"
import { useRef } from "react"
import { useEffect } from "react"
import * as THREE from 'three'

const DirectionalLightGizmo = ({position =  new THREE.Vector3(), active = false, id = 0, handlePointerClick, color= "#ffffff", intensity= 0.2, dispatch = null, identifier=0}) =>{

    const [matrix, setMatrix] = useState(new THREE.Matrix4().setPosition(position))

    const {directionalLightColor, directionalLightIntensity, visible} = useControls(
        `Directional Light ${identifier}`, 
        {
            Color: {
                value: `#${color}`,
                onChange: function(v){
                    dispatch({type: "changeLightColor", id: id, value: v})
                }
            }, 
            Intensity: 
            {
                value: intensity,
                onChange: function(v){
                    dispatch({type: "changeLightIntensity", id: id, value: v})
                },
                min: 0,
                max: 3,
                step: 0.01
            },
            visible: {value: false}
        })

    return (
    <PivotControls 
        depthTest={false}
        anchor={[0,0,0]}
        activeAxes={[active, active, active]}
        onClick={(e) => handlePointerClick(e, id, visible)}
        autoTransform={false}
        onDrag={(e)=>{
            // Extract the position and rotation
            const pos = new THREE.Vector3().setFromMatrixPosition(e)
            dispatch({type: "changeLightPosition", id: id, value: pos})
            const _matrix = new THREE.Matrix4()
            _matrix.setPosition(pos)
            setMatrix(_matrix)
        }}
        matrix={matrix}
        
      >
          <mesh 
            visible={false} 
          >
              <sphereGeometry 
              args={[0.3,16]}
              />
              <Html
                  wrapperClass="gizmo"
                  distanceFactor={10}
                  sprite
              >
                  <FaSun size={48} color={`#${color}`} opacity={!visible? 0.0 : active? 1.0 : 0.4}/>
              </Html>
          </mesh>
      </PivotControls>
      )
}

export default DirectionalLightGizmo