import React,{useContext,useState} from 'react'
import {DescBox,NameButton,Input} from '../styles/DescBox'
import {GlobalContext} from '../Context/provider'

function VisualAid() {
    const [name,setName]=useState('')

    const {currentRoom,pickup,changeName,gold} = useContext(GlobalContext)
    // console.log(currentRoom);

    const handleName=e=>{
        if(name.length>0){
            changeName(name)
            setName('')
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

        </DescBox>
    )
}

export default VisualAid
