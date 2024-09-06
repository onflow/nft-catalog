import "NFTCatalog"

access(all) fun main(proposalID: UInt64): NFTCatalog.NFTCatalogProposal? {
    return NFTCatalog.getCatalogProposalEntry(proposalID: proposalID)
}