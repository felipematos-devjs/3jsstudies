import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from '@react-three/fiber'
import HolographicMaterial from './material/HolographicMaterial'
import { useControls } from 'leva'
import { useGlobalContext } from '../../providers/GlobalProvider'

import { useEffect } from 'react'

const HolographicScene = () =>{

    const suzanneModel = useLoader(GLTFLoader, '/suzanne.glb')
    const [globals, dispatchGlobals] = useGlobalContext()

    const {color, stripeGap, falloffPosition} = useControls('Holographic', {
        color: {
            value: "#70c1ff"
        },
        stripeGap: {
            value: 20.0,
            min: 0
        },
        falloffPosition: {
            value: 0.00
        }
    })

    useEffect(()=>{
        dispatchGlobals({type: "changeBackgroundColor", value: "#1e1d21"})
    }, [])

    return (<>
        <mesh geometry={suzanneModel.nodes.Suzanne.geometry}>
            <HolographicMaterial color={color} stripeGap={stripeGap} falloffPosition={falloffPosition}/>
        </mesh>

        <mesh rotation-x={Math.PI} position-y = {-1.0}>
            <coneGeometry args={[2,5,32,8,true]}/>
            <HolographicMaterial color={color} stripeGap={stripeGap} falloffPosition={falloffPosition}/>
        </mesh>

    </>)
}

export default HolographicScene