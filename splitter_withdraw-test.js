
  it("Should withdraw recipient's funds from contract", function() {
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
      console.log(JSON.stringify(balance, null, 4));
      balanceBefore = parseInt(balance.valueOf());
      gasPrice = parseInt(web3.eth.gasPrice.valueOf());
      return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount})
    })
    .then(result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.requestWithdraw({from: receiver1});
    })
    .then(result => {
      gasUsed = parseInt(result.receipt.cumulativeGasUsed);
      assert.equal(result.receipt.status, true, "withdraw did not return true");
      assert.equal(result.logs[0].args.eRecipient, receiver1, "Recipient's address did not emit correctly from withdraw event");
      assert.equal(result.logs[0].args.eAmount, amount / 2, "Recipient's amount did not emit correctly from withdraw event");
      return new Promise((resolve, reject) => {
        web3.eth.getBalance(receiver1, (err, balance) => {
          if (err) reject(err)
          else resolve(balance)
        });
      });
    })
    .then(balance => {
      balanceNow = parseInt(balance.valueOf());
      gasConsumed = (gasUsed * gasPrice);
      sendAmount = (parseInt(amount) / 2);
      //console.log(balanceNow - (balanceBefore + (parseInt(amount) / 2) - (allGasUsed*gasPrice)));
      console.log("Now:    " + balanceNow + "\n" +
        "Before: " + balanceBefore + "\n" +
          "Gas: " + gasConsumed + "\n" +
            "Amount: " + sendAmount + "\n" +
              "Amount minus Gas: " + (sendAmount - gasConsumed) + "\n" +
                "Balance Diff: " + (balanceNow - balanceBefore) + "\n" +
                  "Leftover: " + ((sendAmount - gasConsumed) - (balanceNow - balanceBefore)));
      //assert.equal(balanceNow, (balanceBefore + (sendAmount - gasConsumed)), "Receiver1's balance did not return correctly");
    });

    //end tests
  });
