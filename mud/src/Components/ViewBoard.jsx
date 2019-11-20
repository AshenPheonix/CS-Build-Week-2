import React,{useContext,useState} from 'react'
import {GlobalContext} from '../Context/provider'
import {CharSheet,StatBlock,BodySlot,FootSlot,Backpack,BPButton} from '../styles/ViewBoard'
function ViewChar() {
    const {name,strength,speed,status,bodywear,footwear,gold,inventory,resetUser,currentRoom}=useContext(GlobalContext)

    return (
        <CharSheet>
            <BPButton onClick={resetUser}>Reset Player</BPButton>
            <StatBlock>
                <li>Name: {name}</li>
                <li>Strength: {strength}</li>
                <li>Speed: {speed}</li>
                <li>Current Gold: {gold}</li>                
                <li>Statuses: 
                    <ul>
                        {status.length>0?status.map((stat,index)=><li key={index}>{stat}</li>):<li>None</li>}
                    </ul>
                </li>
            </StatBlock>
            <BodySlot>
                {bodywear==='None' || bodywear===null?'Shirt':bodywear}
            </BodySlot>
            <FootSlot>
                {footwear==='None' || footwear===null?'Boots':footwear}
            </FootSlot>
            <Backpack>
                Backpack
                {inventory.length===0?
                    <li>Empty</li>:
                    inventory.map(item=><li>{item}</li>)
                }
            </Backpack>
        </CharSheet>
    )
}

export default ViewChar
