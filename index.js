const json = require("./lib/CadenceToJson.json");
export { json };

import contracts from "./lib/cadut-generated/contracts/index.js";
import scripts from "./lib/cadut-generated/scripts/index.js";
import transactions from "./lib/cadut-generated/transactions/index.js";

import {
    setEnvironment,
    getEnvironment,
    extendEnvironment,
} from "@onflow/flow-cadut";

let contractNames = Object.keys(json.vars["testnet"]);
for (let index in contractNames) {
    const contractName = contractNames[index];
    extendEnvironment({
        name: contractName.replace("0x", ""),
        testnet: json.vars["testnet"][contractName],
        mainnet: json.vars["mainnet"][contractName],
    });
}

const getAddressMaps = async function () {
    const addressMaps = {};
    setEnvironment("mainnet");
    addressMaps["mainnet"] = await getEnvironment();
    setEnvironment("testnet");
    addressMaps["testnet"] = await getEnvironment();
    return addressMaps;
};

export { getAddressMaps, contracts, scripts, transactions };