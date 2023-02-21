import { GenericViewToggle } from './generic-view-toggle';

type GenericViewProps = {
  view: any;
};

export function DisplayView({ view }: GenericViewProps) {
  let { thumbnail } = view;
  const { name, description } = view;
  if (thumbnail.startsWith('ipfs://')) {
    thumbnail = 'https://ipfs.io/ipfs/' + thumbnail.substring(7);
  }
  const classes = 'flex flex-col md:flex-row justify-between';
  return (
    <>
      <div className={classes}>
        <div className="flex flex-col mr-4">
          <p className="text-3xl font-bold">
            {'NFT | '}
            {name}
          </p>
          <span className="pt-4 text-m">
            {description || 'No description set'}
          </span>
          <div className="pt-2">
            <GenericViewToggle view={view} />
          </div>
        </div>
        {thumbnail && (
          <img
            className="align-right"
            src={thumbnail}
            width="400"
            alt="NFT Thumbnail"
          ></img>
        )}
      </div>
    </>
  );
}
