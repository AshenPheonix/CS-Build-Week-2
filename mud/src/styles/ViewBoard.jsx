import styled from 'styled-components';
import body from '../images/body.png'
import * as v from './global'

export const CharSheet = styled.section`
    position:relative;
    background-image:url(${body});
    background-position:center;
    background-repeat:no-repeat;
    background-color:black;
    width:500px;
    height:75vh;
    color:#00ff8e;
    margin:0;
`

export const StatBlock=styled.ul`
    padding:.5rem;
    list-style-type:none;
    margin-left:1.5rem;
    margin-top:0;
    li ul{
        list-style-type:none;
        font-size:.8em;
    }
`
const Slots=styled.section`
    position:absolute;
`

export const BodySlot=styled(Slots)`
    left:45%;
    top:40%;
`

export const FootSlot=styled(Slots)`
    left:45%;
    top:80%;
`
export const Backpack=styled(StatBlock)`
    position:absolute;
    bottom:8%;
`

export const BPButton=styled(v.DefaultButton)`
    
`