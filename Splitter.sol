//Splitter
//there are 3 people: Alice, Bob and Carol
//we can see the balance of the Splitter contract on the web page
//whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol
//we can see the balances of Alice, Bob and Carol on the web page
//we can send ether to it from the web page

pragma solidity ^0.4.13;


contract Splitter {

    address public owner;
    address public aliceAddy;
    address public bobAddy;
    address public carolAddy;
    uint256 public bobAmount;
    uint256 public carolAmount;

    bool public hasSplit;

    function Splitter()
    public {
        owner = msg.sender;
    }

    function setMembers(address alice, address bob, address carol)
    public
    {
        require(msg.sender == owner);
        require(alice != 0);
        require(bob != 0);
        require(carol != 0);

        aliceAddy = alice;
        bobAddy = bob;
        carolAddy = carol;
    }

    function getBalance()
    public
    constant
    returns(bool success, uint256 _balance)
    {
        return (true, this.balance);
    }

    function split()
    public
    payable
    returns(bool success)
    {
        require(msg.value > 0);
        require(msg.sender == aliceAddy);
        require(msg.value%2 == 0);
        require(!hasSplit);

        hasSplit = true;
        bobAmount = msg.value/2;
        carolAmount = msg.value/2;
        return true;
    }

    function bobWithdraw()
    public
    returns(bool success)
    {
        require(msg.sender == bobAddy);
        require(hasSplit);
        uint256 amountToSend = bobAmount;
        require(amountToSend != 0);
        bobAmount = 0;
        bobAddy.transfer(amountToSend);
        return true;
    }

    function carolWithdraw()
    public
    returns(bool success)
    {
        require(msg.sender == carolAddy);
        require(hasSplit);
        uint256 amountToSend = carolAmount;
        require(amountToSend != 0);
        carolAmount = 0;
        carolAddy.transfer(amountToSend);
        return true;
    }

}
