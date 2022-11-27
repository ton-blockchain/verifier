const makeElipsisAddress = (address?: string | null, padding?: number): string => {
  const paddingValue = padding || 10;
  if (!address) return "";
  const firstPart = address.substring(0, paddingValue);
  const secondPart = address.substring(address.length - paddingValue);
  return `${firstPart}...${secondPart}`;
};

const trimDirectory = (str: string): string => {
  let trimmed = str.replace(/([^:]\/)\/+/g, "$1");
  if (trimmed.split("")[0] === "/") {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed;
};

const checkLastDirectoryDigit = (str: string): string => {
  let trimmed = str.split("")[str.length - 1] === "/" && str.slice(0, str.length - 1);
  return typeof trimmed !== "string" ? "" : trimmed;
};

export { makeElipsisAddress, trimDirectory, checkLastDirectoryDigit };
