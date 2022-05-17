import NFTCatalog from "../contracts/NFTCatalog.cdc"

transaction(
  name : String,
  contractName: String,
  address: Address,
  nftTypeIdentifer: String,
  storagePathIdentifier: String,
  publicPathIdentifier: String,
  message: String
) {
  
  prepare(acct: AuthAccount) {}
  
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

    NFTCatalog.proposeNFTMetadata(metadata : catalogData, message: message)
  }
}