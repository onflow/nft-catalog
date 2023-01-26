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
  const classes = 'flex flex-col items-start';
  return (
    <>
      {thumbnail && (
        <div className="float-right">
          <img src={thumbnail} width="400" alt="NFT Thumbnail"></img>
        </div>
      )}
      <div className={classes}>
        <div>
          <span className="text-3xl font-bold">
            {'NFT | '}
            {name}
          </span>
        </div>
        <div className="pt-2">
          <span className="text-m">{description || 'No description set'}</span>
        </div>
        <div className="pt-2">
          <GenericViewToggle view={view} />
        </div>
      </div>
    </>
  );
}
