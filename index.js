import json from  "./lib/CadenceToJson.json" assert { type: "json" };
export {json}

import * as cadence from "./lib/cadut-generated/index.js"

import { setEnvironment, getEnvironment, extendEnvironment } from "@onflow/flow-cadut"

let contractNames = Object.keys(json.vars["testnet"])
for (let index in contractNames) {
  const contractName = contractNames[index]
  extendEnvironment({
    name: contractName.replace('0x', ''),
    "testnet": json.vars["testnet"][contractName],
    "mainnet": json.vars["mainnet"][contractName]
  })
}

const getAddressMaps = async function() {
  const addressMaps = {}
  setEnvironment("mainnet")
  addressMaps["mainnet"] = await getEnvironment();
  setEnvironment("testnet")
  addressMaps["testnet"] = await getEnvironment();
  return addressMaps
}

// This is here just as an example of how to make use of
// the templating transaction code.
const getTemplatedTransactionCode = async function() {
  const catalogAddressMap = await getAddressMaps()
  const result = await cadence.scripts.genTx({
    args: ['CollectionInitialization', 'Flunks', 'flow'],
    addressMap: catalogAddressMap
  })
  return result
}

export { getAddressMaps }
export { cadence }
