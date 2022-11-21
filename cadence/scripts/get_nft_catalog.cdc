import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(batch : [UInt64]?): {String : NFTCatalog.NFTCatalogMetadata} {
    if batch == nil {
        return NFTCatalog.getCatalog()
    }
    let catalog = NFTCatalog.getCatalog()
    let catalogIDs = catalog.keys
    var data : {String : NFTCatalog.NFTCatalogMetadata} = {}
    var i = batch![0]
    while i < batch![1] {
        data.insert(key: catalogIDs[i], catalog[catalogIDs[i]]!)
        i = i + 1
    }
    return data
}
 