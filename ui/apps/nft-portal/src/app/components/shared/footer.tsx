import OnFlowIcon from "../../../assets/flow-icon-bw-light.svg"
import GithubIcon from "../../../assets/github-light.svg"

// reduce repetition of the section layout in Footer component
const footerSections = [
  {
    header: "",
    links: [
      {
        link: "/",
        text: "Home",
      },
      {
        link: "/catalog",
        text: "Catalog",
      },
      {
        link: "/v",
        text: "Metadata Verifier",
      },
      {
        link: "/proposals",
        text: "Catalog Proposals",
      },
    ],
  },
  {
    header: "",
    links: [
      {
        link: "/terms",
        text: "Terms of Use",
      },
      {
        link: "/privacy",
        text: "Privacy Policy",
      }
    ],
  },
]

export const Footer = ({ sections = footerSections }) => {
  return (
    <footer className="bg-black px-6 text-white">
      <div className="container mx-auto">
        <div className="block items-center justify-between px-2 pt-8 pb-6 md:flex md:px-4 md:pt-16">
          <a href="/" className="py-2 hover:opacity-75 text-xl font-display font-bold">
            Flow NFT Catalog
          </a>
          <div className="flex items-center gap-6 pt-8 md:pt-0">
            <a href="https://github.com/dapperlabs/nft-catalog" className="hover:opacity-75">
              <img src={GithubIcon} height={32} width={32} />
            </a>
            <a href="https://onflow.org/" className="hover:opacity-75">
              <img src={OnFlowIcon} height={28} width={28} />
            </a>
          </div>
        </div>
        <div className="grid auto-cols-min gap-y-4 border-y border-y-primary-gray-400 px-2 pb-6 pt-9 xs:grid-cols-1 sm:grid-cols-2 sm:gap-x-12 md:gap-x-20 md:px-4 lg:grid-cols-[fit-content(25%)_fit-content(25%)_fit-content(25%)_fit-content(25%)]">
          {sections.map((section, i) => (
            <section key={i} className="w-fit pb-12 md:pb-0">
              <div className="pb-3">
                <h3 className="whitespace-nowrap text-base font-bold md:text-xl lg:text-2xl">
                  {section.header}
                </h3>
              </div>
              <ul>
                {section.links.map((link, j) => (
                  <li className="py-1 pl-0" key={j}>
                    <a
                      className="whitespace-nowrap text-xs text-primary-gray-200 hover:text-primary-gray-100 md:text-sm lg:text-base"
                      href={link.link}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </footer>
  )
}