/** pragma type transaction **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  sendTransaction
} from '@onflow/flow-cadut'

export const CODE = `
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/ExampleNFT.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction(
    recipient: Address,
    name: String,
    description: String,
    thumbnail: String,
    cuts: [UFix64],
    royaltyDescriptions: [String],
    royaltyBeneficiaries: [Address]
) {

    // local variable for storing the minter reference
    let minter: &ExampleNFT.NFTMinter

    let royalties: [MetadataViews.Royalty]


    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&ExampleNFT.NFTMinter>(from: ExampleNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
        
        // creating the royalty details
        var count = 0
        self.royalties = []
        while royaltyBeneficiaries.length > count {
            let beneficiary = royaltyBeneficiaries[count]
            let beneficiaryCapability = getAccount(beneficiary)
            .getCapability<&{FungibleToken.Receiver}>(MetadataViews.getRoyaltyReceiverPublicPath())

            // Make sure the royalty capability is valid before minting the NFT
            if !beneficiaryCapability.check() { panic("Beneficiary capability is not valid!") }

            self.royalties.append(
                MetadataViews.Royalty(
                    recepient: beneficiaryCapability,
                    cut: cuts[count],
                    description: royaltyDescriptions[count]
                )
            )
            count = count + 1
        }
    }

    pre {
        cuts.length == royaltyDescriptions.length && cuts.length == royaltyBeneficiaries.length: "Array length should be equal for royalty related details"
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(ExampleNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver,
            name: name,
            description: description,
            thumbnail: thumbnail,
            royalties: self.royalties
        )
    }
}
 
`;

/**
* Method to generate cadence code for mintExampleNft transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const mintExampleNftTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `mintExampleNft =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Sends mintExampleNft transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const mintExampleNft = async (props = {}) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await mintExampleNftTemplate(addressMap);

  reportMissing("arguments", args.length, 7, `mintExampleNft =>`);
  reportMissing("signers", signers.length, 1, `mintExampleNft =>`);

  return sendTransaction({code, processed: true, ...props})
}