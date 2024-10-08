import "MetadataViews"
import "NFTCatalog"
import "NFTCatalogAdmin"
import "NonFungibleToken"

transaction(
    collectionIdentifier : String,
    contractName: String,
    contractAddress: Address,
    nftTypeIdentifer: String,
    addressWithNFT: Address,
    nftID: UInt64,
    publicPathIdentifier: String
) {
    
    let adminResource: auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.Admin
    
    prepare(acct: auth(BorrowValue) &Account) {
        self.adminResource = acct.storage.borrow<auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.Admin>(from: NFTCatalogAdmin.AdminStoragePath)!
    }
    
    execute {
        let nftAccount = getAccount(addressWithNFT)
        let pubPath = PublicPath(identifier: publicPathIdentifier)!
        let collectionRef = nftAccount.capabilities.borrow<&{NonFungibleToken.Collection}>(pubPath) ?? panic("Could not get collection public capability")
        assert(collectionRef.getIDs().length > 0, message: "No NFTs exist in this collection.")
        let nftResolver = collectionRef.borrowViewResolver(id: nftID) ?? panic("Couldn't get view resolver")
        
        let metadataCollectionData = nftResolver.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData
        
        let collectionData = NFTCatalog.NFTCollectionData(
            storagePath: metadataCollectionData.storagePath,
            publicPath: metadataCollectionData.publicPath,
            publicLinkedType : metadataCollectionData.publicLinkedType,
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