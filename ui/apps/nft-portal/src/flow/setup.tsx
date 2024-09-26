import { config } from "@onflow/fcl";
import { Network } from "../app/components/catalog/network-dropdown";
import FlowJSON from "../../../../../flow.json";

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
  }).load({ flowJSON: FlowJSON });
}

function setupTestnet() {
  config({
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "app.detail.title": "NFT Metadata",
    "app.detail.icon": "https://assets.website-files.com/5f734f4dbd95382f4fdfa0ea/62743866c2a1ff97d43bb844_Group%2010.svg"
  }).load({ flowJSON: FlowJSON });
}

if (process.env["FLOW_ENVIRONMENT"] === "mainnet") {
  setupMainnet()
} else {
  setupTestnet()
}
