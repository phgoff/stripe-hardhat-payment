type Price = {
  amount: number;
  currency?: string;
  quantity?: number;
};

export const formatPrice = ({ amount, currency = "usd", quantity }: Price) => {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100;
  let total = amount;
  if (quantity) {
    total = Number((quantity * amount).toFixed(2));
  }
  return numberFormat.format(total);
};
