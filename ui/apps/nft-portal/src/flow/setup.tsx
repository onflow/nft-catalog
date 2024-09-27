import { config } from "@onflow/config";
import { Network } from "../app/components/catalog/network-dropdown";
import FlowJSON from "../../../../../flow.json";

export async function changeFCLEnvironment(input: Network) {
  if (input === 'mainnet') {
    await setupMainnet()
  } else if (input === 'testnet') {
    await setupTestnet();
  }
}

async function setupMainnet() {
  await config.overload({}, () => {})
  await config({
    'flow.network': "mainnet",
    "accessNode.api": "https://rest-mainnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
    "app.detail.title": "NFT Metadata",
    "app.detail.icon": "https://assets.website-files.com/5f734f4dbd95382f4fdfa0ea/62743866c2a1ff97d43bb844_Group%2010.svg"
  }).load({ flowJSON: FlowJSON }, true);
}

async function setupTestnet() {
  await config.overload({}, () => {})
  await config({
    'flow.network': "testnet",
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "app.detail.title": "NFT Metadata",
    "app.detail.icon": "https://assets.website-files.com/5f734f4dbd95382f4fdfa0ea/62743866c2a1ff97d43bb844_Group%2010.svg"
  }).load({ flowJSON: FlowJSON }, true);
}

if (process.env["FLOW_ENVIRONMENT"] === "mainnet") {
  setupMainnet()
} else {
  setupTestnet()
}
