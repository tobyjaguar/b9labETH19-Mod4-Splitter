//Splitter
//there are 3 people: Alice, Bob and Carol
//we can see the balance of the Splitter contract on the web page
//whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol
//we can see the balances of Alice, Bob and Carol on the web page
//we can send ether to it from the web page

pragma solidity ^0.4.13;

import "./Stoppable.sol";


contract Splitter is Stoppable {

    address public owner;
    address public aliceAddy;
    address public bobAddy;
    address public carolAddy;

    mapping(address => uint256) public amountOf;

    event LogSetMembers(address sender, address alice, address bob, address carol);
    event LogSplit(address sender, uint256 amount);
    event LogrequestWithdraw(address sender, uint256 amount);

    function Splitter()
    public {
        owner = msg.sender;
    }

    function setMembers(address alice, address bob, address carol)
    public
    onlyOwner
    onlyIfRunning
    returns(bool success)
    {
        require(alice != 0);
        require(bob != 0);
        require(carol != 0);

        aliceAddy = alice;
        bobAddy = bob;
        carolAddy = carol;

        LogSetMembers(msg.sender, alice, bob, carol);
        return true;
    }

    function getBalance()
    public
    constant
    onlyIfRunning
    returns(bool success, uint256 _balance)
    {
        return (true, this.balance);
    }

    function split()
    public
    payable
    onlyIfRunning
    returns(bool success)
    {
        require(msg.value > 0);
        require(msg.sender == aliceAddy);
        require(msg.value%2 == 0);

        amountOf[bobAddy] += msg.value/2;
        amountOf[carolAddy] += msg.value/2;

        LogSplit(msg.sender, msg.value);
        return true;
    }

    function requestWithdraw()
    public
    onlyIfRunning
    returns(bool success)
    {
        uint256 amountToSend = amountOf[msg.sender];
        require(amountToSend != 0);
        amountOf[msg.sender] = 0;
        msg.sender.transfer(amountToSend);

        LogrequestWithdraw(msg.sender, amountToSend);
        return true;
    }

}
