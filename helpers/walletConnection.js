/* eslint-disable */
import Web3 from 'web3'
import Web3Modal from 'web3modal'
// import WalletConnectProvider from "@walletconnect/web3-provider";

let WalletConnectProvider

if (process.client) {
  WalletConnectProvider = require('@walletconnect/web3-provider')
}
export default {
  async setProvider () {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: '4c426919f9d2465f803710f94b254734' // required
        }
      }
    }

    const web3Modal = new Web3Modal({
      network: 'bsc', // optional
      cacheProvider: false, // optional
      providerOptions // required
    })

    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    console.log('setProvider')
    console.log('web3:', web3)
  }
}
