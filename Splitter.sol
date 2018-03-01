//Splitter
//there are 3 people: Alice, Bob and Carol
//we can see the balance of the Splitter contract on the web page
//whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol
//we can see the balances of Alice, Bob and Carol on the web page
//we can send ether to it from the web page

pragma solidity ^0.4.13;

import "./Stoppable.sol";


contract Splitter is Stoppable {

    uint256 public balance;

    struct SplitMember {
        address sender;
        uint256 amount;
    }

    mapping(address => SplitMember) public splitters;

    event LogSplitMembers(address eSender, address eSplit1, address eSplit2, uint256 eSplitAmount);
    event LogRequestWithdraw(address eRecipient, address eSender, uint256 eAmount);

    function Splitter()
    public {
        //owner = msg.sender;
    }

    function splitMembers(address _split1, address _split2)
    public
    onlyIfRunning
    payable
    returns(bool success)
    {
        require(msg.sender != 0);
        require(msg.value > 0);
        require(_split1 != 0);
        require(_split2 != 0);
        require(msg.value%2 == 0);

        splitters[_split1].sender = msg.sender;
        splitters[_split1].amount += msg.value/2;

        splitters[_split2].sender = msg.sender;
        splitters[_split2].amount += msg.value/2;

        balance += msg.value;

        LogSplitMembers(msg.sender, _split1, _split2, msg.value/2);
        return true;
    }

    function getBalance()
    public
    constant
    returns(bool success, uint256 _balance)
    {
        return (true, balance);
    }

    function requestWithdraw()
    public
    onlyIfRunning
    returns(bool success)
    {
        require(splitters[msg.sender].amount != 0);
        uint256 amountToSend = splitters[msg.sender].amount;
        splitters[msg.sender].amount = 0;
        balance -= amountToSend;
        msg.sender.transfer(amountToSend);

        LogRequestWithdraw(msg.sender, splitters[msg.sender].sender, amountToSend);
        return true;
    }

}
