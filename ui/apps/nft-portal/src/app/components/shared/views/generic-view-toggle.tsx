import { useState } from 'react';
import { GenericView } from './generic-view';

type GenericViewProps = {
  view: any;
};
export function GenericViewToggle({ view }: GenericViewProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {expanded && <GenericView view={view} />}
      <span
        className="ml-auto text-blue-600 underline text-s cursor-pointer"
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {!expanded ? 'Show Raw View ↓' : 'Hide Raw View ↑'}
      </span>
    </>
  );
}
