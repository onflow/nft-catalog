import MetadataViews from "MetadataViews"
import NFTRetrieval from "NFTRetrieval"
import ViewResolver from "ViewResolver"

access(all) struct DisplayView {
    access(all) let name : String
    access(all) let description : String
    access(all) let thumbnail : String

    init (
        name : String,
        description : String,
        thumbnail : String
    ) {
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
    }
}

access(all) struct ExternalURLView {
    access(all) let externalURL : String

    init (
        externalURL : String
    ) {
        self.externalURL = externalURL
    }
}

access(all) struct NFTCollectionDataView {
    access(all) let storagePath : StoragePath
    access(all) let publicPath : PublicPath
    access(all) let privatePath: PrivatePath
    access(all) let publicLinkedType: Type
    access(all) let privateLinkedType: Type

    init (
        storagePath : StoragePath,
        publicPath : PublicPath,
        privatePath : PrivatePath,
        publicLinkedType : Type,
        privateLinkedType : Type,
    ) {
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
    }
}

access(all) struct NFTCollectionDisplayView {
    access(all) let collectionName : String
    access(all) let collectionDescription: String
    access(all) let collectionSquareImage : MetadataViews.Media
    access(all) let collectionBannerImage : MetadataViews.Media
    access(all) let externalURL : String
    access(all) let socials : {String: MetadataViews.ExternalURL}

    init (
        collectionName : String,
        collectionDescription : String,
        collectionSquareImage : MetadataViews.Media,
        collectionBannerImage : MetadataViews.Media,
        externalURL : String,
        socials : {String: MetadataViews.ExternalURL}
    ) {
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
        self.externalURL = externalURL
        self.socials = socials
    }
}

access(all) struct RoyaltiesView {
    access(all) let royalties: [MetadataViews.Royalty]

    init (
        royalties : [MetadataViews.Royalty]
    ) {
        self.royalties = royalties
    }
}

access(all) struct NFT {
    access(all) let id : UInt64
    access(all) let display : DisplayView?
    access(all) let externalURL : ExternalURLView?
    access(all) let nftCollectionData : NFTCollectionDataView?
    access(all) let nftCollectionDisplay : NFTCollectionDisplayView?
    access(all) let royalties : RoyaltiesView?

    init(
            id: UInt64,
            display : DisplayView?,
            externalURL : ExternalURLView?,
            nftCollectionData : NFTCollectionDataView?,
            nftCollectionDisplay : NFTCollectionDisplayView?,
            royalties : RoyaltiesView?
    ) {
        self.id = id
        self.display = display
        self.externalURL = externalURL
        self.nftCollectionData = nftCollectionData
        self.nftCollectionDisplay = nftCollectionDisplay
        self.royalties = royalties
}

access(all) fun getMapping() : {String : AnyStruct} {
    return {
        "Id" : self.id,
        "Display" : self.display,
        "ExternalURL" : self.externalURL,
        "NFTCollectionData" : self.nftCollectionData,
        "NFTCollectionDisplay" : self.nftCollectionDisplay,
        "Royalties" : self.royalties
    }
}

}

access(all) fun main(ownerAddress: Address, storagePathIdentifier: String): [{String : AnyStruct}]    {
    let owner = getAuthAccount<auth(Storage,BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account>(ownerAddress)
    
    let tempPathStr = "getNFTsInAccountFromPathNFTCatalog"
    let tempPublicPath = PublicPath(identifier: tempPathStr)!

    let collectionCap = owner.capabilities.storage.issue<&{ViewResolver.ResolverCollection}>(StoragePath(identifier : storagePathIdentifier)!)
    owner.capabilities.publish(collectionCap, at: tempPublicPath)

    assert(collectionCap.check(), message: "MetadataViews Collection is not set up properly, ensure the Capability was created/linked correctly.")
    let collection = collectionCap.borrow()!
    assert(collection.getIDs().length > 0, message: "No NFTs exist in this collection, ensure the provided account has at least 1 NFTs.")

    let data : [{String : AnyStruct}] = []

    for nftID in collection.getIDs() {
        data.append(getNFTData(nftID: nftID, collection: collection))
    }

    return data
}


access(all) fun getNFTData(nftID: UInt64, collection: &{ViewResolver.ResolverCollection} ): {String : AnyStruct} {
    let nftResolver = collection.borrowViewResolver(id: nftID)!
    let nftViews = MetadataViews.getNFTView(
        id : nftID,
        viewResolver: nftResolver
    )

    let displayView = nftViews.display
    let externalURLView = nftViews.externalURL
    let collectionDataView = nftViews.collectionData
    let collectionDisplayView = nftViews.collectionDisplay
    let royaltyView = nftViews.royalties

    var display : DisplayView? = nil
    if displayView != nil {
        display = DisplayView(
            name : displayView!.name,
            description : displayView!.description,
            thumbnail : displayView!.thumbnail.uri()
        )
    }

    var externalURL : ExternalURLView? = nil
    if externalURLView != nil {
        externalURL = ExternalURLView(
            externalURL : externalURLView!.url,
        )
    }

    var nftCollectionData : NFTCollectionDataView? = nil
    if collectionDataView != nil {
        nftCollectionData = NFTCollectionDataView(
            storagePath : collectionDataView!.storagePath,
            publicPath : collectionDataView!.publicPath,
            privatePath : collectionDataView!.providerPath,
            publicLinkedType : collectionDataView!.publicLinkedType,
            privateLinkedType : collectionDataView!.providerLinkedType,
        )
    }

    var nftCollectionDisplay : NFTCollectionDisplayView? = nil
    if collectionDisplayView != nil {
        nftCollectionDisplay = NFTCollectionDisplayView(
            collectionName : collectionDisplayView!.name,
            collectionDescription : collectionDisplayView!.description,
            collectionSquareImage : collectionDisplayView!.squareImage,
            collectionBannerImage : collectionDisplayView!.bannerImage,
            externalURL : collectionDisplayView!.externalURL.url,
            socials : collectionDisplayView!.socials
        )
    }

    var royalties : RoyaltiesView? = nil
    if royaltyView != nil {
        royalties = RoyaltiesView(
            royalties : royaltyView!.getRoyalties()
        )
    }

    return NFT(
        id: nftID,
        display : display,
        externalURL : externalURL,
        nftCollectionData : nftCollectionData,
        nftCollectionDisplay : nftCollectionDisplay,
        royalties : royalties
    ).getMapping()
}