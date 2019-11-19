import React from 'react'
import {Connection} from '../helpers/connection'
import Room from '../objects/room'

const defaultValues={
    name:'unnamed',
    cooldown:0,
    strength:0,
    speed:0,
    gold:0,
    items:[],
    bodywear:'None',
    footwear:'None',
    status:[],
    map:{},
    connected:false,
    Connection,
    init:()=>{},
    login:()=>{},
    dispatch:()=>{},
    map:{},
    currentRoom:null
}

const GlobalContext=React.createContext(defaultValues)

export {GlobalContext,defaultValues}