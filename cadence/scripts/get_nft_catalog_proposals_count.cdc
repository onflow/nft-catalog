import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): Int {
    let proposals = NFTCatalog.getCatalogProposalKeys()
    return proposals.length
}