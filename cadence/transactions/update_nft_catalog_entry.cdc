import "MetadataViews"
import "NFTCatalog"
import "NFTCatalogAdmin"

transaction(
        collectionIdentifier : String,
        contractName: String,
        contractAddress: Address,
        nftTypeIdentifer: String,
        addressWithNFT: Address,
        publicPathIdentifier: String
) {
        let adminProxyRef : auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.AdminProxy

        prepare(acct: auth(BorrowValue) &Account) {
                self.adminProxyRef = acct.borrow<auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
        }

        execute {
                let nftAccount = getAccount(addressWithNFT)
                let pubPath = PublicPath(identifier: publicPathIdentifier)!
                let collectionCap = nftAccount.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(pubPath)
                assert(collectionCap.check(), message: "MetadataViews Collection is not set up properly, ensure the Capability was created/linked correctly.")
                let collectionRef = collectionCap.borrow()!
                assert(collectionRef.getIDs().length > 0, message: "No NFTs exist in this collection, ensure the provided account has at least 1 NFTs.")
                let testNftId = collectionRef.getIDs()[0]
                let nftResolver = collectionRef.borrowViewResolver(id: testNftId)
                
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
                
                self.adminProxyRef.getCapability()!.borrow()!.updateCatalogEntry(collectionIdentifier : collectionIdentifier, metadata : catalogData)
        }
}