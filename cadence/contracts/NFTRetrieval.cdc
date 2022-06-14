import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"

// NFTRetrieval
//
// A helper contract to get NFT's in a users account
// leveraging the NFTCatalog Smart Contract

pub contract NFTRetrieval {

    pub struct BaseNFTViewsV1 {
        pub let id: UInt64
        pub let display: MetadataViews.Display?
        pub let externalURL: MetadataViews.ExternalURL?
        pub let collectionData: MetadataViews.NFTCollectionData?
        pub let collectionDisplay: MetadataViews.NFTCollectionDisplay?
        pub let royalties: MetadataViews.Royalties?

        init(
            id : UInt64,
            display : MetadataViews.Display?,
            externalURL : MetadataViews.ExternalURL?,
            collectionData : MetadataViews.NFTCollectionData?,
            collectionDisplay : MetadataViews.NFTCollectionDisplay?,
            royalties : MetadataViews.Royalties?
        ) {
            self.id = id
            self.display = display
            self.externalURL = externalURL
            self.collectionData = collectionData
            self.collectionDisplay = collectionDisplay
            self.royalties = royalties
        }
    }

    pub fun getRecommendedViewsTypes(version: String) : [Type] {
        switch version {
            case "v1":
                return [
                        Type<MetadataViews.Display>(), 
                        Type<MetadataViews.ExternalURL>(), 
                        Type<MetadataViews.NFTCollectionData>(), 
                        Type<MetadataViews.NFTCollectionDisplay>(),
                        Type<MetadataViews.Royalties>()
                ]
            default:
                panic("Version not supported")
        } 
        return []
    }

    pub fun getNFTs(ownerAddress : Address) : {String : [BaseNFTViewsV1] } {
        let catalog = NFTCatalog.getCatalog()

        let ownedNFTs : { String : [BaseNFTViewsV1] } = {}

        let account = getAccount(ownerAddress)
        
        for key in catalog.keys {
            let items : [BaseNFTViewsV1] = []
            let value = catalog[key]!

            // Check if we have multiple collections for the NFT type...
            let hasMultipleCollections = self.hasMultipleCollections(nftTypeIdentifier : value.nftType.identifier)
            
            // Get users collection
            let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(value.collectionData.publicPath)
            if collectionCap.check() {
                let collectionRef = collectionCap.borrow()!
                for id in collectionRef.getIDs() {
                    let nftResolver = collectionRef.borrowViewResolver(id: id)
                    let nftViews = self.getBasedNFTViewsV1(id: id, nftResolver: nftResolver)
                    if !hasMultipleCollections {
                        items.append(nftViews)
                    } else if nftViews.display!.name == value.collectionDisplay.name {
                        items.append(nftViews)
                    }
                
                }
            }
            ownedNFTs[key] = items
        }

        return ownedNFTs
    }

    access(contract) fun getBasedNFTViewsV1(id : UInt64, nftResolver : &AnyResource{MetadataViews.Resolver}) : BaseNFTViewsV1 {
        return BaseNFTViewsV1(
            id : id,
            display: nftResolver.resolveView(Type<MetadataViews.Display>()) as! MetadataViews.Display?,
            externalURL : nftResolver.resolveView(Type<MetadataViews.ExternalURL>()) as! MetadataViews.ExternalURL?,
            collectionData : nftResolver.resolveView(Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?,
            collectionDisplay : nftResolver.resolveView(Type<MetadataViews.NFTCollectionDisplay>()) as! MetadataViews.NFTCollectionDisplay?,
            royalties : nftResolver.resolveView(Type<MetadataViews.Royalties>()) as! MetadataViews.Royalties?
        )
    }

    access(contract) fun hasMultipleCollections(nftTypeIdentifier : String): Bool {
        let typeCollections = NFTCatalog.getCollectionsForType(nftTypeIdentifier: nftTypeIdentifier)!
        var numberOfCollections = 0
        for identifier in typeCollections.keys {
            let existence = typeCollections[identifier]!
            if existence {
                numberOfCollections = numberOfCollections + 1
            }
            if numberOfCollections > 1 {
                return true
            }
        }
        return false
    }

    init() {}

}