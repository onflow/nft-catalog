pub contract NFTCatalog {
  
  access(self) let catalog: {String : NFTCatalogMetadata}

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

  pub fun getCatalog() : {String : NFTCatalogMetadata} {
    return self.catalog
  }

  pub fun getCatalogEntry(name : String) : NFTCatalogMetadata? {
    return self.catalog[name]
  }

  access(account) fun addToCatalog(name : String, metadata: NFTCatalogMetadata) {
    pre {
      self.catalog[name] == nil : "The nft name has already been added to the catalog"
    }

    self.catalog[name] = metadata
  }

  init() {
    self.catalog = {}
  }
  
}
 