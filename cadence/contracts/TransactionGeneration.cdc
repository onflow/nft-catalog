import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"
import StringUtils from "./StringUtils.cdc"
import ArrayUtils from "./ArrayUtils.cdc"
import NFTStorefrontV2 from "./NFTStorefrontV2.cdc"
import TransactionGenerationUtils from "./TransactionGenerationUtils.cdc"
import TransactionTemplates from "./TransactionTemplates.cdc"

// TransactionGeneration
//
// An entrance point to generating transactions with the nft and ft
// catalog related collections
//
// WIP made by amit
//

pub contract TransactionGeneration {
    

    pub fun createNftSetupTxCode(
        authAccountName: String,
        nftTemplate: TransactionGenerationUtils.NFTTemplate,
        uniqueVariableKey: String
    ): String {
        let nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.publicLinkedType)
        let nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.privateLinkedType)
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

    pub fun createCollectionInitializationTx(collectionIdentifier: String): String? {
        let nftTemplate = TransactionGenerationUtils.getNftTemplate(collectionIdentifier: collectionIdentifier)
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
        let imports = TransactionGenerationUtils.createImports(imports: types)

        let tx = TransactionTemplates.NFTInitTemplate(nftTemplate: nftTemplate, ftTemplate: nil)    

        return StringUtils.join([imports, tx], "\n")
    }

    pub fun createStorefrontListingTx(collectionIdentifier: String, vaultIdentifier: String): String? {
        let nftTemplate = TransactionGenerationUtils.getNftTemplate(collectionIdentifier: collectionIdentifier)
        let ftTemplate = TransactionGenerationUtils.getFtTemplate(vaultIdentifier: vaultIdentifier)
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

        let imports = TransactionGenerationUtils.createImports(imports: types)
        let tx = TransactionTemplates.StorefrontListItemTemplate(nftTemplate: nftTemplate, ftTemplate: ftTemplate)
        
        return StringUtils.join([imports, tx], "\n")
    }

    pub fun createStorefrontBuyTx(collectionIdentifier: String, vaultIdentifier: String): String? {
        let nftTemplate = TransactionGenerationUtils.getNftTemplate(collectionIdentifier: collectionIdentifier)
        let ftTemplate = TransactionGenerationUtils.getFtTemplate(vaultIdentifier: vaultIdentifier)
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

        let imports = TransactionGenerationUtils.createImports(imports: types)
        
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