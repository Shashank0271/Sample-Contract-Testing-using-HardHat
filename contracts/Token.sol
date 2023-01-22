// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "hardhat/console.sol";
contract Token{
    address public owner; 
    mapping (address => uint) funds;
    constructor(uint _initalFunds){
        owner = msg.sender ;
        funds[owner] = _initalFunds ;
    }
    function transferFunds(uint fundingAmount , address transferTo) public {
        require(funds[owner] >= fundingAmount , 'owner has insufficient funds') ;
        funds[owner] -= fundingAmount ;
        funds[transferTo] += fundingAmount ;
    }
    function transferFundac(uint fundingAmount , address transferTo) public {
        require(funds[msg.sender] >= fundingAmount , 'Not enough funds to transfer') ;
        funds[msg.sender]-=fundingAmount ;
        funds[transferTo]+=fundingAmount ;
    }
    function getOwnersFunds() public view returns(uint){
        return funds[owner] ;
    }
    function getFunds(address _address) public view returns(uint){
        return funds[_address] ;
    }
    function getCallingAccount()public view returns(address){
        return msg.sender ;
    }
}