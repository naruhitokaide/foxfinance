/* eslint-disable */
import Web3 from 'web3';
import Web3Modal from "web3modal";
import { ethers, providers } from 'ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { enableAccount, getAdmin, isRightNetwork } from '../helpers/web3Provider';
import networkConfig from '../config/networkConfig';
import { FoxToken, MarketPlace, FoxAuction, FoxNFT } from '../config/contractConfig'
import { getNetwork, isRightNetwork as isRightWeb3Network } from '../helpers/web3Provider';

let provider;
let alert

const IsMainnet = true
const chainID = IsMainnet ? 56 : 97
const rpcURL = {
  56: 'https://bsc-dataseed.binance.org/',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
}
const infuraId = IsMainnet ? "14ac626894b04727a792316d48d56ffb" : "T6NPT88TA4V7YMSFATCQZR31VU96KMA7ZP"

if (process.browser) {
  window.onNuxtReady(({
    $alert,
  }) => {
    alert = $alert
  })
}

export const state = () => ({
  loading: true,
  initialized: false,
  networkId: null,
  account: null,
  singer: null,
  rightNetworks: networkConfig.rightNetworks,
  defaultNetworkId: networkConfig.defaultNetwork,
  explorer: {
    root: null,
    address: null,
    tx: null,
  },
});

export const mutations = {
  INIT_ETH_DATA: (state, payload) => {
    const web3Copy = state;
    web3Copy.initialized = payload.initialized;
    web3Copy.account = payload.account;
    if (payload.networkId) {
      web3Copy.networkId = parseInt(payload.networkId);
    }
    state = web3Copy;
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account;
  },
  SET_NETWORK: (state, networkId) => {
    state.networkId = parseInt(networkId);
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading;
  },
  SET_EXPLORER: (state, payload) => {
    state.explorer = payload;
  },
};

export const actions = {
  initialize({ commit, state }, payload) {
    console.log("initial ize")
    commit('INIT_ETH_DATA', payload);
    commit('SET_LOADING', false);

    if (isRightNetwork(state.networkId)) {
      commit('SET_EXPLORER', networkConfig[state.networkId].explorer);
    } else {
      commit('SET_EXPLORER', networkConfig[state.defaultNetworkId].explorer);
    }
  },

  async connectAccount({ commit, state }) {
    if (!state.account) {
      const account = await enableAccount();
      commit('SET_ACCOUNT', account);
      return true;
    } else {
      return false;
    }
  },

  async setProvider({ commit, state }) {
    console.log('bsc data: ', this.$bsc)
    window.web3 = new Web3(this.$bsc.currentProvider)
    provider = new ethers.providers.Web3Provider(this.$bsc.currentProvider)
    const web3Data = {
      account: this.$bsc.wallet[0],
      initialized: true,
      networkId: 56,
      walletFound: true,
    };

    commit('INIT_ETH_DATA', web3Data);
    commit('SET_LOADING', false);
  },

  async connectToWallet({ commit }, payload) {

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            [chainID]: rpcURL[chainID]
          },
          network: 'binance',
          chainId: chainID,
          infuraId: infuraId
        }
      }
    };

    const web3Modal = new Web3Modal({
      // network: "mainnet", // TODO: change this network option to be changable according
      // network: "binance",
      cacheProvider: false,
      providerOptions,
    });

    await web3Modal.clearCachedProvider();
    const _web3ModalProvider = await web3Modal.connect();

    const web3Data = {
      account: null,
      initialized: false,
      networkId: false,
      walletFound: false,
    };
    web3Data.walletFound = true;
    web3Data.initialized = true;

    _web3ModalProvider.on('chainChanged', (chainId) => {
      console.log('chainChanged', chainId)
    })

    _web3ModalProvider.on('networkChanged', (networkId) => {
      console.log('networkChanged', networkId)
      commit('SET_NETWORK', networkId);
    })

    _web3ModalProvider.on("disconnect", (error) => {
      console.log('wallet disconnected', error);
      provider = null;
      commit('SET_NETWORK', null);
      commit('SET_ACCOUNT', null);
    });

    window.web3 = new Web3(_web3ModalProvider)
    console.log('window.web3', window.web3.eth)
    provider = new ethers.providers.Web3Provider(_web3ModalProvider)
    const network = await provider.getNetwork('binance');
    const chainId = network.chainId;
    web3Data.networkId = chainId;

    if (!isRightWeb3Network(web3Data.networkId)) {
      throw 'Please choose the Binance Smart Chain as the current network in your wallet app.';
    }

    const accounts = await window.web3.eth.getAccounts();

    if (accounts[0]) {
      web3Data.account = accounts[0];
    }
    console.log(accounts[0])
    commit('INIT_ETH_DATA', web3Data);
    commit('SET_LOADING', false);
  },

  setAccount({ commit }, payload) {
    commit('SET_ACCOUNT', payload);
  },

  setNetwork({ commit }, networkId) {
    commit('SET_NETWORK', networkId);
  },

  setExplorer({ commit }, payload) {
    commit('SET_EXPLORER', payload);
  },

  async buyProduct({ commit, state }, payload) {
    console.log('buyProduct: ', payload)

    try {

      const signer = provider.getSigner();
      const foxContract = new ethers.Contract(
        FoxToken.address[networkConfig.defaultNetwork],
        FoxToken.abi,
        signer
      );

      const resApprove = await foxContract.approve(MarketPlace.address[networkConfig.defaultNetwork], ethers.utils.bigNumberify((payload.price * 1000000000).toString()))
      await resApprove.wait().then(
        async receipt => {
          const marketContract = new ethers.Contract(
            MarketPlace.address[networkConfig.defaultNetwork],
            MarketPlace.abi,
            signer
          )

          await marketContract.buy(state.account, payload.hash, ethers.utils.bigNumberify((payload.price * 1000000000).toString())).then(
            res => {
              console.log('Success transaction: ', res)
            },
            error => {
              console.log('error', error)
              alert('Please check your wallet balance or network', 'Transaction Error', {
                confirmButtonText: 'OK',
                confirmButtonClass: 'confirm-button',
              })
            }
          )
        },
        error => {
          console.log('error', error)
          alert('You rejected the transaction', 'Purchase cancelled', {
            confirmButtonText: 'OK',
            confirmButtonClass: 'confirm-button',
          })
        }
      )
    } catch (error) {
      console.error(error)
      if (state.account == null) {
        alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      } else {
        alert('Please check whether you have sufficient balance', 'Transaction Error', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      }
    }
  },

  async setAuction({ commit, state }, payload) {
    console.log('buyProduct: ', payload)

    if (!state.account) {
      alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'confirm-button',
      })
    }

    try {
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(
        payload.nftAddress,
        FoxNFT.abi,
        signer
      );

      const resApprove = await nftContract.approve(FoxAuction.address[networkConfig.defaultNetwork], payload.tokenId)
      const isApprove = await resApprove.wait().then(
        async receipt => {
          return true
        },
        error => {
          console.log('error', error)
          alert('You rejected the transaction', 'Purchase cancelled', {
            confirmButtonText: 'OK',
            confirmButtonClass: 'confirm-button',
          })
          return false
        }
      )

      if (isApprove) {
        const auctionContract = new ethers.Contract(
          FoxAuction.address[networkConfig.defaultNetwork],
          FoxAuction.abi,
          signer
        )

        const resAuction = await auctionContract.createAuction(
          payload.tokenId,
          (payload.startPrice * 1000000000).toString(),
          (payload.endPrice * 1000000000).toString(),
          1, //payment method
          (payload.duration * 86400).toString(),
          state.account,
          payload.nftAddress
        )
        await resAuction.wait().then(
          res => {
            console.log('Success transaction: ', res)
            alert('You set your nft as a auction sell', 'Success transaction', {
              confirmButtonText: 'OK',
              confirmButtonClass: 'confirm-button',
            })
          },
          error => {
            console.log('error', error)
            alert('Please check your wallet balance or network..', 'Transaction Error', {
              confirmButtonText: 'OK',
              confirmButtonClass: 'confirm-button',
            })
          }
        )
      } else {
        alert('Please check your wallet balance or network..', 'Staking Error', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      }

    } catch (error) {
      console.error(error)
      if (state.account == null) {
        alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      } else {
        alert('Please check whether you have sufficient balance', 'Transaction Error', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      }
    }
  },

  async makeOffer({ commit, state }, payload) {
    if (!state.account) {
      alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'confirm-button',
      })
    }

    try {
      const signer = provider.getSigner();
      const foxAuctionContract = new ethers.Contract(
        FoxAuction.address[networkConfig.defaultNetwork],
        FoxAuction.abi,
        signer
      );

      const currentPrice = await foxAuctionContract.getCurrentPrice(payload.nftAddress, payload.id)
      if (ethers.utils.bigNumberify((payload.auctionPrice * 1000000000).toString()).lt(currentPrice)) {
        alert('Your offer price is less than current price', 'Offer cancelled', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
        return
      }

      const foxContract = new ethers.Contract(
        FoxToken.address[networkConfig.defaultNetwork],
        FoxToken.abi,
        signer
      );

      const foxApproved = await foxContract.approve(FoxAuction.address[networkConfig.defaultNetwork], ethers.utils.bigNumberify((payload.auctionPrice * 1000000000).toString()))

      const isFoxApproved = await foxApproved.wait().then(
        async receipt => {
          return true
        },
        error => {
          console.log('error', error)
          alert('Please check your fox balance', 'Transaction Error', {
            confirmButtonText: 'OK',
            confirmButtonClass: 'confirm-button',
          })
          return false
        }
      )

      const amount = ethers.utils.bigNumberify((payload.auctionPrice * 1000000000).toString())
      if (isFoxApproved) {
        const auctionBid = await foxAuctionContract.bid(payload.nftAddress, payload.id, amount)
        await auctionBid.wait().then(
          async receipt => {
            alert('Please check your Wallet or your Asset page', 'Success transaction', {
              confirmButtonText: 'OK',
              confirmButtonClass: 'confirm-button',
            })
            return true
          },
          error => {
            console.log('error', error)
            alert('Please check your fox balance', 'Transaction Error', {
              confirmButtonText: 'OK',
              confirmButtonClass: 'confirm-button',
            })
            return false
          }
        )
      }

    } catch (error) {
      console.error(error)
      if (state.account == null) {
        alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      } else {
        alert('Please check whether you have sufficient balance', 'Transaction Error', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      }
    }
  },

  async acceptOffer({ commit, state }, payload) {
    if (!state.account) {
      alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'confirm-button',
      })
    }

    try {
      const signer = provider.getSigner();
      const foxAuctionContract = new ethers.Contract(
        FoxAuction.address[networkConfig.defaultNetwork],
        FoxAuction.abi,
        signer
      );
      const offerResult = await foxAuctionContract.accept(payload.nftAddress, payload.id, payload.applicant)
      console.log('offerResult: ', offerResult)

    } catch (error) {
      console.error(error)
      if (state.account == null) {
        alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      } else {
        alert('Please check whether you have sufficient balance', 'Transaction Error', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      }
    }
  },

  async cancelAuction({ commit, state }, payload) {
    if (!state.account) {
      alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'confirm-button',
      })
    }

    try {
      const signer = provider.getSigner();
      const foxAuctionContract = new ethers.Contract(
        FoxAuction.address[networkConfig.defaultNetwork],
        FoxAuction.abi,
        signer
      );

      const offerResult = await foxAuctionContract.cancelAuction(payload.nftAddress, payload.id)
      console.log('offerResult: ', offerResult)

    } catch (error) {
      console.error(error)
      if (state.account == null) {
        alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      } else {
        alert('Please check whether you have sufficient balance', 'Transaction Error', {
          confirmButtonText: 'OK',
          confirmButtonClass: 'confirm-button',
        })
      }
    }
  },

};

export const getters = {
  isOk: (state) => {
    return !!(isRightNetwork(state.networkId) && state.account && state.isInjected);
  },

  isRightNetwork: (state) => {
    // return isRightNetwork(state.networkId)
    console.log('state.networkId', state.networkId);
    return state.networkId === chainID;
  },

  initialized: (state) => {
    return state.initialized;
  },

  rightNetwork: (state) => {
    return state.rightNetwork;
  },

  networkId: (state) => {
    return state.networkId;
  },

  defaultNetworkId: (state) => {
    return state.defaultNetworkId;
  },

  currentProvidersNetworkId: (state) => {
    if (isRightNetwork(state.networkId)) {
      return state.networkId;
    } else {
      return state.defaultNetworkId;
    }
  },

  account: (state) => {
    return state.account;
  },

  accountConnected: (state) => {
    return state.account !== '' && state.account !== undefined && state.account !== null;
  },

  explorer: (state) => {
    return state.explorer;
  },

  txUrl: (state) => {
    return state.explorer.root + state.explorer.tx;
  },

  loading: (state) => {
    return state.loading;
  },
};
