//Splitter
//there are 3 people: Alice, Bob and Carol
//we can see the balance of the Splitter contract on the web page
//whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol
//we can see the balances of Alice, Bob and Carol on the web page
//we can send ether to it from the web page

pragma solidity ^0.4.13;


contract Splitter {

    struct MemberFunds {
        uint256 amount;
        bool    sent;
    }

    address public owner;
    address public aliceAddy;
    address public bobAddy;
    address public carolAddy;

    MemberFunds public bobFunds;
    MemberFunds public carolFunds;

    function Splitter(address alice, address bob, address carol)
    public {
        require(alice != 0);
        require(bob != 0);
        require(carol != 0);

        owner = msg.sender;
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
        require(!bobFunds.sent && !carolFunds.sent);

        bobFunds.amount = msg.value/2;
        carolFunds.amount = msg.value/2;
        return true;
    }

    function withdrawBob()
    public
    returns(bool success)
    {
        require(msg.sender == bobAddy);
        require(bobFunds.amount > 0 && !bobFunds.sent);

        bobFunds.sent = true;
        bobAddy.transfer(bobFunds.amount);
        return true;

    }

    function withdrawCarol()
    public
    returns (bool success)
    {
        require(msg.sender == carolAddy);
        require(carolFunds.amount > 0 && !carolFunds.sent);

        carolFunds.sent = true;
        carolAddy.transfer(carolFunds.amount);
        return true;

    }

}
