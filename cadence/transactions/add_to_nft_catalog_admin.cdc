import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(
  name : String,
  contractName: String,
  address: Address,
  nftTypeIdentifer: String,
  storagePathIdentifier: String,
  publicPathIdentifier: String
) {
  
  let adminResource: &NFTCatalogAdmin.Admin
  
  prepare(acct: AuthAccount) {
    self.adminResource = acct.borrow<&NFTCatalogAdmin.Admin>(from: NFTCatalogAdmin.AdminStoragePath)!
  }
  
  execute {
    let collectionView = NFTCatalog.NFTCollectionView(
      storagePath: StoragePath(identifier: storagePathIdentifier)!,
      publicPath: PublicPath(identifier: publicPathIdentifier)!
    )

    let collectionMetadata = NFTCatalog.NFTCollectionMetadata(
      contractName: contractName,
      address: address,
      nftType: CompositeType(nftTypeIdentifer)!,
      collectionData: collectionView,
    )

    let catalogData = NFTCatalog.NFTCatalogMetadata(name: name, collectionMetadata: collectionMetadata)

    self.adminResource.addCatalogEntry(name : name, metadata : catalogData)
  }
}