import React from 'react';
import { LinkIcon } from './link-icon';

export function LandingLinkCard({
  title,
  href,
  image,
}: {
  title: string;
  description?: string | undefined;
  href: string;
  image?: string | undefined;
}) {
  const isExternal = href.startsWith('https://');
  return (
    <a
      className="group my-2 flex flex-1 justify-between rounded-lg px-6 py-10 bg-white"
      href={href}
      target={!isExternal ? '_self' : '_blank'}
      rel="noreferrer"
    >
      {image && <img className="h-10" src={image} />}
      <div className="text-l text-display font-semibold">{title}</div>
      <div>
        <LinkIcon />
      </div>
    </a>
  );
}
