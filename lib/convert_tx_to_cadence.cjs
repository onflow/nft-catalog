/*
    Template parameters:
    Wrap template in ${} to be replaced
    
    collectionIdentifier + vaultIdentifier
    {cI.field} and {vI.field}

        available template fields within `cI and vI`:
            pub let contractName: String
            pub let storagePath: String
            pub let publicPath: String
            pub let privatePath: String
            pub let type: Type
            pub let publicLinkedType: Type
            pub let privateLinkedType: Type

    createFtSetupTx == Replace with create ft setup tx code
    createNftSetupTx == Replace with create nft setup tx code
*/

const version = require('../package.json').version

function r(str) {
  return `", ${str}, "`
}

const fs = require('fs')

const files = [
  __dirname + "/tx/NFTInitTemplate.cdc",
  __dirname + "/tx/StorefrontListItemTemplate.cdc",
  __dirname + "/tx/StorefrontBuyItemTemplate.cdc",
  __dirname + "/tx/DapperBuyNFTMarketplaceTemplate.cdc",
  __dirname + "/tx/StorefrontRemoveItemTemplate.cdc",
  __dirname + "/tx/DapperCreateListingTemplate.cdc",
  __dirname + "/tx/DapperBuyNFTDirectTemplate.cdc",
  __dirname + "/scripts/DapperGetPrimaryListingMetadataTemplate.cdc",
  __dirname + "/scripts/DapperGetSecondaryListingMetadataTemplate.cdc"
]

let finalCode = `
// TransactionTemplates is an auto-generated contract created from https://github.com/dapperlabs/nft-catalog
//
// Why is this string stuff on-chain?!?
// This is on-chain and consummable from a Cadence script in order to allow consumers
// to be able to pull relevant transactions from wherever cadence is able to be executed.
// JS-specific support including an NPM module is available at the above github.
//

import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"
import StringUtils from "./StringUtils.cdc"
import ArrayUtils from "./ArrayUtils.cdc"
import NFTStorefrontV2 from "./NFTStorefrontV2.cdc"
import TransactionGenerationUtils from "./TransactionGenerationUtils.cdc"

pub contract TransactionTemplates {
`

let supportedFuncs = []
for (let fileName in files) {
  const fileSplit = files[fileName].split('/')
  const funcName = fileSplit[fileSplit.length - 1].replace(/\.cdc/, '')
  supportedFuncs.push(funcName)
}
finalCode = finalCode + (`
/*
  The following functions are available:
  ${supportedFuncs.join(', ')}
*/`
)

for (let fileName in files ) {
  const file = fs.readFileSync(files[fileName]);

  let code = file.toString()
  const transactionStart = 0
  code = code.substring(transactionStart, code.length)
  const split = code.split('\n')

  let cadenceCode = []

  const fileSplit = files[fileName].split('/')

  const funcName = fileSplit[fileSplit.length - 1].replace(/\.cdc/, '')

  cadenceCode.push(`pub fun ${funcName}(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {`)

  cadenceCode.push(`
    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  `)
  cadenceCode.push(`let lines: [[String]] = [`)
  for (let curLine in split) {
    let line = split[curLine];
    
    // Replace all relevant template items
    // All replacements are made by splitting around the location
    //and making it a separate entry in the string array result.
    line = line.replaceAll('"', `\\"`)

    // TODO: These currently cause computation limits to go too high. Need some optimizations before doing the following:
    // Possible optimization is to make this line creation a single big string, rather than array of [string]
    line = line.replaceAll('${createNftSetupTx}', '')
    line = line.replaceAll('${createFtSetupTx}', '')

    line = line.replaceAll('${cI.contractName}', r('nftSchema!.contractName'))
    line = line.replaceAll('${vI.contractName}', r('ftSchema!.contractName'))
    line = line.replaceAll('${cI.storagePath}', r('nftSchema!.storagePath'))
    line = line.replaceAll('${vI.storagePath}', r('ftSchema!.storagePath'))
    line = line.replaceAll('${cI.publicPath}', r('nftSchema!.publicPath'))
    line = line.replaceAll('${vI.publicPath}', r('ftSchema!.publicPath'))
    line = line.replaceAll('${cI.privatePath}', r('nftSchema!.privatePath'))
    line = line.replaceAll('${vI.privatePath}', r('ftSchema!.privatePath'))
    line = line.replaceAll('${cI.type}', '@' + r('TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.type)'))
    line = line.replaceAll('${vI.type}', '@' + r('TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.type)'))
    line = line.replaceAll('${vI.contractAddress}', r('TransactionGenerationUtils.getAddressFromType(ftSchema!.type)'))
    line = line.replaceAll('${cI.publicLinkedType}', r('nftPublicLink'))
    line = line.replaceAll('${vI.publicLinkedType}', r('ftPublicLink'))
    line = line.replaceAll('${cI.privateLinkedType}', r('nftPrivateLink'))
    line = line.replaceAll('${vI.privateLinkedType}', r('ftPrivateLink'))
    line = line.replaceAll('${cI.identifier}', r('nftSchema!.identifier'))
    line = line.replaceAll('${vI.identifier}', r('ftSchema!.identifier'))
    line = line.replaceAll('${vI.receiverStoragePath}', r('ftSchema!.receiverStoragePath ?? ""'))
    line = line.replaceAll('${version}', version)
    line = line.replaceAll('${p.merchantAddress}', r('params!["merchantAddress"]!'))
    
    cadenceCode.push(`["${line}"],`)
  }

  cadenceCode.push(`[""]]`)

  // combine `lines` here
  cadenceCode.push(`var combinedLines: [String] = []`)
  cadenceCode.push(`for line in lines {`)
    cadenceCode.push(`combinedLines.append(StringUtils.join(line, ""))`)
  cadenceCode.push(`}`)
  cadenceCode.push(`return StringUtils.join(combinedLines, "\\n")`)
  cadenceCode.push(`}`)

  const result = cadenceCode.join('\n')
  finalCode = finalCode + '\n' + result
}

finalCode = finalCode + '\n' + '}'

console.log(finalCode.trim())
