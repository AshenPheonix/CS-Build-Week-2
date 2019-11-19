import React from 'react'
import ViewBoard from './ViewBoard'
import {GameBoard} from '../styles/Game'
import MoveBoard from './Move'

function Game() {
    return (
        <GameBoard>
            {/* Left Board */}
            <section>

            </section>
            {/* Right Board */}
            <ViewBoard/>
            <MoveBoard/>
        </GameBoard>
    )
}

export default Game

