class Room{
    constructor(id,title,description,exits,coords,items=[]){
        this.id=id
        this.title=title
        this.description=description
        this.exits={}
        exits.forEach(e=>this.addExit(e))
        this.coords=coords
        this.items=[]
    }

    addExit=which=>{
        this.exits[which]='?'
    }
    
    knowExit=(which,id)=>{
        this.exits[which]=id
    }

    getExit=which=>{
        return this.exits[which]
    }

    isKnown=which=>{
        return this.exits[which] || this.exits[which]!='?'
    }

    addItem=which=>{
        this.items=which
    }
}

export default Room