import React,{useContext,useEffect,useState} from 'react'
import {MoveBoard,UpButton,DownButton,RightButton,LeftButton,MoveText,ShopButton,PrayButton} from '../styles/Move'
import {GlobalContext} from '../Context/provider'
import Gamepad from 'react-gamepad'
import ShopDialog from './Dialog'
import PickupDialog from './PickupDialog'
import WellDialog from './WellDialog'
import MineDialog from './MineDialog'

function MoveBar() {

    const   [openShop,setOpenShop]=useState(false),
            [openPickup,setOpenPickup]=useState(false),
            [openWell,setOpenWell]=useState(false),
            [openMine,setOpenMine]=useState(false)

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
    const {cooldown,map,move,currentRoom,pray,getProof,examine,treasureRoom,setGPConnected}=useContext(GlobalContext)
    const [clickable,setClickable]=useState(null)
    const [blank,setBlank]=useState(true)
    const [passthrough,setPassthrough]=useState(null)

    const connect=index=>{
        console.log(`gamepad ${index} connnected`);
        setGPConnected(true)
    }

    const disconnect=index=>{
        console.log(`gamepad ${index} disconnected`);
        setGPConnected(false)
    }

    const accept=e=>{
        // console.log('accept entered');
        if(acceptable!==null){
            acceptable(true)
        }else if(clickable!==null){
            // console.log('clicking ',clickable);
            setBlank(false)
            clickable(true)
        }
    }

    const deny=e=>{
        console.log('deny',acceptable);
        if(acceptable!=null){
            acceptable(false)
        }else if(clickable!=null){
            // console.log('looky here', clickable);
            setBlank(true)
            clickable(false)
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
        if(cooldown<1 && !blink && blank && openShop===false){
            setBlink(true)
            move(DIR_MAP[direction])
        }else if(!blank){
            passthrough(direction)
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
            // examine()
        }
    }

    const viewWaters=e=>{
        if (cooldown<1 && !blink) {
            // getProof()
            examine()
        }
    }

    useEffect(()=>{
        if (cooldown<1) {
            setBlink(false)
        }
    },[blink,cooldown])

    useEffect(()=>{
        switch (currentRoom.title) {
            case 'Shop':
                setClickable(()=>setOpenShop)
                break;
            case 'Wishing Well':
                setClickable(()=>setOpenWell)
                break;
            default:
                setClickable(null)
                break;
        }
        if(currentRoom.items && currentRoom.items.length>0){
            setClickable(()=>setOpenPickup)
        }if(currentRoom.id==treasureRoom){
            setClickable(()=>setOpenMine)
        }

    },[currentRoom,clickable])

    useEffect(()=>{
        if(passthrough===null){
            setBlank(true)
        }
    },[passthrough])

    return (
            <Gamepad
                onConnect={connect}
                onDisconnect={disconnect}
            
                onUp={()=>directional('up')}
                onDown={()=>directional('down')}
                onRight={()=>directional('right')}
                onLeft={()=>directional('left')}
                onA={accept}
                onB={deny}
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

                        accept={setAcceptable}
                        setPass={setPassthrough}
                    />
                    <PickupDialog
                        open={openPickup}
                        closer={setOpenPickup}

                        accept={setAcceptable}
                        setPass={setPassthrough}
                    />
                    <WellDialog
                        open={openWell}
                        closer={setOpenWell}

                        accept={setAcceptable}
                        setPass={setPassthrough}
                    />
                    <MineDialog
                        open={openMine}
                        closer={setOpenMine}

                        accept={setAcceptable}
                        setPass={setPassthrough}
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
                        <PrayButton onClick={viewWaters}>
                            View Waters
                        </PrayButton>
                    }
                    {
                        treasureRoom!==-1 && treasureRoom===currentRoom.id &&
                        <PrayButton onClick={wish}>
                            Mine
                        </PrayButton>
                    }
                    
                </MoveBoard>
            </Gamepad>
    )
}

export default MoveBar
