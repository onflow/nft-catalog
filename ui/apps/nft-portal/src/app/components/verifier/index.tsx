import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from '../../hooks/use-query';
import { ContractSelect } from './contract-select';
import { SampleNFTView } from './sample-nft-view';
import { StepsProgressBar } from "./steps-progress-bar";
import { AdditionalNftInfo } from "./additional-nft-info";
import { AddToCatalog } from "./add-to-catalog";
import { changeFCLEnvironment } from "../../../flow/setup";
import { Network } from "../catalog/network-dropdown";

export default function ({
}: {
}) {
  const query = useQuery()
  const navigate = useNavigate()
  const { selectedNetwork, selectedAddress, selectedContract } = useParams<any>()

  if (selectedNetwork) {
    changeFCLEnvironment(selectedNetwork as Network)
  }

  const storagePath = query.get("path")
  const sampleAddress = query.get("sampleAddress")
  const nftID = query.get("nftID")
  const confirmed = query.get("confirmed")

  const steps = [
    {
      id: "S1",
      title: "Select contract",
      href: `/v`,
      isActive: !selectedNetwork || !selectedAddress || !selectedContract,
      isComplete: selectedNetwork && selectedAddress && selectedContract
    },
    {
      id: "S2",
      title: "Additional info",
      href: `/v/${selectedNetwork}/${selectedAddress}/${selectedContract}`,
      isActive: selectedNetwork && selectedAddress && selectedContract,
      isComplete: selectedNetwork && selectedAddress && selectedContract &&
        sampleAddress && storagePath
    },
    {
      id: "S3",
      title: "Review Metadata",
      href: `/v/${selectedNetwork}/${selectedAddress}/${selectedContract}?path=${storagePath}&sampleAddress=${sampleAddress}`,
      isActive: selectedNetwork && selectedAddress && selectedContract &&
        sampleAddress && storagePath,
      isComplete: selectedNetwork && selectedAddress && selectedContract &&
        sampleAddress && storagePath && confirmed
    },
    {
      id: "S4",
      title: "Submit for review",
      onClick: () => {},
      isActive: selectedNetwork && selectedAddress && selectedContract &&
        sampleAddress && storagePath && confirmed,
      isComplete: false
    }
  ]

  return (
    <div className="xs:p-4 xs:py-16 md:pl-24">
      <div className="md:mb-8 overflow-hidden text-ellipsis xs:text-2xl md:text-4xl lg:text-5xl font-display font-bold">Add your NFT Collection</div>
      <StepsProgressBar
        steps={steps}
      />
      <div className="mt-8 max-w-7xl">
        {
          steps[0].isActive && !steps[0].isComplete && (
            <ContractSelect
              selectContract={(contractAddress: String, contractName: string, network: string) => {
                changeFCLEnvironment(network as Network)
                navigate(`/v/${network}/${contractAddress}/${contractName}`);
              }}
            />
          )
        }

        {
          steps[1].isActive && !steps[1].isComplete && (
            <AdditionalNftInfo />
          )
        }
        {
          steps[2].isActive && !steps[2].isComplete && (
            <SampleNFTView sampleAddress={sampleAddress} storagePath={storagePath} nftID={nftID}  />
          )
        }

        {
          steps[3].isActive && !steps[3].isComplete && (
            <AddToCatalog sampleAddress={sampleAddress} storagePath={storagePath} nftID={nftID} />
          )
        }
      </div>
    </div>
  )
}
