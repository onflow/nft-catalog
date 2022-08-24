/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '@onflow/flow-cadut'

export const CODE = `
import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): {String : NFTCatalog.NFTCatalogMetadata} {
    return NFTCatalog.getCatalog()
}
`;

/**
* Method to generate cadence code for getNftCatalog script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getNftCatalogTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getNftCatalog =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getNftCatalog = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getNftCatalogTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `getNftCatalog =>`);

  return executeScript({code, processed: true, ...props})
}