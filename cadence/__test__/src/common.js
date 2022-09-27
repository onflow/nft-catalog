import {
  shallPass,
  getAccountAddress,
  sendTransaction,
  executeScript
} from 'flow-js-testing';

export const getAdminAddress = async () => getAccountAddress('Admin')

export const TIMEOUT = 50000;

export const runFailingScript = async (code, args) => {
  let passed = false
  try {
      await executeScript({code: code, args: args})
      passed = true
  } catch (e) { }
  expect(passed).toBe(false)
}

export const runScript = async (code, args) => {
  return await executeScript({code: code, args: args})
}

export const runTransaction = async (code, args, signers) => {
  return await shallPass(await sendTransaction({code: code, args: args, signers: signers}))
}

export const runFailingTransaction = async (code, args, signers, addressMap) => {
  let passed = false
  let error;
  try {
      const res = await shallPass(await sendTransaction({code: code, args: args, signers: signers, addressMap: addressMap}))
      passed = true
      console.log('unexpected result:', JSON.stringify(res))
  } catch (e) {
      error = e
  }
  expect(passed).toBe(false)
  return error
}

export const verifyEvent = async (transactionResult, eventType) => {
  const results = transactionResult.events.filter((e) => {
      return e.type.indexOf(eventType) > 0
  })
  expect(results.length > 0).toBeTruthy()
  return results[0]
}
