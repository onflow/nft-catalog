import "NFTCatalogAdmin"

transaction(proposalID : UInt64) {
    let adminProxyRef : auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.AdminProxy

    prepare(acct: auth(BorrowValue) &Account) {
        self.adminProxyRef = acct.storage.borrow<auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
    }

    execute {
        self.adminProxyRef.getCapability()!.borrow()!.approveCatalogProposal(proposalID : proposalID)
    }
}