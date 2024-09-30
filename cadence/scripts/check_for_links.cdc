import "ViewResolver"

/*
    Script to check for the implementation of all recommended MetadataViews.
 */
access(all) fun main(ownerAddress: Address, collectionPublicPath: String): {String: Bool} {
    let owner = getAccount(ownerAddress)
    return { 
        "MetadataViews": owner.capabilities.get<&{ViewResolver.ResolverCollection}>(PublicPath(identifier: collectionPublicPath)!).check(),
        "AnyResource": owner.capabilities.get<&AnyResource>(PublicPath(identifier: collectionPublicPath)!).check()
    }
}