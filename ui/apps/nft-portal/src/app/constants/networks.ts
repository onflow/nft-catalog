export type Network = 'mainnet' | 'testnet';
export type NetworkOption = {
  value: Network;
  label: string;
};

export const mainnet: NetworkOption = { value: 'mainnet', label: 'Mainnet' };
export const testnet: NetworkOption = { value: 'testnet', label: 'Testnet' };

export const networks = [mainnet, testnet];
