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
  let adminProxyResource : &NFTCatalogAdmin.AdminProxy

  prepare(acct: AuthAccount) {
    self.adminProxyResource = acct.borrow<&NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
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
      collectionData: collectionView
    )

    let catalogData = NFTCatalog.NFTCatalogMetadata(name: name, collectionMetadata: collectionMetadata)
    
    self.adminProxyResource.getCapability()!.borrow()!.addCatalogEntry(name : name, metadata : catalogData)
  }
}