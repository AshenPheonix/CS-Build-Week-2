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
        return ret
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
        try {
            let data = await this.connection.post('/adv/move',{direction,next_room_id:attached.toString()})
            let ret = data.data
            return ret
        } catch (error) {
            console.log({...error});
        }
    }

    pickup = async (item)=>{
        try {
            let data = await this.connection.post('/adv/take/',{name:item})
            let ret = data.data
            return ret
        } catch (error) {
            console.log({...error});
        }
    }
    resetUser=async()=>{
        try {
            let data = await this.connection.post('/adv/status/')
            let ret = data.data
            return ret
        } catch (error) {
            console.log({...error});
        }
    }

    sellQuestion=async item=>{
        try {
            let data = await this.connection.post('/adv/sell/',{name:item})
            let ret = data.data
            return ret
        } catch (error) {
            console.log({...error});
        }
    }

    sellConfirm=async item=>{
        try{
            let data = await this.connection.post('/adv/sell/',{name:item,confirm:'yes'})
            let ret = data.data
            return ret
        } catch(err) {
            console.log({...err})
        }
    }

    dash=async (dir,path)=>{
        try {
            let data = await this.connection.post('/adv/dash/',{
                direction:dir,
                num_rooms:path.length,
                next_room_ids:path.toString()
            })
            let ret = data.data
            return ret
        } catch (err) {
            console.log({...err});
        }
    }

    changeName=async name=>{
        try {
            let data = await this.connection.post('/adv/change_name/',{name,confirm:"aye"})
            let ret = data.data
            console.log(ret);
            return ret
        } catch (err) {
            console.log({...err});
        }
    }

    pray = async e=>{
        try {
            let data = await this.connection.post('/adv/pray/')
            let ret = data.data
            return ret
        } catch (err) {
            console.error({...err});
        }
    }

    getProof = async e=>{
        try {
            let data = await this.connection.get('/bc/last_proof/')
            let ret = data.data
            return ret
        } catch (err) {
            console.error({...err});
        }
    }

    mine = async e=>{
        try {
            let data = await this.connection.post('/bc/mine/',{proof:e})
            let ret = data.data
            return ret
        } catch (err) {
            console.error({...err});
        }
    }

    getKey=async (proof,diff)=>{
        try {
            this.connection.defaults.baseURL='http://localhost:5000'
            console.log({last:proof,diff});
            let data = await this.connection.post('/get_coin',{last:proof,diff})
            let ret = data.data

            this.connection.defaults.baseURL='https://lambda-treasure-hunt.herokuapp.com/api/'

            return ret
        } catch (err) {
            this.connection.defaults.baseURL='https://lambda-treasure-hunt.herokuapp.com/api/'
            console.error('error in getKey');
            console.error(err);
        }
    }

    examine=async e=>{
        try {
            let data = await this.connection.post('/adv/examine',{'name':'Wishing Well'})
            let ret = data.data
            return ret
        } catch (err) {
            
        }
    }
}

export const Connection=new Connector()