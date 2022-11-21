import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): Int {
    let catalog = NFTCatalog.getCatalog()
    let catalogIDs = catalog.keys
    return catalogIDs.length
}