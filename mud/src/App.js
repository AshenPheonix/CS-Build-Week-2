import React,{useContext,useEffect} from 'react';
import {GlobalContext} from './Context/provider'
import Game from './Components/Game';
import './global.css'

function App() {
    const {dispatch,init,login,Connection,map,...player} = useContext(GlobalContext)
    useEffect(()=>{
        if (!player.connected) {
            login()
        }else{
            init()
        }
    }
    ,[player.connected])

    

    return (
        <Game/>
    );
}

export default App;
