import path from 'path';
import {
  emulator,
  init,
  shallResolve,
  getAccountAddress,
  shallRevert
} from 'flow-js-testing';
import {
  deployNFTCatalog,
  setupNFTCatalogAdminProxy,
  sendAdminProxyCapability,
  addToCatalog
} from '../src/nftcatalog';
import {
  deployExampleNFT,
  setupExampleNFTCollection,
  mintExampleNFT,
  getExampleNFTType
} from '../src/examplenft';
import { getAllNFTsInAccount, getNFTsInAccount, deployNFTRetrieval, getNFTInAccount, getNFTInAccountFromPath } from '../src/nftviews';
import { TIMEOUT } from '../src/common';

jest.setTimeout(TIMEOUT);


describe('NFT Retrieval Test Suite', () => {
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

  it('should retrieve all NFTs', async () => {
    await deployNFTCatalog();
    const Bob = await getAccountAddress('Bob');
    await setupNFTCatalogAdminProxy(Bob);
    await sendAdminProxyCapability(Bob)

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');
    const Alice = await getAccountAddress('Alice');
    await setupExampleNFTCollection(Alice)

    await deployNFTRetrieval();

    const [nftTypeIdentifier, _] = await getExampleNFTType();


    const nftName = 'Test Name';
    const nftDescription = 'Test Description';
    const thumbnail = 'https://flow.com/';
    await mintExampleNFT(Alice, nftName, nftDescription, thumbnail, [], [], []);

    await addToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      Alice,
      'exampleNFTCollection',
    )

    const [result, error] = await shallResolve(getAllNFTsInAccount(Alice));
    expect(error).toBe(null);
    expect(result['ExampleNFT'][0].name).toBe(nftName);
    expect(result['ExampleNFT'][0].description).toBe(nftDescription);
    expect(result['ExampleNFT'][0].thumbnail).toBe(thumbnail);
  });

  it('should retrieve some NFTs', async () => {
    await deployNFTCatalog();
    const Bob = await getAccountAddress('Bob');
    await setupNFTCatalogAdminProxy(Bob);
    await sendAdminProxyCapability(Bob)

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');
    const Alice = await getAccountAddress('Alice');
    await setupExampleNFTCollection(Alice)

    await deployNFTRetrieval();

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    const nftName = 'Test Name';
    const nftDescription = 'Test Description';
    const thumbnail = 'https://flow.com/';
    await mintExampleNFT(Alice, nftName, nftDescription, thumbnail, [], [], []);

    await addToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      Alice,
      'exampleNFTCollection',
    )

    let [result, error] = await shallResolve(getNFTsInAccount(Alice, ['ExampleNFT']));
    expect(result['ExampleNFT'][0].name).toBe(nftName);
    expect(result['ExampleNFT'][0].description).toBe(nftDescription);
    expect(result['ExampleNFT'][0].thumbnail).toBe(thumbnail);
    expect(error).toBe(null);

    [result, error] = await shallResolve(getNFTsInAccount(Alice, []));
    expect(Object.keys(result).length).toBe(0);
    expect(error).toBe(null);

    [result, error] = await shallResolve(getNFTsInAccount(Alice, ["NotARealNFT"]));
    expect(Object.keys(result).length).toBe(0);
    expect(error).toBe(null);
  });

  it('should retrieve specific NFT', async () => {
    await deployNFTCatalog();
    const Bob = await getAccountAddress('Bob');
    await setupNFTCatalogAdminProxy(Bob);
    await sendAdminProxyCapability(Bob)

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');
    const Alice = await getAccountAddress('Alice');
    await setupExampleNFTCollection(Alice)

    await deployNFTRetrieval();

    const [nftTypeIdentifier, _] = await getExampleNFTType();

    const nftName = 'Test Name';
    const nftDescription = 'Test Description';
    const thumbnail = 'https://flow.com/';
    await mintExampleNFT(Alice, nftName, nftDescription, thumbnail, [], [], []);

    await addToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      Alice,
      'exampleNFTCollection',
    )

    await shallRevert(getNFTInAccount(Alice, 'ExampleNFT2', 0));
    await shallRevert(getNFTInAccount(Bob, 'ExampleNFT', 0));
    await shallRevert(getNFTInAccount(Alice, 'ExampleNFT', 1));

    const [result, error] = await shallResolve(getNFTInAccount(Alice, 'ExampleNFT', 0))
    expect(result.name).toBe(nftName);
    expect(result.description).toBe(nftDescription);
    expect(result.thumbnail).toBe(thumbnail);
    expect(error).toBe(null);
  });

  it('should retrieve random NFT from given path', async () => {
    await deployNFTCatalog();

    let res = await deployExampleNFT();
    const Alice = await getAccountAddress('Alice');
    await setupExampleNFTCollection(Alice)

    await deployNFTRetrieval();

    const nftName = 'Test Name';
    const nftDescription = 'Test Description';
    const thumbnail = 'https://flow.com/';
    await mintExampleNFT(Alice, nftName, nftDescription, thumbnail, [], [], []);

    const [result, error] = await shallResolve(getNFTInAccountFromPath(Alice, 'exampleNFTCollection'))
    expect(result.Display.name).toBe(nftName);
    expect(result.Display.description).toBe(nftDescription);
    expect(result.Display.thumbnail).toBe(thumbnail);
    expect(error).toBe(null);
  });
});