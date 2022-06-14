import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): {UInt64 : NFTCatalog.NFTCatalogProposal} {
    return NFTCatalog.getCatalogProposals()
}