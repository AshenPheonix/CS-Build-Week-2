import React,{useContext,useEffect,useState} from 'react'
import {MoveBoard,UpButton,DownButton,RightButton,LeftButton,MoveText,ShopButton,PrayButton} from '../styles/Move'
import {GlobalContext} from '../Context/provider'
import Gamepad from 'react-gamepad'
import ShopDialog from './Dialog'


function MoveBar() {

    const [openShop,setOpenShop]=useState(false)

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
    const {cooldown,map,move,currentRoom,pray,getProof}=useContext(GlobalContext)

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

    const prayButton=e=>{
        if(cooldown<1 && !blink){
            pray()
        }
    }

    const wish=e=>{
        if (cooldown<1 && !blink) {
            getProof()
        }
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
                    <ShopDialog
                        open={openShop}
                        closer={setOpenShop}
                    />
                    {
                        currentRoom.title=="Shop" && 
                        <ShopButton onClick={()=>setOpenShop(true)}>Open Shop</ShopButton>
                    }
                    {
                        currentRoom.description.includes('shrine') &&
                        <PrayButton onClick={prayButton}>
                            Pray At this Shrine
                        </PrayButton>
                    }
                    {
                        currentRoom.title==='Wishing Well' &&
                        <PrayButton onClick={wish}>
                            Make Wish
                        </PrayButton>
                    }
                </MoveBoard>
            </Gamepad>
    )
}

export default MoveBar
