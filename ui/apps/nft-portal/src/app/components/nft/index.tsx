import { useCallback, useEffect, useState } from "react"
import { NetworkDropDown, Network } from "../catalog/network-dropdown";
import { useParams, useNavigate } from "react-router-dom";
import { CatalogSelect } from "../catalog/catalog-select";
import { NFTContent } from "./nft-content";
import * as fcl from "@onflow/fcl"
import { changeFCLEnvironment } from "apps/nft-portal/src/flow/setup";

type NFTParams = {
    network: Network;
    identifier: string;
    nftID: string;
}

export default function Layout() {

    const [address, setAddress] = useState<string | null>(null)
    const { network = 'testnet', identifier, nftID } = useParams<NFTParams>()

    const navigate = useNavigate()

    const onNetworkChange = useCallback((network: Network) => {
        changeFCLEnvironment(network)
        setAddress(null);
        navigate(`/nfts/${network}`)
    }, [])

    useEffect(() => {
        const setupUser = async () => {
            const user = await fcl.currentUser().snapshot()
            const userAddress = user && user.addr ? user.addr : null
            setAddress(userAddress)
        }
        setupUser()
    }, [])

    return (
        <div className="mx-auto px-0 md:px-4 lg:px-32 pt-4">
            <div className="text-h1 p-2 max-w-full overflow-hidden text-ellipsis !text-2xl md:!text-4xl sm:border-0">
                NFTs
            </div>
            <div
                className="flex w-full h-full items-center text-center bg-white rounded-2xl sm:flex-col md:flex-row"
            >
                <div className="flex-1 border-accent-light-gray sm:border-0 md:border-r-2 self-start min-h-screen md:max-w-xs lg:max-w-sm">
                    <div className="flex-col">
                        <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
                        <CatalogSelect userAddress={address} type="NFTs" network={network} selected={undefined} />
                    </div>
                </div>
                <div className="px-10 w-3/4 self-start py-10 justify-self-start text-left">
                    <NFTContent address={address} onChangeAddress={setAddress} nftID={nftID} identifier={identifier} />
                </div>
            </div>
        </div>
    )
}