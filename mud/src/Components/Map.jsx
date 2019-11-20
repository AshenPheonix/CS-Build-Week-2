import React,{useContext,useEffect, useRef,useState} from 'react'
import {MapBox} from '../styles/Map'
import {GlobalContext} from '../Context/provider'
import roomBase from '../images/BaseRoom.png'
import upExit from '../images/upExit.png'
import downExit from '../images/downExit.png'
import rightExit from '../images/rightExit.png'
import leftExit from '../images/leftExit.png'
import horiz from '../images/horizHall.png'
import vert from '../images/vertHall.png'
import player from '../images/player.png'
import sale from '../images/saleSign.png'
import goal from '../images/well.png'
import pirate from '../images/pirate.png'
import holy from '../images/shrine.png'
import transmog from '../images/transmog.png'

const   IMAGE_SIZE=50,
        USER_WIDTH=20,
        USER_HEIGHT=40


function Map() {
    const {map,currentRoom} = useContext(GlobalContext)
    const   canvas=useRef(null),
            box=useRef(null),
            base=useRef(null),
            left=useRef(null),
            right=useRef(null),
            up=useRef(null),
            down=useRef(null),
            hh=useRef(null),
            vh=useRef(null),
            user=useRef(null),
            end=useRef(null),
            shop=useRef(null),
            rys=useRef(null),
            shrine=useRef(null),
            science=useRef(null)
            

    const [ctx,setCtx]=useState(null)

    useEffect(()=>{
        if (ctx==null && canvas.current!=null) {
            setCtx(canvas.current.getContext('2d'))
        }
    },[canvas,ctx])

    const DrawRoom=(x,y,which)=>{
        let drawX=x,
            drawY=y
        
        if(which.id!==currentRoom.id){
            let [curX,curY]=which.coords.replace(/\(|\)/g,'').split(','),
                [centerX,centerY]=currentRoom.coords.replace(/\(|\)/g,'').split(',')
                
            drawX+=(curX-centerX)*IMAGE_SIZE
            drawY-=(curY-centerY)*IMAGE_SIZE
                
            // console.log('Target Found: ',drawX, drawY);
        }
        // console.log(`drawing ${which.id} reqested at ${drawX},${drawY}`);
        ctx.drawImage(base.current,drawX,drawY)
        if (which.exits.n!=undefined) {
            ctx.drawImage(up.current,drawX,drawY)
        }
        if (which.exits.s!=undefined) {
            ctx.drawImage(down.current,drawX,drawY)
        }
        if (which.exits.e!=undefined) {
            ctx.drawImage(right.current,drawX,drawY)
        }
        if (which.exits.w!=undefined) {
            ctx.drawImage(left.current,drawX,drawY)
        }
        if(which.title==="Shop"){
            ctx.drawImage(shop.current,drawX,drawY)
        }else if(which.title==="Wishing Well"){
            ctx.drawImage(end.current,drawX,drawY)
        }else if(which.title=="Pirate Ry's"){
            ctx.drawImage(rys.current,drawX,drawY)
        }else if(which.description.includes('shrine')){
            ctx.drawImage(shrine.current,drawX,drawY)
        }else if(which.title==='The Transmogriphier'){
            ctx.drawImage(science.current,drawX,drawY)
        }
    }

    const DrawConnect=(x,y,last,cur)=>{
        let [lastX,lastY]=last.coords.replace(/\(|\)/g,'').split(','),
        [curX,curY]=cur.coords.replace(/\(|\)/g,'').split(','),
        [centerX,centerY]=currentRoom.coords.replace(/\(|\)/g,'').split(',')
        
        let  offOfCenterX=lastX-centerX,
        offOfCenterY=lastY-centerY,
        intX=offOfCenterX*IMAGE_SIZE,
        intY=offOfCenterY*IMAGE_SIZE
        intX+=x
        intY+=y
        
        // console.log(`drawing ${last.id} to ${cur.id}. ${last.coords} : ${cur.coords}`);
        
        let stepX=curX-lastX,
        stepY=curY-lastY

        while(stepX!==0){
            if(stepX>0){
                intX+=IMAGE_SIZE
                if(stepX!==1)
                    ctx.drawImage(hh.current,intX,intY)
                stepX--
            }else{
                intX-=IMAGE_SIZE
                if(stepX!==-1)
                    ctx.drawImage(hh.current,intX,intY)
                stepX++
            }
        }
        while(stepY>0){
            if(stepY>0){
                intY-=IMAGE_SIZE
                if(stepY!==1)
                    ctx.drawImage(vh.current,intX,intY)
                stepY--
            }else{
                intY+=IMAGE_SIZE
                if(stepY!==-1)
                    ctx.drawImage(vh.current,intX,intY)
                stepY++
            }
        }

        // console.log(`x:${intX}, y:${intY}`);
        return [intX,intY]
    }

    useEffect(()=>{
        if (currentRoom.id!=-1 && canvas && Object.keys(map).length>0) {

            //data for aquisition
            let compX=box.current.clientWidth
            let compY=box.current.clientHeight

            let maxY=compY*(compY/box.current.offsetHeight)
            let maxX=compX*(compX/box.current.offsetWidth)

            canvas.current.height=compY*(compY/box.current.offsetHeight)
            canvas.current.width=compX*(compX/box.current.offsetWidth)

            let startX = Math.floor(maxX/2)
            let startY = Math.round(maxY/2)

            let Offset = IMAGE_SIZE/2,
                PlayerOffsetX=USER_WIDTH/2,
                PlayerOffsetY=USER_HEIGHT/2
                
            const   playerX=startX-PlayerOffsetX,
                    playerY=startY-PlayerOffsetY

            startX-=Offset
            startY-=Offset

            let order=[currentRoom]
            let done=new Set()
            let lastDraw=null
            let drawnConnections={

            }

            while (order.length>0) {
                let currentDraw=order.pop()
                if (lastDraw==null) {
                    DrawRoom(startX,startY,currentDraw)
                }else{
                    // console.log('connections for ',currentDraw);
                    // console.log('connections all ',drawnConnections);
                    const [newX,newY] = DrawConnect(startX,startY,drawnConnections[currentDraw.id],currentDraw)
                    DrawRoom(startX,startY,currentDraw)
                }

                Object.entries(currentDraw.exits).forEach(([key,val])=>{
                    if(val!=='?' && !done.has(val)){
                        order.push(map[val])
                        drawnConnections[val]=currentDraw
                    }
                })

                lastDraw=map[currentDraw.id]
                done.add(currentDraw.id)
            }
            ctx.drawImage(user.current,playerX,playerY)
        }
    },[map,currentRoom])

    return (
        <MapBox ref={box}>
            <canvas ref={canvas} />
            <img src={roomBase} ref={base} alt=""/>
            <img src={upExit} ref={up} alt=""/>
            <img src={downExit} ref={down} alt=""/>
            <img src={rightExit} ref={right} alt=""/>
            <img src={leftExit} ref={left} alt=""/>
            <img src={horiz} ref={hh} alt=""/>
            <img src={vert} ref={vh} alt=""/>
            <img src={player} alt="" ref={user}/>
            <img src={goal} alt="" ref={end}/>
            <img src={sale} alt="" ref={shop}/>
            <img src={pirate} alt="" ref={rys}/>
            <img src={holy} alt="" ref={shrine}/>
            <img src={transmog} alt="" ref={science}/>
        </MapBox>
    )
}

export default Map
