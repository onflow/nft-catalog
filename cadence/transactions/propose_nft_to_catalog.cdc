import MetadataViews from "MetadataViews"
import NFTCatalog from "NFTCatalog"

transaction(
    collectionIdentifier : String,
    contractName: String,
    contractAddress: Address,
    nftTypeIdentifer: String,
    storagePathIdentifier: String,
    publicPathIdentifier: String,
    privatePathIdentifier: String,
    publicLinkedTypeIdentifier : String,
    publicLinkedTypeRestrictions : [String],
    privateLinkedTypeIdentifier : String,
    privateLinkedTypeEntitlements : [String],
    collectionName : String,
    collectionDescription: String,
    externalURL : String,
    squareImageMediaURL : String,
    squareImageMediaType : String,
    bannerImageMediaURL : String,
    bannerImageMediaType : String,
    socials: {String : String},
    message: String
) {

    let nftCatalogProposalResourceRef : &NFTCatalog.NFTCatalogProposalManager
    
    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        
        if acct.storage.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath) == nil {
            let proposalManager <- NFTCatalog.createNFTCatalogProposalManager()
            acct.storage.save(<-proposalManager, to: NFTCatalog.ProposalManagerStoragePath)
            let proposalManagerCap = acct.capabilities.storage.issue<&NFTCatalog.NFTCatalogProposalManager>(
                NFTCatalog.ProposalManagerStoragePath
            )
            acct.capabilities.publish(
                proposalManagerCap,
                at: NFTCatalog.ProposalManagerPublicPath
            )
        }

        self.nftCatalogProposalResourceRef = acct.storage.borrow<&NFTCatalog.NFTCatalogProposalManager>(from: NFTCatalog.ProposalManagerStoragePath)!
    }
    
    execute {
        var privateLinkedType: Type? = nil
        if (privateLinkedTypeEntitlements.length == 0) {
            privateLinkedType = CompositeType(publicLinkedTypeIdentifier)
        } else {
            privateLinkedType = ReferenceType(entitlements: privateLinkedTypeEntitlements, type: CompositeType(publicLinkedTypeIdentifier)!)
        }
        
        let collectionData = NFTCatalog.NFTCollectionData(
            storagePath: StoragePath(identifier: storagePathIdentifier)!,
            publicPath: PublicPath(identifier : publicPathIdentifier)!,
            privatePath: PrivatePath(identifier: privatePathIdentifier)!,
            publicLinkedType : CompositeType(publicLinkedTypeIdentifier)!,
            privateLinkedType : privateLinkedType!
        )

        let squareMedia = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: squareImageMediaURL
                        ),
                        mediaType: squareImageMediaType
                    )
        
        let bannerMedia = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: bannerImageMediaURL
                        ),
                        mediaType: bannerImageMediaType
                    )

        let socialsStruct : {String : MetadataViews.ExternalURL} = {}
        for key in socials.keys {
            socialsStruct[key] =  MetadataViews.ExternalURL(socials[key]!)
        }
        
        let collectionDisplay = MetadataViews.NFTCollectionDisplay(
            name: collectionName,
            description: collectionDescription,
            externalURL: MetadataViews.ExternalURL(externalURL),
            squareImage: squareMedia,
            bannerImage: bannerMedia,
            socials: socialsStruct
        )

        let catalogData = NFTCatalog.NFTCatalogMetadata(
            contractName: contractName,
            contractAddress: contractAddress,
            nftType: CompositeType(nftTypeIdentifer)!,
            collectionData: collectionData,
            collectionDisplay : collectionDisplay
        )

        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : collectionIdentifier)

        NFTCatalog.proposeNFTMetadata(collectionIdentifier : collectionIdentifier, metadata : catalogData, message: message, proposer: self.nftCatalogProposalResourceRef.owner!.address)

        self.nftCatalogProposalResourceRef.setCurrentProposalEntry(identifier : nil)
    }
}