import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getAccount, retrieveContractInformation } from "../../../flow/utils"
import { Network } from "../catalog/network-dropdown"
import { Alert } from "../shared/alert"
import { Spinner } from "../shared/spinner"
import { NFTValidity } from "./nft-validity"
import { SampleNFTPrompt } from "./sample-nft-prompt"
import { VerifierInfoBox } from "./verifier-info-box"

export function AdditionalNftInfo({
}: {
}) {
  const { selectedNetwork, selectedAddress, selectedContract } = useParams<any>()
  const [account, setAccount] = useState<any>({})
  const [contractInfo, setContractInfo] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyContract = async () => {
      if (!selectedAddress || !selectedContract || !selectedNetwork) {
        return;
      }
      setLoading(true)
      const accountInfo = await getAccount(selectedAddress, selectedNetwork as Network)
      setAccount(accountInfo)
      if (!accountInfo) {
        setLoading(false)
        setError("Failed to retrieve account")
        return
      }
      const contracts = accountInfo.contracts as any
      if (!accountInfo || !contracts || !contracts[selectedContract]) {
        setLoading(false)
        setError("The provided contract could not be found")
        return;
      }

      const res = await retrieveContractInformation(
        selectedAddress,
        selectedContract,
        contracts[selectedContract],
        selectedNetwork as Network
      )
      if (res) {
        setLoading(false)
      } else {

      }
      setContractInfo(res)
    }

    verifyContract()
  }, [selectedAddress, selectedContract, selectedNetwork])


  const isContractValid = contractInfo &&
    contractInfo.isNFTContract &&
    contractInfo.nftConformsToMetadata &&
    contractInfo.collectionConformsToMetadata

  return (
    <div className="w-full">
      <div className="text-h1 mb-4 w-1/2 overflow-hidden text-ellipsis !text-xl md:!text-2xl font-bold">Enter additional contract information</div>
      {loading && <Spinner />}
      {error && <><Alert status="error" title={error} body="" /><br /></>}
      <NFTValidity selectedContract={selectedContract} contractInfo={contractInfo} />
      {
        isContractValid && selectedContract &&
        <>
          <div className="text-l w-7/12 text-stone-600">
            We need a bit more information about {selectedContract}
          </div>
          <br />
          <SampleNFTPrompt
            contractCode={account.contracts[selectedContract]}
            defaultValues={{ sampleAddress: "", storagePath: "" }}
            setError={(error: string) => { setError(error) }}
          />
        </>
      }
      <VerifierInfoBox />
    </div>
  )
}
