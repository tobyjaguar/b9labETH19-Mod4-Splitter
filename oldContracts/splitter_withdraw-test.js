describe("Check withdrawals", function() {

  beforeEach("Run the split", function() {
    return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount})
    .then( result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");;
    });
  })

  it("Should withdraw receipient's funds from the contract", function() {
    var hash;
    var gasPrice = 0;
    var gasUsed = 0;
    var gasConsumed = 0;
    var sendAmount = 0;
    var balanceBefore;
    var balanceNow;

    return new Promise((resolve, reject) => {
      web3.eth.getBalance(receiver1, (err, balance) => {
        if (err) reject(err)
        else resolve(balance)
      });
    })
    .then(balance => {
      balanceBefore = parseInt(balance.valueOf());
      return contractInstance.requestWithdraw({from: receiver1});
    })
    .then(txObj => {
      hash = txObj.receipt.transactionHash;
      gasUsed = txObj.receipt.gasUsed;
      //console.log(JSON.stringify(tx, null, 4));
      return new Promise((resolve, reject) => {
        web3.eth.getTransaction(hash, (err, tx) => {
          if (err) reject(err)
          else resolve(tx)
        });
      })
    })
    .then(tx => {
      gasPrice = parseInt(tx.gasPrice.valueOf());
      console.log
      (
        "gasPrice: " + gasPrice + "\n" +
        "gasUsed: " + gasUsed
      );
      return new Promise((resolve, reject) => {
        web3.eth.getBalance(receiver1, (err, balance) => {
          if (err) reject(err)
          else resolve(balance)
        });
      });
    })
    .then(balance => {
      balanceNow = parseInt(balance.valueOf());
      sendAmount = parseInt(amount) / 2;
      gasConsumed = gasUsed * gasPrice;
      console.log(
        "Balance differnce: " + (balanceNow - balanceBefore) + "\n" +
        "Amount - fee: " + (sendAmount - gasConsumed)
      );
      assert.equal(balanceNow.toString(10), (balanceBefore + (sendAmount - gasConsumed)).toString(10), "Receiver1's balance did not return correctly");
    });
    //end test
  });

  //end describe
});
