import React,{useContext,useState,useEffect} from 'react'
import {ShopDialog,ShopItem,ShopButton,ShopFront} from '../styles/SaleDialog'
import {GlobalContext} from '../Context/provider'

function SaleDialog({accept,deny,open,closer}) {

    const   {inventory,saleQuestion,doSell,cooldown} = useContext(GlobalContext)
    const   [dialog,setDialog] = useState("What are you Selling?"),
            [selling,setSelling]=useState(true),
            [forConf,setForConf]=useState(null)

    const attemptSell=async e=>{
        if(cooldown<1){
            let returned = await saleQuestion(e)
            setDialog(returned[0])
            setSelling(false)
            setForConf(e)
        }
    }

    const confirm=async e=>{
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
    }

    return (
        <ShopDialog className={open?'open':''}>
            <ShopFront>
                <ShopButton onClick={()=>closer(false)}>X</ShopButton>
                <p>{dialog}</p>
                {
                    selling &&
                    <section>
                        {inventory.map(item=>(
                            <button onClick={()=>attemptSell(item)}>{item}</button>
                        ))}
                    </section>
                }
                {
                    !selling && 
                    <section>
                        <button onClick={confirm}>Yes</button>
                        <button onClick={refuse}>No</button>
                    </section>

                }
            </ShopFront>
        </ShopDialog>
    )
}

export default SaleDialog
