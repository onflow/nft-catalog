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

pub fun main(nftTypeIdentifer: String): {String : Bool}? {
    return NFTCatalog.getCollectionsForType(nftTypeIdentifier: CompositeType(nftTypeIdentifer)!.identifier)
}
`;

/**
* Method to generate cadence code for getNftCollectionsForNftType script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getNftCollectionsForNftTypeTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getNftCollectionsForNftType =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getNftCollectionsForNftType = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getNftCollectionsForNftTypeTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `getNftCollectionsForNftType =>`);

  return executeScript({code, processed: true, ...props})
}