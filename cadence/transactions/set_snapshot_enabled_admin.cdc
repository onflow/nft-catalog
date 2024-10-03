import "MetadataViews"
import "NFTCatalog"

transaction(shouldUseSnapshot: Bool) {
    let snapshotResource: &NFTCatalog.Snapshot

    prepare(acct: auth(BorrowValue) &Account) {
        self.snapshotResource = acct.borrow<&NFTCatalog.Snapshot>(from: /storage/CatalogSnapshot)!
    }

    execute {
        self.snapshotResource.setShouldUseSnapshot(shouldUseSnapshot)
    }
}
