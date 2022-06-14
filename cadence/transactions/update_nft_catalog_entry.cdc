import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(
        collectionIdentifier : String,
        contractName: String,
        contractAddress: Address,
        nftTypeIdentifer: String,
        addressWithNFT: Address,
        publicPathIdentifier: String
) {
        let adminProxyResource : &NFTCatalogAdmin.AdminProxy

        prepare(acct: AuthAccount) {
                self.adminProxyResource = acct.borrow<&NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
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
                        privatePath: metadataCollectionData.providerPath,
                        publicLinkedType : metadataCollectionData.publicLinkedType,
                        privateLinkedType : metadataCollectionData.providerLinkedType
                )

                let collectionDisplay = nftResolver.resolveView(Type<MetadataViews.NFTCollectionDisplay>())! as! MetadataViews.NFTCollectionDisplay

                let catalogData = NFTCatalog.NFTCatalogMetadata(
                        contractName: contractName,
                        contractAddress: contractAddress,
                        nftType: CompositeType(nftTypeIdentifer)!,
                        collectionData: collectionData,
                        collectionDisplay : collectionDisplay
                )
                
                self.adminProxyResource.getCapability()!.borrow()!.updateCatalogEntry(collectionIdentifier : collectionIdentifier, metadata : catalogData)
        }
}