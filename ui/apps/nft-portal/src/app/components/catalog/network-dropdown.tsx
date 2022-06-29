import { DropDown } from "../shared/drop-down"

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
  return <DropDown label="Network" options={networks} value={network} onChange={onNetworkChange} />
}