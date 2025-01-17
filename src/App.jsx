import { IoCodeSharp } from "react-icons/io5";

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
      <div style={{position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", display: "flex", justifyContent: "flex-end", alignItems: "flex-end", pointerEvents: "none"}}>
          <a href="https://github.com/felipematos-devjs/3jsstudies" target={"_blank"}>
            <div style={{backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, borderRadius: 100,  marginRight: 20, marginBottom: 20, pointerEvents: "all"}}>
              <IoCodeSharp size={30}/>
            </div>
          </a>
      </div>
    </>
  )
}

export default App
