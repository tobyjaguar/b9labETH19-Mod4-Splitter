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

	uint256 public splitAmount;
	bool sentBob;
	bool sentCarol;
    
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
        returns(bool success) 
	{
            require(msg.value > 0);
            require(msg.sender == Alice);
            require(msg.value%2 == 0);
            
            splitAmount = msg.value/2;
		return true;
            
   }
   
	function withdraw()
	public
	returns(bool success)
	{
		require(msg.sender == Bob || msg.sender == Carol);
		require(splitAmount != 0);
		if(msg.sender == Bob && sentBob == false) 
		{
			Bob.transfer(splitAmount);
			sentBob = true;
			return true;
		}
		if(msg.sender == Carol && sentCarol == false)
		{
			Carol.transfer(splitAmount);
			sentCarol = true;
			return ture;
		}
	}

}
