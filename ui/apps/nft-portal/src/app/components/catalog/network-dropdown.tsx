import { flushSync } from "react-dom";
import { DropDown } from "../shared/drop-down"
import * as fcl from "@onflow/fcl";

export type Network = "mainnet" | "testnet";

type NetworkOption = {
  value: Network,
  label: string
}

type NetworkDropDownProps = {
  network: Network
  onNetworkChange: (value: Network) => void;
};

export function NetworkDropDown({ network, onNetworkChange }: NetworkDropDownProps) {

  const networks: NetworkOption[] = [
    { value: "mainnet", label: "Mainnet" },
    { value: "testnet", label: "Testnet" },
  ];
  return <DropDown label="" options={networks} value={network} onChange={(e) => {
    fcl.unauthenticate()
    return onNetworkChange(e)
  }} />
}