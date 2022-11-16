import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { TextInput } from "../shared/text-input"
import { Spinner } from "../shared/spinner"
import { getNFTInAccountFromCatalog } from "apps/nft-portal/src/flow/utils"
import { Alert } from "../shared/alert"
import { Box } from "../shared/box"
import { DisplayView } from "../shared/views/display-view"
import { CollectionDisplayView } from "../shared/views/collection-display-view"
import { EmptyContent } from "../catalog/empty-content"
import { Button } from "../shared/button"
import { Network } from "../../constants/networks";

export function NFTContent({ nftID, identifier, walletAddress, network }: { nftID: string | undefined, identifier: string | undefined, walletAddress: string | undefined, network: Network }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [address, setAddress] = useState<string | undefined>(walletAddress)
    const [nftData, setNFTData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setError(null)
        const setup = async () => {
            setLoading(true)
            if (nftID && address && identifier) {
                const res = await getNFTInAccountFromCatalog(address, identifier, nftID)
                if (res) {
                    setNFTData(res);
                } else {
                    setError(`Unable to find nft with ID ${nftID} and collection ${identifier}`)
                }
            } else {
                setNFTData(null);
            }
            setLoading(false)
        }
        setup()
    }, [address, nftID])

    const hasAddress = walletAddress != null

    if (!hasAddress) {
        return (
            <div>
                <div className="text-md">
                    Enter a flow account address to view catalog supported NFTs owned by the account.
                </div>
                <br />
                <div className="mb-4 max-w-md">
                    <TextInput
                        value={address ?? ""}
                        placeholder="0xabcdefghijklmnop"
                        updateValue={setAddress}
                    />
                </div>
                <div className="text-left">
                    <Button
                        key="view"
                        onClick={
                            async () => {
                                if (address != null || address !== '') {
                                    navigate(`/nfts/${network}/${address}`);
                                }

                            }
                        }
                    >
                        Submit
                    </Button>
                </div>
            </div>
        )
    }

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <Alert status="error" title={error} body={""} />
    }

    return <>{nftData != null ?
        <>
            <div> <span className="text-xl"><b>{nftData.name}</b></span></div>
            <br />
            <div className="text-lg">Display</div>
            <Box>
                <DisplayView view={{ name: nftData.name, description: nftData.description, thumbnail: nftData.thumbnail }} />
            </Box>
            <br />
            <div className="text-lg">Collection Display</div>
            <Box>
                <CollectionDisplayView view={{ collectionSquareImage: { file: { url: nftData.collectionSquareImage } }, collectionBannerImage: { file: { url: nftData.collectionBannerImage } }, externalURL: { url: nftData.externalURL }, collectionDescription: nftData.collectionDescription, description: nftData.description, collectionName: nftData.collectioNName, name: nftData.name }} withRawView={false} />
            </Box></>
        : <EmptyContent />}</>

}