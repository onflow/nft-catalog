import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';
//@ts-ignore
import { changeFCLEnvironment } from './setup';
import { Network } from '../app/components/catalog/network-dropdown';
import CheckForRecommendedV1Views from "../../../../../cadence/scripts/check_for_recommended_v1_views.cdc"
import GetSupportedGeneratedScripts from "../../../../../cadence/scripts/get_supported_generated_scripts.cdc"
import GetSupportedGeneratedTransactions from "../../../../../cadence/scripts/get_supported_generated_transactions.cdc"
import GenTx from "../../../../../cadence/scripts/gen_tx.cdc"
import GetNftCatalog from "../../../../../cadence/scripts/get_nft_catalog.cdc"
import GetNftCatalogIdentifiers from "../../../../../cadence/scripts/get_nft_catalog_identifiers.cdc"
import GetNftCatalogProposals from "../../../../../cadence/scripts/get_nft_catalog_proposals.cdc"
import GetNftCatalogProposalIds from "../../../../../cadence/scripts/get_nft_catalog_proposal_ids.cdc"
import GetNftProposalForId from "../../../../../cadence/scripts/get_nft_proposal_for_id.cdc"
import GetNftsInAccountFromPath from "../../../../../cadence/scripts/get_nfts_in_account_from_path.cdc"
import GetAllNftsInAccount from "../../../../../cadence/scripts/get_all_nfts_in_account.cdc"
import GetNftInAccount from "../../../../../cadence/scripts/get_nft_in_account.cdc"
import GetNftInAccountFromPath from "../../../../../cadence/scripts/get_nft_in_account_from_path.cdc"
import HasAdminProxy from "../../../../../cadence/scripts/has_admin_proxy.cdc"
import IsCatalogAdmin from "../../../../../cadence/scripts/is_catalog_admin.cdc"
import CheckForLinks from "../../../../../cadence/scripts/check_for_links.cdc"
import GetNftMetadataForCollectionIdentifier from "../../../../../cadence/scripts/get_nft_metadata_for_collection_identifier.cdc"

import setup_nft_catalog_admin_proxy from "../../../../../cadence/transactions/setup_nft_catalog_admin_proxy.cdc"
import approve_nft_catalog_proposal from "../../../../../cadence/transactions/approve_nft_catalog_proposal.cdc"
import reject_nft_catalog_proposal from "../../../../../cadence/transactions/reject_nft_catalog_proposal.cdc"
import propose_nft_to_catalog from "../../../../../cadence/transactions/propose_nft_to_catalog.cdc"
import remove_nft_catalog_proposal from "../../../../../cadence/transactions/remove_nft_catalog_proposal.cdc"

type AccountsMap = { [network in Network]: any };

export async function getAccounts(
  address: string
): Promise<AccountsMap | null> {
  const testnetAccount = await getAccount(address, 'testnet');
  const mainnetAccount = await getAccount(address, 'mainnet');
  if (testnetAccount == null && mainnetAccount == null) {
    return null;
  }
  return {
    mainnet: mainnetAccount,
    testnet: testnetAccount,
  };
}

export async function getAccount(
  address: string,
  network: Network
): Promise<any> {
  changeFCLEnvironment(network);
  try {
    const account = await fcl.account(address);
    return account;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function retrieveContractInformation(
  address: string,
  name: string,
  code: string,
  network: Network
): Promise<any> {
  const nftStandardAddress =
    network === 'mainnet' ? '0x1d7e57aa55817448' : '0x631e88ae7f1d7c20';
  try {
    const publicPath = code.search(/\s+\/public\/.*\s+/gi);
    const scriptResult = await fcl.query({
      // mainnet nft and metadata address is 0x1d7e57aa55817448
      cadence: `
        import NonFungibleToken from ${fcl.withPrefix(nftStandardAddress)}
        import MetadataViews from ${fcl.withPrefix(nftStandardAddress)}
        import ViewResolver from ${fcl.withPrefix(nftStandardAddress)}
        import ${name} from ${fcl.withPrefix(address)}

        access(all) fun main(): {String: AnyStruct} {
          var isNFTContract = false
          var collectionConformsToMetadata = false
          var nftConformsToMetadata = false

          isNFTContract = Type<${name}>().isSubtype(of: Type<{NonFungibleToken}>())
          if (isNFTContract == true) {
            collectionConformsToMetadata = Type<&${name}.Collection>().isSubtype(of: Type<&{ViewResolver.ResolverCollection}>())
            nftConformsToMetadata = Type<&${name}.NFT>().isSubtype(of: Type<&{ViewResolver.Resolver}>())
          }

          return {
            "isNFTContract": isNFTContract,
            "collectionConformsToMetadata": collectionConformsToMetadata,
            "nftConformsToMetadata": nftConformsToMetadata
          }
        }
      `,
    });
    return scriptResult;
  } catch (e) {
    console.error(e);
    // If this isn't an NFT contract, the templated types in the script will fail.
    // We can assume an error from the script likely means the selected contract
    // is not of type `NonFungibleToken`
    return { isNFTContract: false };
  }
}

export async function retrieveMetadataInformation(
  sampleAddress: string,
  storagePath: string
): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(CheckForRecommendedV1Views),
        fcl.args([
          fcl.arg(sampleAddress, t.Address),
          fcl.arg(
            {
              domain: 'storage',
              identifier: storagePath.replace('/storage/', ''),
            },
            t.Path
          ),
        ]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getSupportedGeneratedScripts(): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetSupportedGeneratedScripts),
        fcl.args([]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getSupportedGeneratedTransactions(): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetSupportedGeneratedTransactions),
        fcl.args([]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getGeneratedTransaction(
  tx: string,
  collectionIdentifer: string,
  vaultIdentifier: string,
  merchantAddress: string
): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GenTx),
        fcl.args([
          fcl.arg(tx, t.String),
          fcl.arg(collectionIdentifer, t.String),
          fcl.arg(vaultIdentifier, t.String),
          fcl.arg(merchantAddress, t.String),
        ]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllCollections(): Promise<any> {
  const CHUNK = 50;
  const collectionIdentifiers= await getCatalogCollectionIdentifiers();
  const catalogBatches: [string][] = [];
  for (let i = 0; i < collectionIdentifiers.length; i += CHUNK) {
    catalogBatches.push(collectionIdentifiers.slice(i, i + CHUNK));
  }
  let collections: any = {};
  for (const catalogBatch of catalogBatches) {
    const currentBatch = (await getCollections(catalogBatch)) || [];
    collections = {
      ...currentBatch,
      ...collections,
    };
  }
  return collections;
}

export async function getCollections(
  collectionIdentifiers: [string]
): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftCatalog),
        fcl.args([fcl.arg(collectionIdentifiers, t.Array(t.String))]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getCatalogCollectionIdentifiers(): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftCatalogIdentifiers),
        fcl.args([]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllProposals(): Promise<any> {
  const CHUNK = 50;
  const proposalIDs = await getProposalIds();
  const proposalBatches: [string][] = [];
  for (let i = 0; i < proposalIDs.length; i += CHUNK) {
    proposalBatches.push(proposalIDs.slice(i, i + CHUNK));
  }
  let proposals: any = {};
  for (const proposalBatch of proposalBatches) {
    const currentBatch = (await getProposals(proposalBatch)) || [];
    proposals = {
      ...currentBatch,
      ...proposals,
    };
  }
  return proposals;
}

export async function getProposals(
  proposalIDs: [string]
): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftCatalogProposals),
        fcl.args([fcl.arg(proposalIDs, t.Array(t.UInt64))]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getProposalIds(): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftCatalogProposalIds),
        fcl.args([]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getProposal(proposalID: string): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftProposalForId),
        fcl.args([fcl.arg(proposalID, t.UInt64)]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getNFTsInAccount(
  sampleAddress: string,
  storagePath: string
): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftsInAccountFromPath),
        fcl.args([
          fcl.arg(sampleAddress, t.Address),
          fcl.arg(storagePath.replace('/storage/', ''), t.String),
        ]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    return null;
  }
}

export async function getAllNFTsInAccountFromCatalog(
  ownerAddress: string
): Promise<any> {
  const scriptResult = await fcl
    .send([
      fcl.script(GetAllNftsInAccount),
      fcl.args([fcl.arg(ownerAddress, t.Address)]),
    ])
    .then(fcl.decode);
  return scriptResult;
}

export async function getNFTInAccountFromCatalog(
  ownerAddress: string,
  collectionIdentifier: string,
  tokenID: string
) {
  const scriptResult = await fcl
    .send([
      fcl.script(GetNftInAccount),
      fcl.args([
        fcl.arg(ownerAddress, t.Address),
        fcl.arg(collectionIdentifier, t.String),
        fcl.arg(tokenID, t.UInt64),
      ]),
    ])
    .then(fcl.decode);
  return scriptResult;
}

export async function getNFTInAccountFromPath(
  ownerAddress: string,
  storagePath: string,
  nftID: string
) {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftInAccountFromPath),
        fcl.args([
          fcl.arg(ownerAddress, t.Address),
          fcl.arg(storagePath.replace('/storage/', ''), t.String),
          fcl.arg(nftID, t.UInt64),
        ]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getNFTInAccount(
  sampleAddress: string,
  collectionIdentifier: string,
  id: string
): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(GetNftInAccount),
        fcl.args([
          fcl.arg(sampleAddress, t.Address),
          fcl.arg(collectionIdentifier, t.String),
          fcl.arg(id, t.UInt64),
        ]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    return null;
  }
}

export async function getNFTMetadataForCollectionIdentifier(
  collectionIdentifier: string
): Promise<any> {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(
          GetNftMetadataForCollectionIdentifier
        ),
        fcl.args([fcl.arg(collectionIdentifier, t.String)]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAccountHasAdminProxy(address: string) {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(HasAdminProxy),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getIsAdmin(address: string) {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(IsCatalogAdmin),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAreLinksSetup(address: string, publicPath: string) {
  try {
    const scriptResult = await fcl
      .send([
        fcl.script(CheckForLinks),
        fcl.args([fcl.arg(address, t.Address), fcl.arg(publicPath, t.String)]),
      ])
      .then(fcl.decode);
    return scriptResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createAdminProxy() {
  try {
    const txId = await fcl.mutate({
      cadence: setup_nft_catalog_admin_proxy,
      limit: 9999,
      args: (arg: any, t: any) => [],
    });
    const transaction = await fcl.tx(txId).onceSealed();
    return transaction;
  } catch (e) {
    return null;
  }
}

export async function acceptProposal(proposalID: string) {
  try {
    const txId = await fcl.mutate({
      cadence: approve_nft_catalog_proposal,
      limit: 9999,
      args: (arg: any, t: any) => [fcl.arg(proposalID, t.UInt64)],
    });
    const transaction = await fcl.tx(txId).onceSealed();
    return transaction;
  } catch (e) {
    return null;
  }
}

export async function rejectProposal(proposalID: string) {
  try {
    const txId = await fcl.mutate({
      cadence: reject_nft_catalog_proposal,
      limit: 9999,
      args: (arg: any, t: any) => [fcl.arg(proposalID, t.UInt64)],
    });
    const transaction = await fcl.tx(txId).onceSealed();
    return transaction;
  } catch (e) {
    return null;
  }
}

export async function deleteProposal(proposalID: string) {
  try {
    const txId = await fcl.mutate({
      cadence: remove_nft_catalog_proposal,
      limit: 9999,
      args: (arg: any, t: any) => [fcl.arg(proposalID, t.UInt64)],
    });
    const transaction = await fcl.tx(txId).onceSealed();
    return transaction;
  } catch (e) {
    return null;
  }
}

export async function proposeNFTToCatalog(
  collectionIdentifier: string,
  sampleAddress: string,
  nftID: string,
  storagePath: string,
  contractName: string,
  contractAddress: string,
  message: string
): Promise<any> {
  const sampleNFTView = await getNFTInAccountFromPath(
    sampleAddress,
    storagePath,
    nftID
  );

  await validateCatalogProposal(
    collectionIdentifier,
    contractAddress,
    contractName,
    sampleNFTView
  );

  let socialsDictionary: any = [];
  for (const key in sampleNFTView.NFTCollectionDisplay.socials) {
    let socialsObj = {
      key: key,
      value: sampleNFTView.NFTCollectionDisplay.socials[key].url,
    };
    socialsDictionary.push(socialsObj);
  }

  const cadence = propose_nft_to_catalog;

  // Check if the image is an IPFS one, and convert it to one that is
  // easily viewable from the catalog.
  let collectionSquareImage =
    sampleNFTView.NFTCollectionDisplay.collectionSquareImage.file.url;
  if (sampleNFTView.NFTCollectionDisplay.collectionSquareImage.file.cid) {
    const cid =
      sampleNFTView.NFTCollectionDisplay.collectionSquareImage.file.cid;
    const path =
      sampleNFTView.NFTCollectionDisplay.collectionSquareImage.file.path || '';
    // Using pinata public gateway, since we don't have a proper ipfs gateway as part of the view.
    collectionSquareImage = `https://gateway.pinata.cloud/ipfs/${cid}/${path}`;
  }

  let collectionBannerImage =
    sampleNFTView.NFTCollectionDisplay.collectionBannerImage.file.url;
  if (sampleNFTView.NFTCollectionDisplay.collectionBannerImage.file.cid) {
    const cid =
      sampleNFTView.NFTCollectionDisplay.collectionBannerImage.file.cid;
    const path =
      sampleNFTView.NFTCollectionDisplay.collectionBannerImage.file.path || '';
    // Using pinata public gateway, since we don't have a proper ipfs gateway as part of the view.
    collectionBannerImage = `https://gateway.pinata.cloud/ipfs/${cid}/${path}`;
  }

  let privateLinkedType: string | null = null;
  let privateRestrictedType: any = null;
  try {
    privateRestrictedType = buildRestrictedType(
      sampleNFTView.NFTCollectionData.privateLinkedType.type
    );
    privateLinkedType =
      sampleNFTView.NFTCollectionData.privateLinkedType.type.type.typeID;
  } catch (err) {
    // continue on with an empty array for private restricted type. This fails if it was not a restricted type
    // to begin with.
    privateLinkedType =
      sampleNFTView.NFTCollectionData.privateLinkedType.type.typeID;
    privateRestrictedType = [];
  }
  try {
    const txId = await fcl.mutate({
      cadence: cadence,
      limit: 9999,
      args: (arg: any, t: any) => [
        fcl.arg(collectionIdentifier, t.String),
        fcl.arg(contractName, t.String),
        fcl.arg(fcl.withPrefix(contractAddress), t.Address),
        fcl.arg(
          `A.${fcl.sansPrefix(contractAddress)}.${contractName}.NFT`,
          t.String
        ),
        fcl.arg(
          sampleNFTView.NFTCollectionData.storagePath.identifier,
          t.String
        ),
        fcl.arg(
          sampleNFTView.NFTCollectionData.publicPath.identifier,
          t.String
        ),
        fcl.arg(
          sampleNFTView.NFTCollectionData.privatePath.identifier,
          t.String
        ),
        fcl.arg(
          sampleNFTView.NFTCollectionData.publicLinkedType.type.type.typeID,
          t.String
        ),
        fcl.arg(
          buildRestrictedType(
            sampleNFTView.NFTCollectionData.publicLinkedType.type
          ),
          t.Array(t.String)
        ),
        fcl.arg(privateLinkedType, t.String),
        fcl.arg(privateRestrictedType, t.Array(t.String)),
        fcl.arg(sampleNFTView.NFTCollectionDisplay.collectionName, t.String),
        fcl.arg(
          sampleNFTView.NFTCollectionDisplay.collectionDescription,
          t.String
        ),
        fcl.arg(sampleNFTView.NFTCollectionDisplay.externalURL, t.String),
        fcl.arg(collectionSquareImage, t.String),
        fcl.arg(
          sampleNFTView.NFTCollectionDisplay.collectionSquareImage.mediaType,
          t.String
        ),
        fcl.arg(collectionBannerImage, t.String),
        fcl.arg(
          sampleNFTView.NFTCollectionDisplay.collectionBannerImage.mediaType,
          t.String
        ),
        fcl.arg(
          socialsDictionary,
          t.Dictionary({ key: t.String, value: t.String })
        ),
        fcl.arg(message, t.String),
      ],
    });

    const transaction = await fcl.tx(txId).onceSealed();
    return transaction;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function validateCatalogProposal(
  collectionIdentifier: string,
  contractAddress: string,
  contractName: string,
  sampleNFTView: any
) {
  let collections = await getAllCollections();
  let displayName = sampleNFTView.NFTCollectionDisplay.collectionName;
  let storagePathIdentifier =
    sampleNFTView.NFTCollectionData.storagePath.identifier;

  for (const key in collections) {
    if (
      key !== collectionIdentifier &&
      collections[key].collectionDisplay.name === displayName
    ) {
      throw new Error(
        `An nft collection with the collection display name: ${displayName} already exists`
      );
    }
    if (
      key !== collectionIdentifier &&
      collections[key].contractName !== contractName &&
      collections[key].contractAddress !== contractAddress &&
      collections[key].collectionData.storagePath.identifier ===
        storagePathIdentifier
    ) {
      throw new Error(
        `An nft contract with the storage path: ${storagePathIdentifier} already exists`
      );
    }
  }
}

function buildRestrictedType(restrictedType: any) {
  let res: any[] = [];
  restrictedType.restrictions.forEach((value: { typeID: string }) => {
    res.push(value.typeID);
  });
  return res;
}
