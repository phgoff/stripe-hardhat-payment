import React, { useState, useEffect } from "react";
import { getSigner, ethereum, getSignerRPC } from "../utils/provider";
import { Token, Token__factory, Vendor__factory } from "../../../contract/typechain";
import { address } from "../contracts/Token/address.json";
import { address as vendorAddress } from "../contracts/Vendor/address.json";
import { formatEther, parseEther } from "ethers/lib/utils";

let tokensPerEth: string;
let contract: Token

export default function MyToken() {
  const [token, setToken] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [balance, setBalance] = useState("");

  const updateSupplyBalance = async () => {
    const signer = await getSigner();
    if (signer) {
      contract = Token__factory.connect(address, signer);
      const signerAddress = await signer.getAddress();
      const vendorContract = Vendor__factory.connect(vendorAddress, signer);
      const suppy0 = await contract.totalSupply();
      const name = await contract.name();
      const symbol = await contract.symbol();
      const balance0 = await contract.balanceOf(signerAddress);
      tokensPerEth = (await vendorContract.tokensPerEth()).toString();

      setToken(name);
      setSymbol(symbol);
      setSupply(`${formatEther(suppy0)}`);
      setBalance(formatEther(balance0));
    }
  };

  const updateBalance = async () => {
    if(contract) {
      const signer = await getSigner();
      if (signer) {
        const signerAddress = await signer.getAddress();
        const balance0 = await contract.balanceOf(signerAddress);
        setBalance(formatEther(balance0));
      }
    }
  }

  const transferToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { to, amount } = e.target as HTMLFormElement;
    const signer = await getSigner();
    if (signer && to.value && amount.value) {
      console.log(to.value, amount.value);
      const contract = Token__factory.connect(address, signer);
      const tx = await contract.transfer(to.value, parseEther(amount.value));
      await tx.wait();
      await updateSupplyBalance();
    }
  };

  const buyToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { tokenAmount } = e.target as HTMLFormElement;
    const signer = await getSigner();

    if (signer && tokenAmount.value) {
      console.log(tokenAmount.value);
      const vendorContract = Vendor__factory.connect(vendorAddress, signer);
      const tx = await vendorContract.buy({
        value: parseEther(tokenAmount.value),
      });
      await tx.wait();
      await updateSupplyBalance();
    }
  };

  useEffect(() => {
    const eth = ethereum();
    if (eth) {
      updateSupplyBalance();
      eth.on("accountsChanged", updateSupplyBalance);
      eth.on("chainChanged", reload);

      return () => {
        eth.removeListener("accountsChanged", updateSupplyBalance);
        eth.removeListener("chainChanged", reload);
      };
    }
  }, []);

  useEffect( () => {
    if(contract) {
      contract.on('Transfer', () => {
        updateBalance();
      })

      return () => {
        contract.removeAllListeners('Transfer')
      }
    }
  }, [contract])

  const reload = () => window.location.reload;

  return (
    <div className="">
      <div className="p-8 bg-gradient-to-r from-purple-400 to-indigo-500 text-white space-y-10 ">
        <h1>
          <span className=" font-bold"> {`${token} (${symbol})`}</span>
        </h1>
        <div className="flex justify-between">
          <p>Total Supply: {supply}</p>
          <p>Rate: 1 ETH = {`${tokensPerEth} ${symbol}`}</p>
        </div>
        <div className="flex items-center space-x-2">
          <p>Your Token: {balance}</p>
        </div>
      </div>
      <div className="p-5 flex flex-col max-w-md bg-white space-y-5">
        <form onSubmit={buyToken} className="flex flex-col space-y-3">
          <h1 className="text-center">Buy Token</h1>
          <div className="flex justify-around items-center space-x-2">
            <p>Amount</p>
            <input
              type="text"
              name="tokenAmount"
              className="flex-1 bg-indigo-50 text-right px-2 h-10"
              placeholder="ETH"
            />
          </div>
          <button
            type="submit"
            className="p-3 w-40 mx-auto text-white  rounded-lg bg-indigo-500 hover:bg-indigo-600 "
          >
            Buy
          </button>
        </form>
      </div>
      <div className="p-5 flex flex-col max-w-md bg-white space-y-5">
        <h1 className="text-center">Send Token</h1>
        <form onSubmit={transferToken} className="flex flex-col space-y-3">
          <div className="flex justify-around items-center space-x-2 ">
            <p> Send To</p>
            <input
              type="text"
              name="to"
              className="flex-1 bg-indigo-50 text-right px-2 h-10"
              placeholder="address"
            />
          </div>
          <div className="flex justify-around items-center space-x-2">
            <p>Amount</p>
            <input
              type="text"
              name="amount"
              className="flex-1 bg-indigo-50 text-right px-2 h-10"
              placeholder="token amount"
            />
          </div>
          <button
            type="submit"
            className="p-3 w-40 mx-auto text-white  rounded-lg bg-indigo-500 hover:bg-indigo-600 "
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
