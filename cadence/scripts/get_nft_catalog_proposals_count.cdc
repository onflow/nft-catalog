import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): Int {
    let proposals = NFTCatalog.getCatalogProposals()
    let proposalIDs = proposals.keys
    return proposalIDs.length
}