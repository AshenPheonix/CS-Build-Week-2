import React,{useContext,useState} from 'react'
import {DescBox,NameButton,Input} from '../styles/DescBox'
import {GlobalContext} from '../Context/provider'

function VisualAid() {
    const [name,setName]=useState('')
    const [room,setRoom]=useState(-1)

    const {currentRoom,pickup,changeName,gold,setTreasureRoom} = useContext(GlobalContext)
    // console.log(currentRoom);

    const handleName=e=>{
        if(name.length>0){
            changeName(name)
            setName('')
        }
    }

    const handleRoom=e=>{
        if(room>-1){
            setTreasureRoom(room)
        }
    }

    return (
        <DescBox>
            <ul>
                <li>Room Id: {currentRoom.id}</li>
                <li>Room Title: {currentRoom.title}</li>
                <li>Room Description: {currentRoom.description}</li>
                <li>Exits
                    <ul>
                        {Object.entries(currentRoom.exits).map(item=><li>{item[0]}: {item[1]}</li>)}
                    </ul>
                </li>
            </ul>
            {currentRoom.items && currentRoom.items.length>0 && 
                <p>
                    Items:
                    {
                        currentRoom.items.map(item=>(
                            <button onClick={()=>pickup(item)}>{item}</button>
                        ))
                    }
                </p>
            }
            {
                currentRoom.title==="Pirate Ry's" && gold>1000 &&
                <>
                    <Input type="text" value={name} onChange={e=>setName(e.target.value)}/>
                    <NameButton onClick={handleName}>Change Name</NameButton>
                </>
            }
            {currentRoom.title==="Wishing Well"&&
                <>
                    <Input type="number" value={room} onChange={e=>setRoom(e.target.value)}/>
                    <NameButton onClick={handleRoom}>Set Treasure Room</NameButton>
                </>
            }

        </DescBox>
    )
}

export default VisualAid
