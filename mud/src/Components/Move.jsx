import React,{useContext,useEffect,useState} from 'react'
import {MoveBoard,UpButton,DownButton,RightButton,LeftButton,MoveText} from '../styles/Move'
import {GlobalContext} from '../Context/provider'
import Gamepad from 'react-gamepad'


function MoveBar() {

    const   MOVE='MOVE',
            FLY="FLY",
            DASH="DASH",
            DIR_MAP={
                'up':'n',
                'right':'e',
                'down':'s',
                'left':'w'
            }

    const [moveType,setMoveType]=useState(MOVE)
    const [acceptable,setAcceptable]=useState(null)
    const [blink,setBlink]=useState(true)
    const {cooldown,map,move}=useContext(GlobalContext)

    const connect=index=>{
        console.log(`gamepad ${index} connnected`);
    }

    const disconnect=index=>{
        console.log(`gamepad ${index} disconnected`);
    }

    const accept=e=>{
        if(acceptable){
            acceptable(true)
            setAcceptable(null)
        }
    }

    const deny=e=>{
        if(acceptable){
            acceptable(false)
        }
    }

    const moveChange=e=>{
        if(moveType===MOVE){
            setMoveType(DASH)
        }else{
            setMoveType(MOVE)
        }
    }

    const directional=(direction)=>{
        if(cooldown<1 && !blink){
            // setBlink(true)
            move(DIR_MAP[direction])
        }
    }

    const openMenu=e=>{
        console.log(map)
    }

    useEffect(()=>{
        if (cooldown<1) {
            setBlink(false)
        }
    },[blink])

    return (
            <Gamepad
                onConnect={connect}
                onDisconnect={disconnect}
            
                onUp={()=>directional('up')}
                onDown={()=>directional('down')}
                onRight={()=>directional('right')}
                onLeft={()=>directional('left')}
            >
                <MoveBoard>
                    <UpButton onClick={()=>directional('up')}/>
                    <DownButton onClick={()=>directional('down')}/>
                    <RightButton onClick={()=>directional('right')}/>
                    <LeftButton onClick={()=>directional('left')}/>
                    <MoveText>
                        {cooldown>0 && cooldown}
                    </MoveText>
                </MoveBoard>
            </Gamepad>
    )
}

export default MoveBar
