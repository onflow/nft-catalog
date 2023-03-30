import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): [String] {
    return NFTCatalog.getCatalogKeys()
}
 