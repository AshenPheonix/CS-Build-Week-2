import styled from 'styled-components'
export const DefaultColor='color:#00ff8e;'
export const ColorStack="color:#00ff8e;\nbackground-color:black;"
export const NeonGreen="#00ffe8e"

export const DefaultButton=styled.button`
    height:1.5rem;
    background:black;
    color:#00a45b;
    border: groove 2px #00a45b;
`

export const GenModal=styled.section`
width:100vw;
height:100vh;
position:fixed;
top:0;
left:0;
color:white;
background-color:rgba(2,48,27,.5);
display:none;
&.open{
    display:block;
}
`

export const DefaultSelectedButton=styled(DefaultButton)`
    &.selected{
        border-color:darkcyan;
        color:darkcyan;
    }
    margin:1.5rem;
`

export const ShopButton=styled.button`
    position:absolute;
    top:20px;
    right:20px;
    height:1.5rem;
    background:black;
    color:#00a45b;
    border: groove 2px #00a45b;
`

export const GenCloseButton=styled.button`
    position:absolute;
    top:20px;
    right:20px;
    height:1.5rem;
    background:black;
    color:#00a45b;
    border: groove 2px #00a45b;
`


export const DefaultModalBody=styled.section`
    position:absolute;
    width:50vw;
    height:50vh;
    border:ridge 15px #52ffb1;
    border-radius:25px;
    left:25%;
    top:25%;
    opacity:1;
    background-color:#00240f;
    box-shadow:10px 10px 10px #00ff8e, -10px -10px 10px #00ff8e
    p{
        position:absolute;
        left:10rem;
        top:25%
    }
    section{
        position:absolute;
        left:8rem;
        top:40%;
        display:flex;
        flex-wrap:wrap;
        
        width:75%;
        overflow-y:auto;
    }
`