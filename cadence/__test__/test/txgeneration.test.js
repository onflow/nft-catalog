import path from 'path';
import {
    emulator,
    init,
    shallPass,
    shallResolve,
    getAccountAddress,
    mintFlow
} from 'flow-js-testing';
import {
    deployNFTCatalog,
    addToCatalogAdmin,
    getNFTMetadataForCollectionIdentifier,
} from '../src/nftcatalog';
import {
    deployExampleNFT,
    getExampleNFTType,
    mintExampleNFT,
    setupExampleNFTCollection,
    getExampleNFTCollectionLength
} from '../src/examplenft';
import { TIMEOUT, runTransaction } from '../src/common';
import { createInitTx, createTx } from "../src/txgeneration";
import { setupStorefront } from '../src/nftstorefront';

const TEST_NFT_NAME = 'Test Name';
const TEST_NFT_DESCRIPTION = 'Test Description';
const TEST_NFT_THUMBNAIL = 'https://flow.com/';

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

    it('Should be able to run generated transactions for NFT', async () => {
        await deployNFTCatalog();

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        const Alice = await getAccountAddress('Alice');
        await setupExampleNFTCollection(Alice);
        await shallPass(mintExampleNFT(Alice, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        const collectionIdentifier = nftCreationEvent.data.contract

        await shallPass(addToCatalogAdmin(
            collectionIdentifier,
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection',
        ));

        let [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));

        [result, error] = await createInitTx(collectionIdentifier);
        expect(error).toBe(null)

        const Bob = await getAccountAddress('Bob');
        [result, error] = await runTransaction(result, [], [Bob]);
        expect(result.status).toBe(4);

        [result, error] = await shallPass(mintExampleNFT(Bob, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));
        expect(result.status).toBe(4);

        await shallPass(setupStorefront(Bob));
        await shallPass(setupStorefront(Alice));

        [result, error] = await createTx('StorefrontListItem', collectionIdentifier);
        expect(error).toBe(null);
        [result, error] = await runTransaction(result, [1, 10, null, 0, 32503698000, []], [Bob]);
        expect(error).toBe(null);
        const listingResourceID = result.events[0].data.listingResourceID;

        await mintFlow(Alice, '10.0');

        [result, error] = await createTx('StorefrontBuyItem', collectionIdentifier);
        expect(error).toBe(null);
        [result, error] = await runTransaction(result, [listingResourceID, Bob, null], [Alice]);
        expect(error).toBe(null);

        [result, error] = await shallResolve(getExampleNFTCollectionLength(Alice));
        expect(result).toBe(2);

        [result, error] = await shallResolve(getExampleNFTCollectionLength(Bob))
        expect(result).toBe(0);
    });
})
