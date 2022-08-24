/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '@onflow/flow-cadut'

export const CODE = `
import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub fun main(ownerAddress: Address) : {String : [UInt64]} {
    let catalog = NFTCatalog.getCatalog()
    let account = getAuthAccount(ownerAddress)

    let items : {String : [UInt64]} = {}

    for key in catalog.keys {
        let value = catalog[key]!
        let tempPathStr = "catalogIDs".concat(key)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!
        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
        if !collectionCap.check() {
            continue
        }

        let ids = NFTRetrieval.getNFTIDsFromCap(collectionIdentifier : key, collectionCap : collectionCap)

        if ids.length > 0 {
            items[key] = ids
        }
    }
    return items

}
`;

/**
* Method to generate cadence code for getNftIdsInAccount script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const getNftIdsInAccountTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `getNftIdsInAccount =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const getNftIdsInAccount = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await getNftIdsInAccountTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `getNftIdsInAccount =>`);

  return executeScript({code, processed: true, ...props})
}