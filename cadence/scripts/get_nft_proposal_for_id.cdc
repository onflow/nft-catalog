import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(proposalID: UInt64): NFTCatalog.NFTCatalogProposal? {
    return NFTCatalog.getCatalogProposalEntry(proposalID: proposalID)
}