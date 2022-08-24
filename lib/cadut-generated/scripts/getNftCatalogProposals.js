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

pub fun main(): {UInt64 : NFTCatalog.NFTCatalogProposal} {
    return NFTCatalog.getCatalogProposals()
}
`;

/**
* Method to generate cadence code for getNftCatalogProposals script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getNftCatalogProposalsTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getNftCatalogProposals =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getNftCatalogProposals = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getNftCatalogProposalsTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `getNftCatalogProposals =>`);

  return executeScript({code, processed: true, ...props})
}