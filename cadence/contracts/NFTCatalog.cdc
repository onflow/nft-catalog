pub contract NFTCatalog {
  
  access(self) let catalog: {String : NFTCatalogMetadata}
  access(self) let catalogProposals : {UInt64 : NFTCatalogProposal}

  access(self) var totalProposals : UInt64
  //TODO: Switch to struct from Metadata View when launched
  pub struct NFTCollectionView {
    
    pub let storagePath : StoragePath
    pub let publicPath : PublicPath

    init(
      storagePath : StoragePath,
      publicPath : PublicPath
    ) {
      self.storagePath = storagePath
      self.publicPath = publicPath
    }
  }

  pub struct NFTCollectionMetadata {
    
    pub let contractName : String
    pub let address : Address
    pub let collectionData: NFTCollectionView

    init (contractName : String, address : Address, collectionData : NFTCollectionView) {
      self.contractName = contractName
      self.address = address
      self.collectionData = collectionData
    }
  }

  pub struct NFTCatalogMetadata {
    
    pub let name : String
    pub let collectionMetadata : NFTCollectionMetadata

    init(name : String, collectionMetadata: NFTCollectionMetadata) {
      self.name = name
      self.collectionMetadata = collectionMetadata
    }
  }

  pub struct NFTCatalogProposal {
    pub let metadata : NFTCatalogMetadata
    pub let message : String
    pub let status : String

    init(metadata : NFTCatalogMetadata, message : String, status : String) {
      self.metadata = metadata
      self.message = message
      self.status = status
    }
  }

  pub fun getCatalog() : {String : NFTCatalogMetadata} {
    return self.catalog
  }

  pub fun getCatalogEntry(name : String) : NFTCatalogMetadata? {
    return self.catalog[name]
  }

  //TODO: Add authz
  pub fun proposeNFTMetadata(metadata : NFTCatalogMetadata, message : String) : UInt64 {
    pre {
      self.catalog[metadata.name] == nil : "The nft name has already been added to the catalog"
    }
    let catalogProposal = NFTCatalogProposal(metadata : metadata, message : message, status: "IN_REVIEW")
    self.totalProposals = self.totalProposals + 1
    self.catalogProposals[self.totalProposals] = catalogProposal
    return self.totalProposals
  }

  pub fun getCatalogProposals() : {UInt64 : NFTCatalogProposal} {
    return self.catalogProposals
  }

  pub fun getCatalogProposalEntry(proposalID : UInt64) : NFTCatalogProposal? {
    return self.catalogProposals[proposalID]
  }

  access(account) fun addToCatalog(name : String, metadata: NFTCatalogMetadata) {
    pre {
      self.catalog[name] == nil : "The nft name has already been added to the catalog"
    }

    self.catalog[name] = metadata
  }

  access(account) fun updateCatalogProposal(proposalID: UInt64, proposalMetadata : NFTCatalogProposal) {
    self.catalogProposals[proposalID] = proposalMetadata
  }

  access(account) fun removeCatalogProposal(proposalID : UInt64) {
    self.catalogProposals.remove(key : proposalID)
  }

  init() {
    self.totalProposals = 0
    self.catalog = {}
    self.catalogProposals = {}
  }
  
}
 