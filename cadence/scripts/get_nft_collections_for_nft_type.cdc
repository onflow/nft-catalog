import NFTCatalog from "NFTCatalog"

access(all) fun main(nftTypeIdentifer: String): {String : Bool}? {
    return NFTCatalog.getCollectionsForType(nftTypeIdentifier: CompositeType(nftTypeIdentifer)!.identifier)
}