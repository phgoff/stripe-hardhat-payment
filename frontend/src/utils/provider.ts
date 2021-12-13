import { ethers } from "ethers";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";

export const ethereum = () => (window as any).ethereum;
// let provider: Web3Provider | JsonRpcProvider;

export const getProvider = async () => {
  if (ethereum()) {
    const provider = new ethers.providers.Web3Provider(ethereum());
    await provider.send("eth_requestAccounts", []); // request connection to account
    return provider;
  }
  return null;
};

export const getSigner = async () => {
  const provider = await getProvider();
  if (provider) {
    return provider.getSigner();
  }
  return null;
};

// account 0
export const getSignerRPC = async () => {
  if (ethereum()) {
    const provider = new ethers.providers.JsonRpcProvider();
    return provider.getSigner();
  }
  return null;
};
