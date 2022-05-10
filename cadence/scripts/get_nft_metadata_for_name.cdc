import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(name: String): NFTCatalog.NFTCatalogMetadata? {
  return NFTCatalog.getCatalogEntry(name: name)
}