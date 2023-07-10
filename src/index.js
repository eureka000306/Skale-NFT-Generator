import express from 'express';
// import { Web3 } from 'web3';
// import * as Provider from '@truffle/hdwallet-provider';
import * as IPFS from 'ipfs-core';
import fs from 'fs'

// import contract from './utils/contract.json' assert {type: 'json'}

var app = express();
var port = process.env.PORT || 5000;

// var SmartContractAddress = contract.contract_address;
// var SmartContractABI = contract.contract_abi;
// var privatekey = "6fbabdcce2b6dfc0cebb8924d7b1fe394654892413de26c3d2ea2494e46e480a";
// var rpcurl = "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix";

const imagesDir = './src/images'
const gateway = 'ipfs://'

const files = fs.readdirSync(imagesDir)

const ipfs = await IPFS.create()

const NumberOfEachImageToMint = 2;

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
    console.log(result);
    
    // var provider = new Provider(privatekey, rpcurl);
    // var web3 = new Web3(provider);
    // var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);

    // try {
    //   var newvalue = await myContract.methods.mint("0xd9Dd83e371e380135B6A39b772f61493DBE9Bb3f", result.path).call();
    //   console.log("newvalue", newvalue);
    // } catch (err) {
    //     console.error('error:', err);
    // }

  }
}

app.listen(port);
console.log('listening on', port);