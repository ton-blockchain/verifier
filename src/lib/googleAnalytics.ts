import ReactGA from "react-ga4";

export enum AnalyticsAction {
  ADD_FILE = "ADD_FILE",
  CONNECT_WALLET_POPUP = "CONNECT_WALLET_POPUP",
  WALLET_CONNECTED = "WALLET_CONNECTED",
  SELECT_WALLET = "SELECT_WALLET",
  COMPILE_SUBMIT = "COMPILE_SUBMIT",
  COMPILE_SERVER_ERROR = "COMPILE_SERVER_ERROR",
  SIGN_SERVER_ERROR = "SIGN_SERVER_ERROR",
  SIGN_SERVER_SUCCESS = "SIGN_SERVER_SUCCESS",
  COMPILE_HASHES_NOT_SIMILAR = "COMPILE_HASHES_NOT_SIMILAR",
  COMPILE_COMPILATION_ERROR = "COMPILE_COMPILATION_ERROR",
  COMPILE_SUCCESS_HASHES_MATCH = "COMPILE_SUCCESS_HASHES_MATCH",
  PUBLISH_CLICK = "PUBLISH_CLICK",
  TRANSACTION_ISSUED = "TRANSACTION_ISSUED",
  TRANSACTION_REJECTED = "TRANSACTION_REJECTED",
  TRANSACTION_ERROR = "TRANSACTION_ERROR",
  TRANSACTION_EXPIRED = "TRANSACTION_EXPIRED",
  CONTRACT_DEPLOYED = "CONTRACT_DEPLOYED",
}

export const sendAnalyticsEvent = (action: AnalyticsAction, label: string = "") => {
  if (!ReactGA.isInitialized) {
    return;
  }
  try {
    ReactGA.event({
      category: "VERIFIER",
      action,
      label,
    });
  } catch (error) {
    console.log(error);
  }
};

export const initGA = () => {
  try {
    ReactGA.initialize(import.meta.env.VITE_APP_GA!);
    ReactGA.send(window.location.pathname + window.location.search);
  } catch (error) {}
};
