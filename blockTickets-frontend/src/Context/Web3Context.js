import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { setLocalStorage } from "../utils/localStorage.js";
const providerOptions = {
    /* See Provider Options Section */
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            rpc: {
                56: "https://speedy-nodes-nyc.moralis.io/362fc40c1ab324c15e79d4da/bsc/mainnet",
            },
        },
    },
    binancechainwallet: {
        package: true,
    },

    coinbasewallet: {
        package: CoinbaseWalletSDK, // Required
        options: {
            appName: "Baby Doge Coin", // Required
            rpc: "https://speedy-nodes-nyc.moralis.io/362fc40c1ab324c15e79d4da/bsc/mainnet", // Optional if `infuraId` is provided; otherwise it's required
            chainId: 56, // Optional. It defaults to 1 if not provided
        },
    },
};

const web3Modal = new Web3Modal({
    providerOptions, // required
    theme: {
        background: "#fff",
        main: "#002636",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "#f5f5f5",
    },
});

export const Web3Context = createContext(null);

export const Web3Provider = (props) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(undefined);

    const openModal = async () => {
        const provider = await web3Modal.connect();

        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x61" }], // chainId must be in hexadecimal numbers
            });
        } catch (err) {
            if (err.code === 4902)
                window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: "0x38",
                            chainName: "BSC mainnet",
                            nativeCurrency: {
                                name: "Binance Coin",
                                symbol: "BNB",
                                decimals: 18,
                            },
                            rpcUrls: ["https://bsc-dataseed.binance.org/"],
                            blockExplorerUrls: ["https://bscscan.com/"],
                        },
                    ],
                });
        }

        const web3 = new Web3(provider);
        const [account] = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        // const balance = await getBalance(provider)
        // setBalance(balance)
        setAccount(account);
        setLocalStorage("WALLET_ADDRESS", account);
        setLocalStorage("WALLET_CHAIN", chainId);

        switch (chainId) {
            case 56:
                setLocalStorage("WALLET_NETWORK", "Binance");
								break;
            case 1:
                setLocalStorage("WALLET_NETWORK", "ETH");
                break;
            case 4:
                setLocalStorage("WALLET_NETWORK", "Rinkeby");
                break;
            case 97:
                setLocalStorage("WALLET_NETWORK", "Testnet");
                break;
        }
    };

    return (
        <Web3Context.Provider value={{ account, openModal, balance }}>
            {props.children}
        </Web3Context.Provider>
    );
};

export default function useWeb3Ctx() {
    return useContext(Web3Context);
}

