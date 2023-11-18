// lib
import WalletLink from "walletlink";
import WalletConnectProvider from "@walletconnect/web3-provider";

// images
import CC_LOGO from "../images/CC_LOGO.svg";

// Constants
const polygonChain = "137";
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/7834b610dbc84b509297a8789ca345e0",
  4: "https://rinkeby.infura.io/v3/7834b610dbc84b509297a8789ca345e0",
  137: "https://polygon-mainnet.infura.io/v3/7834b610dbc84b509297a8789ca345e0",
  80001: "https://polygon-mumbai.infura.io/v3/7834b610dbc84b509297a8789ca345e0",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545",
  56: "https://bsc-dataseed.binance.org/",
};
const POLLING_INTERVAL = 12000


const walletLink = new WalletLink({
  appName: "Unicus",
  appLogoUrl: CC_LOGO,
  darkMode: false,
});
export const ethereumCoinBase = walletLink.makeWeb3Provider(
  RPC_URLS[Number(polygonChain)],
  Number(polygonChain)
); 
export const walletConnectorProvider = new WalletConnectProvider({
  rpc: { 137: RPC_URLS[Number(polygonChain)] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
