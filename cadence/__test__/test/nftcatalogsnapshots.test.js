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
    getNFTMetadataForCollectionIdentifier,
    getFullCatalog,
    updateSnapshotAdmin,
    removeFromNFTCatalog,
    setupNFTCatalogAdminProxy,
    sendAdminProxyCapability,
    addToCatalog,
    getNFTCollectionsForNFTType
} from '../src/nftcatalog';
import {
    deployExampleNFT,
    getExampleNFTType,
    mintExampleNFT,
    setupExampleNFTCollection
} from '../src/examplenft';
import { TIMEOUT } from '../src/common';

const TEST_NFT_NAME = 'Test Name';
const TEST_NFT_DESCRIPTION = 'Test Description';
const TEST_NFT_THUMBNAIL = 'https://flow.com/';

jest.setTimeout(TIMEOUT);

describe('NFT Catalog Snapshots Test Suite', () => {
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

    it('should snapshot current state of catalog and persist it despite catalog changes', async () => {
        await deployNFTCatalog();

        const Alice = await getAccountAddress('Alice');

        await shallResolve(setupNFTCatalogAdminProxy(Alice));
        await shallResolve(sendAdminProxyCapability(Alice));

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        await setupExampleNFTCollection(Alice);
        await shallPass(mintExampleNFT(Alice, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        await shallPass(addToCatalog(
            Alice,
            nftCreationEvent.data.contract,
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection'
        ));

        const catalog = await getFullCatalog();
        expect(Object.keys(catalog[0]).length).toEqual(1)

        await shallPass(updateSnapshotAdmin(Alice));
        const snapshottedCatalog = await getFullCatalog();
        expect(Object.keys(snapshottedCatalog[0]).length).toEqual(1)

        await shallPass(removeFromNFTCatalog(
            Alice,
            nftCreationEvent.data.contract
        ));

        // Even though the catalog is empty, the snapshot should still be there
        // ensuring that the snapshot doesn't change as the catalog changes.
        const snapshottedCatalogAfterRemoval = await getFullCatalog();
        expect(Object.keys(snapshottedCatalogAfterRemoval[0]).length).toEqual(1)

        await shallPass(updateSnapshotAdmin(Alice));

        const snapshottedEmptyCatalog = await getFullCatalog();
        expect(Object.keys(snapshottedEmptyCatalog[0]).length).toEqual(1)
    
    });
});
