import { useState } from 'react';
import { Hamburger } from './hamburger';

function NavButton({
  href,
  title,
  withBorder,
}: {
  href: string;
  title: string;
  withBorder: boolean;
}) {
  const border = withBorder ? 'border-l' : '';
  return (
    <li className={`${border} border-primary-gray-100`}>
      <a
        className={
          'inline-flex items-center whitespace-nowrap stroke-black text-primary-blue hover:opacity-75 px-4'
        }
        href={href}
      >
        <span>{title}</span>
      </a>
    </li>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="z-40 flex min-h-[96px] items-center bg-white p-4 text-primary-gray-400 lg:px-8 border-2 border-primary-gray-100">
      <a
        className="flex items-center font-display font-bold text-xl cursor-pointer"
        href="/"
      >
        <header>Flow NFT Catalog</header>
      </a>
      <Hamburger onClick={() => setMenuOpen(true)} />
      {menuOpen && (
        <div className="mt-1 flex flex-1 justify-end lg:hidden">
          <ul className="flex flex-col lg:hidden pb-4">
            <button
              className="flex flex-1 justify-end rounded text-primary-blue hover:opacity-75"
              onClick={() => setMenuOpen(false)}
            >
              x
            </button>
            <NavButton title="Catalog" href="/catalog" withBorder={false} />
            <NavButton title="Tools" href="/tools" withBorder={false} />
            <NavButton
              title="Add NFT Collection"
              href="/v"
              withBorder={false}
            />
          </ul>
        </div>
      )}
      <div className="mt-1 flex flex-1 justify-end lg:flex hidden">
        <ul className="flex items-center">
          <NavButton title="Catalog" href="/catalog" withBorder={false} />
          <NavButton title="Tools" href="/tools" withBorder={false} />
          <NavButton title="Add NFT Collection" href="/v" withBorder={false} />
        </ul>
      </div>
    </nav>
  );
}
