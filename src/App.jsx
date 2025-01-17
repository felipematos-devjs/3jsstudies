import * as THREE from 'three'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'

import './App.css'
import Experience from './components/Experience'

import {Leva, useControls} from 'leva'
import { useGlobalContext } from './providers/GlobalProvider'

function App() {

  const [globals, dispatchGlobals] = useGlobalContext()

  return (
    <>
      <Leva 
        collapsed
      />
      <Canvas onPointerMissed={()=>{
        if (!globals.pointerMissed)
        {
          dispatchGlobals({type: "missPointer"})
        }
      }}
      gl={{toneMapping: THREE.ACESFilmicToneMapping}} 
      shadows
      
      
      >
        <color attach={'background'} args={[globals.background]}/>
        <Experience />
      </Canvas>
    </>
  )
}

export default App
