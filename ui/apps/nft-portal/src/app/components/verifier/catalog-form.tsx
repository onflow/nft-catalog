import { TextInput } from '../shared/text-input';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert } from '../shared/alert';
import { Spinner } from '../shared/spinner';
import {
  proposeNFTToCatalog,
  getNFTMetadataForCollectionIdentifier,
} from '../../../flow/utils';
import { useDebounce } from '../../../app/hooks/use-debounce';
import { getNFTsInAccount } from '../../../flow/utils';
import * as fcl from '@onflow/fcl';
import { VerifierInfoBox } from './verifier-info-box';

type CatalogProps = {
  sampleAddress: string | null;
  storagePath: string | null;
  nftID: string | null;
};

export function CatalogForm({
  sampleAddress,
  storagePath,
  nftID,
}: CatalogProps) {
  const navigate = useNavigate();
  const [collectionIdentifier, setCollectionIdentifier] = useState<string>('');
  const debouncedCollectionIdentifier: string = useDebounce<string>(
    collectionIdentifier,
    500
  );
  const [message, setMessage] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const { selectedNetwork, selectedAddress, selectedContract } =
    useParams<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [user, setUser] = useState({ loggedIn: null });

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  useEffect(() => {
    if (!sampleAddress || !storagePath || !nftID) {
      return;
    }
    const getNfts = async () => {
      const allNFTs = await getNFTsInAccount(sampleAddress, storagePath);
      if (!collectionIdentifier || collectionIdentifier === '') {
        const selectedNft = allNFTs.find((nft: { Id: string }) => {
          return nft.Id === nftID;
        });
        if (selectedNft && selectedNft.NFTCollectionDisplay) {
          // Get rid of spaces if they exist..
          setCollectionIdentifier(
            selectedNft.NFTCollectionDisplay.collectionName.replace(/\s+/g, '')
          );
        }
      }
    };
    getNfts();
  }, []);

  useEffect(() => {
    const metadataInformation = async () => {
      const res = await getNFTMetadataForCollectionIdentifier(
        debouncedCollectionIdentifier
      );
      if (res != null) {
        setError(null);
        setWarning(
          'An entry with this collection identifier already exists in the catalog. This proposal will be proposing an update.'
        );
      } else {
        setWarning(null);
      }
    };
    if (debouncedCollectionIdentifier !== '') {
      metadataInformation();
    }
  }, [debouncedCollectionIdentifier]);

  function validateIdentifier(collectionIdentifier: string): boolean {
    return (
      !/\s/.test(collectionIdentifier) &&
      !/-/.test(collectionIdentifier) &&
      !/\./.test(collectionIdentifier)
    );
  }

  return (
    <>
      {warning && (
        <>
          <Alert status="warning" title={warning} body="" />
          <br />
        </>
      )}
      {error && (
        <>
          <Alert status="error" title={error} body="" />
          <br />
        </>
      )}
      <form
        className="my-12 w-7/12"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setWarning(null);
          if (
            collectionIdentifier === '' ||
            collectionIdentifier == null ||
            message === '' ||
            message == null
          ) {
            setError('Missing Data');
            return;
          }
          if (
            !storagePath ||
            !sampleAddress ||
            !selectedAddress ||
            !selectedContract ||
            !nftID
          ) {
            setError('Missing Data');
            return;
          }
          if (!validateIdentifier(collectionIdentifier)) {
            setError(
              "Invalid identifier, please make sure you don't include any spaces or dashes."
            );
            return;
          }
          if (!user.loggedIn) {
            await fcl.logIn();
          }
          setLoading(true);
          const proposalMessage =
            message +
            ' ( This proposal was made via: ' +
            window.location.href +
            ' )';
          try {
            await proposeNFTToCatalog(
              collectionIdentifier,
              sampleAddress,
              nftID,
              storagePath,
              selectedContract,
              selectedAddress,
              proposalMessage
            );
            setError(null);
            navigate(`/submitted`);
          } catch (e: any) {
            setError(e.toString());
          }
          setLoading(false);
        }}
      >
        <p className="text-sm mb-4 font-bold">
          Enter a unique identifier (title) to describe this collection
        </p>
        <TextInput
          value={collectionIdentifier}
          updateValue={setCollectionIdentifier}
          placeholder="e.g. ExampleNFT"
        />
        <br />
        <br />
        <p className="text-sm mb-4 font-bold">Add a description</p>
        <TextInput
          value={message}
          updateValue={setMessage}
          placeholder="Description"
        />
        <br />
        <br />
        {/*<p className='text-sm mb-4 font-bold'>Enter an email address to be notified when your submission has been reviewed</p>
        <TextInput
          value={emailAddress}
          updateValue={setEmailAddress}
          placeholder=""
        />
    <br />*/}
        {loading ? (
          <Spinner />
        ) : (
          <input
            type="submit"
            value={'Submit for review'}
            className="cursor-pointer bg-black hover:bg-gray-100 text-white text-sm hover:text-black py-4 px-6 rounded-md"
          />
        )}
      </form>
      <VerifierInfoBox />
    </>
  );
}
