import { executeScript } from 'flow-js-testing'

export const createTx = async (tx, collectionIdentifier, vaultIdentifier, merchantAddress) => {
    const name = "gen_tx";
    const args = [tx, collectionIdentifier, vaultIdentifier, merchantAddress || ""]

    return executeScript({ name, args })
}

// This is the same as createTx for now, but makes it so once we separate these
// at the contract level, we just need to update the script name here.
export const createScript = async (tx, collectionIdentifier, vaultIdentifier) => {
    const name = "gen_tx";
    const args = [tx, collectionIdentifier, vaultIdentifier]

    return executeScript({ name, args })
}

export const createInitTx = async (collectionIdentifier) => {
    return createTx("CollectionInitialization", collectionIdentifier, "flow", "")
}

