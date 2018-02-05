//Splitter Test File
var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

  var owner = accounts[0];
  var aliceAddy = accounts[1];
  var bobAddy = accounts[2];
  var carolAddy = accounts[3];

  var amount = 1000;

  beforeEach(function() {
    return Splitter.new({ from: owner })
    .then(function(instance) {
      contractInstance = instance;

    });
  });

  //test owner
  it("Should be owned by owner", function() {
    return contractInstance.owner({from: owner})
    .then(function(_owner) {
      assert.equal(_owner.toString(10), owner.toString(10), "Contract is not owned by owner");
    });
  });

  //members should be set
  it("Should have set members", function() {
    return contractInstance.setMembers(aliceAddy, bobAddy, carolAddy, {from: owner});
    assert.equal(contractInstance.aliceAddy.valueOf(), aliceAddy, "Alice's address did not get set");
    assert.equal(contractInstance.bobAddy.valueOf(), bobAddy, "Bob's address did not get set");
    assert.equal(contractInstance.carolAddy.valueOf(), carolAddy, "Carol did not get set");
  });

  //test split
  it("Should split an amount sent by Alice", function() {
    return contractInstance.setMembers(aliceAddy, bobAddy, carolAddy, {from: owner});
    return contractInstance.split({from: aliceAddy, value: amount})
    .then(function(_result) {
      assert.isTrue(_result, "Split() did not return true");
      assert.isTrue(contractInstance.hasSplit, "hasSplit did not get set to true");
      assert.equal(contractInstance.bobFunds.amount, amount / 2, "Bob's funds did not get set to half the amount");
      assert.equal(contractInstance.carolFunds.amount, amount / 2, "Carols's funds did not get set to half the amount");
    })
  });

  //test withdraw function for Bob
  it("Should withdraw Bob's funds from contract", function() {
    var bobBalanceBefore;
    var bobBalanceNow;
    bobBalanceBefore = bobAddy.balance;

    return contractInstance.setMembers(aliceAddy, bobAddy, carolAddy, {from: owner});
    return contractInstance.split({from: aliceAddy, value: amount});
    return contractInstance.withdrawBob({from: bobAddy})
    .then(function(_result) {
      bobBalanceNow = bobAddy.balance;
      assert.isTrue(_result, "withdraw did not return true");
      assert.isTrue(contractInstance.bobFunds.sent, "Bob's sent param did not get set to true");
      assert.equal(bobBalanceNow, bobBalanceBefore + amount / 2, "Bob's balance is not correct");
    });
    return contractInstance.getBalance.call({from: owner})
    .then(function(_return) {
      assert.equal(_return, amount / 2, "Contract balance is not half the initial amount");
    });
  });

  //test withdraw functions
  it("Should withdraw funds from contract", function() {
    var carolBalanceBefore;
    var carolBalanceNow;
    carolBalanceBefore = carolAddy.balance;

    return contractInstance.setMembers(aliceAddy, bobAddy, carolAddy, {from: owner});
    return contractInstance.split({from: aliceAddy, value: amount});
    return contractInstance.withdrawCarol({from: carolAddy})
    .then(function(_result) {
      carolBalanceNow = carolAddy.balance;
      assert.isTrue(_result, "withdraw did not return true");
      assert.isTrue(contractInstance.carolFunds.sent, "Carol's sent param did not get set to true");
      assert.equal(carolBalanceNow, carolBalanceBefore + amount / 2, "Carol's balance is not correct");
    });
    return contractInstance.getBalance.call({from: owner})
    .then(function(_return) {
      assert.equal(_return, amount / 2, "Contract balance is not half the initial amount");
    });
  });

});
