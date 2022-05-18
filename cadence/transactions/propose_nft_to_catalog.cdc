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

  let nftCatalogProposalResourceRef : &NFTCatalog.NFTCatalogProposalManager
  
  prepare(acct: AuthAccount) {
    
    if acct.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath) == nil {
       let proposalManager <- NFTCatalog.createNFTCatalogProposalManager()
       acct.save(<-proposalManager, to: NFTCatalog.ProposalManagerStoragePath)
       acct.link<&NFTCatalog.NFTCatalogProposalManager{NFTCatalog.NFTCatalogProposalManagerPublic}>(NFTCatalog.ProposalManagerPublicPath, target: NFTCatalog.ProposalManagerStoragePath)
    }

    self.nftCatalogProposalResourceRef = acct.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath)!
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
    self.nftCatalogProposalResourceRef.setCurrentProposalEntry(name : name)
    let catalogData = NFTCatalog.NFTCatalogMetadata(name: name, collectionMetadata: collectionMetadata)

    NFTCatalog.proposeNFTMetadata(metadata : catalogData, message: message, proposer: self.nftCatalogProposalResourceRef.owner!.address)

    self.nftCatalogProposalResourceRef.setCurrentProposalEntry(name : nil)
  }
}