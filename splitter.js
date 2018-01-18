//Splitter Test File
var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

  var owner = accounts[0];
  var aliceAddy = accounts[1];
  var bobAddy = accounts[2];
  var carolAddy = accounts[3];

  var contractInstance;
  var amount = 1000;
  var aliceBalance;
  var bobBalance;
  var carolBalance;

  beforeEach(function() {
    return Splitter.new(aliceAddy, bobAddy, carolAddy, { from: owner })
    .then(function(instance) {
      contractInstance = instance;
      web3.eth.sendTransaction({ from: owner, to: contractInstance.address,
      value: amount});
      aliceBalance = web3.eth.getBalance(aliceAddy);
      bobBalance = web3.eth.getBalance(bobAddy);
      carolBalance = web3.eth.getBalance(carolAddy);
    });
  });

/*
  beforeEach(function() {
    return web3.fromWei(web3.eth.getBalance(aliceAddy), "ether")
    .then(function(result) {
      balance = result;
    });
  });
*/

  //test owner
  it("should be owned by owner", function() {
    return contractInstance.owner({from: owner})
    .then(function(_owner) {
      assert.strictEqual(_owner, owner, "Contract is not owned by owner");
    });
  });

  it("should pass Alice's address to alice", function() {
    return contractInstance.alice({from: owner})
    .then(function(_alice) {
      assert.strictEqual(_alice, aliceAddy, "Contract did not pass Alice's address");
    });
  });

  it("should pass Bob's address to bob", function() {
    return contractInstance.bob({from: owner})
    .then(function(_bob) {
      assert.strictEqual(_bob, bobAddy, "Contract did not pass Bob's address");
    });
  });

  it("should pass Carol's address to carol", function() {
    return contractInstance.carol({from: owner})
    .then(function(_carol) {
      assert.strictEqual(_carol, carolAddy, "Contract did not pass Carol's address");
    });
  });

  //test getBalance
  it("should get a contract Balance of 1000 wei", function() {
    return contractInstance.getBalance({from: owner})
    .then(function(balance) {
      assert.equal(balance[1],amount, "Contract balance is not correct");
    });
  });

  //test getBalanceAlice()
  it("Should get the correct balance of Alice's address", function() {
    var aliceContractBalance;
    return contractInstance.getBalanceAlice({from: owner})
    .then(function(result) {
      //aliceContractBalance = result.toNumber();
      assert.equal(result[1].toString(10), aliceBalance.toString(10), "Alice's balance doesn't match");
    });
  });

  //test getBalanceBob()
  it("Should get the correct balance of Bob's address", function() {
    var bobContractBalance;
    return contractInstance.getBalanceBob({from: owner})
    .then(function(result) {
      assert.equal(result[1].toString(10), bobBalance.toString(10), "Bob's balance doesn't match");
    });
  });

  //test getBalanceCarol()
  it("Should get the correct balance of Carol's address", function() {
    var carolContractBalance;
    return contractInstance.getBalanceCarol({from: owner})
    .then(function(result) {
      assert.equal(result[1].toString(10), carolBalance.toString(10), "Carol's balance doesn't match");
    });
  });

  it("should split Alice's transaction amount", function() {

    var bobFinalBalance;
    var carolFinalBalance;
    var bobPlusAmt
    var carolPlusAmt

    bobPlusAmt = bobBalance.toNumber() + amount / 2;
    carolPlusAmt = carolBalance.toNumber() + amount / 2;

    return contractInstance.split({from: aliceAddy, value: amount})
      .then(function() {
        return contractInstance.getBalanceBob({from: owner})
          .then(function(_balance) {
            bobFinalBalance = _balance[1].toString(10);
              return contractInstance.getBalanceCarol({from: owner})
                .then(function(_balance) {
                carolFinalBalance = _balance[1].toString(10);

                assert.equal(bobFinalBalance, bobPlusAmt, "Bob's balance didn't work");
                assert.equal(carolFinalBalance, carolPlusAmt, "Carol's balance didn't work");
              });
          });
        });
      });

});

