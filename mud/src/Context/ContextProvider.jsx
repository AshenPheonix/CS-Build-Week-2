import React,{useReducer,useState} from 'react';
import {GlobalContext,defaultValues} from './provider'
import Room from '../objects/room'

const reducer = (state,action)=>{
    switch(action.type){
        case 'login':
            return {...state,connected:true}
            break;
        case 'init':
            return {...state,map:action.payload}
            break;
        default:
            console.log('not set up yet')
            return{...state}
            break;
    }
}

function GlobalProvider(props){
    const [state,dispatch]=useReducer(reducer,defaultValues)

    const init=async ()=>{
        let data = await state.Connection.init()
        let payload = []
        if(!localStorage.getItem('map'))
            payload = [new Room(
                data.room_id,
                data.title,
                data.description,
                data.exits)]
        else
            payload = JSON.parse(localStorage.getItem('map'))
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

    return (
        <GlobalContext.Provider
            value={{
                ...state,
                dispatch,
                init,
                login
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider