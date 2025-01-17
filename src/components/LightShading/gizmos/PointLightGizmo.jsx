import { PivotControls, Html } from "@react-three/drei"
import { useState } from "react"
import { FaLightbulb  } from "react-icons/fa"
import { useControls } from "leva"
import { useRef } from "react"
import { useEffect } from "react"
import * as THREE from 'three'

const PointLightGizmo = ({position =  new THREE.Vector3(), active = false, id = 0, handlePointerClick, color= "#ffffff", intensity= 0.2, dispatch = null, decay= 0.1, identifier = 0}) =>{

    const [matrix, setMatrix] = useState(new THREE.Matrix4().setPosition(position))

    const {pointLightColor, pointLightIntensity, visible} = useControls(
        `Point Light ${identifier}`, 
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
                max: 20,
                step: 0.01
            },
            decay: 
            {
                value: decay,
                onChange: function(v){
                    dispatch({type: "changeLightDecay", id: id, value: v})
                },
                min: 0,
                max: 3,
                step: 0.01
            },
            visible: {value: false}
        })

    return (
    <PivotControls 
    visible={visible}
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
                  distanceFactor={30}
                  sprite
              >
                  <FaLightbulb size={12} color={`#${color}`} opacity={!visible? 0.0 : active? 1.0 : 0.4}/>
              </Html>
          </mesh>
      </PivotControls>
      )
}

export default PointLightGizmo