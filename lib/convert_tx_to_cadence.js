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

const { cadence } = require('@onflow/fcl');
const fs = require('fs')
const fileName = process.argv[2]

const file = fs.readFileSync(fileName);

let code = file.toString()
const transactionStart = code.indexOf('transaction')
code = code.substring(transactionStart, code.length)
const split = code.split('\n')

let cadenceCode = []

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
  line = line.replaceAll('${cI.type}', '@' + r('self.createStaticTypeFromType(nftTemplate.type)'))
  line = line.replaceAll('${vI.type}', '@' + r('self.createStaticTypeFromType(ftTemplate.type)'))
  line = line.replaceAll('${cI.publicLinkedType}', r('nftPublicLink'))
  line = line.replaceAll('${vI.publicLinkedType}', r('ftPublicLink'))
  line = line.replaceAll('${cI.privateLinkedType}', r('nftPrivateLink'))
  line = line.replaceAll('${vI.privateLinkedType}', r('ftPrivateLink'))
  
  cadenceCode.push(`["${line}"],`)
}

cadenceCode.push(`[""]]`)

const finalCode = cadenceCode.join('\n')
console.log(finalCode)
