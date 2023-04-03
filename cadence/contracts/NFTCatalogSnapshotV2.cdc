// NFTCatalogSnapshotV2
//
// A snapshot of the NFT Catalog at a specific time.
// This is provided in order to provide post-deprecation
// support to the NFT Catalog `getCatalog` function.
// which has been deprecated because it is nearing
// execution limits when copied and used within a 
// script or transaction.
// https://github.com/dapperlabs/nft-catalog/issues/138
// 

pub contract NFTCatalogSnapshotV2 {

  access(self) var catalogSnapshot: {String : AnyStruct}
  access(account) var shouldUseSnapshot: Bool
  pub var snapshotBlockHeight: UInt64?

  access(account) fun setPartialSnapshot(_ snapshotKey: String, _ snapshotEntry: AnyStruct) {
    self.catalogSnapshot[snapshotKey] = snapshotEntry
  }

  access(account) fun setShouldUseSnapshot(_ shouldUseSnapshot: Bool) {
    self.shouldUseSnapshot = shouldUseSnapshot
  }

  pub fun getCatalogSnapshot(): {String : AnyStruct} {
    return self.catalogSnapshot
  }

  init() {
    self.shouldUseSnapshot = false
    self.snapshotBlockHeight = nil
    self.catalogSnapshot = {}
  }
}
 