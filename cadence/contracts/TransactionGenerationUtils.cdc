import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"
import StringUtils from "./StringUtils.cdc"
import ArrayUtils from "./ArrayUtils.cdc"

// TransactionGenerationUtils
//
// A helper to generate common, useful transaction code
// leveraging the NFTCatalog Smart Contract
//
// WIP made by amit
//

pub contract TransactionGenerationUtils {
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

    // TODO: This does not setup the private link yet.
    pub fun createSetupTxCode(
        authAccountName: String,
        contractName: String,
        storagePath: String,
        publicPath: String,
        privatePath: String,
        publicLinkedType: Type,
        privateLinkedType: Type,
        uniqueVariableKey: String // Taken from Schwap templating playbook.
        // If you don't know what to pass in here, can just pass in an empty string in most cases.
    ): String {
        let publicLink = self.createStaticTypeFromType(publicLinkedType)
        let privateLink = self.createStaticTypeFromType(privateLinkedType)
        let lines: [[String]] = [
            ["if ", authAccountName, ".borrow<&", contractName, ".Collection>(from: ", storagePath, ") == nil {"],
            ["   let collection", uniqueVariableKey, " <- ", contractName, ".createEmptyCollection()"],
            ["    ", authAccountName, ".save(<-collection", uniqueVariableKey, ", to: ", storagePath, ")"],
            ["}"],
            ["if (", authAccountName, ".getCapability<", publicLink, ">(", publicPath, ").borrow() == nil) {"],
            ["    ", authAccountName, ".unlink(", publicPath, ")"],
            ["    ", authAccountName, ".link<", publicLink, ">(", publicPath, "}, target: ", storagePath, ")"],
            ["}"]
        ]
        var combinedLines: [String] = []
        for line in lines {
            combinedLines.append(StringUtils.join(line, ""))
        }
        return StringUtils.join(combinedLines, "\n")
    }

    pub fun createInitTransaction(collectionIdentifier: String): String? {
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

        let types: [Type] = [Type<NonFungibleToken>(), Type<MetadataViews>(), catalogData.nftType, publicLinkedType, privateLinkedType]

        let imports = self.createImports(imports: types)

        let contractName = StringUtils.split(catalogData.nftType.identifier, ".")[2]

        let transactionPieces: [String] = [
            "transaction {",
            "   prepare(signer: AuthAccount) {",
                    self.createSetupTxCode(
                        authAccountName: "signer",
                        contractName: contractName,
                        storagePath: storagePath.toString(),
                        publicPath: publicPath.toString(),
                        privatePath: privatePath.toString(),
                        publicLinkedType: publicLinkedType,
                        privateLinkedType: privateLinkedType,
                        uniqueVariableKey: ""
                    ),
            "   }",
            "}"
        ]
        return StringUtils.join([imports, StringUtils.join(transactionPieces, "\n")], "\n")
    }

    init() {}
}