import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTCatalogAdmin from "NFTCatalogAdmin"

transaction(
    collectionIdentifier : String,
    nftTypeIdentifier: String
) {
    let adminProxyRef : &NFTCatalogAdmin.AdminProxy

    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        self.adminProxyRef = acct.storage.borrow<&NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
    }

    execute {     
        self.adminProxyRef.getCapability()!.borrow()!.removeCatalogEntryUnsafe(collectionIdentifier : collectionIdentifier, nftTypeIdentifier: nftTypeIdentifier)
    }
}