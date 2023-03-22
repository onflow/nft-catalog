// NFTCatalogSnapshot
//
// A snapshot of the NFT Catalog at a specific time.
// This is provided in order to provide post-deprecation
// support to the NFT Catalog `getCatalog` function.
// which has been deprecated because it is nearing
// execution limits when copied and used within a 
// script or transaction.
// https://github.com/dapperlabs/nft-catalog/issues/138
// 

pub contract NFTCatalogSnapshot {

  access(self) var catalogSnapshot: {String : AnyStruct}?
  pub var snapshotBlockHeight: UInt64?

  access(account) fun setSnapshot(_ snapshot: {String : AnyStruct}) {
    self.catalogSnapshot = snapshot
    self.snapshotBlockHeight = getCurrentBlock().height
  }

  pub fun getCatalogSnapshot(): {String : AnyStruct}? {
    return self.catalogSnapshot
  }

  init() {
    self.snapshotBlockHeight = nil
    self.catalogSnapshot = nil
  }
}
 