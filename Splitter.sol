//Splitter
//there are 3 people: Alice, Bob and Carol
//we can see the balance of the Splitter contract on the web page
//whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol
//we can see the balances of Alice, Bob and Carol on the web page
//we can send ether to it from the web page

pragma solidity ^0.4.16;

contract Splitter {
    
    address public owner;
    address public Alice;
    address public Bob; 
    address public Carol;

    
    //uint256 public contractBalance; //how to not overshadow this?
    
    function Splitter(address alice, address bob, address carol) 
        public {
            owner = msg.sender;
            Alice = alice;
            Bob = bob;
            Carol = carol;
    } 
    
    function getBalance() 
        public 
        view 
        returns(bool success, uint256 contractBalance) {
            return (true, this.balance);
        
    }
    
   function split() 
        public 
        payable 
        returns(bool success) {
            require(msg.value > 0);
            if(msg.sender == Alice) {
            Carol.transfer(msg.value/2);
            Bob.transfer(msg.value/2);
            return true;
       }
   }
   
   //Get balance of Alice, Bob, and Carol
   function getBalanceAlice()
    public
    view
    returns(bool success, uint256 aliceBalance) {
        return (true, Alice.balance);
    }
   
   function getBalanceBob()
    public
    view
    returns(bool success, uint256 bobBalance) {
        return (true, Bob.balance);
    }
    
    function getBalanceCarol()
    public
    view
    returns(bool success, uint256 carolBalance) {
        return (true, Carol.balance);
    }
   
   //Do I need this for the contract to receive funds??
   function()
   public
   payable {
       
   }
    
}
