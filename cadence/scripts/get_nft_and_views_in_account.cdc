import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub struct NFTCollectionData {
    pub let storagePath: StoragePath
    pub let publicPath: PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type

    init(
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType: Type,
        privateLinkedType: Type,
    ) {
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
    }
}

pub struct NFT {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    pub let externalURL: String
    pub let storagePath: StoragePath
    pub let publicPath: PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String
    pub let collectionExternalURL: String
    pub let allViews:  {String: AnyStruct}?
    pub let royalties: [MetadataViews.Royalty]

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String,
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType: Type,
        privateLinkedType: Type,
        collectionName: String,
        collectionDescription: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
        collectionExternalURL: String,
        allViews: {String: AnyStruct}?,
        royalties: [MetadataViews.Royalty]
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
        self.collectionExternalURL = collectionExternalURL
        self.allViews = allViews
        self.royalties = royalties
    }
}

 pub fun getAllMetadataViewsFromCap(tokenID: UInt64, collectionIdentifier: String, collectionCap: Capability<&AnyResource{MetadataViews.ResolverCollection}>): {String: AnyStruct} {
    pre {
        NFTCatalog.getCatalog()[collectionIdentifier] != nil : "Invalid collection identifier"
    }

    let catalog = NFTCatalog.getCatalog()
    let items: {String: AnyStruct} = {}
    let value = catalog[collectionIdentifier]!

    // Check if we have multiple collections for the NFT type...
    let hasMultipleCollections = false

    if collectionCap.check() {
        let collectionRef = collectionCap.borrow()!

        let nftResolver = collectionRef.borrowViewResolver(id: tokenID)
        let supportedNftViewTypes = nftResolver.getViews()

        for supportedViewType in supportedNftViewTypes {
            if let view = nftResolver.resolveView(supportedViewType) {
                if !hasMultipleCollections {
                    items.insert(key: supportedViewType.identifier, view)
                } else if MetadataViews.getDisplay(nftResolver)!.name == value.collectionDisplay.name {
                    items.insert(key: supportedViewType.identifier, view)
                }
            }
        }

    }

    return items
}

pub fun main(ownerAddress: Address, collectionIdentifier: String, tokenID: UInt64) : NFT? {
    let catalog = NFTCatalog.getCatalog()

    assert(catalog.containsKey(collectionIdentifier), message: "Invalid Collection")

    let account = getAuthAccount(ownerAddress)

    let value = catalog[collectionIdentifier]!
    let identifierHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
    let tempPathStr = "catalog".concat(identifierHash)
    let tempPublicPath = PublicPath(identifier: tempPathStr)!

    account.link<&{MetadataViews.ResolverCollection}>(
        tempPublicPath,
        target: value.collectionData.storagePath
    )

    let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
    assert(collectionCap.check(), message: "MetadataViews Collection is not set up properly, ensure the Capability was created/linked correctly.")

    let allViews = getAllMetadataViewsFromCap(tokenID: tokenID, collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)
    let nftCollectionDisplayView = allViews[Type<MetadataViews.NFTCollectionData>().identifier] as! MetadataViews.NFTCollectionData?
    let collectionDataView = NFTCollectionData(
        storagePath: nftCollectionDisplayView!.storagePath,
        publicPath: nftCollectionDisplayView!.publicPath,
        privatePath: nftCollectionDisplayView!.providerPath,
        publicLinkedType: nftCollectionDisplayView!.publicLinkedType,
        privateLinkedType: nftCollectionDisplayView!.providerLinkedType,
    )

    allViews.insert(key: Type<MetadataViews.NFTCollectionData>().identifier, collectionDataView)

    let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)

    for view in views {
        if view.id == tokenID {
            let displayView = view.display
            let externalURLView = view.externalURL
            let collectionDataView = view.collectionData
            let collectionDisplayView = view.collectionDisplay
            let royaltyView = view.royalties

            if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                // Bad NFT. Skipping....
                return nil
            }

            return NFT(
                id: view.id,
                name: displayView!.name,
                description: displayView!.description,
                thumbnail: displayView!.thumbnail.uri(),
                externalURL: externalURLView!.url,
                storagePath: collectionDataView!.storagePath,
                publicPath: collectionDataView!.publicPath,
                privatePath: collectionDataView!.providerPath,
                publicLinkedType: collectionDataView!.publicLinkedType,
                privateLinkedType: collectionDataView!.providerLinkedType,
                collectionName: collectionDisplayView!.name,
                collectionDescription: collectionDisplayView!.description,
                collectionSquareImage: collectionDisplayView!.squareImage.file.uri(),
                collectionBannerImage: collectionDisplayView!.bannerImage.file.uri(),
                collectionExternalURL: collectionDisplayView!.externalURL.url,
                allViews: allViews,
                royalties: royaltyView!.getRoyalties()
            )
        }
    }

    panic("Invalid Token ID")
}
