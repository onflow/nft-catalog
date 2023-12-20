import MetadataViews from "MetadataViews"
import NFTCatalog from "NFTCatalog"
import NFTRetrieval from "NFTRetrieval"
import ViewResolver from "ViewResolver"

access(all) fun main(ownerAddress: Address): {String: [UInt64]} {
    let account = getAuthAccount<auth(Storage,BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account>(ownerAddress)
    let items: {String: [UInt64]} = {}

    NFTCatalog.forEachCatalogKey(fun (key: String):Bool {
        let value = NFTCatalog.getCatalogEntry(collectionIdentifier: key)!
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(key.utf8))
        let tempPathStr = "catalogIDs".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        let collectionCap = account.capabilities.storage.issue<&{ViewResolver.ResolverCollection}>(value.collectionData.storagePath)
        account.capabilities.publish(collectionCap, at: tempPublicPath)

        if !collectionCap.check() {
            return true
        }

        let ids = NFTRetrieval.getNFTIDsFromCap(collectionIdentifier: key, collectionCap: collectionCap)

        if ids.length > 0 {
            items[key] = ids
        }
        return true
    })

    return items
}
