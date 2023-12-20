import MetadataViews from "MetadataViews"
import NFTCatalog from "NFTCatalog"
import NFTRetrieval from "NFTRetrieval"
import ViewResolver from "ViewResolver"

access(all) fun main(ownerAddress: Address): {String: Number} {
    let account = getAuthAccount<auth(Storage,BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account>(ownerAddress)
    let items: {String: Number} = {}

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

        let count = NFTRetrieval.getNFTCountFromCap(collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)

        if count != 0 {
            items[collectionIdentifier] = count
        }
        return true
    })

    return items
}
