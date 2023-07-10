import express from 'express';
import { Web3 } from 'web3';
import * as Provider from '@truffle/hdwallet-provider';
import * as IPFS from 'ipfs-core';
import fs from 'fs'

var app = express();
var port = process.env.PORT || 5000;

import { contract_address, contract_abi } from './utils/contract.json'
var SmartContractAddress = contract_address;
var SmartContractABI = contract_abi;
var privatekey = "6fbabdcce2b6dfc0cebb8924d7b1fe394654892413de26c3d2ea2494e46e480a";
var rpcurl = "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix";

// const sendData = async () => {

//   console.log("in function");
//   var provider = new Provider(privatekey, rpcurl);
//   var web3 = new Web3(provider);
//   var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);

//   try {
//   var newvalue = await myContract.methods.multiply(20, 30).call();
//   console.log("newvalue", newvalue);
// } catch (err) {
//     console.error('error:', err);
// }

//   console.log("done with all things");

// }

// sendData();

const imagesDir = './src/images'
const gateway = 'ipfs://'

const files = fs.readdirSync(imagesDir)

const ipfs = await IPFS.create()

const NumberOfEachImageToMint = 2;
    
var provider = new Provider(privatekey, rpcurl);
var web3 = new Web3(provider);
var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);

for(let file of files) {
  for(let idx = 0; idx < NumberOfEachImageToMint; idx++){
    const buffer = fs.readFileSync(`${imagesDir}/${file}`)
    let result = await ipfs.add(buffer)

    const metadata = {};
    metadata.attributes = [];
    metadata.attributes.push({"trait_type": "Background Color", "value": file.split('.')[0].split('-')[2]})
    metadata.image = gateway + result.path;
    metadata.description = file.split('.')[0];
    metadata.name = file.split('.')[0];
    result = await ipfs.add(JSON.stringify(metadata))

    try {
      var newvalue = await myContract.methods.mint("0xd9Dd83e371e380135B6A39b772f61493DBE9Bb3f", result.path).call();
      console.log("newvalue", newvalue);
    } catch (err) {
        console.error('error:', err);
    }

  }
}

// const uploadIPFS = async () => {

// }

app.listen(port);
console.log('listening on', port);

// {
//   "attributes": [
//     {
//       "trait_type": "Breed",
//       "value": "Maltipoo"
//     },
//     {
//       "trait_type": "Eye color",
//       "value": "Mocha"
//     }
//   ],
//   "description": "The world's most adorable and sensitive pup.",
//   "image": "ipfs://QmWmvTJmJU3pozR9ZHFmQC2DNDwi2XJtf3QGyYiiagFSWb",
//   "name": "Ramses"
// }