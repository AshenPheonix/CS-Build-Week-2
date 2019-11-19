import styled from 'styled-components';
import Left from '../images/Left.png'
import Up from '../images/Up.png'
import Right from '../images/Right.png'
import Down from '../images/Down.png'

export const MoveBoard = styled.section`
    position:relative;
    background-color:black;
    width:500px;
    height:25vh;
`

const MoveButton=styled.button`
    position:absolute;
    border:none;
    padding:none;
    margin:none;
    background-color:black;
`
const UDButton=styled(MoveButton)`
    width:64px;
    height:50px;
`

const LRButton=styled(MoveButton)`
    width:50px;
    height:64px;
`

export const UpButton=styled(UDButton)`
    background-image:url(${Up});
    right:42%;
    top:5%;
`
export const DownButton=styled(UDButton)`
    background-image:url(${Down});
    right:42%;
    bottom:5%;
`
export const LeftButton=styled(LRButton)`
    background-image:url(${Left});
    left:5%;
    top:40%;
`
export const RightButton=styled(LRButton)`
    background-image:url(${Right});
    right:5%;
    top:40%;
`

export const MoveText=styled.p`
    position: absolute;
    color:#00ff8e;
    left:51%;
    top:43%
`