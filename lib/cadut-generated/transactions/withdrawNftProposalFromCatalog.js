/** pragma type transaction **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  sendTransaction
} from '@onflow/flow-cadut'

export const CODE = `
import NFTCatalog from "../contracts/NFTCatalog.cdc"

transaction(
    proposalID : UInt64
) {
    let nftCatalogProposalResourceRef : &NFTCatalog.NFTCatalogProposalManager

    prepare(acct: AuthAccount) {
        self.nftCatalogProposalResourceRef = acct.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath)!
    }

    execute {
        let proposal = NFTCatalog.getCatalogProposalEntry(proposalID: proposalID)!
        
        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : proposal.collectionIdentifier)
        NFTCatalog.withdrawNFTProposal(proposalID : proposalID)
        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : nil)
    }
}
`;

/**
* Method to generate cadence code for withdrawNftProposalFromCatalog transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const withdrawNftProposalFromCatalogTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `withdrawNftProposalFromCatalog =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends withdrawNftProposalFromCatalog transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const withdrawNftProposalFromCatalog = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await withdrawNftProposalFromCatalogTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `withdrawNftProposalFromCatalog =>`);
  reportMissing("signers", signers.length, 1, `withdrawNftProposalFromCatalog =>`);

  return sendTransaction({code, processed: true, ...props})
}