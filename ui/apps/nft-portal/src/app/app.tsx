// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import '../flow/setup';
import ContractInputs from './components/verifier';
import Catalog from './components/catalog';
import { HeaderLayout } from "./components/home/header-layout";
import { CardLayout } from "./components/home/card-layout";
import { Navbar } from "./components/shared/navbar";

export function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
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
                <Route path=":selectedNetwork/:selectedAddress/:selectedContract" element={<ContractInputs />} />
              </Route>
            </Route>
            <Route path="proposals">
              <Route index={true} element={<Navigate to="/proposals/mainnet" />} />
              <Route path=":network" element={<Catalog type="Proposals" />} />
              <Route path=":network/:identifier" element={<Catalog type="Proposals"></Catalog>} />
            </Route>
            <Route path="catalog">
              <Route index={true} element={<Navigate to="/catalog/mainnet" />} />
              <Route path=":network/" element={<Catalog type="Catalog"></Catalog>} />
              <Route path=":network/:identifier" element={<Catalog type="Catalog"></Catalog>} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
