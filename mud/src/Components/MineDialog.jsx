import React,{useState,useContext,useReducer,useEffect} from 'react'
import {MineButton,MineClose,MineModal,MineModalBody} from '../styles/MineDialog'
import {GlobalContext} from '../Context/provider'
import sha256 from 'sha256'
const   INC='INCREMENT',
        RESET='RESET'

function MineDialog({accept,setPass,open,closer}) {

    const reducer= (state, action) => {
        switch (action.type) {
            case INC:
                return{...state,attempt:state.attempt+1}
            case RESET:
                return{...state,attempt:0}            
            default:
                return state
        }
    }

    const [{attempt},dispatch]=useReducer(reducer,{attempt:0})

    const   [dialog,setDialog]=useState('X marks the Spot!'),
            [mining,setMining]=useState(false),
            {fetchProof,sendMine}=useContext(GlobalContext)


    //directional pad lockout and reset
    const ctrl=e=>{
        //empty
    }
    useEffect(()=>{
        if(open)
            setPass(ctrl)
        else
            setPass(null)
    },[open])

    useEffect(()=>{
        if(open){
            accept(()=>mineWork)
        }else{
            accept(null)
        }
    },[open,attempt])

    const mineWork=e=>{
        if(mining){
            return
        }else if(!e){
            closer(false)
        }else{
            dispatch({type:RESET})
            setDialog(`Mining, please hold ${attempt}`)
            setMining(true)
            mine()
        }
    }

    const mine=async e=>{
        console.log('attempting');
        let {diff,last} = await fetchProof()
        console.log('fetch done');
        let success=false
        let int = 0
        while(!success){
            const   key=sha256(`${last}${int}`),
                    req='^'+('0'.repeat(diff)),
                    regex=new RegExp(req)
            // console.log(key);
            // console.log(attempt);
            if(regex.test(key)){
                success=true;
            }else{
                dispatch({type:INC})
                int++
                setDialog(`Mining, please hold ${int} BLAHAHHHAHAHAH`)
            }
            if(int>100000){
                success=true
            }
        }
        console.log('Done!');
        setMining(false)
        // let data = await sendMine(attempt)
        // console.log(data);
    }
    
    useEffect(()=>{
        if(attempt!=0 && mining){
            setDialog(`Mining, please hold ${attempt}`)
        }
    },[attempt,mining])

    return (
        <MineModal className={open?'open':''}>
            <MineModalBody>
                <MineClose onClick={()=>closer(false)}>X</MineClose>
                <p>{dialog}</p>
            </MineModalBody>
        </MineModal>
    )
}

export default MineDialog
