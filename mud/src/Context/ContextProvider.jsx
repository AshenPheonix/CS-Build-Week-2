import React,{useReducer,useState} from 'react';
import {GlobalContext,defaultValues} from './provider'

const reducer = async (state,action)=>{
    switch(action.type){
        case 'login':
            state.Connection.login((process.env.REACT_APP_API_TOKEN))
            return {...state}
        case 'init':
            await state.Connection.init()
            return {...state}
        default:
            console.log('not set up yet')
            return{...state}
    }
}

function GlobalProvider(props){
    const [state,dispatch]=useReducer(reducer,defaultValues)

    const init=()=>{
        dispatch({
            type:'init'
        })
    }

    return (
        <GlobalContext.Provider
        value={{

        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider