import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction() {
  
  prepare(acct: AuthAccount) {
    if acct.getCapability(NFTCatalogAdmin.AdminProxyPublicPath).check<&AnyResource>() {
      acct.unlink(NFTCatalogAdmin.AdminProxyPublicPath)
      destroy <- acct.load<@AnyResource>(from: NFTCatalogAdmin.AdminProxyStoragePath)
    }

    acct.save(<- NFTCatalogAdmin.createAdminProxy(), to: NFTCatalogAdmin.AdminProxyStoragePath)
    acct.link<&{NFTCatalogAdmin.IAdminProxy}>(NFTCatalogAdmin.AdminProxyPublicPath, target: NFTCatalogAdmin.AdminProxyStoragePath)
  }
}