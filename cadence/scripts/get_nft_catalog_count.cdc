import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): Int {
    var count: Int = 0
    let catalog = NFTCatalog.forEachCatalogKey(fun (key: String): Bool {
        count = count + 1
        return true
    })
    return count
}