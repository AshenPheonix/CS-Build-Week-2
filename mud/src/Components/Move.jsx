import React,{useContext} from 'react'
import {MoveBoard,UpButton,DownButton,RightButton,LeftButton,MoveText} from '../styles/Move'
import {GlobalContext} from '../Context/provider'


function MoveBar() {

    const {cooldown} = useContext(GlobalContext)
    console.log('here')
    return (
        <MoveBoard>
            <UpButton/>
            <DownButton/>
            <RightButton/>
            <LeftButton/>
            <MoveText>
                {cooldown}
            </MoveText>
        </MoveBoard>
    )
}

export default MoveBar
