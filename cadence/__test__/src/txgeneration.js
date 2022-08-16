import { executeScript } from 'flow-js-testing'

export const createTx = async (tx, collectionIdentifier) => {
    const name = "gen_tx";
    const args = [tx, collectionIdentifier]

    return executeScript({ name, args })
}

export const createInitTx = async (collectionIdentifier) => {
    return createTx("CollectionInitialization", collectionIdentifier)
}

