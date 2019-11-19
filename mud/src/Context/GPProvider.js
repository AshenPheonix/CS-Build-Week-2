import React from 'react'
import Gamepad from 'react-gamepad'

const defaultValues={
    connect:()=>{},
    disconnect:()=>{},
    
}

const GamepadContext=React.createContext(defaultValues)

export {GamepadContext,defaultValues}