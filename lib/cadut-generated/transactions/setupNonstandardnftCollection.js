/** pragma type transaction **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  sendTransaction
} from '@onflow/flow-cadut'

export const CODE = `
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import NonStandardNFT from "../contracts/NonStandardNFT.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"

// This transaction is what an account would run
// to set itself up to receive NFTs

transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&NonStandardNFT.Collection>(from: NonStandardNFT.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- NonStandardNFT.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: NonStandardNFT.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, NonStandardNFT.NonStandardNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            NonStandardNFT.CollectionPublicPath,
            target: NonStandardNFT.CollectionStoragePath
        )
    }
}
`;

/**
* Method to generate cadence code for setupNonstandardnftCollection transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const setupNonstandardnftCollectionTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `setupNonstandardnftCollection =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends setupNonstandardnftCollection transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const setupNonstandardnftCollection = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await setupNonstandardnftCollectionTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `setupNonstandardnftCollection =>`);
  reportMissing("signers", signers.length, 1, `setupNonstandardnftCollection =>`);

  return sendTransaction({code, processed: true, ...props})
}