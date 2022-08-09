import { executeScript } from 'flow-js-testing'

export const createInitTx = async (collectionIdentifier) => {
    const name = "gen_init_tx";
    const args = [collectionIdentifier]

    return executeScript({ name, args })
}

export const createTx = async (tx, collectionIdentifier) => {
    const name = "gen_tx";
    const args = [tx, collectionIdentifier]

    return executeScript({ name, args })
}
