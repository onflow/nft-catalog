import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"

transaction(
  collectionName : String,
  contractName: String,
  contractAddress: Address,
  nftTypeIdentifer: String,
  addressWithNFT: Address,
  nftID: UInt64,
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
    let nftAccount = getAccount(addressWithNFT)
    let pubPath = PublicPath(identifier: publicPathIdentifier)!
    let collectionRef = nftAccount.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(pubPath).borrow() ?? panic("Invalid NFT data")
    let nftResolver = collectionRef.borrowViewResolver(id: nftID)
    
    let metadataCollectionData = nftResolver.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData
    
    let collectionData = NFTCatalog.NFTCollectionData(
      storagePath: metadataCollectionData.storagePath,
      publicPath: metadataCollectionData.publicPath,
      privatePath: metadataCollectionData.providerPath,
      publicLinkedType : metadataCollectionData.publicLinkedType,
      privateLinkedType : metadataCollectionData.providerLinkedType
    )

    let collectionDisplay = nftResolver.resolveView(Type<MetadataViews.NFTCollectionDisplay>())! as! MetadataViews.NFTCollectionDisplay

    let collectionMetadata = NFTCatalog.NFTCollectionMetadata(
      contractName: contractName,
      contractAddress: contractAddress,
      nftType: CompositeType(nftTypeIdentifer)!,
      collectionData: collectionData,
      collectionDisplay : collectionDisplay
    )

    self.nftCatalogProposalResourceRef.setCurrentProposalEntry(name : collectionName)
    let catalogData = NFTCatalog.NFTCatalogMetadata(collectionName: collectionName, collectionMetadata: collectionMetadata)

    NFTCatalog.proposeNFTMetadata(metadata : catalogData, message: message, proposer: self.nftCatalogProposalResourceRef.owner!.address)

    self.nftCatalogProposalResourceRef.setCurrentProposalEntry(name : nil)
  }
}