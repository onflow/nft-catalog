import path from 'path';
import {
    emulator,
    init,
    shallPass,
    getAccountAddress,
    shallResolve
} from 'flow-js-testing';
import {
    deployExampleNFT, setupExampleNFTCollection, mintExampleNFT, getExampleNFTCollectionLength, transferExampleNFT
} from '../src/examplenft';
import { TIMEOUT } from '../src/common';

const TEST_NFT_NAME = 'Test Name';
const TEST_NFT_DESCRIPTION = 'Test Description';
const TEST_NFT_THUMBNAIL = 'https://flow.com/';

jest.setTimeout(TIMEOUT);

describe('Skeleton Example NFT Test Suite', () => {
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

    it('should deploy ExampleNFT contract', async () => {
        await shallPass(deployExampleNFT());
    });

    it('should be able to setup accounts', async () => {
        await deployExampleNFT();
        const Alice = await getAccountAddress('Alice');
        await shallPass(setupExampleNFTCollection(Alice));
    });

    it('should be able to mint NFT', async () => {
        await deployExampleNFT();
        const Alice = await getAccountAddress('Alice');
        await setupExampleNFTCollection(Alice);

        await shallPass(mintExampleNFT(Alice, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        const [result, error] = await shallResolve(getExampleNFTCollectionLength(Alice))

        expect(result).toBe(1);
        expect(error).toBe(null);
    });

    it('should be able to transfer NFT', async () => {
        await deployExampleNFT();
        const Alice = await getAccountAddress('Alice');
        await setupExampleNFTCollection(Alice);

        await mintExampleNFT(Alice, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []);

        const Bob = await getAccountAddress('Bob');
        await setupExampleNFTCollection(Bob);
        await shallPass(transferExampleNFT(Alice, Bob, 0));

        let [result, error] = await shallResolve(getExampleNFTCollectionLength(Alice))
        expect(result).toBe(0);
        expect(error).toBe(null);

        [result, error] = await shallResolve(getExampleNFTCollectionLength(Bob))
        expect(result).toBe(1);
        expect(error).toBe(null);
    });
});
