import "NFTCatalogAdmin"

access(all) fun main(ownerAddress: Address) : Bool {
    let owner = getAccount(ownerAddress)
    let proxyCap = owner.capabilities.get<&NFTCatalogAdmin.AdminProxy>(NFTCatalogAdmin.AdminProxyPublicPath)
    return proxyCap.check()
}