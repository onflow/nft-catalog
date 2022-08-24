/** pragma type contract **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  deployContract,
} from '@onflow/flow-cadut'

export const CODE = `
import FungibleToken from "./FungibleToken.cdc"
import FlowToken from "./FlowToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"
import StringUtils from "./StringUtils.cdc"
import ArrayUtils from "./ArrayUtils.cdc"
import NFTStorefrontV2 from "./NFTStorefrontV2.cdc"

// TransactionGenerationUtils
//
// A helper to generate common, useful transaction code
// leveraging the NFTCatalog Smart Contract
//
// WIP made by amit
//

pub contract TransactionGenerationUtils {
    pub struct interface TokenSchema {
        pub let contractName: String
        pub let storagePath: String
        pub let publicPath: String
        pub let privatePath: String
        pub let type: Type
        pub let publicLinkedType: Type
        pub let privateLinkedType: Type
    }

    pub struct FTSchema: TokenSchema {
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

    pub struct NFTSchema: TokenSchema {
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
    pub fun getFtSchema(vaultIdentifier: String): FTSchema? {
        switch vaultIdentifier {
            case "flow":
                return FTSchema(
                    contractName: "FlowToken",
                    storagePath: "/storage/flowTokenVault",
                    publicPath: "/public/flow",
                    privatePath: "/private/flow",
                    type: Type<@FlowToken.Vault>(),
                    publicLinkedType: Type<@FlowToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>(),
                    privateLinkedType: Type<@FlowToken.Vault{FungibleToken.Provider}>()
                )
            default:
                return nil
        }
    }

    pub fun getNftSchema(collectionIdentifier: String): NFTSchema? {
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
        return NFTSchema(
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
            // Note that the last element will have a '}' appended, which
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

        if (identifier[0] == "&") {
            return identifier.slice(from: 1, upTo: identifier.length)
        } else {
            return identifier
        }
    }

    init() {}
}
`;

/**
* Method to generate cadence code for TransactionGenerationUtils contract
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const TransactionGenerationUtilsTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `TransactionGenerationUtils =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Deploys TransactionGenerationUtils transaction to the network
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> args - list of arguments
* param Array<string> - list of signers
*/
export const  deployTransactionGenerationUtils = async (props) => {
  const { addressMap = {} } = props;
  const code = await TransactionGenerationUtilsTemplate(addressMap);
  const name = "TransactionGenerationUtils"

  return deployContract({ code, name, processed: true, ...props })
}