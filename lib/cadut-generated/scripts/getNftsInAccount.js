/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '@onflow/flow-cadut'

export const CODE = `
import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub struct NFT {
    pub let id : UInt64
    pub let name : String
    pub let description : String
    pub let thumbnail : String
    pub let externalURL : String
    pub let storagePath : StoragePath
    pub let publicPath : PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type
    pub let collectionName : String
    pub let collectionDescription: String
    pub let collectionSquareImage : String
    pub let collectionBannerImage : String
    pub let royalties: [MetadataViews.Royalty]

    init(
            id: UInt64,
            name : String,
            description : String,
            thumbnail : String,
            externalURL : String,
            storagePath : StoragePath,
            publicPath : PublicPath,
            privatePath : PrivatePath,
            publicLinkedType : Type,
            privateLinkedType : Type,
            collectionName : String,
            collectionDescription : String,
            collectionSquareImage : String,
            collectionBannerImage : String,
            royalties : [MetadataViews.Royalty]
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
        self.royalties = royalties
    }
}

pub fun main(ownerAddress: Address, collectionIdentifiers: [String]) : { String : [NFT] }    {
    let catalog = NFTCatalog.getCatalog()
    let account = getAuthAccount(ownerAddress)
    
    let data : {String : [NFT] } = {}

    for collectionIdentifier in collectionIdentifiers {
        if catalog.containsKey(collectionIdentifier) {
            let value = catalog[collectionIdentifier]!
            let tempPathStr = "catalog".concat(collectionIdentifier)
            let tempPublicPath = PublicPath(identifier: tempPathStr)!
            account.link<&{MetadataViews.ResolverCollection}>(
                tempPublicPath,
                target: value.collectionData.storagePath
            )
            
            let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
            if !collectionCap.check() {
                continue
            }
            let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier : collectionIdentifier, collectionCap : collectionCap)
            
            let items : [NFT] = []
            
            for view in views {
                let displayView = view.display
                let externalURLView = view.externalURL
                let collectionDataView = view.collectionData
                let collectionDisplayView = view.collectionDisplay
                let royaltyView = view.royalties
                if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                    // Bad NFT. Skipping....
                    continue
                }

                items.append(
                    NFT(
                        id: view.id,
                        name : displayView!.name,
                        description : displayView!.description,
                        thumbnail : displayView!.thumbnail.uri(),
                        externalURL : externalURLView!.url,
                        storagePath : collectionDataView!.storagePath,
                        publicPath : collectionDataView!.publicPath,
                        privatePath : collectionDataView!.providerPath,
                        publicLinkedType : collectionDataView!.publicLinkedType,
                        privateLinkedType : collectionDataView!.providerLinkedType,
                        collectionName : collectionDisplayView!.name,
                        collectionDescription : collectionDisplayView!.description,
                        collectionSquareImage : collectionDisplayView!.squareImage.file.uri(),
                        collectionBannerImage : collectionDisplayView!.bannerImage.file.uri(),
                        royalties : royaltyView!.getRoyalties()
                    )
                )
            }
            
            data[collectionIdentifier] = items
        }
    }

    return data
}
`;

/**
* Method to generate cadence code for getNftsInAccount script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getNftsInAccountTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getNftsInAccount =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getNftsInAccount = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getNftsInAccountTemplate(addressMap);

  reportMissing("arguments", args.length, 2, `getNftsInAccount =>`);

  return executeScript({code, processed: true, ...props})
}