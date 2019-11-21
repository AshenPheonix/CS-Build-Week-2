import React,{useReducer,useState,useEffect} from 'react';
import {GlobalContext,defaultValues} from './provider'
import Room from '../objects/room'
const   SHOP_CACHE_ADD='SHOP_CACHE_ADD',
        SHOP_CACHE_RESET='SHOP_CACHE_RESET',
        SHOP_CACHE_SET='SHOP_CACHE_SET'

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
            localStorage.setItem('map',JSON.stringify(action.payload.map))
            return{...state,map:action.payload.map}
        case 'add_item':
            let newState={...state,inventory:[...state.inventory,action.payload]},
                {name,strength,speed,gold,inventory,bodywear,footwear}=newState
            localStorage.setItem('player',JSON.stringify({
                name,strength,speed,gold,inventory,bodywear,footwear
            }))
            return{...state,inventory:[...state.inventory,action.payload]}
        case 'room_update':
            state.map[action.payload.id]=state.map[action.payload.room]
            localStorage.setItem('map',JSON.stringify(state.map))
            return{...state}
        case 'update_player':
            let TempState={...state,[action.payload.what]:action.payload.change}
            localStorage.setItem('player',JSON.stringify({
                name:TempState.name,
                strength:TempState.strength,
                speed:TempState.speed,
                gold:TempState.gold,
                inventory:TempState.inventory,
                bodywear:TempState.bodywear,
                footwear:TempState.footwear
            }))
            return TempState
        case 'reset_player':
                let newStatus={...state,...action.payload}
                localStorage.setItem('player',JSON.stringify({
                    name:newStatus.name,
                    strength:newStatus.strength,
                    speed:newStatus.speed,
                    gold:newStatus.gold,
                    inventory:newStatus.inventory,
                    bodywear:newStatus.bodywear,
                    footwear:newStatus.footwear
                }))
            return newStatus
        case 'remove_item':
            let items = state.inventory.map(i=>i).filter(i=>i!==action.payload)
            localStorage.setItem('player',JSON.stringify({
                name:state.name,
                strength:state.strength,
                speed:state.speed,
                gold:state.gold,
                inventory:items,
                bodywear:state.bodywear,
                footwear:state.footwear
            }))
            return{...state,inventory:items}
        case SHOP_CACHE_ADD:
            console.log(`adding ${action.payload.id} with ${action.payload.message}`);
            return {...state,shopCache:{...state.shopCache,[action.payload.id]:action.payload.message}}
        case SHOP_CACHE_SET:
            return{...state,shopCache:{...action.payload}}
        case SHOP_CACHE_RESET:
            return{...state,shopCache:{}}
        default:
            console.log('not set up yet')
            return{...state}
            break;
    }
}

function GlobalProvider(props){
    const   [state,dispatch]=useReducer(reducer,defaultValues)
    const   [currentRoom,setcurrentRoom]=useState({id:-1,title:'nullroom',description:'null room',exits:{}})
    const   [cooldown,setCooldown]=useState(0)
    const   [treasureRoom,setTreasureRoom]=useState(-1)
    const   [GPConnected,setGPConnected]=useState(false)

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
            // let tempPlayer = await state.Connection.resetUser()
            payload = {
                map:JSON.parse(localStorage.getItem('map')),
                // player:tempPlayer
                player:JSON.parse(localStorage.getItem('player'))
            }
            let temp = payload.map
            temp = Object.entries(temp)

            if(localStorage.getItem('treasure')){
                setTreasureRoom(Number(localStorage.getItem('treasure')))
                console.log('triggering initial loadout, ',localStorage.getItem('treasure'));
            }else{
                console.log(`missing ${localStorage.getItem("treasure")}`);
            }

            if(localStorage.getItem('shop_cache')!==undefined){
                try{
                    dispatch({
                        type:SHOP_CACHE_SET,
                        payload:JSON.parse(localStorage.getItem('shop_cache'))
                    })
                }catch(err){
                    console.error('errored loading');
                    console.error(err);
                    console.log(localStorage.getItem("shop_cache"));
                    dispatch({
                        type:SHOP_CACHE_SET,
                        payload:{}
                    })
                }
            }

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

            if(actualMap[data.room_id]===undefined){
                actualMap[newRoom.id]=newRoom
            }

            // console.log(actualMap);
            // console.log(actualMap[data.room_id]);
            // setcurrentRoom(actualMap[data.room_id])
            setcurrentRoom(actualMap[JSON.parse(localStorage.getItem('currentRoom')).id])
            
        }else{
            let data = await state.Connection.init()
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
                    inventory:[],
                    bodywear:'None',
                    footwear:'None',
                    status:[],
                }
            }
            setcurrentRoom(payload.map[data.room_id])
        }
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
            if(data.room_id && !state.map[data.room_id]){
                let newRoom=new Room(
                    data.room_id,
                    data.title,
                    data.description,
                    data.exits,
                    data.coordinates,
                    data.inventory||[]
                ),
                newMap={...state.map}
                newMap[data.room_id]=newRoom
                
                newRoom.knowExit(reversi[direction],room.id)
                room.knowExit(direction,newRoom.id)
                newRoom.addItem(data.items)
                localStorage.setItem('currentRoom',JSON.stringify())
                setcurrentRoom(newRoom)
                dispatch({
                    type:'map_update',
                    payload:{map:newMap}
                })
                setCooldown(data.cooldown)
                // console.log(data);
            }else if(data.room_id){
                let newMap={...state.map}
                newMap[data.room_id].knowExit(reversi[direction],room.id)
                room.knowExit(direction,data.room_id)
                newMap[room.id]=room
                setCooldown(data.cooldown)
                // console.log(`setting room to ${data.room_id}`,newMap[data.room_id]);
                setcurrentRoom(newMap[data.room_id])
                // console.log(data);
                newMap[data.room_id].addItem(data.items)
                dispatch({
                    type:'map_update',
                    payload:{map:newMap}
                })
            }
        }else if(direction in room.exits){
            let data = await state.Connection.walk(direction,room.exits[direction])
            if(data.room_id!=undefined){
                let newRoom = state.map[data.room_id]
                let newMap={...state.map}
                if (newRoom.exits[reversi[direction]]!==room.id) {
                    newRoom.knowExit(reversi[direction],room.id)
                    newMap[newRoom.id]=newRoom
                }else if(room.exits[direction]!=newRoom.id){
                    room.knowExit(direction,newRoom.id)
                    newMap[newRoom.id]=newRoom
                    
                }

                state.map[data.room_id].addItem(data.items)
                setcurrentRoom(state.map[data.room_id])
                setCooldown(data.cooldown)
                dispatch({
                    type:'map_update',
                    payload:{map:newMap}
                })
                // console.log(data);
            }
        }
    }

    const killCooldown=e=>{
        if(cooldown>0){
            setCooldown(cooldown-.5)
        }
    }

    const pickup=async e=>{
        if(cooldown===0){
            let data =await  state.Connection.pickup(e)
            setCooldown(data.cooldown)
            dispatch({
                type:'add_item',
                payload:e
            })
            setTimeout(resetUser, data.cooldown*1000);
        }
    }

    const resetUser=async e=>{
        let data = await state.Connection.resetUser()
        console.log(data);
        setCooldown(data.cooldown)
        dispatch({
            type:'reset_player',
            payload:data
        })
    }

    const saleQuestion=async e=>{
        try {
            if(state.shopCache[e]){
                
                return [state.shopCache[e]]
            }
            console.log(state.shopCache);
            let data = await state.Connection.sellQuestion(e)
            let ret = data.messages
            dispatch({type:SHOP_CACHE_ADD,payload:{id:e,message:ret[0]}})
            setCooldown(data.cooldown)
            return ret
        } catch (error) {
            console.error(error);
            return {fail:'error occured'}
        }
    }

    const doSell=async e=>{
        try {
            let data = await state.Connection.sellConfirm(e)
            let ret = data
            setCooldown(data.cooldown)
            setTimeout(resetUser,data.cooldown*1000)
        } catch (error) {
            console.log({...error});
        }
    }

    const dash=async (dir,dest)=>{
        try {
            let path = [currentRoom.id],
                curRoom=currentRoom
            while(path[path.length-1]!=dest){
                if(curRoom.id===dest){
                    path.push(curRoom.id)
                }else if(curRoom.exits[dir]===undefined || curRoom.exits[dir]==='?'){
                    return {err:'Path Not Found'}
                }else{
                    path.push(curRoom.id)
                    curRoom=state.map[curRoom.exits[dir]]
                }
            }
            let data = await state.Connection.dash()
        } catch (err) {
            
        }
    }

    const changeName=async name=>{
        try {
            let data = await state.Connection.changeName(name)
            setCooldown(data.cooldown)
            setTimeout(resetUser,data.cooldown*1000)
        } catch (err) {
            console.error(...err);
        }
    }

    useEffect(()=>{
        if(cooldown>0){
            setTimeout(killCooldown,500)
        }
    },[cooldown])

    const pray=async e=>{
        try {
            console.log('praying');
            let data = await state.Connection.pray()
            setCooldown(data.cooldown)
            setTimeout(resetUser,data.cooldown*1000)
            console.log(data);
        } catch (err) {
            
        }
    }

    const getProof=async e=>{
        // setCooldown(100000)
        try {
            let data = await state.Connection.getProof()
            const diff = data.difficulty,
                 last = data.proof
            console.log('recieved', data);
            console.log('mining ', diff);
            
            data = await state.Connection.getKey(last,diff)
            console.log(data.key);
            data = await state.Connection.mine(data.key)
            setCooldown(data.cooldown)
            console.log(data);
            setTreasureRoom(-1)
        } catch (err) {
            console.error({...err});
        }
    }

    const fetchProof=async e=>{
        try{
            let data = await state.Connection.getProof()
            
            const  diff=data.difficulty,
                    last=data.proof
            return {diff,last}
        }catch(err){
            console.error(`Errored fetch proof`,{...err});
        }
    }

    const sendMine=async e=>{
        try {
            let data = await state.Connection.mine(e)
            return data
        } catch (err) {
            console.error(`error sending mine`,{...err});
        }
    }

    const examine=async e=>{
        try {
            let data = await state.Connection.examine()
            console.log(data);
            let temp=data.description.match(/\d{8}/g)
            // console.log(temp);
            temp=temp.map(i=>parseInt(i,2))
            // temp = String.fromCharCode(...temp)
            localStorage.setItem('treasure',JSON.stringify(Array.from(data.description)))
            return temp
        } catch (err) {
            console.error({...err});
        }
    }

    useEffect(()=>{
        if(treasureRoom!=-1)
            localStorage.setItem('treasure',treasureRoom)
    },[treasureRoom])

    useEffect(()=>{
        if(state.shopCache!==undefined){
            localStorage.setItem('shop_cache',JSON.stringify(state.shopCache))
        }
    },[state.shopCache])

    return (
        <GlobalContext.Provider
            value={{
                ...state,
                cooldown,
                dispatch,
                init,
                login,
                move,
                currentRoom,
                pickup,
                resetUser,
                saleQuestion,
                doSell,
                changeName,
                pray,
                getProof,
                examine,
                treasureRoom,
                setTreasureRoom,
                GPConnected,
                setGPConnected,
                fetchProof,
                sendMine
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider