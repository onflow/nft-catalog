/** pragma type transaction **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  sendTransaction
} from '@onflow/flow-cadut'

export const CODE = `
import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(
    collectionIdentifier : String,
    contractName: String,
    contractAddress: Address,
    nftTypeIdentifer: String,
    addressWithNFT: Address,
    nftID: UInt64,
    publicPathIdentifier: String
) {
    
    let adminResource: &NFTCatalogAdmin.Admin
    
    prepare(acct: AuthAccount) {
        self.adminResource = acct.borrow<&NFTCatalogAdmin.Admin>(from: NFTCatalogAdmin.AdminStoragePath)!
    }
    
    execute {
        let nftAccount = getAccount(addressWithNFT)
        let pubPath = PublicPath(identifier: publicPathIdentifier)!
        let collectionCap = nftAccount.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(pubPath)
        assert(collectionCap.check(), message: "MetadataViews Collection is not set up properly, ensure the Capability was created/linked correctly.")
        let collectionRef = collectionCap.borrow()!
        assert(collectionRef.getIDs().length > 0, message: "No NFTs exist in this collection.")
        let nftResolver = collectionRef.borrowViewResolver(id: nftID)
        
        let metadataCollectionData = nftResolver.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData
        
        let collectionData = NFTCatalog.NFTCollectionData(
            storagePath: metadataCollectionData.storagePath,
            publicPath: metadataCollectionData.publicPath,
            privatePath: metadataCollectionData.providerPath,
            publicLinkedType : metadataCollectionData.publicLinkedType,
            privateLinkedType : metadataCollectionData.providerLinkedType
        )

        let collectionDisplay = nftResolver.resolveView(Type<MetadataViews.NFTCollectionDisplay>())! as! MetadataViews.NFTCollectionDisplay

        let catalogData = NFTCatalog.NFTCatalogMetadata(
            contractName: contractName,
            contractAddress: contractAddress,
            nftType: CompositeType(nftTypeIdentifer)!,
            collectionData: collectionData,
            collectionDisplay : collectionDisplay
        )

        self.adminResource.addCatalogEntry(collectionIdentifier : collectionIdentifier, metadata : catalogData)
    }
}
`;

/**
* Method to generate cadence code for addToNftCatalogAdmin transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const addToNftCatalogAdminTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `addToNftCatalogAdmin =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends addToNftCatalogAdmin transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const addToNftCatalogAdmin = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await addToNftCatalogAdminTemplate(addressMap);

  reportMissing("arguments", args.length, 7, `addToNftCatalogAdmin =>`);
  reportMissing("signers", signers.length, 1, `addToNftCatalogAdmin =>`);

  return sendTransaction({code, processed: true, ...props})
}