import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(collectionName: String): NFTCatalog.NFTCatalogMetadata? {
  return NFTCatalog.getCatalogEntry(collectionName: collectionName)
}