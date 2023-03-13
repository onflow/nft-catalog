import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub fun main(ownerAddress: Address): {String: Number} {
    let account = getAuthAccount(ownerAddress)
    let items: {String: Number} = {}

    NFTCatalog.forEachCatalogKey(fun (key: String): Bool {
        let value = NFTCatalog.mustGetCatalogEntry(collectionIdentifier: key)
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(key.utf8))
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

        let count = NFTRetrieval.getNFTCountFromCap(collectionIdentifier: key, collectionCap: collectionCap)

        if count != 0 {
            items[key] = count
        }
        return true
    })

    return items
}
