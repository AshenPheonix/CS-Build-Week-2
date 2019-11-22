import React,{useContext,useEffect,useState} from 'react'
import {GlobalContext} from '../Context/provider'
import {WellModal,WellModalBody} from '../styles/WellDialog'
import CPU from '../helpers/cpu'

function WellDialog({accept, closer, open, setPass}) {

    const {cooldown,treasureRoom,examine,setTreasureRoom}=useContext(GlobalContext)
    const   [dialog,setDialog]=useState(`Your current Treasure Room is ${treasureRoom===-1?'Not Found':treasureRoom}`)

    const revert=e=>{
        setDialog("Generate New Treasure Room?")
    }



    const killer=async e=>{
        if(!e){
            closer(false)
        }else{
            const ls8 = new CPU();
            let data = await examine()
            console.log(data);
            ls8.load(data)
            ls8.run()
            let room = ls8.output.match(/\d/g).join('')
            room=Number(room)
            setTreasureRoom(room)
        }
    }

    useEffect(()=>{
        if(open){
            accept(()=>killer)
            setDialog(`Your current Treasure Room is ${treasureRoom===-1?'Not Found':treasureRoom}`)
        }else if(accept!==null){
            accept(null)
        }
    },[open,cooldown,treasureRoom])

    const ctrl=e=>{
        //empty
    }

    useEffect(()=>{
        if(open)
            setPass(ctrl)
        else
            setPass(null)
    },[open])

    return (
        <WellModal className={open?'open':''}>
            <WellModalBody>
                <p>{dialog}</p>
                <section>Would you like to check the Water Again?</section>
            </WellModalBody>
        </WellModal>
    )
}

export default WellDialog
