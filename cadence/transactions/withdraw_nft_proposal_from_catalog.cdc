import NFTCatalog from "../contracts/NFTCatalog.cdc"

transaction(
    proposalID : UInt64
) {
    let nftCatalogProposalResourceRef : &NFTCatalog.NFTCatalogProposalManager

    prepare(acct: AuthAccount) {
        self.nftCatalogProposalResourceRef = acct.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath)!
    }

    execute {
        let proposal = NFTCatalog.getCatalogProposalEntry(proposalID: proposalID)!
        
        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : proposal.collectionIdentifier)
        NFTCatalog.withdrawNFTProposal(proposalID : proposalID)
        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : nil)
    }
}