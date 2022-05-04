import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction() {
  
  prepare(acct: AuthAccount) {
    if acct.getCapability(NFTCatalogAdmin.AdminAgentPublicPath).check<&AnyResource>() {
      acct.unlink(NFTCatalogAdmin.AdminAgentPublicPath)
      destroy <- acct.load<@AnyResource>(from: NFTCatalogAdmin.AdminAgentStoragePath)
    }

    acct.save(<- NFTCatalogAdmin.createAdminAgent(), to: NFTCatalogAdmin.AdminAgentStoragePath)
    acct.link<&{NFTCatalogAdmin.IAdminAgent}>(NFTCatalogAdmin.AdminAgentPublicPath, target: NFTCatalogAdmin.AdminAgentStoragePath)
  }
}