import { sendTransaction } from '@onflow/flow-js-testing'
export const setupStorefront = async (account) => {
    const name = 'setup_storefront';
    const signers = [account];

    return sendTransaction({ name, signers })
}