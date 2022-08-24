/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '@onflow/flow-cadut'

export const CODE = `
import TransactionGeneration from "../contracts/TransactionGeneration.cdc"

pub fun main(tx: String, collectionIdentifier: String) : String {
    return TransactionGeneration.getTx(tx: tx, params: {
        "collectionIdentifier": collectionIdentifier,
        "vaultIdentifier": "flow"
    })!
}

`;

/**
* Method to generate cadence code for genTx script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const genTxTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `genTx =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const genTx = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await genTxTemplate(addressMap);

  reportMissing("arguments", args.length, 2, `genTx =>`);

  return executeScript({code, processed: true, ...props})
}