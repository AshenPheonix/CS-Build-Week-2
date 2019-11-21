import React,{useContext,useState,useEffect,useReducer} from 'react'
import {ShopDialog,ShopItem,ShopButton,ShopFront} from '../styles/SaleDialog'
import {GlobalContext} from '../Context/provider'
const   INC='INCREMENT',
        DEC='DECREMENT',
        RESET='RESET'

        
function SaleDialog({accept,open,closer,setPass}) {
            
    const reducer=(state,action)=>{
        switch (action.type) {
            case INC:
                if(state.selection+action.payload<inventory.length)
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
            default:
                break;
        }
    }
            
            

    const   {inventory,saleQuestion,doSell,cooldown,GPConnected} = useContext(GlobalContext)
    const   [dialog,setDialog] = useState("What are you Selling?"),
            [selling,setSelling]=useState(true),
            [forConf,setForConf]=useState(null),
            [blank,setBlank]=useState(false)
    
    const [state,dispatch]=useReducer(reducer,{selection:0})

    const attemptSell=async e=>{
        if(cooldown<1){
            let returned = await saleQuestion(e)
            console.log('Sell Check ', returned);
            setDialog(returned[0])
            setSelling(false)
            setForConf(e)
        }
    }

    const buttonSell=async e=>{
        if(cooldown>0 || inventory.length==0){
            return
        }else if(selling && e){
            let returned = await saleQuestion(inventory[state.selection])
            console.log('Sell Check ', returned);
            setDialog(returned[0])
            setSelling(false)
            setForConf(inventory[state.selection])
        }else if(selling){
            closer(false)
        }else if(e){
            confirm()
        }else{
            refuse()
        }
    }

    const confirm=async e=>{
        console.log(`confirm dump ${forConf}, ${cooldown}`);
        if(cooldown<1){
            setDialog("Thanks for the Artifact")
            doSell(forConf)
            setForConf(null)
            setTimeout(revert,1500)
        }
    }

    const refuse=e=>{
        setDialog("Awww, that's too bad")
        setTimeout(revert,1500)
    }

    const revert=e=>{
        setSelling(true)
        setDialog('What are you Selling?')
        dispatch({
            type:RESET
        })
    }

    useEffect(()=>{
        if(open){
            // console.log('firing effect');
            setPass(()=>ctrl)
        }else{
            console.log('open triggering selection change');
            setPass(null)
            dispatch({type:RESET})
        }
    },[open])

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

    useEffect(()=>{
        if(open){
            accept(()=>buttonSell)
        }else if(accept!==null){
            accept(null)
        }
    },[open,state.selection,selling,forConf,cooldown])

    return (
        <ShopDialog className={open?'open':''}>
            <ShopFront>
                <ShopButton onClick={()=>closer(false)}>X</ShopButton>
                <p>{dialog}</p>
                {
                    selling &&
                    <section>
                        {inventory.map((item,index)=>{
                            let classes='none';
                            if(index==state.selection && GPConnected){
                                classes='selected'
                            }
                            if(index%5===0 && index>0)
                               return <><ShopItem className={classes} onClick={()=>attemptSell(item)}>{item}</ShopItem> <br/></>
                            else
                                return <ShopItem className={classes} onClick={()=>attemptSell(item)}>{item}</ShopItem>
                        })}
                    </section>
                }
                {
                    !selling && 
                    <section>
                        <ShopItem onClick={confirm}>Yes</ShopItem>
                        <ShopItem onClick={refuse}>No</ShopItem>
                    </section>

                }
            </ShopFront>
        </ShopDialog>
    )
}

export default SaleDialog
