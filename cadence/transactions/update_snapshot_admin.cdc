import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"

transaction(collectionIdentifiers: [String]) {
    let snapshotResource: &NFTCatalog.Snapshot

    prepare(acct: AuthAccount) {
        let snapshot = acct.borrow<&NFTCatalog.Snapshot>(from: /storage/CatalogSnapshot)
        if snapshot == nil {
            acct.save(<-NFTCatalog.createEmptySnapshot(), to: /storage/CatalogSnapshot)
        }
        self.snapshotResource = acct.borrow<&NFTCatalog.Snapshot>(from: /storage/CatalogSnapshot)!
    }

    execute {
        for id in collectionIdentifiers {
            let entry = NFTCatalog.getCatalogEntry(collectionIdentifier: id)
            self.snapshotResource.setPartialSnapshot(id, entry!)
        }
    }
}
