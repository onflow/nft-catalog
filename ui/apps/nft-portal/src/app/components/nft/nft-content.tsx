import { useEffect, useState } from "react"
import * as fcl from "@onflow/fcl"
import { Button } from "../shared/button"
import { Spinner } from "../shared/spinner"
import { getNFTInAccountFromCatalog } from "apps/nft-portal/src/flow/utils"
import { Alert } from "../shared/alert"
import { Box } from "../shared/box"
import { DisplayView } from "../shared/views/display-view"
import { CollectionDisplayView } from "../shared/views/collection-display-view"
import { EmptyContent } from "../catalog/empty-content"

export function NFTContent({ nftID, identifier, address, onChangeAddress }: { nftID: string | undefined, identifier: string | undefined, address: string | null, onChangeAddress: (value: string | null) => void }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [nftData, setNFTData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

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
            }
            setLoading(false)
        }
        setup()
    }, [address, nftID])

    const loggedIn = address !== null

    if (!loggedIn) {
        return (
            <>
                <Button
                    key="login"
                    onClick={
                        async () => {
                            setLoading(true)
                            let res = await fcl.logIn()
                            setLoading(false)
                            onChangeAddress(res.addr);
                        }
                    }
                >
                    Log In
                </Button>
            </>
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