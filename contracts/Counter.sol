// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
contract Counter {
    string public name;
    uint256 public age;

    constructor(uint256 _age, string memory _name) {
        age = _age;
        name = _name;
    }

    function incrementAge() public returns(uint256){
        age++;
        return age ;
    }

    function decrementAge() public{
        age-- ;
    }

    function doubleAge() public{
        age*=2 ;
    }

    function getAge() public view returns(uint256){
        return age ;
    }

    function changeName(string memory _newName) public{
        name = _newName ;
    }
}
