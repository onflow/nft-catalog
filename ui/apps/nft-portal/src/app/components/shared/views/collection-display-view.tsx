import { GenericViewToggle } from './generic-view-toggle';
import { SocialIcon } from 'react-social-icons';

type GenericViewProps = {
  view: any;
  withRawView: boolean;
};

export function CollectionDisplayView({ view, withRawView }: GenericViewProps) {
  const collectionSquareImage =
    view.squareImage && view.squareImage.file
      ? view.squareImage.file.url
      : view.collectionSquareImage.file.url;
  const collectionBannerImage =
    view.bannerImage && view.bannerImage.file
      ? view.bannerImage.file.url
      : view.collectionBannerImage.file.url;
  const externalURL =
    view && view.externalURL && view.externalURL.url
      ? view.externalURL.url
      : view.externalURL;
  return (
    <>
      <a
        className="text-s hover:underline text-gray-500 py-1"
        href={externalURL}
        target="_blank"
      >
        Part of a NFT collection
      </a>
      <div className="text-2xl">{view.collectionName || view.name}</div>
      <div className="text-md mt-2">
        {view.collectionDescription || view.description}
      </div>
      <div className="w-full overflow-x-auto text-md">
        {view &&
          view.socials &&
          Object.keys(view.socials).map((social) => {
            const socialLink =
              view.socials[social] && view.socials[social].url
                ? view.socials[social].url
                : view.socials[social];
            return (
              <div key={social}>
                <SocialIcon
                  url={socialLink}
                  style={{ height: 25, width: 25 }}
                />{' '}
                {socialLink}
              </div>
            );
          })}
        <img src={collectionBannerImage} width="200" height="50"></img>
      </div>
      {withRawView && (
        <>
          <hr className="my-2" />
          <GenericViewToggle view={view} />
        </>
      )}
    </>
  );
}
