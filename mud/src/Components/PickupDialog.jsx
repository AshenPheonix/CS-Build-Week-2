import React,{useState,useContext,useEffect,useReducer} from 'react'
import {GlobalContext} from '../Context/provider'
import {PickupModal, CloseButton, PickupModalBody,ItemButton} from '../styles/PickupDialog'
const   INC='INCREMENT',
        DEC='DECREMENT',
        RESET='RESET',
        REMOVE='REMOVE_ITEM',
        SET='SET_ITEMS'

function PickupDialog({open,accept,closer,setPass}) {

    const reducer=(state,action)=>{
        switch (action.type) {
            case INC:
                if(state.selection+action.payload<state.items.length)
                    return{...state,selection:state.selection+action.payload}
                else
                    return{...state}
                break;
            case DEC:
                if(state.selection-action.payload>=0)
                    return{...state,selection:state.selection-action.payload}
                else
                    return {...state}
            case RESET:
                return{...state,selection:0}
            case REMOVE:
                return{...state,items:state.items.filter((i,index)=>index!==action.payload)}
            case SET:
                return{...state,items:action.payload}
            default:
                return {...state}
                break;
        }
    }

    const   {cooldown,currentRoom,pickup} = useContext(GlobalContext)
    const   [dialog,setDialog] = useState("What do you want to pick up"),
            [questioning,setQuestioning]=useState(-1)

    const [state,dispatch]=useReducer(reducer,{selection:0,items:[]})
        const {items,selection}=state
    const revert=e=>{
        setDialog('What do you want to pick up?')
        dispatch({RESET})
        setQuestioning(-1)
    }

    const ctrl=dir=>{
        switch (dir) {
            case 'up':
                // console.log('up ',state.selection);
                dispatch({type:DEC,payload:5})
                break;
            case 'down':
                // console.log('down ',state.selection);
                dispatch({type:INC,payload:5})
                break;
            case 'left':
                // console.log('left ',state.selection);
                dispatch({type:DEC,payload:1})
                break;
            case 'right':
                // console.log('right ',state.selection);
                dispatch({type:INC,payload:1})
                break;
            default:
                break;
        }
    }

    const grabTreasure=e=>{
        console.log('grab treasure clicked');
        console.log(`Questioning == ${questioning}`);
        if(!e && questioning===-1)
            closer(false)
        else if(!e){
            revert()
        }else if(cooldown>0 || items.length===0){
            console.log(`CD: ${cooldown}, items: ${items}`);
            return
        }else if(questioning===-1){
            setQuestioning(selection)
            setDialog(`Do you want to pickup the ${items[selection]}`)
        }else{
            pickup(items[selection])
            setDialog(`You have taken the ${items[selection]}`)
            dispatch({
                type:REMOVE,
                payload:selection
            })
            revert()
        }
    }

    useEffect(()=>{
        if(open){
            accept(()=>grabTreasure)
        }else if(accept!==null){
            accept(null)
        }
    },[open,selection,questioning,cooldown,dialog,items])

    useEffect(()=>{
        if(open){
            setPass(()=>ctrl)
            dispatch({type:SET,payload:currentRoom.items})
        }else{
            setPass(null)
            dispatch({type:RESET})
        }
    },[open,currentRoom])

    return (
        <PickupModal className={open?'open':''}>
            <PickupModalBody>
                <CloseButton onClick={()=>closer(false)}>X</CloseButton>
                {items.length>0 && questioning===-1 &&
                    <>
                        <p>{dialog}</p>
                        <section>
                            {
                                items.length>0 && items.map((item,index)=>{
                                    let classes='none'

                                    if(index===selection)
                                        classes='selected'
                                    return <ItemButton className={classes}>{item}</ItemButton>
                                })
                            }
                        </section>
                    
                    </>
                }{questioning>-1&&
                    <p>{dialog}</p>
                }
                {
                    items.length===0 &&
                    <p>No Items Remain Here</p>
                }
            </PickupModalBody>
        </PickupModal>
    )
}

export default PickupDialog
