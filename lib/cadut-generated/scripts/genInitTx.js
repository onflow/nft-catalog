/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '@onflow/flow-cadut'

export const CODE = `
import TransactionGenerationUtils from "../contracts/TransactionGenerationUtils.cdc"

pub fun main(collectionIdentifier: String) : String {
    return TransactionGenerationUtils.createCollectionInitializationTx(collectionIdentifier: collectionIdentifier)!
}

`;

/**
* Method to generate cadence code for genInitTx script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const genInitTxTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `genInitTx =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const genInitTx = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await genInitTxTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `genInitTx =>`);

  return executeScript({code, processed: true, ...props})
}