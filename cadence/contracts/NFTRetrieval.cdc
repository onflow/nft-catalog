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

    init(
      id : UInt64,
      display : MetadataViews.Display?,
      externalURL : MetadataViews.ExternalURL?,
      collectionData : MetadataViews.NFTCollectionData?,
      collectionDisplay : MetadataViews.NFTCollectionDisplay?
    ) {
      self.id = id
      self.display = display
      self.externalURL = externalURL
      self.collectionData = collectionData
      self.collectionDisplay = collectionDisplay
    }
  }

  pub fun getRecommendedViewsTypes(version: String) : [Type] {
    switch version {
      case "v1":
        return [
            Type<MetadataViews.Display>(), 
            Type<MetadataViews.ExternalURL>(), 
            Type<MetadataViews.NFTCollectionData>(), 
            Type<MetadataViews.NFTCollectionDisplay>()
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
      // Get users collection
      let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(value.collectionData.publicPath)
      if collectionCap.check() {
        let collectionRef = collectionCap.borrow()!
        for id in collectionRef.getIDs() {
          let nftResolver = collectionRef.borrowViewResolver(id: id)
          let nftViews = self.getBasedNFTViewsV1(id: id, nftResolver: nftResolver)
          items.append(nftViews)
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
      collectionDisplay : nftResolver.resolveView(Type<MetadataViews.NFTCollectionDisplay>()) as! MetadataViews.NFTCollectionDisplay?
    )
  }

  init() {}

}