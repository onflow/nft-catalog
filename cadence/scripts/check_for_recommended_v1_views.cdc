import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

/*
    Script to check for the implementation of all recommended MetadataViews.
 */
pub fun main(ownerAddress: Address, collectionStoragePath: StoragePath): {String: Bool} {
    let owner = getAuthAccount(ownerAddress)
    let tempPathStr = "recommnededV1ViewsNFTCatalog"
    let tempPublicPath = PublicPath(identifier: tempPathStr)!
    owner.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: collectionStoragePath
    )
    
    let collectionCap = owner.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
    assert(collectionCap.check(), message: "MetadataViews Collection is not set up properly, ensure the Capability was created/linked correctly.")
    let collection = collectionCap.borrow()!
    assert(collection.getIDs().length > 0, message: "No NFTs exist in this collection, ensure the provided account has at least 1 NFTs.")
    let testNFTID = collection.getIDs()[0]
    let nftResolver = collection.borrowViewResolver(id: testNFTID)
    let views: {String: Bool} = {}
    // Initialize map to all falses for recommended views.
    for view in NFTRetrieval.getRecommendedViewsTypes(version: "v1") {
        views.insert(key: view.identifier, false)
    }
    // Set to true if supported.
    for view in nftResolver.getViews() {
        if views.containsKey(view.identifier) {
            views.insert(key: view.identifier, true)
        }
    }
    return views
}