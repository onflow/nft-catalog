import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub struct DisplayView {
    pub let name : String
    pub let description : String
    pub let thumbnail : String

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

pub struct ExternalURLView {
    pub let externalURL : String

    init (
        externalURL : String
    ) {
        self.externalURL = externalURL
    }
}

pub struct NFTCollectionDataView {
    pub let storagePath : StoragePath
    pub let publicPath : PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type

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

pub struct NFTCollectionDisplayView {
    pub let collectionName : String
    pub let collectionDescription: String
    pub let collectionSquareImage : MetadataViews.Media
    pub let collectionBannerImage : MetadataViews.Media
    pub let externalURL : String
    pub let socials : {String: MetadataViews.ExternalURL}

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

pub struct RoyaltiesView {
    pub let royalties: [MetadataViews.Royalty]

    init (
        royalties : [MetadataViews.Royalty]
    ) {
        self.royalties = royalties
    }
}

pub struct NFT {
    pub let id : UInt64
    pub let display : DisplayView?
    pub let externalURL : ExternalURLView?
    pub let nftCollectionData : NFTCollectionDataView?
    pub let nftCollectionDisplay : NFTCollectionDisplayView?
    pub let royalties : RoyaltiesView?

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

pub fun getMapping() : {String : AnyStruct} {
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

pub fun main(ownerAddress: Address, storagePathIdentifier: String, nftID: UInt64): {String : AnyStruct}    {
    let owner = getAuthAccount(ownerAddress)
    
    let tempPathStr = "getNFTsInAccountFromPathNFTCatalog"
    let tempPublicPath = PublicPath(identifier: tempPathStr)!
    owner.link<&{MetadataViews.ResolverCollection}>(
        tempPublicPath,
        target: StoragePath(identifier : storagePathIdentifier)!
    )

    let collectionCap = owner.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
    assert(collectionCap.check(), message: "MetadataViews Collection is not set up properly, ensure the Capability was created/linked correctly.")
    let collection = collectionCap.borrow()!
    assert(collection.getIDs().length > 0, message: "No NFTs exist in this collection, ensure the provided account has at least 1 NFTs.")

    return getNFTData(nftID: nftID, collection: collection)
}


pub fun getNFTData(nftID: UInt64, collection: &AnyResource{MetadataViews.ResolverCollection} ): {String : AnyStruct} {
    let nftResolver = collection.borrowViewResolver(id: nftID)
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