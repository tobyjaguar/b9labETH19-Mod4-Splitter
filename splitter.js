//Splitter Test File
var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

  var owner = accounts[0];
  var sender = accounts[0];
  var receiver1 = accounts[1];
  var receiver2 = accounts[2];

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
  it("Should have set members", function() {

    return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount})
    .then(result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.splitters.call(receiver1, {from: owner});
    })
    .then(result => {
      //console.log("splitters: " + result[0] + "\n" + result[1]);
      assert.equal(result[0], owner, "splitters did not return sender correctly");
      assert.equal(result[1], amount / 2, "splitters did not return amount correctly");
      return contractInstance.splitters.call(receiver2, {from: owner});
    })
    .then(result => {
      assert.equal(result[0], owner, "splitters did not return sender correctly");
      assert.equal(result[1], amount / 2, "splitters did not return amount correctly");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(result => {
      assert.equal(result[1].valueOf(), amount, "contract balance did not return correctly");
    });
  });

  //test withdraw function
  it("Should withdraw recipient's funds from contract", function() {
    var balanceBefore;
    var balanceNow;

    return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: amount})
    .then(result => {
      assert.equal(result.receipt.status, true, "splitMembers did not return true");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(result => {
      balanceBefore = parseInt(result[1].valueOf());
      return contractInstance.requestWithdraw({from: receiver1});
    })
    .then(result => {
      //console.log(JSON.stringify(result, null, 4));
      //console.log("withdraw event: " + result.logs[0].args.amount);
      assert.equal(result.receipt.status, true, "withdraw did not return true");
      assert.equal(result.logs[0].args.eRecipient, receiver1, "Recipient's address did not emit correctly from withdraw event");
      assert.equal(result.logs[0].args.eSender, owner, "Owner's address did not emit correctly from withdraw event");
      assert.equal(result.logs[0].args.eAmount, amount / 2, "Recipient's amount did not emit correctly from withdraw event");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(result => {
      //console.log(JSON.stringify(result, null, 4));
      balanceNow = parseInt(result[1].valueOf());
      assert.equal(balanceNow, balanceBefore - (amount / 2), "Recipient's balance did not reconcile correctly");
      return contractInstance.requestWithdraw({from: receiver2});
    })
    .then(result => {
      assert.equal(result.receipt.status, true, "withdraw did not return true");
      return contractInstance.getBalance.call({from: owner});
    })
    .then(result => {
      assert.equal(result[1].valueOf(), 0, "contract balance did not return a zero balance");
    });
    //end test
  });

//end tests
});
