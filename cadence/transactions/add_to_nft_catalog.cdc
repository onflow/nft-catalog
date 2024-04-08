import "NonFungibleToken"
import "MetadataViews"
import "NFTCatalog"
import "NFTCatalogAdmin"

transaction(
    collectionIdentifier : String,
    contractName: String,
    contractAddress: Address,
    nftTypeIdentifer: String,
    addressWithNFT: Address,
    nftID: UInt64,
    publicPathIdentifier: String
) {
    let adminProxyRef : &NFTCatalogAdmin.AdminProxy

    prepare(acct: auth(BorrowValue) &Account) {
        self.adminProxyRef = acct.storage.borrow<&NFTCatalogAdmin.AdminProxy>(from: NFTCatalogAdmin.AdminProxyStoragePath)!
    }

    execute {
        let nftAccount = getAccount(addressWithNFT)
        let pubPath = PublicPath(identifier: publicPathIdentifier)!
        let collectionRef = nftAccount.capabilities.borrow<&{NonFungibleToken.Collection}>(pubPath) ?? panic("Could not get collection public capability")
        assert(collectionRef.getIDs().length > 0, message: "No NFTs exist in this collection.")
        let nftResolver = collectionRef.borrowViewResolver(id: nftID)!
        
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
        
        self.adminProxyRef.getCapability()!.borrow()!.addCatalogEntry(collectionIdentifier : collectionIdentifier, metadata : catalogData)
    }
}