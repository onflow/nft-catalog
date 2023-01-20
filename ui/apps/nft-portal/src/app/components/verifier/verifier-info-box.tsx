export function VerifierInfoBox() {
    return (
        <div className="mt-24 p-6 bg-stone-200 rounded-xl border-2">
            <div className="text-h1 mb-6 overflow-hidden text-ellipsis !text-xl md:!text-2xl font-display font-bold">Additional information and examples</div>
            <div className="text-l text-stone-500 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                <br />
            </div>
            <div className="mb-2">
                <a className="text-h1 overflow-hidden text-ellipsis text-sm font-display font-bold cursor-pointer">This is a link to an example</a>
            </div>
            <div className="mb-2">
                <a className="text-h1 overflow-hidden text-ellipsis text-sm font-display font-bold cursor-pointer">Another link to an example</a>
            </div>
        </div>
    );
}