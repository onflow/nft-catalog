import { mintFlow, deployContractByName, sendTransaction, executeScript } from 'flow-js-testing'
import { getAdminAddress } from './common'

export const deployNFTCatalog = async () => {
  const NFTCatalogAdmin = await getAdminAddress()
  await mintFlow(NFTCatalogAdmin, '10.0')
  await deployContractByName({ to: NFTCatalogAdmin, name: 'NFTCatalog' })
  return deployContractByName({ to: NFTCatalogAdmin, name: 'NFTCatalogAdmin' })
}

export const addToCatalogAdmin = async (nftName, contractName, nftAddressLocation, storagePath, publicPath) => {
  const NFTCatalogAdmin = await getAdminAddress();
  const name = 'add_to_nft_catalog_admin';

  const signers = [NFTCatalogAdmin];
  const args = [nftName, contractName, nftAddressLocation, storagePath, publicPath];

  return sendTransaction({ name, args, signers });
}

export const addToCatalogAdminAgent = async (agentAccount, nftName, contractName, nftAddressLocation, storagePath, publicPath) => {
  const name = 'add_to_nft_catalog_admin_agent';

  const signers = [agentAccount];
  const args = [nftName, contractName, nftAddressLocation, storagePath, publicPath];

  return sendTransaction({ name, args, signers });
}

export const setupNFTCatalogAdminAgent = async (account) => {
  const name = 'setup_nft_catalog_admin_agent';
  const signers = [account];

  return sendTransaction({ name, signers })
}

export const sendAdminAgentCapability = async (ownerAccount) => {
  const NFTCatalogAdmin = await getAdminAddress();
  const signers = [NFTCatalogAdmin];

  const name = 'send_admin_capability_to_agent';

  const args = [ownerAccount];

  return sendTransaction({ name, args, signers });
}

export const getNFTMetadataForName = async (nftName) => {
  const name = 'get_nft_metadata_for_name';
  const args = [nftName];

  return executeScript({ name, args });
}