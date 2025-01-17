import * as THREE from 'three'
import {extend, useLoader} from '@react-three/fiber'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader'

extend({
        Lensflare, 
        LensflareElement
    })

import PropTypes from 'prop-types'
import { useRef } from 'react';
import { useEffect } from 'react';

const Flares = ({sunPosition = new THREE.Vector3(), radius = 7}) =>{

    const flare = useRef()
    const pointLightRef = useRef()
    const ready = useRef(false)

    const [textureFlare0, textureFlare1] 
    = useLoader(TextureLoader, [
        '/textures/lenses/lensflare0.png',
        '/textures/lenses/lensflare1.png',
    ])

    useEffect(()=>{
        if (flare && !ready.current)
        {
            console.log(pointLightRef)

            const element1 = new LensflareElement(textureFlare0, 512, 0)
            const element2 = new LensflareElement(textureFlare1, 256, 0.3)

            flare.current.addElement(
                element1
            )

            flare.current.addElement(
                element2
            )
            ready.current = true
            flare.current.geometry.boundingSphere = null
            flare.current.frustumCulled = false
        }
    }, [])


    return(
        <pointLight
            position={[sunPosition.x * radius, sunPosition.y * radius, sunPosition.z * radius]}
            distance={10}
            decay={0}
            intensity={3}
            frustumCulled={false}
            ref={pointLightRef}
        >
            <lensflare ref={flare} frustumCulled={false} />
        </pointLight>)
}

Flares.propTypes = {
    sunPosition: PropTypes.object,
    radius: PropTypes.number
}

export default Flares