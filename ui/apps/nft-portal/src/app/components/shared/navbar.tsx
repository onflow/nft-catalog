import { useState } from "react";

function NavButton({ href, title, withBorder }: { href: string, title: string, withBorder: boolean }) {
  const border = withBorder ? 'border-l' : ''
  return (
    <li className={`${border} border-primary-gray-100`}>
      <a
        className={
          "inline-flex items-center whitespace-nowrap stroke-black text-primary-blue hover:opacity-75 px-4"
        }
        href={href}
      >
        <span>{title}</span>
      </a>
    </li>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="z-40 flex min-h-[96px] items-center bg-white p-4 text-primary-gray-400 lg:px-8 border-2 border-primary-gray-100">
      <a className="flex items-center font-display font-bold text-xl cursor-pointer" href="/">
        <header>Flow NFT Catalog</header>
      </a>
      <div className="mt-1 flex flex-1 justify-end lg:hidden">
        <button className="flex items-center px-3 py-2 text-lg border rounded text-primary-blue hover:opacity-75" onClick={(() => setMenuOpen(true))}>
          <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
        </button>
      </div>
      {menuOpen && <div className="mt-1 flex flex-1 justify-end lg:hidden">
        <ul className="flex flex-col lg:hidden pb-4">
          <button className="flex flex-1 justify-end rounded text-primary-blue hover:opacity-75" onClick={() => setMenuOpen(false)}>
            x
          </button>
          <NavButton title="Catalog" href="/catalog" withBorder={false} />
          <NavButton title="Proposals" href="/proposals" withBorder={false} />
          <NavButton title="Verify NFT Metadata" href="/v" withBorder={false} />
          <NavButton title="View NFTs" href="/nfts" withBorder={false} />
          <NavButton title="Generate Transactions" href="/transactions" withBorder={false} />
        </ul>
      </div>}
      <div className="mt-1 flex flex-1 justify-end lg:flex hidden">
        <ul className="flex items-center">
          <NavButton title="Catalog" href="/catalog" withBorder={false} />
          <NavButton title="Proposals" href="/proposals" withBorder={true} />
          <NavButton title="Verify NFT Metadata" href="/v" withBorder={true} />
          <NavButton title="View NFTs" href="/nfts" withBorder={true} />
          <NavButton title="Generate Transactions" href="/transactions" withBorder={true} />
        </ul>
      </div>
    </nav>
  )
}