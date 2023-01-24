import { LinkIcon } from './link-icon';

export function LandingLinkCard({
  title,
  href,
}: {
  title: string;
  description: string | undefined;
  href: string;
}) {
  const isExternal = href.startsWith('https://');
  return (
    <a
      className="group my-2 flex flex-1 justify-between rounded-lg px-6 py-10 bg-gray-200/50"
      href={href}
      target={!isExternal ? '_self' : '_blank'}
      rel="noreferrer"
    >
      <div className="text-l text-display font-semibold">{title}</div>
      <div>
        <LinkIcon />
      </div>
    </a>
  );
}
