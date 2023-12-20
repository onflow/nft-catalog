import NFTCatalog from "NFTCatalog"

access(all) fun main(): Int {
    let catalogKeys = NFTCatalog.getCatalogKeys()
    return catalogKeys.length
}