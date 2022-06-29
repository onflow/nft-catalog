import { LinkIcon } from "../shared/link-icon"

export function LandingLinkCard({title, description, href}: {title: string, description: string, href: string}) {
  const isExternal = href.startsWith('https://')
  return (
    <div className="group my-2 flex flex-1 flex-col md:flex-row justify-start rounded-lg bg-white px-6 py-5 relative border-2 hover:shadow-2xl cursor-pointer  hover:shadow-2xl divided-item-hover">
      <a
        className="link-card-3-column-link group flex flex-col rounded-lg px-4"
        href={href}
        target={!isExternal ? "_self" : "_blank"}
      >
        <span className="display-block py-4">
          <div className="flex justify-between">
            <div>
              <div className="text-l text-display font-semibold">
                {title}
              </div>
              <div className="text-sm">
                {description}
              </div>
            </div>
            <div className="align-middle pt-6 text-primary-blue">
              <LinkIcon />
            </div>
          </div>
        </span>
      </a>
    </div>
  )
}