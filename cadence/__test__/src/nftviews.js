import { executeScript, mintFlow, deployContractByName } from 'flow-js-testing'
import { getAdminAddress } from './common'

export const deployNFTRetrieval = async () => {
  const NFTRetrievalAdmin = await getAdminAddress()
  await mintFlow(NFTRetrievalAdmin, '10.0')
  return deployContractByName({ to: NFTRetrievalAdmin, name: 'NFTRetrieval' })
}

export const getAllNFTsInAccount = async (ownerAddress) => {
  const name = 'get_all_nfts_in_account';
  const args = [ownerAddress];

  return executeScript({ name, args });
}

export const getNFTsInAccount = async (ownerAddress, collections) => {
  const name = 'get_nfts_in_account';
  const args = [ownerAddress, collections];

  return executeScript({ name, args });
}

export const getNFTInAccount = async (ownerAddress, collection, tokenID) => {
  const name = 'get_nft_in_account';
  const args = [ownerAddress, collection, tokenID];

  return executeScript({ name, args });
}