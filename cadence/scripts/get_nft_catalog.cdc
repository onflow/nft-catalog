import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(identifiers : [String]): {String : NFTCatalog.NFTCatalogMetadata} {

    var data : {String : NFTCatalog.NFTCatalogMetadata} = {}

    for identifier in identifiers {
        assert(NFTCatalog.getCatalogEntry(collectionIdentifier: identifier) != nil, message: "Invalid Identifier")
        data.insert(key: identifier, NFTCatalog.getCatalogEntry(collectionIdentifier: identifier)!)

    }
    return data
}
 