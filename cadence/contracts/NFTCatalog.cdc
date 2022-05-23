import MetadataViews from "./MetadataViews.cdc"

pub contract NFTCatalog {

  pub event EntryAdded(
    collectionName : String, 
    contractName : String, 
    contractAddress : Address, 
    nftType : Type, 
    storagePath: StoragePath, 
    publicPath: PublicPath, 
    privatePath: PrivatePath, 
    publicLinkedType : Type, 
    privateLinkedType : Type,
    displayName : String,
    description: String,
    externalURL : String
  )

  pub event EntryUpdated(
    collectionName : String, 
    contractName : String, 
    contractAddress : Address, 
    nftType : Type, 
    storagePath: StoragePath, 
    publicPath: PublicPath, 
    privatePath: PrivatePath, 
    publicLinkedType : Type, 
    privateLinkedType : Type,
    displayName : String,
    description: String,
    externalURL : String
  )

  pub event EntryRemoved(collectionName : String)

  pub event ProposalEntryAdded(proposalID : UInt64, collectionName : String, message: String, status: String, proposer : Address)
  
  pub event ProposalEntryUpdated(proposalID : UInt64, collectionName : String, message: String, status: String, proposer : Address)
  
  pub event ProposalEntryRemoved(proposalID : UInt64)

  pub let ProposalManagerStoragePath: StoragePath

  pub let ProposalManagerPublicPath: PublicPath

  
  access(self) let catalog: {String : NFTCatalog.NFTCatalogMetadata}
  access(self) let catalogTypeData: {Type : {String : Bool}}

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

  pub struct NFTCollectionData {
    
    pub let storagePath : StoragePath
    pub let publicPath : PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type

    init(
      storagePath : StoragePath,
      publicPath : PublicPath,
      privatePath : PrivatePath,
      publicLinkedType : Type,
      privateLinkedType : Type
    ) {
      self.storagePath = storagePath
      self.publicPath = publicPath
      self.privatePath = privatePath
      self.publicLinkedType = publicLinkedType
      self.privateLinkedType = privateLinkedType
    }
  }


  pub struct NFTCatalogMetadata {
    pub let contractName : String
    pub let contractAddress : Address
    pub let nftType: Type
    pub let collectionData: NFTCollectionData
    pub let collectionDisplay: MetadataViews.NFTCollectionDisplay

    init (contractName : String, contractAddress : Address, nftType: Type, collectionData : NFTCollectionData, collectionDisplay : MetadataViews.NFTCollectionDisplay) {
      self.contractName = contractName
      self.contractAddress = contractAddress
      self.nftType = nftType
      self.collectionData = collectionData
      self.collectionDisplay = collectionDisplay
    }
  }

  pub struct NFTCatalogProposal {
    pub let collectionName : String
    pub let metadata : NFTCatalogMetadata
    pub let message : String
    pub let status : String
    pub let proposer : Address
    pub let createdTime : UFix64

    init(collectionName : String, metadata : NFTCatalogMetadata, message : String, status : String, proposer : Address) {
      self.collectionName = collectionName
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

  pub fun getCatalogEntry(collectionName : String) : NFTCatalogMetadata? {
    return self.catalog[collectionName]
  }

  pub fun getCollectionsForType(nftType: Type) : {String : Bool}? {
    return self.catalogTypeData[nftType]
  }

  pub fun getCatalogTypeData() : {Type : {String : Bool}} {
    return self.catalogTypeData
  }

  pub fun proposeNFTMetadata(collectionName : String, metadata : NFTCatalogMetadata, message : String, proposer : Address) : UInt64 {
    pre {
      self.catalog[collectionName] == nil : "The nft name has already been added to the catalog"
    }
    let proposerManagerCap = getAccount(proposer).getCapability<&NFTCatalogProposalManager{NFTCatalog.NFTCatalogProposalManagerPublic}>(NFTCatalog.ProposalManagerPublicPath)

    assert(proposerManagerCap.check(), message : "Proposer needs to set up a manager")

    let proposerManagerRef = proposerManagerCap.borrow()!

    assert(proposerManagerRef.getCurrentProposalEntry()! == collectionName, message: "Expected proposal entry does not match entry for the proposer")
    
    let catalogProposal = NFTCatalogProposal(collectionName : collectionName, metadata : metadata, message : message, status: "IN_REVIEW", proposer: proposer)
    self.totalProposals = self.totalProposals + 1
    self.catalogProposals[self.totalProposals] = catalogProposal

    emit ProposalEntryAdded(proposalID : self.totalProposals, collectionName : collectionName, message: catalogProposal.message, status: catalogProposal.status, proposer: catalogProposal.proposer)
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

    assert(proposerManagerRef.getCurrentProposalEntry()! == proposal.collectionName, message: "Expected proposal entry does not match entry for the proposer")

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

  access(account) fun addCatalogEntry(collectionName : String, metadata: NFTCatalogMetadata) {
    pre {
      self.catalog[collectionName] == nil : "The nft name has already been added to the catalog"
    }

    self.addCatalogTypeEntry(collectionName : collectionName , metadata: metadata)

    self.catalog[collectionName] = metadata

    emit EntryAdded(
      collectionName : collectionName, 
      contractName : metadata.contractName, 
      contractAddress : metadata.contractAddress, 
      nftType: metadata.nftType,
      storagePath: metadata.collectionData.storagePath, 
      publicPath: metadata.collectionData.publicPath, 
      privatePath: metadata.collectionData.privatePath, 
      publicLinkedType : metadata.collectionData.publicLinkedType, 
      privateLinkedType : metadata.collectionData.privateLinkedType,
      displayName : metadata.collectionDisplay.name,
      description: metadata.collectionDisplay.description,
      externalURL : metadata.collectionDisplay.externalURL.url
    )
  }

  access(account) fun updateCatalogEntry(collectionName : String , metadata: NFTCatalogMetadata) {
    pre {
      self.catalog[collectionName] != nil : "Invalid collection name"
    }
    // remove previous nft type entry
    self.removeCatalogTypeEntry(collectionName : collectionName , metadata: metadata)
    // add updated nft type entry
    self.addCatalogTypeEntry(collectionName : collectionName , metadata: metadata)

    self.catalog[collectionName] = metadata

    let nftType = metadata.nftType

    emit EntryUpdated(
      collectionName : collectionName, 
      contractName : metadata.contractName, 
      contractAddress : metadata.contractAddress, 
      nftType: metadata.nftType,
      storagePath: metadata.collectionData.storagePath, 
      publicPath: metadata.collectionData.publicPath, 
      privatePath: metadata.collectionData.privatePath, 
      publicLinkedType : metadata.collectionData.publicLinkedType, 
      privateLinkedType : metadata.collectionData.privateLinkedType,
      displayName : metadata.collectionDisplay.name,
      description: metadata.collectionDisplay.description,
      externalURL : metadata.collectionDisplay.externalURL.url
    )
  }

  access(account) fun removeCatalogEntry(collectionName : String) {
    pre {
      self.catalog[collectionName] != nil : "Invalid collection name"
    }

    self.removeCatalogTypeEntry(collectionName : collectionName , metadata: self.catalog[collectionName]!)
    self.catalog.remove(key: collectionName)

    emit EntryRemoved(collectionName : collectionName)
  }

  access(account) fun updateCatalogProposal(proposalID: UInt64, proposalMetadata : NFTCatalogProposal) {
    self.catalogProposals[proposalID] = proposalMetadata

    emit ProposalEntryUpdated(proposalID : proposalID, collectionName : proposalMetadata.collectionName, message: proposalMetadata.message, status: proposalMetadata.status, proposer: proposalMetadata.proposer)
  }

  access(account) fun removeCatalogProposal(proposalID : UInt64) {
    self.catalogProposals.remove(key : proposalID)

    emit ProposalEntryRemoved(proposalID : proposalID)
  }

  access(contract) fun addCatalogTypeEntry(collectionName : String , metadata: NFTCatalogMetadata) {
    if self.catalogTypeData[metadata.nftType] != nil {
      let typeData : {String : Bool} = self.catalogTypeData[metadata.nftType]!
      assert(self.catalogTypeData[metadata.nftType]![collectionName] == nil, message : "The nft name has already been added to the catalog")
      typeData[collectionName] = true
      self.catalogTypeData[metadata.nftType]  = typeData
    } else {
      let typeData : {String : Bool} = {}
      typeData[collectionName] = true
      self.catalogTypeData[metadata.nftType]  = typeData
    }
  }

  access(contract) fun removeCatalogTypeEntry(collectionName : String , metadata: NFTCatalogMetadata) {
    let prevMetadata = self.catalog[collectionName]!
    let prevCollectionsForType = self.catalogTypeData[prevMetadata.nftType]!
    prevCollectionsForType.remove(key : collectionName)
    if prevCollectionsForType.length == 0 {
      self.catalogTypeData.remove(key: prevMetadata.nftType)
    } else {
      self.catalogTypeData[prevMetadata.nftType] = prevCollectionsForType
    }
  }

  init() {
    self.ProposalManagerStoragePath = /storage/nftCatalogProposalManager
    self.ProposalManagerPublicPath = /public/nftCatalogProposalManager
    
    self.totalProposals = 0
    self.catalog = {}
    self.catalogTypeData = {}
    
    self.catalogProposals = {}
  }
  
}
 