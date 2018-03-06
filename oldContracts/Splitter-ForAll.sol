//Splitter
//there are 3 people: Alice, Bob and Carol
//we can see the balance of the Splitter contract on the web page
//whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol
//we can see the balances of Alice, Bob and Carol on the web page
//we can send ether to it from the web page

pragma solidity ^0.4.13;


contract Splitter {

    address public owner;

    mapping(address => uint256) public amountOf;

    function Splitter()
    public {
        owner = msg.sender;
    }

    function getBalance()
    public
    constant
    returns(bool success, uint256 _balance)
    {
        return (true, this.balance);
    }

    function split(address senderA, address senderB)
    public
    payable
    returns(bool success)
    {
        require(senderA != 0);
        require(senderB != 0);
        require(msg.value > 0);
        require(msg.value%2 == 0);

        amountOf[senderA] += msg.value/2;
        amountOf[senderB] += msg.value/2;
        return true;
    }

    function requestWithdraw()
    public
    returns(bool success)
    {
        require(msg.sender != 0);
        require(amountOf[msg.sender] > 0);
        uint256 amountToSend = amountOf[msg.sender];
        require(amountToSend != 0);
        amountOf[msg.sender] = 0;
        msg.sender.transfer(amountToSend);
        return true;
    }

}
