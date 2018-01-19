//Splitter
//there are 3 people: Alice, Bob and Carol
//we can see the balance of the Splitter contract on the web page
//whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol
//we can see the balances of Alice, Bob and Carol on the web page
//we can send ether to it from the web page

pragma solidity ^0.4.13;

contract Splitter {
    
    address public owner;
    address public Alice;
    address public Bob; 
    address public Carol;

    
    function Splitter(address alice, address bob, address carol) 
        public {
            require(alice > 0);
            require(bob > 0);
            require(carol > 0);
            owner = msg.sender;
            Alice = alice;
            Bob = bob;
            Carol = carol;
    } 
    
   function split() 
        public 
        payable 
        returns(bool success) {
            require(msg.value > 0);
            require(msg.sender == Alice);
            require(msg.value%2 == 0);
            Carol.transfer(msg.value/2);
            Bob.transfer(msg.value/2);
            return true;
       
   }
   
    
}
