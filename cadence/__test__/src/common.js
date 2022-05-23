import { getAccountAddress } from 'flow-js-testing'

export const getAdminAddress = async () => getAccountAddress('Admin')

export const TIMEOUT = 50000;
