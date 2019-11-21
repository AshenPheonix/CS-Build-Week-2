import React from 'react'
import {Connection} from '../helpers/connection'
import Room from '../objects/room'

const defaultValues={
    name:'unnamed',
    cooldown:0,
    strength:0,
    speed:0,
    gold:0,
    inventory:[],
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
    currentRoom:null,
    pickup:(item)=>{},
    resetUser:()=>{},
    changeName:()=>{},
    pray:()=>{},
    getProof:()=>{},
    treasureRoom:-1,
    setTreasureRoom:(room)=>{},
    GPConnected:false,
    setGPConnected:which=>{},
    fetchProof:e=>{},
    sendMine:e=>{}
}

const GlobalContext=React.createContext(defaultValues)

export {GlobalContext,defaultValues}