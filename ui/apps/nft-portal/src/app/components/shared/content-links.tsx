import { ContentCard } from './content-card';
import TxImage from '../../../assets/tx.png';
import SImage from '../../../assets/script.png';
import NFTImage from '../../../assets/nft.png';

export function ContentLinks({}: {}) {
  const classes =
    'flex flex-col items-start items-center px-4 py-5 md:flex-row md:px-15 ';
  return (
    <div className="container">
      <span className="text-xl font-display font-bold md:mb-3">Build using collections on Flow</span>
      <div className={classes}>
        <div className="flex w-full flex-1 grid xs:grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <ContentCard
            title="Generate Transactions"
            href="/transactions"
            image={TxImage}
          />
          <ContentCard title="View NFT's" href="/nfts" image={NFTImage} />
          <ContentCard
            title="Cadence Scripts"
            href="https://github.com/dapperlabs/nft-catalog/tree/main/cadence"
            image={SImage}
          />
        </div>
      </div>
    </div>
  );
}
