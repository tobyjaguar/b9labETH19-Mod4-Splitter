pragma solidity ^0.4.13;

  function requestWithdraw()
  public
  returns(bool success)
  {
      uint256 amountToSend = members[msg.sender].amount;
      require(hasSplit);
      require(amountToSend != 0);
      amountToSend = members[msg.sender].amount;
      members[msg.sender].amount = 0;
      msg.sender.transfer(amountToSend);
      return true;
  }
