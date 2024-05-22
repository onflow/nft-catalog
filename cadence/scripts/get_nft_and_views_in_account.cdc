import "MetadataViews"
import "NFTCatalog"
import "NFTRetrieval"
import "ViewResolver"

access(all) struct NFTCollectionData {
    access(all) let storagePath: StoragePath
    access(all) let publicPath: PublicPath
    access(all) let privatePath: PrivatePath
    access(all) let publicLinkedType: Type
    access(all) let privateLinkedType: Type

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

access(all) struct NFT {
    access(all) let id: UInt64
    access(all) let name: String
    access(all) let description: String
    access(all) let thumbnail: String
    access(all) let externalURL: String
    access(all) let storagePath: StoragePath
    access(all) let publicPath: PublicPath
    access(all) let privatePath: PrivatePath
    access(all) let publicLinkedType: Type
    access(all) let privateLinkedType: Type
    access(all) let collectionName: String
    access(all) let collectionDescription: String
    access(all) let collectionSquareImage: String
    access(all) let collectionBannerImage: String
    access(all) let collectionExternalURL: String
    access(all) let allViews:  {String: AnyStruct}?
    access(all) let royalties: [MetadataViews.Royalty]

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

 access(all) fun getAllMetadataViewsFromCap(tokenID: UInt64, collectionIdentifier: String, collectionCap: Capability<&{ViewResolver.ResolverCollection}>): {String: AnyStruct} {
   pre {
        NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) != nil : "Invalid collection identifier"
    }

    let items: {String: AnyStruct} = {}
    let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!

    // Check if we have multiple collections for the NFT type...
    let hasMultipleCollections = false

    let collectionRef = collectionCap.borrow()!

    let nftResolver = collectionRef.borrowViewResolver(id: tokenID)

    if nftResolver != nil {

        let supportedNftViewTypes = nftResolver!.getViews()

        for supportedViewType in supportedNftViewTypes {
            if let view = nftResolver!.resolveView(supportedViewType) {
                if !hasMultipleCollections {
                    items.insert(key: supportedViewType.identifier, view)
                } else if MetadataViews.getDisplay(nftResolver!)!.name == value.collectionDisplay.name {
                    items.insert(key: supportedViewType.identifier, view)
                }
            }
        }

    }

    return items
}

access(all) fun main(ownerAddress: Address, collectionIdentifier: String, tokenID: UInt64) : NFT? {
    pre {
        NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) != nil : "Invalid collection identifier"
    }

    let account = getAuthAccount<auth(Storage,BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account>(ownerAddress)

    let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
    let identifierHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
    let tempPathStr = "catalog".concat(identifierHash)
    let tempPublicPath = PublicPath(identifier: tempPathStr)!

    let collectionCap = account.capabilities.storage.issue<&{ViewResolver.ResolverCollection}>(value.collectionData.storagePath)
    account.capabilities.publish(collectionCap, at: tempPublicPath)

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

    let views = NFTRetrieval.getNFTViewsFromIDs(collectionIdentifier: collectionIdentifier, ids: [tokenID], collectionCap: collectionCap)

    if views.length == 0 {
        panic("Invalid Token ID")
    }

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