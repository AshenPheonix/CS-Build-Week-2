import React from 'react'
import {Connection} from '../helpers/connection'

const defaultValues={
    cooldown:0,
    strength:0,
    speed:0,
    gold:0,
    items:[],
    bodywear:'None',
    footwear:'None',
    status:[],
    map:{},
    Connection
}

const GlobalContext=React.createContext(defaultValues)

export {GlobalContext,defaultValues}