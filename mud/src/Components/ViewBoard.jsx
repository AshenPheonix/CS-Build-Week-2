import React,{useContext,useState} from 'react'
import {GlobalContext} from '../Context/provider'
import {CharSheet,StatBlock,BodySlot,FootSlot,Backpack} from '../styles/ViewBoard'
function ViewChar() {
    const {name,strength,speed,status,bodywear,footwear,gold,items}=useContext(GlobalContext)

    return (
        <CharSheet>
            <StatBlock>
                <li>Name: {name}</li>
                <li>Strength: {strength}</li>
                <li>Speed: {speed}</li>
                <li>Current Gold: {gold}</li>                
                <li>Statuses: 
                    <ul>
                        {status.length>0?status.map(stat=><li>{stat}</li>):<li>None</li>}
                    </ul>
                </li>
            </StatBlock>
            <BodySlot>
                {bodywear==='None'?'Shirt':bodywear}
            </BodySlot>
            <FootSlot>
                {footwear==='None'?'Boots':footwear}
            </FootSlot>
            <Backpack>
                Backpack
                {items.length===0?
                    <li>Empty</li>:
                    items.map(item=><li>{item}</li>)
                }
            </Backpack>
        </CharSheet>
    )
}

export default ViewChar
