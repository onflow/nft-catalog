import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): {String : NFTCatalog.NFTCatalogMetadata} {
    return NFTCatalog.getCatalog()
}