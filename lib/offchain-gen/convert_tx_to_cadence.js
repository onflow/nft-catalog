const fcl = require('@onflow/fcl')
const fs = require('fs')
const config = fcl.config()

const json = require('../CadenceToJson.json')

const network = process.argv[2] === 'mainnet' ? 'mainnet' : 'testnet'
const collectionIdentifier = process.argv[3]

const files = [
  //"./lib/tx/StorefrontBuyItemTemplate.cdc",
  __dirname + "../tx/NFTInitTemplate.cdc",
  __dirname + "../tx/StorefrontListItemTemplate.cdc"
]


const accessNode = network === 'mainnet' ? 'https://rest-mainnet.onflow.org' : 'https://rest-testnet.onflow.org'
config.put("accessNode.api", accessNode)
for (let contractName in json.vars[network]) {
  config.put(contractName, json.vars[network][contractName])
}

const makeTransaction = async () => {
  
  console.log('json is', json)
}

makeTransaction()