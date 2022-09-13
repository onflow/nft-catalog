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
// To add a new transaction, add to the `getSupportedTx()` returned list
// and add a new switch case for your template within the `getTx` function
//

pub contract TransactionGeneration {

    pub fun createTx(
        collectionIdentifier: String?,
        vaultIdentifier: String?,
        createTxCode: ((TransactionGenerationUtils.NFTSchema?,TransactionGenerationUtils.FTSchema?): String)
    ) : String? {
        var nftSchema: TransactionGenerationUtils.NFTSchema? = nil
        var ftSchema: TransactionGenerationUtils.FTSchema? = nil
        var importTypes: [Type] = [
            Type<FungibleToken>(),
            Type<NonFungibleToken>(),
            Type<MetadataViews>(),
            Type<NFTStorefrontV2>()
        ]
        if (collectionIdentifier != nil) {
            nftSchema = TransactionGenerationUtils.getNftSchema(collectionIdentifier: collectionIdentifier!)
            importTypes = importTypes.concat([
                nftSchema!.type,
                nftSchema!.publicLinkedType,
                nftSchema!.privateLinkedType
            ])
        }
        if (vaultIdentifier != nil) {
            ftSchema = TransactionGenerationUtils.getFtSchema(vaultIdentifier: vaultIdentifier!)
            importTypes = importTypes.concat([
                ftSchema!.type,
                ftSchema!.publicLinkedType,
                ftSchema!.privateLinkedType
            ])
        }
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

    pub fun getTx(tx: String, params: {String: String}): String? {
        // This function will get overrode, and utilized towards the end.
        // If we're unable to override this function due to not having a relevant template,
        // the function will not continue, and will just return nil
        var createTxCode: ((TransactionGenerationUtils.NFTSchema?,TransactionGenerationUtils.FTSchema?): String) = (
            fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                return ""
            }
        )
        switch tx {
            case "CollectionInitialization":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                    return TransactionTemplates.NFTInitTemplate(nftSchema: nftSchema, ftSchema: nil)
                })
            case "StorefrontListItem":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                    return TransactionTemplates.StorefrontListItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema)
                })
            case "StorefrontBuyItem":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                    return TransactionTemplates.StorefrontBuyItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema)
                })
            case "DapperBuyNFTMarketplace":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                    return TransactionTemplates.DapperBuyNFTMarketplace(nftSchema: nftSchema, ftSchema: ftSchema)
                })
            case "StorefrontRemoveItem":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                    return TransactionTemplates.StorefrontRemoveItemTemplate(nftSchema: nftSchema, ftSchema: ftSchema)
                })
            case "DapperCreateListing":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                    return TransactionTemplates.DapperCreateListingTemplate(nftSchema: nftSchema, ftSchema: ftSchema)
                })
            case "DapperBuyNFTDirect":
                createTxCode = (fun (nftSchema: TransactionGenerationUtils.NFTSchema?,ftSchema: TransactionGenerationUtils.FTSchema?): String {
                    return TransactionTemplates.DapperBuyNFTDirectTemplate(nftSchema: nftSchema, ftSchema: ftSchema)
                })
            default:
                return nil
        }
        return self.createTx(
            collectionIdentifier: params["collectionIdentifier"],
            vaultIdentifier: params["vaultIdentifier"],
            createTxCode: createTxCode
        )
    }

    init() {}
}