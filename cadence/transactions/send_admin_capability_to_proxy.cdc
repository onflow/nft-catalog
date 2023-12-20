import NFTCatalogAdmin from "NFTCatalogAdmin"

transaction(proxyAddress: Address) {
    let adminCap : Capability<auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.Admin>
    
    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        self.adminCap = acct.capabilities.storage.issue<auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.Admin>(
            NFTCatalogAdmin.AdminStoragePath
        )
        assert(self.adminCap.check(), message: "Missing or mis-typed Admin provider")
    }

    execute {
        let owner = getAccount(proxyAddress)
        let proxy = owner.capabilities.borrow<&NFTCatalogAdmin.AdminProxy>(NFTCatalogAdmin.AdminProxyPublicPath) ?? panic("Could not borrow Admin Proxy")
        
        proxy.addCapability(capability : self.adminCap)
    }
}