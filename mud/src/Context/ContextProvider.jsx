import React,{useReducer,useState,useEffect} from 'react';
import {GlobalContext,defaultValues} from './provider'
import Room from '../objects/room'

const reducer = (state,action)=>{
    switch(action.type){
        case 'login':
            return {...state,connected:true}
            break;
        case 'init':
            return {...state,
                map:action.payload.map,
                ...action.payload.player
                }
            break;
        case 'map_update':
            return{...state,map:action.payload.map}
        default:
            console.log('not set up yet')
            return{...state}
            break;
    }
}

function GlobalProvider(props){
    const [state,dispatch]=useReducer(reducer,defaultValues)
    const [currentRoom,setcurrentRoom]=useState({id:-1,title:'nullroom',description:'null room',exits:{}})
    const [cooldown,setCooldown]=useState(0)

    const init=async ()=>{
        let payload = {}
        if(localStorage.getItem('player') && localStorage.getItem('map')){
            
            // for fixing screwups while dev
            let data = await state.Connection.init()
            let newRoom=new Room(
                data.room_id,
                data.title,
                data.description,
                data.exits,
                data.coordinates
            )
            localStorage.setItem('currentRoom',JSON.stringify(newRoom))

            payload = {
                map:JSON.parse(localStorage.getItem('map')),
                player:JSON.parse(localStorage.getItem('player'))
            }
            
            let temp = payload.map
            temp = Object.entries(temp)
            let actualMap={}
            temp.forEach(e => {
                const roomData=e[1]
                actualMap[e[0]] = new Room(roomData.id,roomData.title,roomData.description,Object.keys(roomData.exits),roomData.coords)
                Object.entries(roomData.exits).forEach(element => {
                    if(element[1]!="?"){
                        actualMap[e[0]].knowExit(element[0],element[1])
                    }
                });
            });
            payload.map=actualMap
            setcurrentRoom(actualMap[JSON.parse(localStorage.getItem('currentRoom')).id])
            
        }else{
            let data = await state.Connection.init()
            console.log('loading from init')
            payload = {
                map:{
                    [data.room_id]:
                        new Room(
                            data.room_id,
                            data.title,
                            data.description,
                            data.exits,
                            data.coordinates
                        )
                },
                player:{
                    name:'unnamed',
                    cooldown:0,
                    strength:0,
                    speed:0,
                    gold:0,
                    items:[],
                    bodywear:'None',
                    footwear:'None',
                    status:[],
                }
            }
            setcurrentRoom(payload.map[data.room_id])
        }
        console.log(payload)
        dispatch({
            type:'init',
            payload
        })
    }
    
    const login=async ()=>{
        let data = await state.Connection.login((process.env.REACT_APP_API_TOKEN))
        dispatch({
            type:'login'
        })
    }

    const move=async direction=>{
        const room = currentRoom
        const reversi={
            'n':'s',
            's':'n',
            'e':'w',
            'w':'e'
        }
        if(direction in room.exits && room.exits[direction]==='?'){
            let data = await state.Connection.explore(direction)
            if(data.room_id){
                let newRoom=new Room(
                    data.room_id,
                    data.title,
                    data.description,
                    data.exits,
                    data.coordinates
                ),
                newMap={...state.map}
                newMap[data.room_id]=newRoom

                newRoom.knowExit(reversi[direction],room.id)
                room.knowExit(direction,newRoom.id)

                localStorage.setItem('map',JSON.stringify(newMap))
                localStorage.setItem('currentRoom',JSON.stringify(newRoom))
                setcurrentRoom(newRoom)

                dispatch({
                    type:'map_update',
                    payload:{map:newMap}
                })
                setCooldown(data.cooldown)
                
            }
        }else if(direction in room.exits){
            // console.log(state.map);
            let data = await state.Connection.walk(direction,room.exits[direction])
            console.log(state.map[data.room_id]);
            if(data.room_id){
                setcurrentRoom(state.map[data.room_id])
                setCooldown(data.cooldown)
            }
        }
    }

    const killCooldown=e=>{
        if(cooldown>0){
            setCooldown(cooldown-.5)
        }
    }

    useEffect(()=>{
        if(cooldown>0){
            setTimeout(killCooldown,500)
        }
    },[cooldown])

    return (
        <GlobalContext.Provider
            value={{
                ...state,
                cooldown,
                dispatch,
                init,
                login,
                move,
                currentRoom
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider