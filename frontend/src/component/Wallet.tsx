import React, { useState, useEffect } from "react";
import { getSigner, ethereum } from "../utils/provider";
import { shorten } from "../utils/shorten";
import { JsonRpcSigner } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";

function Wallet() {
  const eth = ethereum();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (eth) {
      getSigner().then((initialSigner) => {
        initialSigner && setSigner(initialSigner);
      });
    }
  }, []);

  useEffect(() => {
    connect();
    eth.on("connect", connect);
    eth.on("accountsChanged", connect);
    eth.on("chainChanged", reload);

    return () => {
      eth.removeListener("connect", connect);
      eth.removeListener("accountsChanged", connect);
      eth.removeListener("chainChanged", reload);
    };
  }, [signer]);

  const connect = async () => {
    if (signer) {
      setWallet(await signer.getAddress());
      setBalance(Number(formatEther(await signer.getBalance())).toFixed(4));
    }
  };

  const reload = () => window.location.reload();

  return (
    <div className="flex gap-3 rounded-md bg-indigo-200 p-2 font-md text-black hover:bg-indigo-600 hover:text-white">
      <h1>{shorten(wallet)}</h1>
      <span>{balance} ETH</span>
    </div>
  );
}

export default Wallet;
