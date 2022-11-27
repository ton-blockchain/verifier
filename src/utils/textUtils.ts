const makeElipsisAddress = (address?: string | null, padding?: number): string => {
  const paddingValue = padding || 10;
  if (!address) return "";
  const firstPart = address.substring(0, paddingValue);
  const secondPart = address.substring(address.length - paddingValue);
  return `${firstPart}...${secondPart}`;
};

const trimDirectory = (str: string): string =>
  str
    .replace(/\/+/g, "/")
    .replace(/^\/[^\/]/, "")
    .replace(/\/$/, "");

export { makeElipsisAddress, trimDirectory };
