import axios from "axios";
import React, { useState } from "react";
import { formatPrice } from "../utils/price";

function Checkout() {
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(100 * 1000); // 1000 dollar

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await axios("http://localhost:4242/create-checkout-session", {
      method: "POST",
      data: JSON.stringify({ amount, quantity, currency: "usd" }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // redirect to stripe's checkout page
    window.location = res.data.url;
  };

  return (
    <>
      <div className="flex items-end p-5 md:flex-col md:justify-center md:items-center md:text-center md:px-10 gap-5">
        <img
          src="https://picsum.photos/280/320?random=1"
          alt="The cover of Stubborn Attachments"
          className="w-24 h-24 md:w-72 md:h-72 rounded-2xl"
        />
        <div>
          <h3 className="font-medium">Stubborn Attachments</h3>
          <p>{formatPrice({ amount, quantity })}</p>
        </div>
        <div className="flex justify-evenly">
          <button
            className="w-6 rounded-md bg-black text-white"
            disabled={quantity === 1}
            onClick={() => setQuantity(quantity - 1)}
            type="button"
          >
            -
          </button>
          <input
            type="number"
            id="quantity-input"
            min="1"
            max="10"
            value={quantity}
            name="quantity"
            readOnly
            className=" text-right"
          />
          <button
            className="w-6 rounded-md bg-black text-white"
            disabled={quantity === 10}
            onClick={() => setQuantity(quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <div className="bg-indigo-700 text-center text-white p-3 hover:bg-indigo-600">
        <form onSubmit={(e) => handleSubmit(e)}>
          <button type="submit">Checkout</button>
        </form>
      </div>
    </>
  );
}

export default Checkout;
