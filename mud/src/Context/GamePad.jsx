import React,{useReducer,useState} from 'react'
import {GamepadContext,defaultValues} from './GPProvider'

const GamepadReducer=(state,action)=>{
    switch (action.type) {
        case 'state_change':
            return {...action.payload}
            break;
        default:
            break;
    }
}


function GamepadProvider() {
    const [controller,setController]=useState(null)
    let defs = {
        buttonCache:[],
        buttonStatus:[],
        axesStatus:[]
    }

    const [state,dispatch]=useReducer(GamepadReducer,defs)

    //runtimes
    window.addEventListener('gamepadconnected',e=>{
        let pads = navigator.getGamepads()[e.gamepad.index]
        setAlert('Gamepad Connected')
        setController(pads)
        update()
    })
    
    window.addEventListener('gamepaddisconnected',e=>{
        setController(false)
        setAlert('Gamepad Disconnected')
    })
    
    const [buttons,setButtons]=useState([
        'DPad-Up','DPad-Down','DPad-Left','DPad-Right',
        'Start','Back','Axis-Left','Axis-Right',
        'LB','RB','Power','A','B','X','Y'
    ])

    const update=()=>{
        //if no pad connected, stop
        const pad=controller||{}
        if(!pad)
            return

        //store button previous state
        let cacheChange = false
        if(JSON.stringify(state.buttonCache) !== JSON.stringify(state.buttonStatus)){
            cacheChange = state.buttonStatus.map(i=>i)
        }
        
        let buttonChange=false
        
        const buttonsCurrent=pad.buttons.reverse() || false
        if (JSON.stringify(state.buttonStatus) !== JSON.stringify(buttonsCurrent)) {
            buttonChange=buttonsCurrent
        }

        
    }

    // controller:{},
    // update:()=>{},
    // buttonPressed:()=>{},
    // buttons:[],
    // buttonCache:[], //state req
    // buttonStatus:[],
    // axesStatus:[]

    return (
        <div>
            
        </div>
    )
}

export default GamepadProvider
