import React from 'react'
import ViewBoard from './ViewBoard'
import {GameBoard} from '../styles/Game'
import MoveBoard from './Move'
import DescBox from './DescBox'

function Game() {
    return (
        <GameBoard>
            {/* Left Board */}
            <section>
                <DescBox/>
            </section>
            {/* Right Board */}
            <section>
                <ViewBoard/>
                <MoveBoard/>
            </section>
        </GameBoard>
    )
}

export default Game

