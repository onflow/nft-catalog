import { useState } from 'react';
import { getAccounts } from "../../../flow/utils"
import { SearchBar } from '../shared/search-bar';
import { Alert } from '../shared/alert';
import { Badge } from '../shared/badge';
import { VerifierInfoBox } from './verifier-info-box';

export function ContractSelect({
  selectContract
}: {
  selectContract: (address: string, text: string, network: string) => void
}) {
  const [contractAddress, setContractAddress] = useState<string>("")
  const [accounts, setAccounts] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <div className="text-h1 mb-6 w-1/2 overflow-hidden text-ellipsis !text-xl md:!text-2xl font-bold">Select NFT Contract</div>
      <div className="text-l text-stone-500">
        This tool will assist you in verifying the metadata on your NFTs and allow your collection to be added to the Flow NFT Catalog.
        The Flow NFT Catalog will provide the needed context to applications and marketplaces to utilize your NFT collection and unlock interoperability throughout the Flow ecosystem.
        <br />
      </div>
      <div className="my-12">
        <b className="w-1/2">Enter Address containing your NFT Contract</b>
        <div className="my-4 w-full">
          <SearchBar
            onSubmit={(address) => {
              if (!address) { return }
              const retrieveAccount = async () => {
                setError(null)
                const res = await getAccounts(String(address))
                if (res) {
                  setAccounts(res)
                  setContractAddress(address)
                  setError(null)
                } else {
                  setAccounts({})
                  setError("Failed to retrieve address")
                }
              }
              retrieveAccount()
            }}
          />
        </div>
      </div>

      {
        accounts && Object.keys(accounts).length > 0 &&
        <>
          <b>Select a contract to continue</b>
          <div className="flex flex-wrap sm:flex-no-wrap">
            {
              Object.keys(accounts).map((network: string) => {
                const account = accounts[network];
                if (account != null) {
                  return Object.keys(account.contracts).map((contractName: string) => {
                    return (
                      <div className='cursor-pointer flex space-x-4 p-6 rounded-xl border-2 m-4'
                        onClick={() => { selectContract(contractAddress, contractName, network) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>

                        <div>
                          <div className="text-md truncate pr-24 hover:text-clip">
                            {contractName}
                          </div>
                          <div className='flex items-center mt-2'>
                            {network === 'mainnet' ? <div className="bg-white text-green-600 text-xs">#{network}</div> : <div className="bg-white py-1 text-violet-600 text-xs">#{network}</div>}
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
                return null;
              })
            }
          </div>
        </>
      }

      {
        error && (
          <Alert status='error' title="Failed to retrieve address" body="Please try a different address" />
        )
      }
      <VerifierInfoBox />
    </>
  )
}