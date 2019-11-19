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
        let data = await this.connection.post('/adv/transmogrify/',{name:item})
        let ret = await data.data
        return ret
    }

    attemptMine=async proof=>{
        let data = await this.connection.post('/bc/mine/',{proof})
        let ret = await data.data
        console.log(ret)
    }
    
    init=async e=>{
        try {
            let data = await this.connection.get('/adv/init/')
            let ret = await data.data
            return ret
        } catch (error) {
            console.log(error.response.data)
            console.error({...error})
        }
    }

    sell = async e=>{
        let data = await this.connection.post('/adv/sell/',{'name':e})
        let ret = await data.data
        return ret
    }

    explore = async e=>{
        let data = await this.connection.post('/adv/move',{'direction':e})
        let ret = data.data
        return ret
    }

    walk = async (direction,attached)=>{
        console.log(`walking with ${direction} and ${attached}`);
        try {
            let data = await this.connection.post('/adv/move',{direction,next_room_id:attached.toString()})
            let ret = data.data
            console.log(ret);
            return ret
        } catch (error) {
            console.log({...error});
        }
    }
}

export const Connection=new Connector()