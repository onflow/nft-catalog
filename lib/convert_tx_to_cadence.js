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

function r(str) {
  return `", ${str}, "`
}
const fs = require('fs')

const files = [
  //"./lib/tx/StorefrontBuyItemTemplate.cdc",
  __dirname + "/tx/StorefrontListItemTemplate.cdc"
]

let finalCode = `
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
  const transactionStart = code.indexOf('transaction')
  code = code.substring(transactionStart, code.length)
  const split = code.split('\n')

  let cadenceCode = []

  const fileSplit = files[fileName].split('/')

  const funcName = fileSplit[fileSplit.length - 1].replace(/\.cdc/, '')

  cadenceCode.push(`pub fun ${funcName}(nftTemplate: TransactionGenerationUtils.NFTTemplate, ftTemplate: TransactionGenerationUtils.FTTemplate) {`)

  cadenceCode.push(`
    let nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.publicLinkedType)
    let nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.privateLinkedType)
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

    line = line.replaceAll('${cI.contractName}', r('nftTemplate.contractName'))
    line = line.replaceAll('${vI.contractName}', r('ftTemplate.contractName'))
    line = line.replaceAll('${cI.storagePath}', r('nftTemplate.storagePath'))
    line = line.replaceAll('${vI.storagePath}', r('ftTemplate.storagePath'))
    line = line.replaceAll('${cI.publicPath}', r('nftTemplate.publicPath'))
    line = line.replaceAll('${vI.publicPath}', r('ftTemplate.publicPath'))
    line = line.replaceAll('${cI.privatePath}', r('nftTemplate.privatePath'))
    line = line.replaceAll('${vI.privatePath}', r('ftTemplate.privatePath'))
    line = line.replaceAll('${cI.type}', '@' + r('TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.type)'))
    line = line.replaceAll('${vI.type}', '@' + r('TransactionGenerationUtils.createStaticTypeFromType(ftTemplate.type)'))
    line = line.replaceAll('${cI.publicLinkedType}', r('nftPublicLink'))
    line = line.replaceAll('${vI.publicLinkedType}', r('ftPublicLink'))
    line = line.replaceAll('${cI.privateLinkedType}', r('nftPrivateLink'))
    line = line.replaceAll('${vI.privateLinkedType}', r('ftPrivateLink'))
    
    cadenceCode.push(`["${line}"],`)
  }

  cadenceCode.push(`[""]]`)
  cadenceCode.push(`}`)

  const result = cadenceCode.join('\n')
  finalCode = finalCode + '\n' + result
}

finalCode = finalCode + '\n' + '}'

console.log(finalCode)
