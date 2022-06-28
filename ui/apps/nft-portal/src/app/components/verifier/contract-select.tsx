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
      <div className="text-h1 mb-6 max-w-full overflow-hidden text-ellipsis !text-2xl md:!text-4xl">Select NFT Contract</div>
      <div className="text-l">
        This tool will assist you in verifying the metadata on your NFTs and allow your collection to be added to the <b>Flow NFT Catalog</b>.
        <br />
        <br />
        The <b>Flow NFT Catalog</b> will provide the needed context to applications and marketplaces to utilize your NFT collection and unlock interoperability throughout the Flow ecosystem.
        <br />
      </div>
      <hr className="my-6" />
      <b>Enter Address containing your NFT Contract</b>
      <br />
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
                    <div key={contractName} className="mt-1">
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

      {/*
      <br />
      <a onClick={() => { setContractAddress(`0xe223d8a629e49c68`) }}>Sample without nft: 0xe223d8a629e49c68</a>
      <br />
      <a onClick={() => { setContractAddress(`0x3277199d6c1eeaa4`) }}>Sample with nft and no metadata: 0x3277199d6c1eeaa4</a>
      <br />
      <a onClick={() => { setContractAddress(`0x877931736ee77cff`) }}>Sample with nft and metadataviews and improper public link: 0x877931736ee77cff</a>
      <br />
      <a onClick={() => { setContractAddress(`0x386817f360a5c8df`) }}>Sample with nft and metadataviews and proper public link: 0x386817f360a5c8df</a>
      <br />
      */}

    </>
  )
}