import "NFTCatalog"

access(all) fun main(): [UInt64] {
    return NFTCatalog.getCatalogProposalKeys()
}