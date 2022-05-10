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

export const addToCatalog = async (proxyAccount, nftName, contractName, nftAddressLocation, storagePath, publicPath) => {
  const name = 'add_to_nft_catalog';

  const signers = [proxyAccount];
  const args = [nftName, contractName, nftAddressLocation, storagePath, publicPath];

  return sendTransaction({ name, args, signers });
}

export const setupNFTCatalogAdminProxy = async (account) => {
  const name = 'setup_nft_catalog_admin_proxy';
  const signers = [account];

  return sendTransaction({ name, signers })
}

export const sendAdminProxyCapability = async (ownerAccount) => {
  const NFTCatalogAdmin = await getAdminAddress();
  const signers = [NFTCatalogAdmin];

  const name = 'send_admin_capability_to_proxy';

  const args = [ownerAccount];

  return sendTransaction({ name, args, signers });
}

export const proposeNFTToCatalog = async (account, nftName, contractName, nftAddressLocation, storagePath, publicPath, message) => {
  const name = 'propose_nft_to_catalog';
  const args = [nftName, contractName, nftAddressLocation, storagePath, publicPath, message];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const approveNFTProposal = async (account, proposalID) => {
  const name = 'approve_nft_catalog_proposal';
  const args = [proposalID];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const rejectNFTProposal = async (account, proposalID) => {
  const name = 'reject_nft_catalog_proposal';
  const args = [proposalID];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const removeNFTProposal = async (account, proposalID) => {
  const name = 'remove_nft_catalog_proposal';
  const args = [proposalID];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const getNFTMetadataForName = async (nftName) => {
  const name = 'get_nft_metadata_for_name';
  const args = [nftName];

  return executeScript({ name, args });
}

export const getNFTProposalForID = async (proposalID) => {
  const name = 'get_nft_proposal_for_id';
  const args = [proposalID];

  return executeScript({ name, args });
}