const {expect} = require('chai') ;
const {ethers} = require('hardhat') ;

describe('Token contract' , ()=>{
    let owner , add1 , add2 ;
    let tokenContract ;
    beforeEach(async()=>{
        Token = await ethers.getContractFactory('Token') ;
        tokenContract = await Token.deploy(100) ;
        [owner , add1 , add2] = await ethers.getSigners() ;
    });
    describe('Deployment' , ()=>{
        it('initializes the owner' , async()=>{
            expect(await tokenContract.owner()).to.equals(owner.address) ;
        });
        it('supply 100 tokens to the owners contract' , async()=>{
            expect(await tokenContract.getOwnersFunds()).to.not.be.undefined ;
            expect(await tokenContract.getOwnersFunds()).to.equals(100) ;
        }) ;
    });
    describe('Transactions' , ()=>{
        it('transfers the funds from owner account to another' , async()=>{
            expect(await tokenContract.getCallingAccount()).to.be.equals(owner.address) ;
            const initialOwnerFunds = await tokenContract.getOwnersFunds() ;
            const initialRecipeientsFunds = await tokenContract.getFunds(add1.address) ;
            transaction = await tokenContract.transferFunds(30 , add1.address) ;
            await transaction.wait() ;

            const remainingOwnerFunds = await tokenContract.getOwnersFunds() ;
            const finalRecipientsFunds = await tokenContract.getFunds(add1.address) ;
            expect(remainingOwnerFunds.add(30)).to.equals(initialOwnerFunds) ;
            expect(finalRecipientsFunds.sub(30)).to.equals(initialRecipeientsFunds) ;
        });
        it('transaction should fail when one account has insufficient funds' , async()=>{
            expect(await tokenContract.connect(add1.address).getCallingAccount()).to.be.equals(add1.address) ;
            const signerInstance = await ethers.getSigner(add1.address) ;
            //simply writing this would reult in an error ( void signer ). We need to take this address and make a signer instance out of it
            await expect(tokenContract.connect(signerInstance).transferFundac(4 , add2.address)).to.be.revertedWith('Not enough funds to transfer') ;
        });
        it('transaction from owner to add1 , then from add1 to add2' , async()=>{
            //transfer from owner to add1 :
            expect(await tokenContract.transferFunds(50 , add1.address)).not.to.be.reverted;
            expect(await tokenContract.getFunds(owner.address)).to.be.equal(50) ;
            expect(await tokenContract.getFunds(add1.address)).to.be.equal(50) ;
            const firstAdd = await ethers.getSigner(add1.address) ;
            //transfer from add1 to add2 :
            await expect(tokenContract.connect(firstAdd).transferFundac(50 , add2.address)).not.to.be.reverted ;
            expect(await tokenContract.getFunds(add2.address)).to.be.equals(50);
            expect(await tokenContract.getFunds(add1.address)).to.be.equals(0);
        });
    });
});
