import React from 'react'
import ViewBoard from './ViewBoard'
import {GameBoard,ColumnA} from '../styles/Game'
import MoveBoard from './Move'
import DescBox from './DescBox'
import MapBox from './Map'

function Game() {
    return (
        <GameBoard>
            {/* Left Board */}
            <ColumnA>
                <MapBox/>
                <DescBox/>
            </ColumnA>
            {/* Right Board */}
            <section>
                <ViewBoard/>
                <MoveBoard/>
            </section>
        </GameBoard>
    )
}

export default Game

