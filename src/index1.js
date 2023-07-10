var express = require('express');
var { Web3 } = require('web3');
const Provider = require('@truffle/hdwallet-provider');

var contract = require('./utils/contract.json')

var app = express();
var port = process.env.PORT || 5000;

var SmartContractAddress = contract.contract_address;
var SmartContractABI = contract.contract_abi;
var privatekey = "6fbabdcce2b6dfc0cebb8924d7b1fe394654892413de26c3d2ea2494e46e480a";
var rpcurl = "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix";

const sendData = async () => {

  console.log("in function");
  var provider = new Provider(privatekey, rpcurl);
  var web3 = new Web3(provider);
  var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);
  var newValue = await myContract.methods.multiply(10, 20).call();
  console.log("newValue", newValue);

}

sendData();

app.listen(port);
console.log('listening on', port);
