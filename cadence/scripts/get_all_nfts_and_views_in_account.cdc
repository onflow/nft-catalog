import "MetadataViews"
import "NFTCatalog"
import "NFTRetrieval"
import "ViewResolver"

access(all) struct NFTCollectionData {
    access(all) let storagePath: StoragePath
    access(all) let publicPath: PublicPath
    access(all) let publicLinkedType: Type

    init(
        storagePath: StoragePath,
        publicPath: PublicPath,
        publicLinkedType: Type,
    ) {
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.publicLinkedType = publicLinkedType
    }
}

access(all) fun main(ownerAddress: Address): {String: {String: AnyStruct}} {
    let account = getAuthAccount<auth(Storage,BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account>(ownerAddress)
    let items: [MetadataViews.NFTView] = []
    let data: {String: {String: AnyStruct}} = {}

    NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
        let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
        let tempPathStr = "catalog".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        let collectionCap = account.capabilities.storage.issue<&{ViewResolver.ResolverCollection}>(value.collectionData.storagePath)
        account.capabilities.publish(collectionCap, at: tempPublicPath)

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
            publicLinkedType: nftCollectionDisplayView!.publicLinkedType,
        )
        views.insert(key: Type<MetadataViews.NFTCollectionData>().identifier, collectionDataView)

        data[collectionIdentifier] = views

        return true
    })

    return data
}
 