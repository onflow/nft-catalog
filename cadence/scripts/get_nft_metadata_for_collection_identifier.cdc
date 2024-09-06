import "NFTCatalog"

access(all) fun main(collectionIdentifier: String): NFTCatalog.NFTCatalogMetadata? {
    return NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)
}