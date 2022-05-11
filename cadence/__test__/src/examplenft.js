import { mintFlow, deployContractByName, sendTransaction, executeScript } from 'flow-js-testing'
import { getAdminAddress } from './common'

export const deployExampleNFT = async () => {
    const ExampleNFTAdmin = await getAdminAddress()
    await mintFlow(ExampleNFTAdmin, '10.0')

    await deployContractByName({ to: ExampleNFTAdmin, name: 'NonFungibleToken' })
    await deployContractByName({ to: ExampleNFTAdmin, name: 'MetadataViews' })
    return deployContractByName({ to: ExampleNFTAdmin, name: 'ExampleNFT' })
}

export const setupExampleNFTCollection = async (account) => {
    const name = 'setup_examplenft_collection'
    const signers = [account]

    return sendTransaction({ name, signers })
}

export const mintExampleNFT = async (recipient, nftName, description, thumbnail, cuts, royaltyDescriptions, royaltyBeneficiaries) => {
    const ExampleNFTAdmin = await getAdminAddress();

    const name = "mint_example_nft";
    const args = [recipient, nftName, description, thumbnail, cuts, royaltyDescriptions, royaltyBeneficiaries];
    const signers = [ExampleNFTAdmin];

    return sendTransaction({ name, args, signers });
};

export const transferExampleNFT = async (owner, recipient, withdrawID) => {
    const name = "transfer_examplenft";

    const args = [recipient, withdrawID];

    const signers = [owner];

    return sendTransaction({ name, args, signers });
}

export const getExampleNFTCollectionLength = async (account) => {
    const name = "get_examplenft_collection_length";
    const args = [account];

    return executeScript({ name, args });
};

export const getExampleNFTType = async () => {
    const name = 'get_examplenft_type';

    return executeScript({ name })
}
