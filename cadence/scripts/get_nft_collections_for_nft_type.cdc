import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(nftTypeIdentifer: String): {String : Bool}? {
  return NFTCatalog.getCollectionsForType(nftType: CompositeType(nftTypeIdentifer)!)
}