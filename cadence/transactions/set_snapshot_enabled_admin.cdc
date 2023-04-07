import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"

transaction(shouldUseSnapshot: Bool) {
    let snapshotResource: &NFTCatalog.Snapshot

    prepare(acct: AuthAccount) {
        self.snapshotResource = acct.borrow<&NFTCatalog.Snapshot>(from: /storage/CatalogSnapshot)!
    }

    execute {
        self.snapshotResource.setShouldUseSnapshot(shouldUseSnapshot)
    }
}
