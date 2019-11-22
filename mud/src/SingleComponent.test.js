import React from 'react'
import {render} from '@testing-library/react'
import {GlobalContext,defaultValues} from './Context/provider'
import Move from './Components/Move'
import Room from './objects/room'
import DescBox from './Components/DescBox'
import Map from './Components/Map'
import ViewBoard from './Components/ViewBoard'

const   room8=new Room(8,'A small room',"A small white room",['n','e','s'],'(1,1)',[]),
        room9=new Room(9,'A smaller room','A small, green room.',['w'],'(2,1)',[]),
        room6=new Room(6,'A large room','A Large, Red Room',['s'],'(1,2)',[]),
        room20=new Room(20,'A very large room','A Huge Blue Room',['n'],'(0,1)',[])

        room8.knowExit('e',9)
        room8.knowExit('n',6)
        room8.knowExit('s',20)
        room9.knowExit('w',8)
        room20.knowExit('n',8)
        room6.knowExit('s',8)

const ctxDummy = {
    cooldown:0,
    map:{
        8:room8,
        9:room9,
        6:room6,
        20:room20
    },
    move:jest.fn(),
    currentRoom:room8,
    pray:jest.fn(),
    getProof:jest.fn(),
    examine:jest.fn(),
    treasureRoom:70,
    setGPConnected:false,
    name:'AshenPheonix',
    strength:0,
    speed:0,
    gold:0,
    inventory:[],
    bodywear:'None',
    footwear:'None',
    status:[]
}

test('Movement API Renders without error',()=>{
    const tree = (
        <GlobalContext.Provider value={ctxDummy}>
            <Move/>
        </GlobalContext.Provider>
    )
})

test('ViewBoardAPI Renders without Error',()=>{
    const tree = (
        <GlobalContext.Provider value={ctxDummy}>
            <ViewBoard/>
        </GlobalContext.Provider>
    )
})

test('Map Renders without error',()=>{
    const tree = (
        <GlobalContext.Provider value={ctxDummy}>
            <Map/>
        </GlobalContext.Provider>
    )
})

test("Desc Box renders without Error",()=>{
    const tree = (
        <GlobalContext.Provider value={ctxDummy}>
            <DescBox/>
        </GlobalContext.Provider>
    )
})