import { useEffect, useState } from 'react';
import { Spinner } from '../shared/spinner';
import { getNFTInAccountFromCatalog } from 'apps/nft-portal/src/flow/utils';
import { Alert } from '../shared/alert';
import { Box } from '../shared/box';
import { DisplayView } from '../shared/views/display-view';
import { EmptyContent } from '../catalog/empty-content';
import { Network } from '../catalog/network-dropdown';
import { CollectionDisplayView } from '../shared/views/collection-display-view';

export function NFTContent({
  nftID,
  identifier,
  walletAddress,
}: {
  nftID: string | undefined;
  identifier: string | undefined;
  walletAddress: string | undefined;
  network: Network;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [nftData, setNFTData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    const setup = async () => {
      setLoading(true);
      if (nftID && walletAddress && identifier) {
        try {
          const res = await getNFTInAccountFromCatalog(
            walletAddress,
            identifier,
            nftID
          );
          setNFTData(res);
        } catch (e) {
          console.log(e);
          setError(
            `Unable to find nft with ID ${nftID} and collection ${identifier}`
          );
        }
      } else {
        setNFTData(null);
      }
      setLoading(false);
    };
    setup();
  }, [identifier, walletAddress, nftID]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert status="error" title={error} body={''} />;
  }

  if (nftData == null) {
    return <EmptyContent />;
  }
  return (
    <div>
      <div className="pb-96">
        <DisplayView
          view={{
            name: nftData.name,
            description: nftData.description,
            thumbnail: nftData.thumbnail,
          }}
        />
      </div>
      <hr className="my-3" />
      <div>
        <CollectionDisplayView
          view={{
            collectionSquareImage: {
              file: { url: nftData.collectionSquareImage },
            },
            collectionBannerImage: {
              file: { url: nftData.collectionBannerImage },
            },
            externalURL: { url: nftData.externalURL },
            collectionDescription: nftData.collectionDescription,
            description: nftData.description,
            collectionName: nftData.collectioNName,
            name: nftData.name,
          }}
          withRawView={false}
        />
      </div>
    </div>
  );
}
