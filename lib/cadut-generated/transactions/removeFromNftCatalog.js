/** pragma type transaction **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  sendTransaction
} from '@onflow/flow-cadut'

export const CODE = `
import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(
    collectionIdentifier : String
) {
    let adminProxyResource : &NFTCatalogAdmin.AdminProxy

    prepare(acct: AuthAccount) {
        self.adminProxyResource = acct.borrow<&NFTCatalogAdmin.AdminProxy>(from : NFTCatalogAdmin.AdminProxyStoragePath)!
    }

    execute {     
        self.adminProxyResource.getCapability()!.borrow()!.removeCatalogEntry(collectionIdentifier : collectionIdentifier)
    }
}
`;

/**
* Method to generate cadence code for removeFromNftCatalog transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const removeFromNftCatalogTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `removeFromNftCatalog =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends removeFromNftCatalog transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const removeFromNftCatalog = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await removeFromNftCatalogTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `removeFromNftCatalog =>`);
  reportMissing("signers", signers.length, 1, `removeFromNftCatalog =>`);

  return sendTransaction({code, processed: true, ...props})
}