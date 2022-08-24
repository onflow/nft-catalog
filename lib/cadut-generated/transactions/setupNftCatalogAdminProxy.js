/** pragma type transaction **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  sendTransaction
} from '@onflow/flow-cadut'

export const CODE = `
import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction() {
    
    prepare(acct: AuthAccount) {
        acct.save(<- NFTCatalogAdmin.createAdminProxy(), to: NFTCatalogAdmin.AdminProxyStoragePath)
        acct.link<&NFTCatalogAdmin.AdminProxy{NFTCatalogAdmin.IAdminProxy}>(NFTCatalogAdmin.AdminProxyPublicPath, target: NFTCatalogAdmin.AdminProxyStoragePath)
    }
}
`;

/**
* Method to generate cadence code for setupNftCatalogAdminProxy transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const setupNftCatalogAdminProxyTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `setupNftCatalogAdminProxy =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends setupNftCatalogAdminProxy transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const setupNftCatalogAdminProxy = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await setupNftCatalogAdminProxyTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `setupNftCatalogAdminProxy =>`);
  reportMissing("signers", signers.length, 1, `setupNftCatalogAdminProxy =>`);

  return sendTransaction({code, processed: true, ...props})
}