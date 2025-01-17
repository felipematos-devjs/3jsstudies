import { useContext } from "react"
import { useReducer } from "react"
import { createContext } from "react"

const initialGlobals = {
    pointerMissed: false,
    background: "#1e1d21"
}

const GlobalsContext = createContext(initialGlobals)

const reducer = (state, actions) =>{
    const newState = {...state}
    
    switch (actions.type) {
        case "missPointer":
            newState.pointerMissed = true
            return newState 
        break;
        case "cancelMissPointer":
            newState.pointerMissed = false
            return newState 
        break;
        case "changeBackgroundColor":
            newState.background = actions.value
            return newState 
        break;

        default:
            break;
    }
}

export const GlobalProvider = ({children}) =>{
    
    const [globals, dispatchGlobals] = useReducer(reducer, initialGlobals)
    
    return (
        <GlobalsContext.Provider value={[globals, dispatchGlobals]}>
            {children}
        </GlobalsContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalsContext)