import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(collectionIdentifier: String): NFTCatalog.NFTCatalogMetadata? {
    return NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)
}