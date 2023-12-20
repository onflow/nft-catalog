import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"
import NonFungibleToken from "NonFungibleToken"
import MetadataViews from "MetadataViews"
import NFTCatalog from "NFTCatalog"
import StringUtils from "StringUtils"
import ArrayUtils from "ArrayUtils"
import NFTStorefrontV2 from "NFTStorefrontV2"
import DapperUtilityCoin from "DapperUtilityCoin"
import FlowUtilityToken from "FlowUtilityToken"

// TransactionGenerationUtils
//
// A helper to generate common, useful transaction code
// leveraging the NFTCatalog Smart Contract
//
// WIP made by amit
//

access(all) contract TransactionGenerationUtils {
    access(all) struct interface TokenSchema {
        access(all) let identifier: String
        access(all) let contractName: String
        access(all) let storagePath: String
        access(all) let publicPath: String
        access(all) let privatePath: String
        access(all) let type: Type
        access(all) let publicLinkedType: Type
        access(all) let privateLinkedType: Type
    }

    access(all) struct FTSchema: TokenSchema {
        access(all) let identifier: String
        access(all) let contractName: String
        access(all) let storagePath: String
        access(all) let publicPath: String
        access(all) let privatePath: String
        access(all) let type: Type
        access(all) let publicLinkedType: Type
        access(all) let privateLinkedType: Type
        init(
            identifier: String,
            contractName: String,
            storagePath: String,
            publicPath: String,
            privatePath: String,
            type: Type,
            publicLinkedType: Type,
            privateLinkedType: Type
        ) {
            self.identifier = identifier
            self.contractName = contractName
            self.storagePath = storagePath
            self.publicPath = publicPath
            self.privatePath = privatePath
            self.type = type
            self.publicLinkedType = publicLinkedType
            self.privateLinkedType = privateLinkedType
        }
    }

    access(all) struct FTSchemaV2: TokenSchema {
        access(all) let identifier: String
        access(all) let contractName: String
        access(all) let storagePath: String
        access(all) let publicPath: String
        access(all) let privatePath: String
        access(all) let type: Type
        access(all) let publicLinkedType: Type
        access(all) let privateLinkedType: Type
        access(all) let receiverStoragePath : String?
        
        init(
            identifier: String,
            contractName: String,
            storagePath: String,
            publicPath: String,
            privatePath: String,
            type: Type,
            publicLinkedType: Type,
            privateLinkedType: Type,
            receiverStoragePath: String?
        ) {
            self.identifier = identifier
            self.contractName = contractName
            self.storagePath = storagePath
            self.publicPath = publicPath
            self.privatePath = privatePath
            self.type = type
            self.publicLinkedType = publicLinkedType
            self.privateLinkedType = privateLinkedType
            self.receiverStoragePath = receiverStoragePath
        }
    }

    access(all) struct NFTSchema: TokenSchema {
        access(all) let identifier: String
        access(all) let contractName: String
        access(all) let storagePath: String
        access(all) let publicPath: String
        access(all) let privatePath: String
        access(all) let type: Type
        access(all) let publicLinkedType: Type
        access(all) let privateLinkedType: Type
        init(
            identifier: String,
            contractName: String,
            storagePath: String,
            publicPath: String,
            privatePath: String,
            type: Type,
            publicLinkedType: Type,
            privateLinkedType: Type
        ) {
            self.identifier = identifier
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
    access(all) fun getFtSchema(vaultIdentifier: String): FTSchemaV2? {
        switch vaultIdentifier {
            case "flow":
                return FTSchemaV2(
                    identifier: vaultIdentifier,
                    contractName: "FlowToken",
                    storagePath: "/storage/flowTokenVault",
                    publicPath: "/public/flow",
                    privatePath: "/private/flow",
                    type: Type<@FlowToken.Vault>(),
                    publicLinkedType: Type<@FlowToken.Vault>(),
                    privateLinkedType: Type<auth(NonFungibleToken.Withdrawable) &FlowToken.Vault>(),
                    receiverStoragePath : nil
                )
            case "duc":
                return FTSchemaV2(
                    identifier: vaultIdentifier,
                    contractName: "DapperUtilityCoin",
                    storagePath: "/storage/dapperUtilityCoinVault",
                    publicPath: "/public/dapperUtilityCoinReceiver",
                    privatePath: "/private/dapperUtilityCoinVault",
                    type: Type<@DapperUtilityCoin.Vault>(),
                    publicLinkedType: Type<@DapperUtilityCoin.Vault>(),
                    privateLinkedType: Type<auth(NonFungibleToken.Withdrawable) &DapperUtilityCoin.Vault>(),
                    receiverStoragePath : "/storage/dapperUtilityCoinReceiver"
                )
            case "fut":
                return FTSchemaV2(
                    identifier: vaultIdentifier,
                    contractName: "FlowUtilityToken",
                    storagePath: "/storage/flowUtilityTokenVault",
                    publicPath: "/public/flowUtilityTokenReceiver",
                    privatePath: "",
                    type: Type<@FlowUtilityToken.Vault>(),
                    publicLinkedType: Type<@FlowUtilityToken.Vault>(),
                    privateLinkedType: Type<auth(NonFungibleToken.Withdrawable) &FlowUtilityToken.Vault>(),
                    receiverStoragePath : "/storage/flowUtilityTokenReceiver"
                )
            default:
                return nil
        }
    }

    access(all) fun getNftSchema(collectionIdentifier: String): NFTSchema? {
        let catalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)
        if catalogEntry == nil {
            return nil
        }
        let catalogData = catalogEntry!

        let publicLinkedType: Type = catalogData.collectionData.publicLinkedType
        let privateLinkedType: Type = catalogData.collectionData.privateLinkedType

        let storagePath = catalogData.collectionData.storagePath
        let publicPath = catalogData.collectionData.publicPath
        let privatePath = catalogData.collectionData.privatePath

        let contractName = StringUtils.split(catalogData.nftType.identifier, ".")[2]
        return NFTSchema(
            identifier: collectionIdentifier,
            contractName: contractName,
            storagePath: storagePath.toString(),
            publicPath: publicPath.toString(),
            privatePath: privatePath.toString(),
            type: catalogData.nftType,
            publicLinkedType: publicLinkedType,
            privateLinkedType: privateLinkedType
        )
    }

    access(all) fun createImports(imports: [Type]): String {
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

    access(all) fun getAddressFromType(_ type: Type): String {
        let typeStr = type.identifier
        return "0x".concat(StringUtils.split(typeStr, ".")[1])
    }

    access(all) fun createStaticTypeFromType(_ type: Type): String {
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

        if (identifier[0] == "&") {
            return identifier.slice(from: 1, upTo: identifier.length)
        } else {
            return identifier
        }
    }

    init() {}
}