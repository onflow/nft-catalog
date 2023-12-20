import NFTCatalog from "../contracts/NFTCatalog.cdc"

// NOT RECOMMENDED FOR USE.
// This is used for automated testing of the
// expected to be deprecated getCatalog.
access(all) fun main(): {String : NFTCatalog.NFTCatalogMetadata} {
    return NFTCatalog.getCatalog()
}
