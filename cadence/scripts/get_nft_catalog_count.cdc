import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): Int {
    let catalogKeys = NFTCatalog.getCatalogKeys()
    return catalogKeys.length
}