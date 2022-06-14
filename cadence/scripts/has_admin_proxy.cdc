import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

pub fun main(ownerAddress: Address) : Bool {
    let owner = getAccount(ownerAddress)
    let proxyCap = owner.getCapability<&{NFTCatalogAdmin.IAdminProxy}>(NFTCatalogAdmin.AdminProxyPublicPath)
    return proxyCap.check()
}