//Splitter Test File
Promise = require("bluebird");
var Splitter = artifacts.require("./Splitter.sol");

web3.eth.expectedException = require("../utils/expectedException.js");
//const sequentialPromise = require("../utils/sequentialPromise.js");
//web3.eth.makeSureHasAtLeast = require("../utils/makeSureHasAtLeast.js");
//web3.eth.makeSureAreUnlocked = require("../utils/makeSureAreUnlocked.js");
web3.eth.getTransactionReceiptMined = require("../utils/getTransactionReceiptMined.js");

contract('Splitter', function(accounts) {

  var owner = accounts[0];
  var sender2 = accounts[1]
  var receiver1 = accounts[2];
  var receiver2 = accounts[3];
  var receiver3 = accounts[4];

  var amount = web3.toWei(2, "ether");

  beforeEach(function() {
    return Splitter.new({ from: owner })
    .then(function(instance) {
      contractInstance = instance;

    });
  });

  //test owner
  it("Should be owned by owner", function() {
    return contractInstance.owner({from: owner})
    .then(result => {
      assert.equal(result, owner, "Contract is not owned by owner");
    });
  });

  //members should be set
  it("Should be able to split amount amount two members", function() {

    return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount})
    .then(result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.splitAmounts.call(receiver1, {from: owner});
    })
    .then(result => {
      //console.log("splitters: " + result[0] + "\n" + result[1]);
      assert.equal(result, (amount / 2), "splitters did not return amount correctly");
      return contractInstance.splitAmounts.call(receiver2, {from: owner});
    })
    .then(result => {
      assert.equal(result, amount / 2, "splitters did not return amount correctly");
    });
    //end test
  });

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

/*
  //test withdraw function
  it("Should withdraw recipient's funds from contract", function() {
    var gasPrice;
    var allGasUsed;
    var balanceBefore;
    var balanceNow;

    return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount})
    .then(result => {
      console.log(result.receipt.cumulativeGas);
      //allGasUsed += result.receipt.cumulativeGas;
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(result => {
      balanceBefore = parseInt(result.valueOf());
      return contractInstance.requestWithdraw({from: receiver1});
    })
    .then(result => {
      //console.log(JSON.stringify(result, null, 4));
      //console.log("withdraw event: " + result.logs[0].args.amount);
      assert.equal(result.receipt.status, true, "withdraw did not return true");
      assert.equal(result.logs[0].args.eRecipient, receiver1, "Recipient's address did not emit correctly from withdraw event");
      assert.equal(result.logs[0].args.eAmount, amount / 2, "Recipient's amount did not emit correctly from withdraw event");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(result => {
      //console.log(JSON.stringify(result, null, 4));
      balanceNow = parseInt(result.valueOf());
      assert.equal(balanceNow, balanceBefore - (amount / 2), "Recipient's balance did not reconcile correctly");
      return contractInstance.requestWithdraw({from: receiver2});
    })
    .then(result => {
      assert.equal(result.receipt.status, true, "withdraw did not return true");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(result => {
      assert.equal(result.valueOf(), 0, "contract balance did not return a zero balance");
    });
    //end test
  });

  //test utility
  it("Should split multiple members and withdraw multiple members", function() {

    var balanceBefore;
    var balanceNow;
    var balanceReceiver3Before;

    return contractInstance.getBalance.call({from: owner})
    .then(balance => {
      balanceBefore = balance.valueOf();
      return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount});
    })
    .then(result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.requestWithdraw({from: receiver1});
    })
    .then(result => {
      assert.equal(result.receipt.status, true, "withdraw did not return true");
      return contractInstance.splitAmounts.call(receiver1, {from: owner});
    })
    .then(result => {
      assert.equal(result, 0, "Receiver1's balance did not return correctly");
      return new Promise((resolve, reject) => {
        web3.eth.getBalance(receiver3, (err, balance) => {
          if (err) reject(err)
          else resolve(balance)
        });
      });
    })
    .then(balance => {
      balanceReceiver3Before = balance.valueOf();
      return contractInstance.splitMembers(receiver2, receiver3, {from: owner, value: amount});
    })
    .then(result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.splitAmounts.call(receiver2, {from: owner});
    })
    .then(result => {
      assert.equal(result.valueOf(), ((amount / 2) + (amount / 2)), "Receiver2's balance did not return double the amount");
      return contractInstance.requestWithdraw({from: receiver2});
    })
    .then(result => {
      assert.equal(result.logs[0].args.eAmount.valueOf(), ((amount / 2) + (amount / 2)), "Event withdraw did not return correctly");
      return contractInstance.splitAmounts.call(receiver2, {from: owner});
    })
    .then(result => {
      assert.equal(result.valueOf(), 0, "Receiver2's balance did not return zero");
      return contractInstance.requestWithdraw({from: receiver3});
    })
    .then(result => {
      assert.equal(result.logs[0].args.eAmount.valueOf(), (amount / 2), "Event withdraw did not return correctly");
      return contractInstance.splitAmounts.call(receiver3, {from: owner});
    })
    .then(result => {
      assert.equal(result.valueOf(), 0, "Receiver3's balance did not return zero");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(balance => {
      balanceNow = balance.valueOf();
      assert.equal(balanceNow, balanceBefore, "Contract's balance did not return correctly");
      return new Promise((resolve, reject) => {
        web3.eth.getBalance(receiver3, (err, balance) => {
          if (err) reject(err)
          else resolve(balance)
        });
      });
    })
    .then(balance => {
      assert.isTrue(balance.valueOf() > balanceReceiver3Before, "Receiver3's balance did not return correctly");
    });
    //end test
  });

  it("Should not let non-owner stop the contract", function() {

    return web3.eth.expectedException(
      () => contractInstance.runSwitch(0, {from: sender2}),
    3000000);
    //end test
  });

  //test for failed cases
  it("Should not split among members if not running", function() {

    return contractInstance.runSwitch(0, {from: owner})
    .then(result => {
      assert.equal(result.receipt.status, true, "runSwitch did not return true");
      return contractInstance.running.call({from: owner})
    })
    .then(result => {
      assert.isFalse(result, "Running did not return false");
      return web3.eth.expectedException(
        () => contractInstance.splitMembers(receiver1, receiver2, {from: owner}),
        3000000);
    });
    //end test
  });

  it("Should not allow withdrawals when not running", function() {

    return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount})
    .then(result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.runSwitch(0, {from: owner});
    })
    .then(result => {
      assert.equal(result.receipt.status, true, "runSwitch did not return true");
      return web3.eth.expectedException(
        () => contractInstance.requestWithdraw({from: receiver1}),
      3000000);
    });
    //end test
  });
*/
//end tests
});
