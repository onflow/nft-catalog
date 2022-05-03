import { mintFlow, deployContractByName, sendTransaction, executeScript } from 'flow-js-testing'
import { getAdminAddress } from './common'

export const deployNFTCatalog = async () => {
  const NFTCatalogAdmin = await getAdminAddress()
  await mintFlow(NFTCatalogAdmin, '10.0')
  return deployContractByName({ to: NFTCatalogAdmin, name: 'NFTCatalog' })
}

export const addToCatalog = async (nftName, contractName, nftAddressLocation, storagePath, publicPath) => {
  const NFTCatalogAdmin = await getAdminAddress();
  const name = 'add_to_nft_catalog';

  const signers = [NFTCatalogAdmin];
  const args = [nftName, contractName, nftAddressLocation, storagePath, publicPath];

  return sendTransaction({ name, args, signers });
}

export const getNFTMetadataForName = async (nftName) => {
  const name = 'get_nft_metadata_for_name';
  const args = [nftName];

  return executeScript({name, args});
}