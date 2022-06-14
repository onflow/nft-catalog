import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(proposalID : UInt64) {
    let adminProxyResource : &NFTCatalogAdmin.AdminProxy

    prepare(acct: AuthAccount) {
        self.adminProxyResource = acct.borrow<&NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
    }

    execute {
        self.adminProxyResource.getCapability()!.borrow()!.rejectCatalogProposal(proposalID : proposalID)
    }
}