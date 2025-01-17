import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useControls } from "leva"
import { useEffect } from "react"
import EarthScene from "./Earth/EarthScene"
import HalftoneScene from "./Halftone/HalftoneScene"
import HolographicScene from "./Holographic/HolographicScene"
import LightShadingScene from "./LightShading/LightShadingScene"
import RagingSeaScene from "./RagingSea/RagingSeaScene"
import SplineExtrusionScene from "./SplineExtrusion/SplineExtrusionScene"

const options = {
    lightScene: '0', 
    holographicScene: '1',
    ragingSeaScene: '2',
    halftoneScene: '3',
    earthScene: '4',
    bezierScene: '5',
}

const Experience = () =>{

    const {currentScene} = useControls('Scene', {
        currentScene: {
            options: options
        }
    })

    useEffect(()=>{
        console.log(currentScene)
    }, [currentScene])

    return (
        <>
            <OrbitControls makeDefault/>
            <PerspectiveCamera makeDefault position={[7,3,7]}/>
            
            {(currentScene == options.lightScene) && <LightShadingScene />}
            {(currentScene == options.holographicScene) && <HolographicScene />}
            {(currentScene == options.ragingSeaScene) && <RagingSeaScene />} 
            {(currentScene == options.halftoneScene) && <HalftoneScene />} 
            {(currentScene == options.earthScene) && <EarthScene />} 
            {(currentScene == options.bezierScene) && <SplineExtrusionScene />} 
           
            {/* <SplineExtrusionScene /> */}
            
        </>
    )
    
}

export default Experience