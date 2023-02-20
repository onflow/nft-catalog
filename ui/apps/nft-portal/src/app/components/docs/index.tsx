import { useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import NFTGuide from './composability-nft-guide.mdx';
import Flowcase from './composability-flowcase-guide.mdx';

type DocsParams = {
  name: string;
}

export function Docs({}) {
  const {
    name
  } = useParams<DocsParams>();

  var content = <div>Doc not found</div>

  if (name === 'nft-guide') {
    content = <NFTGuide />
  } else if (name === 'flowcase-guide') {
    content = <Flowcase />
  }

  const components = {
    h1: (props: any) => <div className="text-3xl font-bold" {...props}>props.children</div>,
    h2: (props: any) => <div className="text-2xl font-bold" {...props}>{props.children}</div>,
    p: (props: any) => <div className="text-lg" {...props} />
  }

  return (
    <div className="mx-auto px-4 md:px-4 lg:px-32 md">
      <MDXProvider components={components}>
        { content }
      </MDXProvider>
    </div>
  )
}