export function VerifierInfoBox() {
    return (
        <div className="mt-28 p-6 bg-gray-200 rounded-xl border-2">
            <div className="text-h1 mb-6 overflow-hidden text-ellipsis !text-xl md:!text-2xl font-display font-bold">How to add your NFT Collection</div>
            <div className="text-l text-stone-500 mb-6">
                Follow the prompts above and fill in the information to add your NFT collection to the Flow NFT Catalog. Visit the link below to view detailed instructions with sample inputs.
                <br />
            </div>
            <div className="flex">
                <div className="mb-2">
                    <a
                        className="text-md font-bold hover:text-primary-gray-100 lg:text-base flex items-center space-x-0"
                        target="_blank"
                        href="https://github.com/dapperlabs/nft-catalog/#submitting-a-collection-to-the-nft-catalog" rel="noreferrer"
                    >

                        Link to instructions
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={2.5} stroke="black" className="ml-2 mr-4 w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>

                    </a>
                </div>
            </div>
        </div>
    );
}