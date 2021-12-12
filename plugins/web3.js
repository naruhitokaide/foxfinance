/* eslint-disable */
import Web3 from 'web3';
import networkConfig from '../config/networkConfig';
import {
	getAccount,
	getNetwork,
	getNetworkOldVersion,
	isRightNetwork,
} from '../helpers/web3Provider';

const defaultNetwork = networkConfig.defaultNetwork;
let localStore;

export default async ({ store }) => {
	localStore = store;

	if (process.client) {
		const web3Data = {
			account: null,
			initialized: false,
			networkId: false,
			walletFound: false,
		};

		// Modern dapp browser
		// if (window.ethereum) {
		// 	window.ethereum.autoRefreshOnNetworkChange = false;
		// 	web3Data.walletFound = true;
		// 	web3Data.initialized = true;

		// 	web3Data.networkId = await getNetwork();

		// 	if (window.ethereum.isMetaMask) {
		// 		window.ethereum.on('chainChanged', handleChainChanged);
		// 		window.ethereum.on('accountsChanged', handleAccountsChanged);
		// 	}

		// 	if (isRightNetwork(web3Data.networkId)) {
		// 		window.web3 = new Web3(ethereum);
		// 	} else {
		// 		window.web3 = getHttpWeb3Provider();
		// 	}
		// 	const account = window.ethereum.selectedAddress;
		// 	if (account) {
		// 		web3Data.account = account;
		// 	}
		// } else if (window.web3) {
		// 	// Old browsers
		// 	try {
		// 		web3Data.walletFound = true;
		// 		web3Data.initialized = true;
		// 		web3Data.networkId = await getNetworkOldVersion();
		// 		const account = await getAccount();
		// 		accountInterval();
		// 		if (account) {
		// 			web3Data.account = account;
		// 		}
		// 		if (isRightNetwork(web3Data.networkId)) {
		// 			window.web3 = new Web3(web3.currentProvider);
		// 		} else {
		// 			window.web3 = getHttpWeb3Provider();
		// 		}
		// 	} catch (error) {
		// 		console.log('error:', error);
		// 	}
		// } // Non-dapp browsers
		// else {
			try {
				window.web3 = getHttpWeb3Provider();
				web3Data.initialized = true;
			} catch (error) {
				console.log(error);
			}
		// }
		store.dispatch('ethereum/initialize', web3Data);
	}
};

const handleChainChanged = (chainId) => {
	window.location.reload();
	// const previousNetworkId = localStore.state.ethereum.networkId;
	// if (previousNetworkId !== chainId) {
	//     if (isRightNetwork(chainId)) {
	//         window.web3 = new Web3(ethereum);
	//     } else if (!isRightNetwork(previousNetworkId)) {
	//         window.web3 = getHttpWeb3Provider();
	//     }
	//     localStore.dispatch("ethereum/setNetwork", chainId)
	//     web3.eth.defaultChain = chainId;
	// }
};

const handleAccountsChanged = (accounts) => {
	window.location.reload();
	// if (accounts.length !== 0 && accounts[0] !== localStore.state.account) {
	//   localStore.dispatch('ethereum/setAccount', accounts[0])
	// }
};

// const accountInterval = () =>
// 	setInterval(() => {
// 		web3.eth.getAccounts(async (err, accounts) => {
// 			const account = localStore.state.ethereum.account;
// 			if (!err) {
// 				if (accounts[0] !== account) {
// 					localStore.dispatch('ethereum/setAccount', accounts[0]);
// 					let networkId = localStore.state.ethereum.networkId;
// 					if (networkId === undefined) {
// 						networkId = await getNetworkOldVersion();
// 						localStore.dispatch('ethereum/setNetwork', networkId);
// 					}
// 				}
// 			}
// 		});
// 	}, 1000);

const getHttpWeb3Provider = () => {
	const httpProvider = networkConfig[defaultNetwork].httpProvider;
	return new Web3(new Web3.providers.HttpProvider(httpProvider));
};
