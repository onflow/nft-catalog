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

transaction(
    collectionIdentifier : String,
    contractName: String,
    contractAddress: Address,
    nftTypeIdentifer: String,
    storagePathIdentifier: String,
    publicPathIdentifier: String,
    privatePathIdentifier: String,
    publicLinkedTypeIdentifier : String,
    publicLinkedTypeRestrictions : [String],
    privateLinkedTypeIdentifier : String,
    privateLinkedTypeRestrictions : [String],
    collectionName : String,
    collectionDescription: String,
    externalURL : String,
    squareImageMediaURL : String,
    squareImageMediaType : String,
    bannerImageMediaURL : String,
    bannerImageMediaType : String,
    socials: {String : String},
    message: String
) {

    let nftCatalogProposalResourceRef : &NFTCatalog.NFTCatalogProposalManager
    
    prepare(acct: AuthAccount) {
        
        if acct.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath) == nil {
             let proposalManager <- NFTCatalog.createNFTCatalogProposalManager()
             acct.save(<-proposalManager, to: NFTCatalog.ProposalManagerStoragePath)
             acct.link<&NFTCatalog.NFTCatalogProposalManager{NFTCatalog.NFTCatalogProposalManagerPublic}>(NFTCatalog.ProposalManagerPublicPath, target: NFTCatalog.ProposalManagerStoragePath)
        }

        self.nftCatalogProposalResourceRef = acct.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath)!
    }
    
    execute {
        var privateLinkedType: Type? = nil
        if (privateLinkedTypeRestrictions.length == 0) {
            privateLinkedType = CompositeType(publicLinkedTypeIdentifier)
        } else {
            privateLinkedType = RestrictedType(identifier : privateLinkedTypeIdentifier, restrictions: privateLinkedTypeRestrictions)
        }
        
        let collectionData = NFTCatalog.NFTCollectionData(
            storagePath: StoragePath(identifier: storagePathIdentifier)!,
            publicPath: PublicPath(identifier : publicPathIdentifier)!,
            privatePath: PrivatePath(identifier: privatePathIdentifier)!,
            publicLinkedType : RestrictedType(identifier : publicLinkedTypeIdentifier, restrictions: publicLinkedTypeRestrictions)!,
            privateLinkedType : privateLinkedType!
        )

        let squareMedia = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: squareImageMediaURL
                        ),
                        mediaType: squareImageMediaType
                    )
        
        let bannerMedia = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: bannerImageMediaURL
                        ),
                        mediaType: bannerImageMediaType
                    )

        let socialsStruct : {String : MetadataViews.ExternalURL} = {}
        for key in socials.keys {
            socialsStruct[key] =  MetadataViews.ExternalURL(socials[key]!)
        }
        
        let collectionDisplay = MetadataViews.NFTCollectionDisplay(
            name: collectionName,
            description: collectionDescription,
            externalURL: MetadataViews.ExternalURL(externalURL),
            squareImage: squareMedia,
            bannerImage: bannerMedia,
            socials: socialsStruct
        )

        let catalogData = NFTCatalog.NFTCatalogMetadata(
            contractName: contractName,
            contractAddress: contractAddress,
            nftType: CompositeType(nftTypeIdentifer)!,
            collectionData: collectionData,
            collectionDisplay : collectionDisplay
        )

        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : collectionIdentifier)

        NFTCatalog.proposeNFTMetadata(collectionIdentifier : collectionIdentifier, metadata : catalogData, message: message, proposer: self.nftCatalogProposalResourceRef.owner!.address)

        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : nil)
    }
}
`;

/**
* Method to generate cadence code for proposeNftToCatalog transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const proposeNftToCatalogTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `proposeNftToCatalog =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends proposeNftToCatalog transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const proposeNftToCatalog = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await proposeNftToCatalogTemplate(addressMap);

  reportMissing("arguments", args.length, 20, `proposeNftToCatalog =>`);
  reportMissing("signers", signers.length, 1, `proposeNftToCatalog =>`);

  return sendTransaction({code, processed: true, ...props})
}