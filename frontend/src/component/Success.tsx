import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "../utils/price";
import { getSigner, getSignerRPC } from "../utils/provider";
import { Token__factory } from "../../../contract/typechain";
import { address as TokenAddress } from "../contracts/Token/address.json";
import { formatEther, parseEther } from "ethers/lib/utils";
import Lodding from "./Lodding";
const BASE_API = "http://localhost:4242";

type Session = {
  status: string;
  amount_total: number;
};

function Success() {
  const [loading, setLoading] = useState(false);
  const [receive, setReceive] = useState("");
  const [symbol, setSymbol] = useState("");
  const session = useRef({} as Session)
  const ethPrice = 4000;

  const location = useLocation();
  const sessionId = location.search.replace("?session_id=", "");

  const handleSession = async () => {
    setLoading(true);
    const res = await axios(
      `${BASE_API}/checkout-session?sessionId=${sessionId}`
    );

    session.current.status = res.data.status;
    session.current.amount_total =  res.data.amount_total

    await transferToken();
    window.localStorage.setItem('sessionId', sessionId)
    setLoading(false);
  };

  // transfer from owner
  const transferToken = async () => {
    const owner = await getSignerRPC();
    const signer = await getSigner();
    const localStorageSession = window.localStorage.getItem('sessionId')

    if (localStorageSession !== sessionId){
      if (signer && owner && session.current.amount_total) {
        const signerAddr = await signer.getAddress();
        const contract = Token__factory.connect(TokenAddress, owner);
        const calAmount = Number(session.current.amount_total) / ethPrice;
        const amount = parseEther(calAmount.toString());

        const tx = await contract.transfer(
          signerAddr,
          amount
        );
        await tx.wait();

        setReceive(formatEther(amount));
        setSymbol(await contract.symbol());
      }
    }
  };

  useEffect(() => {
      handleSession();
  }, []);

  return (
    <>
      {loading || session.current.status !== "complete" ? (
        <Lodding />
      ) : (
        <>
          <div className="p-20 text-center">
            <h1 className="m-2 text-xl font-bold ">Your payment succeeded</h1>
            <div>
              { receive && symbol && `Received: ${receive} ${symbol} `}
            </div>
            <div>{ receive && `Total: ${formatPrice({ amount: Number(session.current.amount_total) })}`}</div>
          </div>
          <div className="flex justify-evenly text-center text-white">
            <Link
              to="/"
              className="p-3 w-full bg-indigo-700 hover:bg-indigo-600 "
            >
              Home
            </Link>
            <Link
              to="/token"
              className="p-3 w-full bg-green-500 hover:bg-green-600 "
            >
              Balance
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default Success;
