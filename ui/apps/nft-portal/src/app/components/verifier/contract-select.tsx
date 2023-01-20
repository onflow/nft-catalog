import { useState } from 'react';
import { getAccounts } from "../../../flow/utils"
import { SearchBar } from '../shared/search-bar';
import { Alert } from '../shared/alert';
import { Badge } from '../shared/badge';

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
      <div className="text-h1 mb-6 w-1/2 overflow-hidden text-ellipsis !text-xl md:!text-2xl font-display font-bold">Select NFT Contract</div>
      <div className="text-l w-7/12 text-stone-500">
        This tool will assist you in verifying the metadata on your NFTs and allow your collection to be added to the Flow NFT Catalog.
        The Flow NFT Catalog will provide the needed context to applications and marketplaces to utilize your NFT collection and unlock interoperability throughout the Flow ecosystem.
        <br />
      </div>
      <div className="my-12 w-7/12">
        <b className="w-1/2">Flow account address</b>
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
          <b>Select Contract</b>
          {
            Object.keys(accounts).map((network: string) => {
              const account = accounts[network];
              if (account != null) {
                return Object.keys(account.contracts).map((contractName: string) => {
                  return (
                    <div key={contractName} className="mt-2">
                      <a
                        className="no-underline hover:underline cursor-pointer text-blue-600"
                        onClick={() => { selectContract(contractAddress, contractName, network) }}
                      >
                        {contractName}
                      </a>
                      <span className='ml-4'>
                        <Badge text={network} color={network === 'mainnet' ? 'green' : 'yellow'} />
                      </span>
                      <br />
                    </div>
                  )
                })
              }
              return null;
            })
          }
        </>
      }

      {
        error && (
          <Alert status='error' title={error} body={""} />
        )
      }

    </>
  )
}