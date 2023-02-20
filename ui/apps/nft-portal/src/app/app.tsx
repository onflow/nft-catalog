// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Route, Routes, Navigate } from 'react-router-dom';
import '../flow/setup';
import ContractInputs from './components/verifier';
import Catalog from './components/catalog';
import Proposals from './components/catalog/proposals';
import { HeaderLayout } from './components/home/header-layout';
import { CardLayout } from './components/home/card-layout';
import { Navbar } from './components/shared/navbar';
import { Footer } from './components/shared/footer';
import { Terms } from './components/terms/terms';
import { Privacy } from './components/privacy/privacy';
import { AdminSetup } from './components/admin/setup';
import NFTs from './components/nft';
import Transactions from './components/transactions';
import { ToolsLayout } from './components/tools/tools-layout';
import { Submitted } from './components/verifier/submitted';
import { CatalogDetails } from './components/catalog/catalog-details';
import { Docs } from './components/docs';

export function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary-gray-50">
        <div className="pb-16">
          <Routes>
            <Route path="/">
              <Route
                path=""
                element={
                  <>
                    <HeaderLayout />
                    <CardLayout />
                  </>
                }
              />
              <Route path="v">
                <Route index={true} element={<ContractInputs />}></Route>
                <Route
                  path=":selectedNetwork/:selectedAddress/:selectedContract"
                  element={<ContractInputs />}
                />
              </Route>
            </Route>
            <Route path="proposals">
              <Route
                index={true}
                element={<Navigate to="/proposals/mainnet" />}
              />
              <Route path=":network" element={<Catalog type="Proposals" />} />
              <Route
                path=":network/:collectionIdentifier"
                element={<CatalogDetails type="Proposals"></CatalogDetails>}
              />
            </Route>
            <Route path="catalog">
              <Route index={true} element={<Navigate to="/catalog/mainnet" />} />
              <Route path=":network/" element={<Catalog type="Catalog"></Catalog>} />
              <Route path=":network/:collectionIdentifier" element={<CatalogDetails type="Catalog"></CatalogDetails>} />
            </Route>
            <Route path="nfts">
              <Route index={true} element={<Navigate to="/nfts/mainnet" />} />
              <Route path=":network" element={<NFTs />} />
              <Route path=":network/:address" element={<NFTs />} />
              <Route
                path=":network/:address/:identifier/:nftID"
                element={<NFTs />}
              />
            </Route>
            <Route path="transactions">
              <Route
                index={true}
                element={<Navigate to="/transactions/mainnet" />}
              />
              <Route path=":network" element={<Transactions />} />
              <Route path=":network/:transaction" element={<Transactions />} />
              <Route
                path=":network/:transaction/:identifier"
                element={<Transactions />}
              />
              <Route
                path=":network/:transaction/:identifier/:vault"
                element={<Transactions />}
              />
            </Route>
            <Route path="docs/:name" element={<Docs />} />
            <Route path="admin" element={<AdminSetup />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="tools" element={<ToolsLayout />} />
            <Route path="submitted" element={<Submitted />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
