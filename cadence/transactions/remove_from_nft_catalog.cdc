import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(
    collectionIdentifier : String
) {
    let adminProxyResource : &NFTCatalogAdmin.AdminProxy

    prepare(acct: AuthAccount) {
        self.adminProxyResource = acct.borrow<&NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
    }

    execute {     
        self.adminProxyResource.getCapability()!.borrow()!.removeCatalogEntry(collectionIdentifier : collectionIdentifier)
    }
}