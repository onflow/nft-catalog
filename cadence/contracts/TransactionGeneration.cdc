import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"
import StringUtils from "./StringUtils.cdc"
import ArrayUtils from "./ArrayUtils.cdc"
import NFTStorefrontV2 from "./NFTStorefrontV2.cdc"
import TransactionGenerationUtils from "./TransactionGenerationUtils.cdc"
import TransactionTemplates from "./TransactionTemplates.cdc"

// TransactionGenerationUtils
//
// A helper to generate common, useful transaction code
// leveraging the NFTCatalog Smart Contract
//
// WIP made by amit
//

pub contract TransactionGeneration {
    pub struct interface TokenTemplate {
        pub let contractName: String
        pub let storagePath: String
        pub let publicPath: String
        pub let privatePath: String
        pub let type: Type
        pub let publicLinkedType: Type
        pub let privateLinkedType: Type
    }

    pub struct FTTemplate: TokenTemplate {
        pub let contractName: String
        pub let storagePath: String
        pub let publicPath: String
        pub let privatePath: String
        pub let type: Type
        pub let publicLinkedType: Type
        pub let privateLinkedType: Type
        init(
            contractName: String,
            storagePath: String,
            publicPath: String,
            privatePath: String,
            type: Type,
            publicLinkedType: Type,
            privateLinkedType: Type
        ) {
            self.contractName = contractName
            self.storagePath = storagePath
            self.publicPath = publicPath
            self.privatePath = privatePath
            self.type = type
            self.publicLinkedType = publicLinkedType
            self.privateLinkedType = privateLinkedType
        }
    }

    pub struct NFTTemplate: TokenTemplate {
        pub let contractName: String
        pub let storagePath: String
        pub let publicPath: String
        pub let privatePath: String
        pub let type: Type
        pub let publicLinkedType: Type
        pub let privateLinkedType: Type
        init(
            contractName: String,
            storagePath: String,
            publicPath: String,
            privatePath: String,
            type: Type,
            publicLinkedType: Type,
            privateLinkedType: Type
        ) {
            self.contractName = contractName
            self.storagePath = storagePath
            self.publicPath = publicPath
            self.privatePath = privatePath
            self.type = type
            self.publicLinkedType = publicLinkedType
            self.privateLinkedType = privateLinkedType
        }
    }

    /*
        We do not yet have a FT catalog, so FTs must be hardcoded for now.
    */
    pub fun getFtTemplate(vaultIdentifier: String): FTTemplate? {
        switch vaultIdentifier {
            case "flow":
                return FTTemplate(
                    contractName: "FlowToken",
                    storagePath: "/storage/flow",
                    publicPath: "/public/flow",
                    privatePath: "/private/flow",
                    type: Type<@FungibleToken.Vault>(),
                    publicLinkedType: Type<@FungibleToken.Vault>(),
                    privateLinkedType: Type<@FungibleToken.Vault>()
                )
            default:
                return nil
        }
    }

    pub fun getNftTemplate(collectionIdentifier: String): NFTTemplate? {
        let catalog = NFTCatalog.getCatalog()
        if catalog[collectionIdentifier] == nil {
            return nil
        }
        let catalogData = catalog[collectionIdentifier]!

        let publicLinkedType: Type = catalogData.collectionData.publicLinkedType
        let privateLinkedType: Type = catalogData.collectionData.privateLinkedType

        let storagePath = catalogData.collectionData.storagePath
        let publicPath = catalogData.collectionData.publicPath
        let privatePath = catalogData.collectionData.privatePath

        let contractName = StringUtils.split(catalogData.nftType.identifier, ".")[2]
        return NFTTemplate(
            contractName: contractName,
            storagePath: storagePath.toString(),
            publicPath: publicPath.toString(),
            privatePath: privatePath.toString(),
            type: catalogData.nftType,
            publicLinkedType: publicLinkedType,
            privateLinkedType: privateLinkedType
        )
    }

    pub fun createImports(imports: [Type]): String {
        var duplicates: {String: Bool} = {}
        var res: [String] = []
        let types: [String] = []

        for typeImport in imports {
            let mainTypeSplit = StringUtils.split(typeImport.identifier, "{")
            types.append(mainTypeSplit[0])

            // If this is a restricted type, we'd end up here.
            // Note that the last element will have a `}` appended, which
            // is consider okay in this context of what we are using it for.
            if (mainTypeSplit.length > 1) {
                let inheritedTypes = StringUtils.split(mainTypeSplit[1], ",")
                for inheritedType in inheritedTypes {
                    types.append(inheritedType)
                }
            }
        }

        for type in types {
            var line = "import "
            let typeSplit = StringUtils.split(type, ".")
            line = line.concat(typeSplit[2])
            line = line.concat(" from 0x")
            line = line.concat(typeSplit[1])

            // If we've already seen this import statement, skip it
            // This is possible because multiple of the same type can
            // be passed into this function
            if (duplicates[line] != nil) {
                continue
            }
            res.append(line)
            duplicates[line] = true
        }
        return StringUtils.join(res, "\n")
    }

    pub fun createStaticTypeFromType(_ type: Type): String {
        // A type identifier may come in like the following:
        // &A.01cf0e2f2f715450.ExampleNFT.Collection{A.01cf0e2f2f715450.ExampleNFT.ExampleNFTCollectionPublic}
        // and we would want:
        // &ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic}
        let typeIdentifier = type.identifier
        let types: [String] = []
        let mainTypeSplit = StringUtils.split(typeIdentifier, "{")
        types.append(mainTypeSplit[0])
        if (mainTypeSplit.length > 1) {
            let inheritedTypes = StringUtils.split(mainTypeSplit[1], ",")
            for inheritedType in inheritedTypes {
                types.append(inheritedType)
            }
        }
        let replaceableType = ArrayUtils.mapStrings(
            types,
            (fun (str: String): String {
                return StringUtils.join(["A", StringUtils.split(str, ".")[1]], ".").concat(".")
            })
        )
        var identifier = typeIdentifier
        for replaceable in replaceableType {
            identifier = StringUtils.replaceAll(identifier, replaceable, "")
        }
        return identifier
    }

    pub fun createNftSetupTxCode(
        authAccountName: String,
        nftTemplate: NFTTemplate,
        uniqueVariableKey: String
    ): String {
        let nftPublicLink = self.createStaticTypeFromType(nftTemplate.publicLinkedType)
        let nftPrivateLink = self.createStaticTypeFromType(nftTemplate.privateLinkedType)
        let lines: [[String]] = [
            ["if ", authAccountName, ".borrow<&", nftTemplate.contractName, ".Collection>(from: ", nftTemplate.storagePath, ") == nil {"],
            ["   let collection", uniqueVariableKey, " <- ", nftTemplate.contractName, ".createEmptyCollection()"],
            ["    ", authAccountName, ".save(<-collection", uniqueVariableKey, ", to: ", nftTemplate.storagePath, ")"],
            ["}"],
            ["if (", authAccountName, ".getCapability<", nftPublicLink, ">(", nftTemplate.publicPath, ").borrow() == nil) {"],
            ["    ", authAccountName, ".unlink(", nftTemplate.publicPath, ")"],
            ["    ", authAccountName, ".link<", nftPublicLink, ">(", nftTemplate.publicPath, ", target: ", nftTemplate.storagePath, ")"],
            ["}"],
            ["if (", authAccountName, ".getCapability<", nftPrivateLink, ">(", nftTemplate.privatePath, ").borrow() == nil) {"],
            ["    ", authAccountName, ".unlink(", nftTemplate.privatePath, ")"],
            ["    ", authAccountName, ".link<", nftPrivateLink, ">(", nftTemplate.privatePath, ", target: ", nftTemplate.storagePath, ")"],
            ["}"]
        ]
        var combinedLines: [String] = []
        for line in lines {
            combinedLines.append(StringUtils.join(line, ""))
        }
        return StringUtils.join(combinedLines, "\n")
    }

    pub fun createListingCode(
        _ authAccountName: String,
        _ nftTemplate: NFTTemplate,
        _ ftTemplate: FTTemplate,
    ): String {
        let nftPublicLink = self.createStaticTypeFromType(nftTemplate.publicLinkedType)
        let nftPrivateLink = self.createStaticTypeFromType(nftTemplate.privateLinkedType)
        
        let lines: [[String]] = [
            ["transaction(saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {"],
            ["    let ftReceiver: Capability<&AnyResource{FungibleToken.Receiver}>"],
            ["    let exampleNFTProvider: Capability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>"],
            ["    let storefront: &NFTStorefrontV2.Storefront"],
            ["    var saleCuts: [NFTStorefrontV2.SaleCut]"],
            ["    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]"],
            [""],
            ["    prepare(acct: AuthAccount) {"],
            ["        self.saleCuts = []"],
            ["        self.marketplacesCapability = []"],
            [""],
            ["        // Receiver for the sale cut."],
            ["        self.ftReceiver = acct.getCapability<&{FungibleToken.Receiver}>(", ftTemplate.publicPath, ")!"],
            ["        assert(self.ftReceiver.borrow() != nil, message: \"Missing or mis-typed token receiver\")"],
            [""],
            ["        // Set up NFT just to make sure the proper links are setup."],
            ["        "],
            [""],
            ["        // Set up FT to make sure this account can receive the proper currency"],
            ["        "],
            [""],
            ["        self.nftProvider = acct.getCapability<", nftPrivateLink, ">(", nftTemplate.privatePath, ")!"],
            ["        let collectionPub = acct"],
            ["            .getCapability(", nftTemplate.publicPath, ")"],
            ["            .borrow<", nftPublicLink, ">()"],
            ["            ?? panic(\"Could not borrow a reference to the collection\")"],
            ["        var totalRoyaltyCut = 0.0"],
            ["        let effectiveSaleItemPrice = saleItemPrice - commissionAmount"],
            [""],
            ["        let metadataPub = acct"],
            ["            .getCapability(", nftTemplate.publicPath, ")"],
            ["            .borrow<MetadataViews.Resolver>()"],
            ["        if (metadataPub != nil && metadataPub!.getViews().contains(Type<MetadataViews.Royalties>())) {"],
            ["            let royaltiesRef = metadataPub!.resolveView(Type<MetadataViews.Royalties>())?? panic(\"Unable to retrieve the royalties\")"],
            ["            let royalties = (royaltiesRef as! MetadataViews.Royalties).getRoyalties()"],
            ["            for royalty in royalties {"],
            ["                self.saleCuts.append(NFTStorefrontV2.SaleCut(receiver: royalty.receiver, amount: royalty.cut * effectiveSaleItemPrice))"],
            ["                totalRoyaltyCut = totalRoyaltyCut + royalty.cut * effectiveSaleItemPrice"],
            ["            }"],
            ["        }"],
            [""],
            ["        // Append the cut for the seller."],
            ["        self.saleCuts.append(NFTStorefrontV2.SaleCut("],
            ["            receiver: self.ftReceiver,"],
            ["            amount: effectiveSaleItemPrice - totalRoyaltyCut"],
            ["        ))"],
            ["        assert(self.nftProvider.borrow() != nil, message: \"Missing or mis-typed nftProvider\")"],
            [""],
            ["        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)"],
            ["            ?? panic(\"Missing or mis-typed NFTStorefront Storefront\")"],
            [""],
            ["        for marketplace in marketplacesAddress {"],
            ["            // Here we are making a fair assumption that all given addresses would have"],
            ["            // the capability to receive the `FlowToken`"],
            ["            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver))"],
            ["        }"],
            ["    }"],
            [""],
            ["    execute {"],
            ["        // Create listing"],
            ["        self.storefront.createListing("],
            ["            nftProviderCapability: self.nftProvider,"],
            ["            nftType: Type<@", self.createStaticTypeFromType(nftTemplate.type), ">(),"],
            ["            nftID: saleItemID,"],
            ["            salePaymentVaultType: Type<@", self.createStaticTypeFromType(ftTemplate.type), ">(),"],
            ["            saleCuts: self.saleCuts,"],
            ["            marketplacesCapability: self.marketplacesCapability.length == 0 ? nil : self.marketplacesCapability,"],
            ["            customID: customID,"],
            ["            commissionAmount: commissionAmount,"],
            ["            expiry: expiry"],
            ["        )"],
            ["    }"],
            ["}"],
            [""]]

        var combinedLines: [String] = []
        for line in lines {
            combinedLines.append(StringUtils.join(line, ""))
        }
        return StringUtils.join(combinedLines, "\n")
    }

    pub fun createCollectionInitializationTx(collectionIdentifier: String): String? {
        let nftTemplate = self.getNftTemplate(collectionIdentifier: collectionIdentifier)
        if nftTemplate == nil {
            return nil
        }
        let types: [Type] = [
            Type<NonFungibleToken>(),
            Type<MetadataViews>(),
            nftTemplate!.type,
            nftTemplate!.publicLinkedType,
            nftTemplate!.privateLinkedType
        ]
        let imports = self.createImports(imports: types)

        let transactionPieces: [String] = [
            "transaction {",
            "   prepare(signer: AuthAccount) {",
                    self.createNftSetupTxCode(
                        authAccountName: "signer",
                        nftTemplate: nftTemplate!,
                        uniqueVariableKey: ""
                    ),
            "   }",
            "}"
        ]
        return StringUtils.join([imports, StringUtils.join(transactionPieces, "\n")], "\n")
    }

    pub fun createStorefrontListingTx(collectionIdentifier: String, vaultIdentifier: String): String? {
        let nftTemplate = self.getNftTemplate(collectionIdentifier: collectionIdentifier)
        let ftTemplate = self.getFtTemplate(vaultIdentifier: vaultIdentifier)
        if (nftTemplate == nil || ftTemplate == nil) {
            return nil
        }

        let types: [Type] = [
            Type<FungibleToken>(),
            Type<NonFungibleToken>(),
            Type<MetadataViews>(),
            Type<NFTStorefrontV2>(),
            nftTemplate!.type,
            nftTemplate!.publicLinkedType,
            nftTemplate!.privateLinkedType,
            ftTemplate!.type,
            ftTemplate!.publicLinkedType,
            ftTemplate!.privateLinkedType
        ]

        let imports = self.createImports(imports: types)
        let listingCode = self.createListingCode("auth", nftTemplate!, ftTemplate!)
        
        return StringUtils.join([imports, listingCode], "\n")
    }

    pub fun createStorefrontBuyTx(collectionIdentifier: String, vaultIdentifier: String): String? {
        let nftTemplate = self.getNftTemplate(collectionIdentifier: collectionIdentifier)
        let ftTemplate = self.getFtTemplate(vaultIdentifier: vaultIdentifier)
        if (nftTemplate == nil || ftTemplate == nil) {
            return nil
        }

        let types: [Type] = [
            Type<FungibleToken>(),
            Type<NonFungibleToken>(),
            Type<MetadataViews>(),
            Type<NFTStorefrontV2>(),
            nftTemplate!.type,
            nftTemplate!.publicLinkedType,
            nftTemplate!.privateLinkedType,
            ftTemplate!.type,
            ftTemplate!.publicLinkedType,
            ftTemplate!.privateLinkedType
        ]

        let imports = self.createImports(imports: types)
        
        return imports
    }

    pub fun getSupportedTx(): [String] {
        return [
            "CollectionInitialization",
            "StorefrontListItem",
            "StorefrontBuyItem"
        ]
    }

    pub fun getTx(tx: String, params: {String: String}): String? {
        // Currently hardcoded vault identifier to `flow`
        switch tx {
            case "CollectionInitialization":
                return self.createCollectionInitializationTx(collectionIdentifier: params["collectionIdentifier"]!)
            case "StorefrontListItem":
                return self.createStorefrontListingTx(collectionIdentifier: params["collectionIdentifier"]!, vaultIdentifier: params["vaultIdentifier"]!)
            case "StorefrontBuyItem":
                return self.createStorefrontBuyTx(collectionIdentifier: params["collectionIdentifier"]!, vaultIdentifier: params["vaultIdentifier"]!)
            default:
                return nil
        }
    }

    init() {}
}