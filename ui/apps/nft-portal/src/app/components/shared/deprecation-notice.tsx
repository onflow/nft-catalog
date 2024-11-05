import React from 'react';
import {FaExclamationTriangle} from 'react-icons/fa'

export const DeprecationNotice = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <FaExclamationTriangle />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-yellow-700">
            Deprecation Notice
          </p>
          <p className="mt-1 text-sm text-yellow-700">
            The <strong>Flow NFT Catalog</strong> is deprecated in favor of the <strong><a className="underline" href="https://token-list.fixes.world/">Token List</a></strong>.
            Please update your references accordingly.
          </p>
        </div>
      </div>
    </div>
  );
};
