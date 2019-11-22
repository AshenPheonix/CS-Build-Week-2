import {Connection as connection} from './helpers/connection'
import mockAxios from 'jest-mock-axios'

const BASEURL='https://lambda-treasure-hunt.herokuapp.com/api/'

afterEach(()=>{
    mockAxios.reset()
})

it("Get's Balance from Server",async ()=>{

    let data=connection.getBalance()
    
    let responseObj={
        cooldown:5,
        messages:['You have a balance of 1 Lambda Coin'],
        errors:[]
    }
    mockAxios.mockResponse(responseObj)
    
    await data
    expect(mockAxios.get).toHaveBeenCalledWith(`/bc/get_balance/`)

    expect(data==responseObj)
})

it("Attempts to Transmog",async ()=>{
    let promise = connection.transmog("demo")

    let responseObj={
        message:"I don't know what would be here"
    }
    mockAxios.mockResponse(responseObj)

    await promise
    expect(mockAxios.post).toHaveBeenCalledWith('/adv/transmogrify/',{name:'demo'})
    expect(promise==responseObj)
})

it("Attempts to Mine",async ()=>{
    let promise=connection.attemptMine(546)

    let responseObj={
        message:"New Block Forged",
        timestamp:'now, dummy'
    }
    mockAxios.mockResponse(responseObj)

    await promise
    expect(mockAxios.post).toHaveBeenCalledWith('/bc/mine/',{proof:546})
    expect(promise==responseObj)
})