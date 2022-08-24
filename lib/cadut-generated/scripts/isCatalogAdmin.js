/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '@onflow/flow-cadut'

export const CODE = `
import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

pub fun main(ownerAddress: Address) : Bool {
    let owner = getAccount(ownerAddress)
    let proxyCap = owner.getCapability<&NFTCatalogAdmin.AdminProxy{NFTCatalogAdmin.IAdminProxy}>(NFTCatalogAdmin.AdminProxyPublicPath)
    if !proxyCap.check() {
        return false
    }
    let proxyRef = proxyCap.borrow()!
    return proxyRef.hasCapability()
}
`;

/**
* Method to generate cadence code for isCatalogAdmin script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const isCatalogAdminTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `isCatalogAdmin =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const isCatalogAdmin = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await isCatalogAdminTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `isCatalogAdmin =>`);

  return executeScript({code, processed: true, ...props})
}