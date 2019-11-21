/* CPU functionality. */
// import * as sys from 'sys';
export default class CPU {
    /* Main CPU class. */
    constructor() {
        /* Construct a new CPU. */
        this.pc = 0;
        this.reg =[];
        this.reg.length=7
        this.reg.fill(0)
        this.reg.push(244);
        this.ram = [];
        this.ram.length=255
        this.ram.fill(0)
        this.IR = 0;
        this.sp = 7;
        this.MAR = 0;
        this.MDR = 0;
        this.FL = 0;
        this.inst = {
            130: this.LDI, 
            71: this.PRN, 
            162: this.MUL, 
            70: this.pop, 
            69: this.push, 
            17: this.ret, 
            80: this.call, 
            160: this.ADD, 
            167: this.CMP, 
            84: this.JMP, 
            85: this.JEQ, 
            86: this.JNE, 
            72: this.PRA,
            168:this.AND,
            171:this.XOR
        };
        this.output=''
    }
    load=which=> {
        /* Load a program into memory. */
        var address, program;
        address = 0;
        program = which;
        this.output=''
        which.forEach((inst,index)=>{
            this.ram[index]=inst
        })
        // for (var instruction, _pj_c = 0, _pj_a = program, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
        //     instruction = _pj_a[_pj_c];
        //     // console.log(this.ram);
        //     this.ram[address] = Number.parseInt(instruction, 2);
        //     address += 1;
        // }
    }
    alu=(op, reg_a, reg_b)=> {
        /* ALU operations. */
        if ((op === "ADD")) {
            this.reg[reg_a] += this.reg[reg_b];
            this.reg[reg_a] %= 256;
        } else if ((op === "MUL")) {
            this.reg[reg_a] *= this.reg[reg_b];
            this.reg[reg_a] %= 256;
        } else if ((op === "CMP")) {
            if ((this.reg[reg_a] === this.reg[reg_b])) {
                this.FL |= 1;
            } else {
                this.FL &= 254;
            }
        } else if ((op === "AND")) {
            this.reg[reg_a] &= this.reg[reg_b];
        } else if ((op === "OR")) {
            this.reg[reg_a] |= this.reg[reg_b];
        } else if ((op === "XOR")) {
            this.reg[reg_a] ^= this.reg[reg_b];
        } else if ((op === "NOT")) {
            this.reg[reg_a] ^= 255;
        } else if ((op === "SHL")) {
            (this.reg[reg_a] <<= 1);
            this.reg[reg_a] %= 256;
        } else if ((op === "SHR")) {
            (this.reg[reg_a] >>= 1);
        } else if ((op === "MOD")) {
            this.reg[reg_a] %= this.reg[reg_b];
        } else {
            throw new Error("Unsupported ALU operation");
        }
    }

    trace=()=> {
        /*
        Handy function to print out the CPU state. You might want to call this
        from run() if you need help debugging.
        */
        console.log((`TRACE: %02X | %02X %02X %02X |` % [this.pc, this.ram_read(this.pc), this.ram_read((this.pc + 1)), this.ram_read((this.pc + 2))]));
        for (var i = 0, _pj_a = 8; (i < _pj_a); i += 1) {
            console.log((" %02X" % this.reg[i]));
        }
        console.log();
    }
    run=()=> {
        /* Run the CPU. */
        let run = true;
        this.pc=0;
        while (run) {
            this.IR = this.ram[this.pc];
            if ((this.IR === 1)) {
                run = false;
            } else {
                if(this.inst[this.IR]===undefined){
                    console.log('error at ', this.IR);
                }
                this.inst[this.IR]();
                this.pc += 1;
            }
        }
    }

    ram_read=MAR=>{
        return this.ram[MAR];
    }

    ram_write=(MAR, MDR)=>{
        this.ram[MAR] = MDR;
    }
    LDI=()=>{
        var reg, val;
        this.pc += 1;
        reg = this.ram_read(this.pc);
        this.pc += 1;
        val = this.ram_read(this.pc);
        this.reg[reg] = val;
    }
    PRN=()=>{
        var reg;
        this.pc += 1;
        reg = this.ram[this.pc];
        console.log(this.reg[reg]);
    }
    MUL=()=>{
        var reg1, reg2;
        this.pc += 1;
        reg1 = this.ram_read(this.pc);
        this.pc += 1;
        reg2 = this.ram_read(this.pc);
        this.alu("MUL", reg1, reg2);
    }
    push=()=>{
        var reg;
        this.reg[this.sp] -= 1;
        this.pc += 1;
        reg = this.ram_read(this.pc);
        this.ram_write(this.reg[this.sp], this.reg[reg]);
    }
    push_data=(data)=>{
        this.reg[this.sp] -= 1;
        this.ram_write(this.reg[this.sp], data);
    }
    pop_data=()=>{
        this.MDR = this.ram_read(this.reg[this.sp]);
        this.reg[this.sp] += 1;
    }
    pop=()=>{
        var data, reg;
        this.pc += 1;
        reg = this.ram_read(this.pc);
        data = this.ram_read(this.reg[this.sp]);
        this.reg[reg] = data;
        this.reg[this.sp] += 1;
    }
    call=()=>{
        var data, register;
        this.pc += 1;
        this.push_data(this.pc);
        register = this.ram_read(this.pc);
        data = this.reg[register];
        this.pc = (data - 1);
    }
    ret=()=>{
        this.pop_data();
        this.pc = this.MDR;
    }
    ADD=()=>{
        var reg1, reg2;
        this.pc += 1;
        reg1 = this.ram_read(this.pc);
        this.pc += 1;
        reg2 = this.ram_read(this.pc);
        this.alu("ADD", reg1, reg2);
    }
    ST=()=>{
        var dest, src;
        this.pc += 1;
        dest = this.ram_read(this.pc);
        this.pc += 1;
        src = this.ram_read(this.pc);
        this.ram_write(this.reg[dest], this.reg[src]);
    }
    CMP=()=>{
        var reg1, reg2;
        this.pc += 1;
        reg1 = this.ram_read(this.pc);
        this.pc += 1;
        reg2 = this.ram_read(this.pc);
        this.alu("CMP", reg1, reg2);
    }
    JMP=()=>{
        var reg_with_dest;
        this.pc += 1;
        reg_with_dest = this.ram_read(this.pc);
        this.pc = this.reg[reg_with_dest];
        this.pc -= 1;
    }
    JNE=()=>{
        var test_against;
        test_against = (this.FL & 1);
        if ((test_against === 0)) {
            new this.JMP();
        } else {
            this.pc += 1;
        }
    }
    JEQ=()=>{
        var test_against;
        test_against = (this.FL & 1);
        if ((test_against === 1)) {
            new this.JMP();
        } else {
            this.pc += 1;
        }
    }
    ADDI=()=>{
        var dest, to_add;
        this.pc += 1;
        dest = this.ram_read(this.pc);
        this.pc += 1;
        to_add = this.ram_read(this.pc);
        this.reg[dest] += to_add;
    }
    PRA=()=>{
        var reg;
        this.pc += 1;
        reg = this.ram_read(this.pc);
        this.output+=String.fromCharCode(this.reg[reg])
        // console.log(String.fromCharCode(this.reg[reg]));
    }
    AND=()=>{
        this.pc+=1
        const reg1=this.ram_read(this.pc)
        this.pc+=1
        const reg2=this.ram_read(this.pc)
        this.alu('AND',reg1,reg2)
    }
    XOR=()=>{
        this.pc+=1
        const reg1=this.ram_read(this.pc)
        this.pc+=1
        const reg2=this.ram_read(this.pc)
        this.alu('XOR',reg1,reg2)
    }
}

//# sourceMappingURL=cpu.js.map
