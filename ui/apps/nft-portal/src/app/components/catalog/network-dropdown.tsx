import { flushSync } from "react-dom";
import { DropDown } from "../shared/drop-down"
import { networks as _networks, Network, NetworkOption } from "../../constants/networks";
import * as fcl from "@onflow/fcl";

type NetworkDropDownProps = {
  network: Network
  onNetworkChange: (value: Network) => void;
};

export function NetworkDropDown({ network, onNetworkChange }: NetworkDropDownProps) {

  const networks: NetworkOption[] = _networks as  NetworkOption[];
  return <DropDown label="Network" options={networks} value={network} onChange={(e) => {
    fcl.unauthenticate()
    return onNetworkChange(e)
  }} />
}