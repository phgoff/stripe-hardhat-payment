export const shorten = (address: string) =>
  address && address.length >= 20
    ? address.slice(0, 5) + "..." + address.slice(address.length - 4)
    : "";
