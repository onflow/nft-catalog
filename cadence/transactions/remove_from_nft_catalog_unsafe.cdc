import "MetadataViews"
import "NFTCatalog"
import "NFTCatalogAdmin"

transaction(
    collectionIdentifier : String,
    nftTypeIdentifier: String
) {
    let adminProxyRef: auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.AdminProxy

    prepare(acct: auth(BorrowValue) &Account) {
        self.adminProxyRef = acct.storage.borrow<auth(NFTCatalogAdmin.CatalogActions) &NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
    }

    execute {     
        self.adminProxyRef.getCapability()!.borrow()!.removeCatalogEntryUnsafe(collectionIdentifier : collectionIdentifier, nftTypeIdentifier: nftTypeIdentifier)
    }
}