import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(proxyAddress: Address) {
    let adminCap : Capability<&NFTCatalogAdmin.Admin>
    
    prepare(acct: AuthAccount) {
        self.adminCap = acct.getCapability<&NFTCatalogAdmin.Admin>(NFTCatalogAdmin.AdminPrivatePath)
    }

    execute {
        let owner = getAccount(proxyAddress)
        let proxy = owner.getCapability<&NFTCatalogAdmin.AdminProxy{NFTCatalogAdmin.IAdminProxy}>(NFTCatalogAdmin.AdminProxyPublicPath)
            .borrow() ?? panic("Could not borrow Admin Proxy")
        
        proxy.addCapability(capability : self.adminCap)
    }
}