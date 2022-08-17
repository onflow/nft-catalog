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

    pub fun createCollectionInitializationTx(collectionIdentifier: String): String? {
        let nftSchema = TransactionGenerationUtils.getNftSchema(collectionIdentifier: collectionIdentifier)
        if nftSchema == nil {
            return nil
        }
        let types: [Type] = [
            Type<NonFungibleToken>(),
            Type<MetadataViews>(),
            nftSchema!.type,
            nftSchema!.publicLinkedType,
            nftSchema!.privateLinkedType
        ]
        let imports = TransactionGenerationUtils.createImports(imports: types)

        let tx = TransactionTemplates.NFTInitTemplate(nftSchema: nftSchema, ftSchema: nil)    

        return StringUtils.join([imports, tx], "\n")
    }

    pub fun createStorefrontListingTx(collectionIdentifier: String, vaultIdentifier: String): String? {
        let nftSchema = TransactionGenerationUtils.getNftSchema(collectionIdentifier: collectionIdentifier)
        let ftSchema = TransactionGenerationUtils.getFtSchema(vaultIdentifier: vaultIdentifier)
        if (nftSchema == nil || ftSchema == nil) {
            return nil
        }

        let types: [Type] = [
            Type<FungibleToken>(),
            Type<NonFungibleToken>(),
            Type<MetadataViews>(),
            Type<NFTStorefrontV2>(),
            nftSchema!.type,
            nftSchema!.publicLinkedType,
            nftSchema!.privateLinkedType,
            ftSchema!.type,
            ftSchema!.publicLinkedType,
            ftSchema!.privateLinkedType
        ]

        let imports = TransactionGenerationUtils.createImports(imports: types)
        let tx = TransactionTemplates.StorefrontListItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema)
        
        return StringUtils.join([imports, tx], "\n")
    }

    pub fun createStorefrontBuyTx(collectionIdentifier: String, vaultIdentifier: String): String? {
        let nftSchema = TransactionGenerationUtils.getNftSchema(collectionIdentifier: collectionIdentifier)
        let ftSchema = TransactionGenerationUtils.getFtSchema(vaultIdentifier: vaultIdentifier)
        if (nftSchema == nil || ftSchema == nil) {
            return nil
        }

        let types: [Type] = [
            Type<FungibleToken>(),
            Type<NonFungibleToken>(),
            Type<MetadataViews>(),
            Type<NFTStorefrontV2>(),
            nftSchema!.type,
            nftSchema!.publicLinkedType,
            nftSchema!.privateLinkedType,
            ftSchema!.type,
            ftSchema!.publicLinkedType,
            ftSchema!.privateLinkedType
        ]

        let imports = TransactionGenerationUtils.createImports(imports: types)
        let tx = TransactionTemplates.StorefrontBuyItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema)
        
        return StringUtils.join([imports, tx], "\n")
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