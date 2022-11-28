import ReactGA from "react-ga4";

export enum AnalyticsCategory {
  VIEW = "View",
  PUBLISH = "Publish",
}

export enum AnalyticsAction {
  ADD_FILE = "Add file",
  CONNECT_WALLET_POPUP = "Connect wallet popup",
  CONNECT_WALLET_CONNECTED = "Connect wallet connected",
  COMPILE_CLICK = "Submit Compile",
  COMPILE_ERROR = "Compile Error",
  COMPILE_SUCCESS = "Compile Success",
  PUBLISH_CLICK = "Publish",
}

export const sendAnalyticsEvent = (
  category: AnalyticsCategory,
  action: AnalyticsAction,
  label: string = "",
) => {
  if (!ReactGA.isInitialized) {
    return;
  }
  try {
    ReactGA.event({
      category,
      action,
      label,
    });
  } catch (error) {
    console.log(error);
  }
};

export const initGA = () => {
  try {
    // ReactGA.initialize(import.meta.env.VITE_APP_GA!);
    ReactGA.send(window.location.pathname + window.location.search);
  } catch (error) {}
};
