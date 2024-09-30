import { SocialIcon } from 'react-social-icons';
import { LinkIcon } from '../link-icon';
import { Badge } from '../badge';
import { useEffect, useState } from "react"
import { getNFTMetadataForCollectionIdentifier } from '../../../../flow/utils';
type GenericViewProps = {
  proposalData: any;
  view: any;
  withRawView: boolean;
};

function getFormattedDate(date: any) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
}

function Socials(externalURL: any, socials: any) {
  let formattedSocials: [{ social: string; socialLink: string }] = [
    {
      social: 'Website',
      socialLink: externalURL,
    },
  ];

  Object.keys(socials).map((social) => {
    const socialLink =
      socials[social] && socials[social].url
        ? socials[social].url
        : socials[social];
    formattedSocials.push({
      social,
      socialLink,
    });
  });

  const withoutIcons = (
    <>
      {formattedSocials.map((social, i) => {
        return (
          <a
            key={i}
            href={social.socialLink}
            target="_blank"
            className="flex flex-row mr-8"
          >
            <div className="text-sm mr-2 text-lg">
              {social.social[0].toUpperCase() + social.social.slice(1)}
            </div>
            <LinkIcon />
          </a>
        );
      })}
    </>
  );

  const socialProps = {
    style: { height: 44, width: 44, marginRight: 12 },
    target: '_blank',
    bgColor: '#DEE2E9',
    fgColor: '#3B3CFF',
  };
  const withIcons = (
    <>
      {externalURL && externalURL.url && externalURL.url !== '' && (
        <div>
          <SocialIcon url={externalURL.url} href={externalURL.url} {...socialProps} />{' '}
        </div>
      )}
      {socials &&
        Object.keys(socials).map((social) => {
          const socialLink =
            socials[social] && socials[social].url
              ? socials[social].url
              : socials[social];
          
          // Only return the SocialIcon component if the socialLink is not null or an empty string
          if (socialLink && socialLink.url && socialLink.url !== '') {
            return (
              <div key={social}>
                <SocialIcon url={socialLink} href={socialLink} {...socialProps} />{' '}
              </div>
            );
          } else {
            return null;
          }
        })}
    </>
  );
  return (
    <div>
      <div className="flex md:hidden">{withIcons}</div>
      <div className="hidden md:flex">{withoutIcons}</div>
    </div>
  );
}

export function CollectionDisplayView(props: any) {
  const [isUpdateProposal, setIsUpdateProposal] = useState<boolean | null>(null)
  
  useEffect(() => {
    if (!props?.proposalData?.collectionIdentifier) { return }
    const setup = async () => {
        const catalogEntry = await getNFTMetadataForCollectionIdentifier(props?.proposalData?.collectionIdentifier)
        if (catalogEntry != null) {
          // Proposing an update...
          setIsUpdateProposal(true)
        } else {
          setIsUpdateProposal(false)
        }
    }
    setup()
  }, [props?.proposalData?.collectionIdentifier])

  const proposalData = props.proposalData;
  const view = props.view;
  const withRawView = props.withRawView;
  const readableStatus =
    proposalData &&
    (proposalData.status === 'IN_REVIEW'
      ? 'In Review'
      : proposalData.status === 'APPROVED'
      ? 'Approved'
      : 'Rejected');

  let proposal = proposalData && (
    <div>
      <div className="flex flex-row">
        <Badge
          color={
            proposalData.status === 'IN_REVIEW'
              ? 'blue'
              : proposalData.status === 'APPROVED'
              ? 'green'
              : 'red'
          }
          text={readableStatus}
        />
        <span className="rounded bg-primary-gray-50 border-2 text-sm border-2 text-xs mr-2 px-2.5 py-0.5 rounded pt-1">
          Created {getFormattedDate(new Date(proposalData.createdTime * 1000))}
        </span>
        {isUpdateProposal && proposalData.status === "IN_REVIEW" && <Badge color="red" text="This is an update" />}
      </div>
    </div>
  );

  // Check if IPS File
  let collectionSquareImage;
  if(view.squareImage?.file?.cid != null) {
    collectionSquareImage = 'https://ipfs.io/ipfs/' + view.squareImage?.file?.cid;
  } else {
    collectionSquareImage =
      view.squareImage && view.squareImage.file
        ? view.squareImage.file.url
        : view.collectionSquareImage.file.url;
    if (collectionSquareImage.startsWith('ipfs://')) {
      collectionSquareImage =
        'https://ipfs.io/ipfs/' + collectionSquareImage.substring(7);
    }
  }

  const externalURL =
    view && view.externalURL && view.externalURL.url
      ? view.externalURL.url
      : view.externalURL;
  return (
    <>
      <div className="flex xs:flex-col md:flex-row">
        <div className="md:basis-1/2 flex flex-col align-items-center justify-center pt-12">
          {proposal}
          <div className="xs:text-2xl sm:text-4xl md:text-5xl font-display font-bold py-8 overflow-clip">
            {view.collectionName || view.name}
          </div>
          <div className="text-md mt-2 font-semibold text-lg text-gray-600 overflow-clip">
            {view.collectionDescription || view.description}
          </div>
          <div className="w-full overflow-x-none text-md py-20 flex flex-row">
            {view.socials && Socials(externalURL, view.socials)}
          </div>
        </div>
        <div className="basis-1/2 flex flex-row justify-center">
          <img
            className="basis-1/2 md:pl-12 py-16 object-contain"
            src={collectionSquareImage}
          ></img>
        </div>
      </div>
    </>
  );
}
