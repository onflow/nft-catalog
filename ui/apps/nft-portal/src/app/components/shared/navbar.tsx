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

export function Navbar({ } : { }) {
  return (
    <nav className="z-40 flex min-h-[96px] items-center bg-white p-4 text-primary-gray-400 lg:px-8 border-2 border-primary-gray-100">
      <a className="flex items-center font-display font-bold text-xl cursor-pointer" href="/">
        <header>Flow NFT Catalog</header>
      </a>
      <div className="mt-1 flex flex-1 justify-end">
        <ul className="flex items-center">
          <NavButton title="Catalog" href="/catalog" withBorder={false} />
          <NavButton title="Proposals" href="/proposals" withBorder={true} />
          <NavButton title="Verify NFT Metadata" href="/v" withBorder={true} />
          <NavButton title="View NFTs" href="/nfts" withBorder={true} />
        </ul>
      </div>
    </nav>
  )
}