pub contract NFTCatalog {

  pub event EntryAdded(name : String, contractName : String, address : Address, nftType : Type, storagePath: StoragePath, publicPath: PublicPath)

  pub event ProposalEntryAdded(proposalID : UInt64, message: String, status: String, proposer : Address)
  
  pub event ProposalEntryUpdated(proposalID : UInt64, message: String, status: String, proposer : Address)
  
  pub event ProposalEntryRemoved(proposalID : UInt64)

  pub let ProposalManagerStoragePath: StoragePath

  pub let ProposalManagerPublicPath: PublicPath

  
  access(self) let catalog: {String : NFTCatalogMetadata}
  access(self) let catalogProposals : {UInt64 : NFTCatalogProposal}

  access(self) var totalProposals : UInt64

  pub resource interface NFTCatalogProposalManagerPublic {
    pub fun getCurrentProposalEntry(): String?
	}
  pub resource NFTCatalogProposalManager : NFTCatalogProposalManagerPublic {
      access(self) var currentProposalEntry: String?

      pub fun getCurrentProposalEntry(): String? {
        return self.currentProposalEntry
      }

      pub fun setCurrentProposalEntry(name: String?) {
        self.currentProposalEntry = name
      }
      
      init () {
        self.currentProposalEntry = nil
      }
  }

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
    pub let nftType: Type
    pub let collectionData: NFTCollectionView

    init (contractName : String, address : Address, nftType: Type, collectionData : NFTCollectionView) {
      self.contractName = contractName
      self.address = address
      self.nftType = nftType
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
    pub let proposer : Address
    pub let createdTime : UFix64

    init(metadata : NFTCatalogMetadata, message : String, status : String, proposer : Address) {
      self.metadata = metadata
      self.message = message
      self.status = status
      self.proposer = proposer
      self.createdTime = getCurrentBlock().timestamp
    }
  }

  pub fun getCatalog() : {String : NFTCatalogMetadata} {
    return self.catalog
  }

  pub fun getCatalogEntry(name : String) : NFTCatalogMetadata? {
    return self.catalog[name]
  }

  pub fun proposeNFTMetadata(metadata : NFTCatalogMetadata, message : String, proposer : Address) : UInt64 {
    pre {
      self.catalog[metadata.name] == nil : "The nft name has already been added to the catalog"
    }
    let proposerManagerCap = getAccount(proposer).getCapability<&NFTCatalogProposalManager{NFTCatalog.NFTCatalogProposalManagerPublic}>(NFTCatalog.ProposalManagerPublicPath)

    assert(proposerManagerCap.check(), message : "Proposer needs to set up a manager")

    let proposerManagerRef = proposerManagerCap.borrow()!

    assert(proposerManagerRef.getCurrentProposalEntry()! == metadata.name, message: "Expected proposal entry does not match entry for the proposer")
    
    let catalogProposal = NFTCatalogProposal(metadata : metadata, message : message, status: "IN_REVIEW", proposer: proposer)
    self.totalProposals = self.totalProposals + 1
    self.catalogProposals[self.totalProposals] = catalogProposal

    emit ProposalEntryAdded(proposalID : self.totalProposals, message: catalogProposal.message, status: catalogProposal.status, proposer: catalogProposal.proposer)
    return self.totalProposals
  }

  pub fun withdrawNFTProposal(proposalID : UInt64) {
    pre {
      self.catalogProposals[proposalID] != nil : "Invalid Proposal ID"
    }
    let proposal = self.catalogProposals[proposalID]!
    let proposer = proposal.proposer

    let proposerManagerCap = getAccount(proposer).getCapability<&NFTCatalogProposalManager{NFTCatalog.NFTCatalogProposalManagerPublic}>(NFTCatalog.ProposalManagerPublicPath)

    assert(proposerManagerCap.check(), message : "Proposer needs to set up a manager")

    let proposerManagerRef = proposerManagerCap.borrow()!

    assert(proposerManagerRef.getCurrentProposalEntry()! == proposal.metadata.name, message: "Expected proposal entry does not match entry for the proposer")

    self.removeCatalogProposal(proposalID : proposalID)
  }

  pub fun getCatalogProposals() : {UInt64 : NFTCatalogProposal} {
    return self.catalogProposals
  }

  pub fun getCatalogProposalEntry(proposalID : UInt64) : NFTCatalogProposal? {
    return self.catalogProposals[proposalID]
  }

  pub fun createNFTCatalogProposalManager(): @NFTCatalogProposalManager {
    return <-create NFTCatalogProposalManager()
  }

  access(account) fun addToCatalog(name : String, metadata: NFTCatalogMetadata) {
    pre {
      self.catalog[name] == nil : "The nft name has already been added to the catalog"
    }

    self.catalog[name] = metadata

    emit EntryAdded(name : name, contractName : metadata.collectionMetadata.contractName, address : metadata.collectionMetadata.address, nftType: metadata.collectionMetadata.nftType, storagePath: metadata.collectionMetadata.collectionData.storagePath, publicPath: metadata.collectionMetadata.collectionData.publicPath)
  }

  access(account) fun updateCatalogProposal(proposalID: UInt64, proposalMetadata : NFTCatalogProposal) {
    self.catalogProposals[proposalID] = proposalMetadata

    emit ProposalEntryUpdated(proposalID : proposalID, message: proposalMetadata.message, status: proposalMetadata.status, proposer: proposalMetadata.proposer)
  }

  access(account) fun removeCatalogProposal(proposalID : UInt64) {
    self.catalogProposals.remove(key : proposalID)

    emit ProposalEntryRemoved(proposalID : proposalID)
  }

  init() {
    self.ProposalManagerStoragePath = /storage/nftCatalogProposalManager
    self.ProposalManagerPublicPath = /public/nftCatalogProposalManager
    
    self.totalProposals = 0
    self.catalog = {}
    self.catalogProposals = {}
  }
  
}
 