import path from 'path';
import {
  emulator,
  init,
  shallPass,
  shallResolve,
  getAccountAddress,
  shallRevert
} from 'flow-js-testing';
import {
  deployNFTCatalog,
  addToCatalogAdmin,
  getNFTMetadataForName,
  setupNFTCatalogAdminProxy,
  sendAdminProxyCapability,
  addToCatalog,
  proposeNFTToCatalog,
  getNFTProposalForID,
  approveNFTProposal,
  rejectNFTProposal,
  removeNFTProposal,
  withdrawNFTProposalFromCatalog
} from '../src/nftcatalog';
import {
  deployExampleNFT,
  getExampleNFTType
} from '../src/examplenft';
import { TIMEOUT } from '../src/common';

jest.setTimeout(TIMEOUT);

describe('NFT Catalog Test Suite', () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, '../../');
    const port = 7002;
    await init(basePath, { port });
    await emulator.start(port, false);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    await emulator.stop();
    return new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it('should deploy NFTCatalog contract', async () => {
    await shallPass(deployNFTCatalog());
  });

  it('main admin should add to catalog', async () => {
    await deployNFTCatalog();

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    await shallPass(addToCatalogAdmin(
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection'
    ));

    let [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).not.toBe(null);
    expect(result.name).toBe(nftCreationEvent.data.contract);
    expect(error).toBe(null);
  });

  it('non-admin accounts should be able to receive admin capability', async () => {
    await deployNFTCatalog();

    const Alice = await getAccountAddress('Alice');

    await shallResolve(setupNFTCatalogAdminProxy(Alice));

    await shallResolve(sendAdminProxyCapability(Alice));
  });


  it('non-admin accounts with proxies should be able to add NFT to catalog', async () => {
    await deployNFTCatalog();

    const Alice = await getAccountAddress('Alice');

    await shallResolve(setupNFTCatalogAdminProxy(Alice));

    await shallResolve(sendAdminProxyCapability(Alice));

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    await shallPass(addToCatalog(
      Alice,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection'
    ));

    let [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).not.toBe(null);
    expect(result.name).toBe(nftCreationEvent.data.contract);
    expect(error).toBe(null);
  });


  it('should be able to approve proposals', async () => {
    await deployNFTCatalog();

    const Alice = await getAccountAddress('Alice');

    await shallResolve(setupNFTCatalogAdminProxy(Alice));

    await shallResolve(sendAdminProxyCapability(Alice));

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

    const Bob = await getAccountAddress('Bob');

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    await shallPass(proposeNFTToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection',
      'Please add my NFT to the Catalog'
    ));

    let [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).toBe(null);

    [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result.status).toBe("IN_REVIEW");
    expect(result.metadata.name).toBe(nftCreationEvent.data.contract);

    await shallPass(approveNFTProposal(Alice, 1));

    [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result.status).toBe("APPROVED");

    [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).not.toBe(null);
    expect(result.name).toBe(nftCreationEvent.data.contract);
    expect(error).toBe(null);
  });


  it('should be able to reject proposals', async () => {
    await deployNFTCatalog();

    const Alice = await getAccountAddress('Alice');

    await shallResolve(setupNFTCatalogAdminProxy(Alice));

    await shallResolve(sendAdminProxyCapability(Alice));

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

    const Bob = await getAccountAddress('Bob');

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    await shallPass(proposeNFTToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection',
      'Please add my NFT to the Catalog'
    ));

    let [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).toBe(null);

    [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result.status).toBe("IN_REVIEW");
    expect(result.metadata.name).toBe(nftCreationEvent.data.contract);

    await shallPass(rejectNFTProposal(Alice, 1));

    [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result.status).toBe("REJECTED");

    [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).toBe(null);
  });


  it('should be able to remove proposals', async () => {
    await deployNFTCatalog();

    const Alice = await getAccountAddress('Alice');

    await shallResolve(setupNFTCatalogAdminProxy(Alice));

    await shallResolve(sendAdminProxyCapability(Alice));

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

    const Bob = await getAccountAddress('Bob');

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    await shallPass(proposeNFTToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection',
      'Please add my NFT to the Catalog'
    ));

    let [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).toBe(null);

    [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result.status).toBe("IN_REVIEW");
    expect(result.metadata.name).toBe(nftCreationEvent.data.contract);

    await shallPass(removeNFTProposal(Alice, 1));

    [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result).toBe(null);

    [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).toBe(null);
  });

  it('should be able to withdraw proposals', async () => {
    await deployNFTCatalog();

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

    const Bob = await getAccountAddress('Bob');

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    await shallPass(proposeNFTToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection',
      'Please add my NFT to the Catalog'
    ));

    let [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result.status).toBe("IN_REVIEW");
    expect(result.metadata.name).toBe(nftCreationEvent.data.contract);

    const Alice = await getAccountAddress('Alice');
    await shallRevert(withdrawNFTProposalFromCatalog(Alice, 1));

    await shallPass(withdrawNFTProposalFromCatalog(Bob, 1));

    [result, error] = await shallResolve(getNFTProposalForID(1));
    expect(result).toBe(null);
  });

});