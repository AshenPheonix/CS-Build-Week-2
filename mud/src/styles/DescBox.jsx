import styled from 'styled-components';
import * as v from './global'

export const DescBox=styled.section`
    margin:0;
    width:100%;
    height:25vh;
    ${v.ColorStack}
    position:relative;
    top:0;
    left:0;
    p{
        padding-left:1rem;
    }
`

export const Input=styled.input`
    margin:0 1rem;
    border:${v.NeonGreen};
    background-color:black;
    ${v.DefaultColor}
`

export const NameButton=styled.button`
    height:1.5rem;
    background:black;
    color:#00a45b;
    border: groove 2px #00a45b;
`