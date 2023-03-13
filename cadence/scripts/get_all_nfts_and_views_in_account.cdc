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

pub fun main(ownerAddress: Address): {String: {String: AnyStruct}} {
    let account = getAuthAccount(ownerAddress)
    let items: [MetadataViews.NFTView] = []
    let data: {String: {String: AnyStruct}} = {}

    NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
        let value = NFTCatalog.mustGetCatalogEntry(collectionIdentifier: collectionIdentifier)
        
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
        let tempPathStr = "catalog".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

        if !collectionCap.check() {
            return true
        }

        var views = NFTRetrieval.getAllMetadataViewsFromCap(collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)

        if views.keys.length == 0 {
            return true
        }

        // Cadence doesn't support function return types, lets manually get rid of it
        let nftCollectionDisplayView = views[Type<MetadataViews.NFTCollectionData>().identifier] as! MetadataViews.NFTCollectionData?
        let collectionDataView = NFTCollectionData(
            storagePath: nftCollectionDisplayView!.storagePath,
            publicPath: nftCollectionDisplayView!.publicPath,
            privatePath: nftCollectionDisplayView!.providerPath,
            publicLinkedType: nftCollectionDisplayView!.publicLinkedType,
            privateLinkedType: nftCollectionDisplayView!.providerLinkedType,
        )
        views.insert(key: Type<MetadataViews.NFTCollectionData>().identifier, collectionDataView)

        data[collectionIdentifier] = views
    
        return true
    })

    return data
}
