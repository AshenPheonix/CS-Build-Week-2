class Room{
    constructor(id,title,description,exits){
        this.id=id
        this.title=title
        this.description=description
        this.exits={}
        exits.forEach(e=>this.addExit(e))
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