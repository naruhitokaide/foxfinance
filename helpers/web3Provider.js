/* eslint-disable */
import networkConfig from '../config/networkConfig'
import { getContract } from './contractFunctions/productList'

const rightNetworks = networkConfig.rightNetworks

export const getAccount = () =>
  new Promise(async resolve => {
    await web3.eth.getAccounts((err, accounts) => {
      if (err) {
        resolve(false)
      } else {
        resolve(accounts[0])
      }
    })
  })

export const getNetwork = async () => {
  return new Promise(async resolve => {
    const networkId = window.web3.eth.currentProvider.isMetaMask? window.web3.eth.currentProvider.networkVersion : window.web3.eth.currentProvider.networkId
    if (!networkId) {
      setTimeout(() => {
        return resolve(getNetwork())
      }, 2000)
    } else {
      return resolve(networkId)
    }
  })
}

export const getNetworkOldVersion = async () =>
  new Promise(resolve => {
    if (web3.version.getNetwork) {
      web3.version.getNetwork((err, chainId) => {
        if (!err) {
          resolve(chainId)
        } else {
          resolve(false)
        }
      })
    } else {
      web3.eth.getChainId((err, chainId) => {
        if (!err) {
          resolve(chainId)
        } else {
          resolve(false)
        }
      })
    }
  })

export const enableAccount = async () => {
  let account = null
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    account = accounts[0]
  } catch (error) {
    console.log('error on connecting account', error)
  }
  return account
}


export const getAdmin = async () => {
  let admin = null
  try {
    const contract = await getContract()
    admin = await contract.methods.DEFAULT_ADMIN_ROLE().call()
  } catch (error) {
    console.log('error on connecting account', error)
  }
  return admin.toString()
}

export const getProduce = async () => {
  let produce = null
  try {
    const contract = await getContract()
    produce = await contract.methods.PRODUCE_ROLE().call()
  } catch (error) {
    console.log('error on connecting account', error)
  }
  return produce.toString()
}

export const isRightNetwork = (networkId) => {
  return rightNetworks.includes(parseInt(networkId))
}
