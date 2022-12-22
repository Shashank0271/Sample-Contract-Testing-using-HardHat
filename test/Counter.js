const { expect } = require('chai') ;
const { ethers } = require('hardhat') ;
describe('Counter contract' , ()=>{
    let counter ;
    beforeEach(async()=>{
        const Counter = await ethers.getContractFactory('Counter') ;
        counter = await Counter.deploy(1 , "Shanky") ;
    });

    describe('Deployment' , () => {
        it('sets the initial name' , async()=>{
            const name = await counter.name() ;
            expect(name).to.equals("Shanky") ;
        });
        it('sets the initial age' , async()=>{
            const age = await counter.age() ;
            expect(age).to.equals(1) ;
        });
    });
    
    describe('Counting' , async()=>{
        let initialAge ;

        beforeEach(async()=>{
            initialAge = await counter.age() ;
        });

        it('reads the age using age() public variable' , async()=>{
            expect(await counter.age()).to.equal(1) ;
        });

        it('reads the age using getAge function' , async()=>{
            expect(await counter.getAge()).to.equal(1) ;
        });

        it('increases the age' , async()=>{
            transaction = await counter.incrementAge() ;
            await transaction.wait() ;
            const updatedAge = await counter.age() ;
            expect(updatedAge).to.equal(initialAge.add(1)) ;
        });

        it('decreases the age' , async()=>{
            transaction = await counter.decrementAge() ;
            await transaction.wait() ;
            finalAge = await counter.getAge() ;
            expect(finalAge).to.equal(initialAge.sub(1)) ;
            //age cannot be negative : hence we expect a 'revert'
            await expect(counter.decrementAge()).to.be.reverted ;
        });

        it('doubles the age' , async()=>{
            transaction = await counter.doubleAge() ;
            await transaction.wait() ;
            const updatedAge = await counter.age() ;
            expect(updatedAge).to.equals(initialAge.mul(2)) ;
        });
    });

    describe('Changing name' , ()=>{
        it('updated the name with a new name' , async()=>{
            let newName = "Shashank";
            await counter.changeName(newName) ;
            expect(await counter.name()).equals(newName) ;
        });
    });

});

