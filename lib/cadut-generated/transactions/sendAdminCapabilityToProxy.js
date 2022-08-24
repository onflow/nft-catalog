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

transaction(proxyAddress: Address) {
    let adminCap : Capability<&NFTCatalogAdmin.Admin>
    
    prepare(acct: AuthAccount) {
        self.adminCap = acct.getCapability<&NFTCatalogAdmin.Admin>(NFTCatalogAdmin.AdminPrivatePath)
    }

    execute {
        let owner = getAccount(proxyAddress)
        let proxy = owner.getCapability<&NFTCatalogAdmin.AdminProxy{NFTCatalogAdmin.IAdminProxy}>(NFTCatalogAdmin.AdminProxyPublicPath)
            .borrow() ?? panic("Could not borrow Admin Proxy")
        
        proxy.addCapability(capability : self.adminCap)
    }
}
`;

/**
* Method to generate cadence code for sendAdminCapabilityToProxy transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const sendAdminCapabilityToProxyTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `sendAdminCapabilityToProxy =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends sendAdminCapabilityToProxy transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const sendAdminCapabilityToProxy = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await sendAdminCapabilityToProxyTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `sendAdminCapabilityToProxy =>`);
  reportMissing("signers", signers.length, 1, `sendAdminCapabilityToProxy =>`);

  return sendTransaction({code, processed: true, ...props})
}