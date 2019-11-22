import React from 'react'
import CPU from './helpers/cpu'

const ls8=new CPU()
const   LDIcmd=130,
        HLTcmd=1,
        PRNcmd = 71,
        MULcmd = 162, 
        popcmd = 70, 
        pushcmd = 69, 
        retcmd = 17, 
        callcmd = 80, 
        ADDcmd = 160, 
        CMPcmd = 167, 
        JMPcmd = 84, 
        JEQcmd = 85, 
        JNEcmd = 86, 
        PRAcmd = 72,
        ANDcmd = 168,
        XORcmd = 171

test('LDI/HLT acts the way expected',()=>{

    
    const   upload1=4,
            upload2=9,
            upload3=256,
            upload4=257

    const instSet=[
        LDIcmd,
        1,
        upload1,
        LDIcmd,
        upload2,
        2,
        LDIcmd,
        3,
        upload3,
        LDIcmd,
        4,
        upload4,
        HLTcmd
    ]

    ls8.load(instSet)
    ls8.run()
    expect(ls8.reg[1]==4)
    expect(ls8.reg[2]==9)
    expect(ls8.reg[3]==0)
    expect(ls8.reg[4]==1)
})


test('PRN works as intended',()=>{
    const   upload1=8,
            upload2=20,
            upload3=5,
            upload4=30

    const instSet=[
        LDIcmd,
        1,
        upload1,
        LDIcmd,
        upload2,
        2,
        LDIcmd,
        3,
        upload3,
        LDIcmd,
        4,
        upload4,
        PRNcmd,
        1,
        PRNcmd,
        2,
        PRNcmd,
        3,
        PRNcmd,
        4,
        HLTcmd
    ]

    expect(ls8.output=='820530')
})

test('ALU works as intended',()=>{
    const instSet=[
        LDIcmd,0,5,
        LDIcmd,1,2,
        MULcmd,0,1,
        LDIcmd,2,3,
        ADDcmd,1,2,
        LDIcmd,3,2,
        ANDcmd,2,3,
        LDIcmd,4,1,
        XORcmd,3,4,
    ]

    expect(ls8.reg[0]==5*2)
    expect(ls8.reg[1]==2+3)
    expect(ls8.reg[2]==3&2)
    expect(ls8.reg[3]==2^1)
})