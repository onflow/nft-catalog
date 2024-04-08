import "NFTCatalogAdmin"

transaction() {
    
    prepare(acct: auth(IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {
        acct.storage.save(<- NFTCatalogAdmin.createAdminProxy(), to: NFTCatalogAdmin.AdminProxyStoragePath)
        let proxyCap = acct.capabilities.storage.issue<&NFTCatalogAdmin.AdminProxy>(NFTCatalogAdmin.AdminProxyStoragePath)
        acct.capabilities.publish(proxyCap, at: NFTCatalogAdmin.AdminProxyPublicPath)
    }
}