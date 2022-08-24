/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '@onflow/flow-cadut'

export const CODE = `
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/ExampleNFT.cdc"

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account
        .getCapability(ExampleNFT.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
`;

/**
* Method to generate cadence code for getExamplenftCollectionLength script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getExamplenftCollectionLengthTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getExamplenftCollectionLength =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getExamplenftCollectionLength = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getExamplenftCollectionLengthTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `getExamplenftCollectionLength =>`);

  return executeScript({code, processed: true, ...props})
}