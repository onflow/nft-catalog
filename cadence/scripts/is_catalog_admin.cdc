import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

pub fun main(ownerAddress: Address) : Bool {
    let owner = getAccount(ownerAddress)
    let proxyCap = owner.getCapability<&{NFTCatalogAdmin.IAdminProxy}>(NFTCatalogAdmin.AdminProxyPublicPath)
    if !proxyCap.check() {
        return false
    }
    let proxyRef = proxyCap.borrow()!
    return proxyRef.hasCapability()
}