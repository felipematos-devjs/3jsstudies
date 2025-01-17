import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { useMemo } from "react"
import * as THREE from 'three'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

const LightShadingMaterial = ({color = "ffffff", ambientLightColor = "#ffffff", ambientLightIntensity = 0.2, lights=[]}) =>{

    const LightShadingMaterial = useMemo(()=>{

        const dirLights = lights.filter((el)=>{
            return el.type == "directional"
        })

        const pointLights = lights.filter((el)=>{
            return el.type == "point"
        })

        return shaderMaterial(
            {
                uColor: new THREE.Color(color),
                uAmbientColor: new THREE.Color(ambientLightColor),
                uAmbientIntensity: ambientLightIntensity,
                uDirLights: 
                [
                    ...dirLights
                ],
                uPointLights: 
                [
                    ...pointLights
                ],
            },
            vertex,
            fragment
        )
    }, [color, ambientLightColor, ambientLightIntensity, lights])
    
    extend({LightShadingMaterial})
    
    return <lightShadingMaterial 
            uColor={color}
            uAmbientColor={ambientLightColor}
            uAmbientIntensity={ambientLightIntensity}
        />
}

export default LightShadingMaterial