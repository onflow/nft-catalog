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
    return proxyCap.check()
}
`;

/**
* Method to generate cadence code for hasAdminProxy script
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const hasAdminProxyTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `hasAdminProxy =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const hasAdminProxy = async (props = {}) => {
  const { addressMap = {}, args = [] } = props
  const code = await hasAdminProxyTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `hasAdminProxy =>`);

  return executeScript({code, processed: true, ...props})
}