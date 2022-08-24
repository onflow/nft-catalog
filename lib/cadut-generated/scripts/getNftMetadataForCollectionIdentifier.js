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

pub fun main(collectionIdentifier: String): NFTCatalog.NFTCatalogMetadata? {
    return NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)
}
`;

/**
* Method to generate cadence code for getNftMetadataForCollectionIdentifier script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getNftMetadataForCollectionIdentifierTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getNftMetadataForCollectionIdentifier =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getNftMetadataForCollectionIdentifier = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getNftMetadataForCollectionIdentifierTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `getNftMetadataForCollectionIdentifier =>`);

  return executeScript({code, processed: true, ...props})
}