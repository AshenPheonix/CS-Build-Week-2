import React,{useContext,useEffect,useState} from 'react'
import {MoveBoard,UpButton,DownButton,RightButton,LeftButton,MoveText} from '../styles/Move'
import {GlobalContext} from '../Context/provider'
import Gamepad from 'react-gamepad'


function MoveBar() {
    const [moveType,setMoveType]=useState('move')
    const {cooldown,map}=useContext(GlobalContext)

    const connect=index=>{
        console.log(`gamepad ${index} connnected`);
    }

    const disconnect=index=>{
        console.log(`gamepad ${index} disconnected`);
    }

    const directional=(direction)=>{
        console.log('directional ',direction);
    }


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
                        {cooldown}
                    </MoveText>
                </MoveBoard>
            </Gamepad>
    )
}

export default MoveBar
