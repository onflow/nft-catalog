import { useCallback } from "react"
import { NetworkDropDown } from "../catalog/network-dropdown";
import { Network } from "../../constants/networks";
import { useParams, useNavigate } from "react-router-dom";
import { CatalogSelect } from "../catalog/catalog-select";
import { NFTContent } from "./nft-content";
import { changeFCLEnvironment } from "apps/nft-portal/src/flow/setup";
import { Hamburger } from "../shared/hamburger";

type NFTParams = {
    network: Network;
    address: string;
    identifier: string;
    nftID: string;
}

export default function Layout() {

    const { network = 'testnet', address, identifier, nftID } = useParams<NFTParams>()

    const navigate = useNavigate()

    const onNetworkChange = useCallback((network: Network) => {
        changeFCLEnvironment(network)
        navigate(`/nfts/${network}`)
    }, [])

    return (
        <div className="mx-auto px-0 md:px-4 lg:px-32 pt-4">
            <div className="text-h1 p-2 max-w-full overflow-hidden text-ellipsis !text-2xl md:!text-4xl sm:border-0">
                NFTs
            </div>
            <div
                className="flex w-full h-full items-center text-center bg-white rounded-2xl sm:flex-col md:flex-row"
            >
                <div className="flex-col lg:hidden w-full">
                    <div className="flex w-full items-center">
                        <div className="grow">
                            <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
                        </div>
                        <div>
                            <Hamburger onClick={() => {
                                // Item selected
                                if (identifier != null || address != null) {
                                    navigate(`/nfts/${network}`)
                                }
                            }} />
                        </div>
                    </div>
                    {identifier == null && <CatalogSelect userAddress={address} type="NFTs" network={network} selected={undefined} />}
                    {(address == null || identifier != null) && <NFTContent network={network} walletAddress={address} nftID={nftID} identifier={identifier} />}
                </div>
                <div className="lg:flex hidden overflow-hidden">
                    <div className="flex-1 border-accent-light-gray sm:border-0 md:border-r-2 self-start min-h-screen w-full md:max-w-xs lg:max-w-sm">
                        <div className="flex-col">
                            <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
                            <CatalogSelect userAddress={address} type="NFTs" network={network} selected={undefined} />
                        </div>
                    </div>

                    <div className="px-10 w-3/4 self-start py-10 justify-self-start text-left">
                        <NFTContent network={network} walletAddress={address} nftID={nftID} identifier={identifier} />
                    </div>
                </div>
            </div>
        </div>
    )
}