import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): [UInt64] {
    return NFTCatalog.getCatalogProposalKeys()
}