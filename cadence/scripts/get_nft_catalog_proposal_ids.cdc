import NFTCatalog from "NFTCatalog"

access(all) fun main(): [UInt64] {
    return NFTCatalog.getCatalogProposalKeys()
}