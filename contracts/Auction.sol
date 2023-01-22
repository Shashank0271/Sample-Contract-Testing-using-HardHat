// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    uint public maxbid;
    address public maxaddress;
    address payable public owner;
    enum ContractStatus {
        NotInitiated,
        Running,
        Ended
    }
    ContractStatus public contractStatus;

    event HighestBidUpdated(address, uint, uint);
    event Ended();

    constructor(uint baseamt) {
        maxbid = baseamt;
        owner = payable(msg.sender); //owner
        contractStatus = ContractStatus.NotInitiated;
    }

    modifier canPay() {
        require(contractStatus != ContractStatus.Ended, "auction is not open");
        require(msg.sender != owner, "you cannot bid in your own auction");
        require(msg.value >= maxbid, "cant bid lower amount than highest bid");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller should be owner");
        _;
    }

    function getMaxBid() internal view returns (uint) {
        return maxbid;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function bid() public payable canPay {
        if (contractStatus == ContractStatus.Running) {
            payable(maxaddress).transfer(getMaxBid()); //return the previous max bidders money to him
            maxaddress = msg.sender;
            maxbid = msg.value;
        } else {
            maxaddress = msg.sender;
            maxbid = msg.value;
            contractStatus = ContractStatus.Running;
        }
        emit HighestBidUpdated(maxaddress, maxbid, getBalance());
    }

    function EndAuction() public onlyOwner {
        payable(owner).transfer(getBalance());
        contractStatus = ContractStatus.Ended;
        emit Ended();
    }
}
