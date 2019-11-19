class Room{
    constructor(id,title,description,exits,coords){
        this.id=id
        this.title=title
        this.description=description
        this.exits={}
        exits.forEach(e=>this.addExit(e))
        this.coords=coords
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
}

export default Room