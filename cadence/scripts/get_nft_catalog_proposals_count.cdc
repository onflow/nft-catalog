import NFTCatalog from "NFTCatalog"

access(all) fun main(): Int {
    let proposals = NFTCatalog.getCatalogProposalKeys()
    return proposals.length
}