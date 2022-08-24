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

pub fun main(proposalID: UInt64): NFTCatalog.NFTCatalogProposal? {
    return NFTCatalog.getCatalogProposalEntry(proposalID: proposalID)
}
`;

/**
* Method to generate cadence code for getNftProposalForId script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getNftProposalForIdTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getNftProposalForId =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getNftProposalForId = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getNftProposalForIdTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `getNftProposalForId =>`);

  return executeScript({code, processed: true, ...props})
}