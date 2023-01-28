import { GenericViewToggle } from './generic-view-toggle';
import { SocialIcon } from 'react-social-icons';
import { LinkIcon } from '../link-icon';

type GenericViewProps = {
  view: any;
  withRawView: boolean;
};

function Socials(withIcons: boolean, externalURL: string, socials: any) {
  if (!withIcons) {
    let formattedSocials: [{social: string, socialLink: string}] = [
      {
        social: 'Website',
        socialLink: externalURL,
      }
    ]
    
    Object.keys(socials).map((social) => {
      const socialLink =
        socials[social] && socials[social].url
          ? socials[social].url
          : socials[social];
      formattedSocials.push({
        social,
        socialLink,
      })
    })

    return (
      <>
        {formattedSocials.map((social, i) => {
          return (
            <a key={i} href={social.socialLink} target="_blank" className="flex flex-row mr-8">
              <div className="text-sm mr-2 text-lg">{social.social[0].toUpperCase() + social.social.slice(1)}</div>
              <LinkIcon />
            </a>
          );
        })}
      </>
    )
    
  }
  return (
    <>
      {externalURL && (
        <div>
          <SocialIcon url={externalURL} style={{ height: 25, width: 25 }} />{' '}
          {externalURL}
        </div>
      )}
      {socials &&
        Object.keys(socials).map((social) => {
          const socialLink =
            socials[social] && socials[social].url
              ? socials[social].url
              : socials[social];
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
    </>
  );

}

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
      <div className="flex flex-row">
        <div className="basis-1/2 flex flex-col align-items-center justify-center">
          <div className="text-5xl font-display font-bold py-8">{view.collectionName || view.name}</div>
          <div className="text-md mt-2 font-semibold text-lg text-gray-600">
            {view.collectionDescription || view.description}
          </div>
          <div className="w-full overflow-x-auto text-md py-20 flex flex-row">
            {Socials(false, externalURL, view.socials)}
          </div>
        </div>
        <div className="basis-1/2 flex flex-row justify-center">
          <img className="basis-1/2 pl-32 py-16" src={collectionSquareImage}></img>
        </div>
      </div>
    </>
  );
}
