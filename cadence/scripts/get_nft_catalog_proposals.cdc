import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(batch: [UInt64]?): {UInt64 : NFTCatalog.NFTCatalogProposal} {
    if batch == nil {
        return NFTCatalog.getCatalogProposals()
    }
    let proposals = NFTCatalog.getCatalogProposals()
    let proposalIDs = proposals.keys
    var data : {UInt64 : NFTCatalog.NFTCatalogProposal}  = {}
    var i = batch![0]
    while i < batch![1] {
        data.insert(key: proposalIDs[i], proposals[proposalIDs[i]]!)
        i = i + 1
    }

    return data
}