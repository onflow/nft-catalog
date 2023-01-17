import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"
import StringUtils from "./StringUtils.cdc"
import ArrayUtils from "./ArrayUtils.cdc"
import NFTStorefrontV2 from "./NFTStorefrontV2.cdc"
import TransactionGenerationUtils from "./TransactionGenerationUtils.cdc"
import TransactionTemplates from "./TransactionTemplates.cdc"
import TokenForwarding from "./TokenForwarding.cdc"

// TransactionGeneration
//
// An entrance point to generating transactions with the nft and ft
// catalog related collections
//
// To add a new transaction, add to the `getSupportedTx()` returned list
// and add a new switch case for your template within the `getTx` function
//

pub contract TransactionGeneration {

    pub fun createTxFromSchemas(
        nftSchema: TransactionGenerationUtils.NFTSchema?,
        ftSchema: TransactionGenerationUtils.FTSchemaV2?,
        createTxCode: ((TransactionGenerationUtils.NFTSchema?,TransactionGenerationUtils.FTSchemaV2?): String),
        importTypes: [Type]
    ) : String? {
        let imports = TransactionGenerationUtils.createImports(imports: importTypes)
        let tx = createTxCode(nftSchema, ftSchema)
        return StringUtils.join([imports, tx!], "\n")
    }

    pub fun getSupportedTx(): [String] {
        return [
            "CollectionInitialization",
            "StorefrontListItem",
            "StorefrontBuyItem",
            "StorefrontRemoveItem",
            "DapperBuyNFTMarketplace",
            "DapperCreateListing",
            "DapperBuyNFTDirect"
        ]
    }

    pub fun getSupportedScripts(): [String] {
        return [
            "DapperGetPrimaryListingMetadata",
            "DapperGetSecondaryListingMetadata"
        ]
    }

    pub fun getTx(tx: String, params: {String: String}): String? {
        let collectionIdentifier = params["collectionIdentifier"]
        let vaultIdentifier = params["vaultIdentifier"]
        
        var nftSchema: TransactionGenerationUtils.NFTSchema? = nil
        var ftSchema: TransactionGenerationUtils.FTSchemaV2? = nil
        
        // Composition of all imports that are needed for the given transaction
        var importTypes: [Type] = []

        var nftImportTypes: [Type] = []
        var ftImportTypes: [Type] = []
        var storefrontTypes: [Type] = [ Type<NFTStorefrontV2>() ]
        var tokenForwardingTypes: [Type] = [ Type<TokenForwarding>() ]

        // This createTxCode function will get overrode, and utilized towards the end.
        // If we're unable to override this function due to not having a relevant template,
        // the function will not continue, and will just return nil
        var createTxCode: ((TransactionGenerationUtils.NFTSchema?,TransactionGenerationUtils.FTSchemaV2?): String) = (
            fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                return ""
            }
        )

        if (collectionIdentifier != nil) {
            nftSchema = TransactionGenerationUtils.getNftSchema(collectionIdentifier: collectionIdentifier!)
            nftImportTypes = [
                nftSchema!.type,
                nftSchema!.publicLinkedType,
                nftSchema!.privateLinkedType,
                Type<NonFungibleToken>(),
                Type<MetadataViews>()
            ]
        }
        if (vaultIdentifier != nil) {
            ftSchema = TransactionGenerationUtils.getFtSchema(vaultIdentifier: vaultIdentifier!)
            ftImportTypes = [
                ftSchema!.type,
                ftSchema!.publicLinkedType,
                ftSchema!.privateLinkedType,
                Type<FungibleToken>()
            ]
        }

        switch tx {
            case "CollectionInitialization":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.NFTInitTemplate(nftSchema: nftSchema, ftSchema: nil, params: nil)
                })
                importTypes = nftImportTypes
            case "StorefrontListItem":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.StorefrontListItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: nil)
                })
                importTypes = nftImportTypes.concat(ftImportTypes).concat(storefrontTypes)
            case "StorefrontBuyItem":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.StorefrontBuyItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: nil)
                })
                importTypes = nftImportTypes.concat(ftImportTypes).concat(storefrontTypes)
            case "StorefrontRemoveItem":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.StorefrontRemoveItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: nil)
                })
                importTypes = storefrontTypes
            case "DapperBuyNFTMarketplace":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.DapperBuyNFTMarketplaceTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: nil)
                })
                importTypes = nftImportTypes.concat(ftImportTypes).concat(storefrontTypes)
            case "DapperCreateListing":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.DapperCreateListingTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: nil)
                })
                importTypes = nftImportTypes.concat(ftImportTypes).concat(storefrontTypes).concat(tokenForwardingTypes)
            case "DapperBuyNFTDirect":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.DapperBuyNFTDirectTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: params)
                })
                importTypes = nftImportTypes.concat(ftImportTypes).concat(storefrontTypes)
            case "DapperGetPrimaryListingMetadata":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.DapperGetPrimaryListingMetadataTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: nil)
                })
                importTypes = nftImportTypes.concat(storefrontTypes)
            case "DapperGetSecondaryListingMetadata":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchemaV2?): String {
                    return TransactionTemplates.DapperGetSecondaryListingMetadataTemplate(nftSchema: nftSchema, ftSchema: ftSchema, params: nil)
                })
                importTypes = nftImportTypes.concat(storefrontTypes)
            default:
                return nil
        }

        return self.createTxFromSchemas(
            nftSchema: nftSchema,
            ftSchema: ftSchema,
            createTxCode: createTxCode,
            importTypes: importTypes
        )
    }

    init() {}
}
