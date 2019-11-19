import axios from 'axios'

class Connector{
    constructor(){
        this.connection = axios
        this.connection.defaults.baseURL='https://lambda-treasure-hunt.herokuapp.com/api/'
        this.coins=0
    }

    login=token=>{
        this.connection.defaults.headers.common['Authorization']=`Token ${token}`
        this.token=token
    }
    getBalance=async ()=>{
        let data = await this.connection.get('/bc/get_balance/')
        let ret = await data.data
        return ret
    }

    transmog=async item=>{
        let data = await this.connection.post('/api/adv/transmogrify/',{name:item})
        let ret = await data.data
        return ret
    }

    attemptMine=async proof=>{
        let data = await this.connection.post('/api/bc/mine/',{proof})
        let ret = await data.data
    }
    
    init=async e=>{
        let data = await this.connection.get('/adv/init/')
        let ret = await data.data
        console.log(ret)
    }

    serll = async e=>{
        let data = await this.connection.post('/adv/sell/',{'name':e})
        let ret = await data.data
        return ret
    }
}

export const Connection=new Connector()