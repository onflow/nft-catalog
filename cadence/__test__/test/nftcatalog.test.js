import path from 'path';
import {
  emulator,
  init,
  shallPass,
  shallResolve,
  getAccountAddress
} from 'flow-js-testing';
import {
  deployNFTCatalog,
  addToCatalogAdmin,
  getNFTMetadataForName,
  setupNFTCatalogAdminAgent,
  sendAdminAgentCapability,
  addToCatalogAdminAgent
} from '../src/nftcatalog';
import {
  deployExampleNFT
} from '../src/examplenft';


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

    await shallPass(addToCatalogAdmin(
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
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

    await shallResolve(setupNFTCatalogAdminAgent(Alice));

    await shallResolve(sendAdminAgentCapability(Alice));
  });


  it('non-admin accounts with agents should be able to add NFT to catalog', async () => {
    await deployNFTCatalog();

    const Alice = await getAccountAddress('Alice');

    await shallResolve(setupNFTCatalogAdminAgent(Alice));

    await shallResolve(sendAdminAgentCapability(Alice));

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

    await shallPass(addToCatalogAdminAgent(
      Alice,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      'exampleNFTCollection',
      'exampleNFTCollection'
    ));

    let [result, error] = await shallResolve(getNFTMetadataForName('ExampleNFT'));
    expect(result).not.toBe(null);
    expect(result.name).toBe(nftCreationEvent.data.contract);
    expect(error).toBe(null);
  });
});
