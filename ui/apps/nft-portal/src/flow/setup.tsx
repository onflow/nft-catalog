import { config } from "@onflow/fcl";
import { Network } from "../app/components/catalog/network-dropdown";
//@ts-ignore
import * as json from "./c2j.json";
//@ts-ignore
import * as catalogJson from "./catalog_c2j.json"


export function changeFCLEnvironment(input: Network) {
  if (input === 'mainnet') {
    setupMainnet()
  } else if (input === 'testnet') {
    setupTestnet();
  }
}

function setupMainnet() {
  config({
    "accessNode.api": "https://rest-mainnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
    "app.detail.title": "NFT Metadata",
    "app.detail.icon": "https://assets.website-files.com/5f734f4dbd95382f4fdfa0ea/62743866c2a1ff97d43bb844_Group%2010.svg"
  })
  Object.keys(json.vars["mainnet"]).forEach(
    (contractAddressKey) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.put(
        contractAddressKey,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        json.vars["mainnet"][contractAddressKey]
      );
    }
  );
  Object.keys(catalogJson.vars["mainnet"]).forEach(
    (contractAddressKey) => {
      // @ts-ignore
      if (contractAddressKey.indexOf("0xNFTCatalog") > 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.put("0xNFTCatalogAdmin", catalogJson.vars["mainnet"][contractAddressKey])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.put(
        contractAddressKey,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        catalogJson.vars["mainnet"][contractAddressKey]
      );
    }
  );
}

function setupTestnet() {
  config({
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "app.detail.title": "NFT Metadata",
    "app.detail.icon": "https://assets.website-files.com/5f734f4dbd95382f4fdfa0ea/62743866c2a1ff97d43bb844_Group%2010.svg"
  })
  Object.keys(json.vars["testnet"]).forEach(
    (contractAddressKey) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.put(
        contractAddressKey,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        json.vars["testnet"][contractAddressKey]
      );
    }
  );
  Object.keys(catalogJson.vars["testnet"]).forEach(
    (contractAddressKey) => {
      // @ts-ignore
      if (contractAddressKey.indexOf("0xNFTCatalog") > 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.put("0xNFTCatalogAdmin", catalogJson.vars["testnet"][contractAddressKey])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.put(
        contractAddressKey,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        catalogJson.vars["testnet"][contractAddressKey]
      );
    }
  );
}

if (process.env["FLOW_ENVIRONMENT"] === "mainnet") {
  setupMainnet()
} else {
  setupTestnet()
}
