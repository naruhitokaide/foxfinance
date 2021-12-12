/* eslint-disable */
import networkConfig from '@/config/networkConfig'

const rightNetworks = networkConfig.rightNetworks
const defaultNetwork = networkConfig.defaultNetwork

let alert
let store
if (process.browser) {
  window.onNuxtReady(({
    $alert,
    $store
  }) => {
    alert = $alert
    store = $store
  })
}

/**
 * @desc calls contract functions
 * @param contractInstance
 * @param methods {
 *   methodName - name of method,
 *   args[] - method's arguments,
 *   opts - additional options
 * }
 * @return array - contract methods info
 */
export const makeBatchCall = async (contractInstance, methods) => {
  let result = [];
  for (const method of methods) {
    let methodToCall;
    if (method.args) {
      methodToCall = await contractInstance.methods[method.methodName].apply(null, method.args);
    } else {
      methodToCall = await contractInstance.methods[method.methodName]();
    }
    try {
      const response = await methodToCall.call(method.opts);    
      result.push(response);
    }catch (error) {
      console.log('error :', error)
    }
    // console.log("response",method.methodName,response,method.opts);
  }
  return result;
}


export const sendTransaction = async (method, options) => {
  return new Promise(async (resolve, reject) => {

    const accountConnected = store.getters['ethereum/accountConnected']
    const isRightNetwork = store.getters['ethereum/isRightNetwork']
    console.log("isRightNetwork",isRightNetwork);

    if (!accountConnected) {
      alert('Account not connected. Please check your connection or try re-connecting your wallet. ', 'Notification', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'confirm-button',
      })
      return resolve(false)
    } else if(!isRightNetwork) {
      alert('Wrong network. Please change your network to Ethereum Mainnet. ', 'Notification', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'confirm-button',
      })
      return resolve(false)
    }

    const gasPriceInWei = await getGasPrice();
    // const estimatedGas = await estimateGas(method, options.from, gasPriceInWei * 20);

    Object.assign(options, {
      gasPrice: toHex(gasPriceInWei)
      // gasLimit: estimatedGas,
    })

    console.log(options)

    return await method.send(options)
      .on('sending', (sending) => { console.log('sending.....', sending) })
      .on('receipt', (receipt) => {
        resolve(receipt)
      })
      .on('error', (error, receipt) => {
        if (error.code === 4001) {
          return resolve(false)
        } else {
          console.log("error",error);
          alert('The transaction failed. Please check your connection or try re-connecting your wallet. ', 'Notification', {
            confirmButtonText: 'OK',
            confirmButtonClass: 'confirm-button',
            callback: action => {
              console.log(error)
            }
          })
          resolve()
        }
      })
  })
}

export const getNetworkId = () => {
  if (web3.givenProvider) {
    const currentProvidersNetwork = parseInt(web3.givenProvider.chainId || web3.givenProvider.networkVersion)
    const isRightNetwork = rightNetworks.includes(currentProvidersNetwork)
    if (isRightNetwork) {
      return currentProvidersNetwork
    }
  }
  return defaultNetwork
}


export const isContractExists = async (contractAddress) => {
  try {
    const code = await web3.eth.getCode(contractAddress)

    return code !== '0x'
  } catch {

  }
}

export const isAddress = (address) => {
  return web3.utils.isAddress(address)
}

export const toWei = (amount, unit) => {
  return web3.utils.toWei(amount.toString(), unit)
}

export const fromWei = (amount, unit = 'ether') => {
  return web3.utils.fromWei(amount.toString(), unit)
}

export const toHex = (value) => {
  return web3.utils.toHex(value)
}

export const numberToHex = (number) => {
  return web3.utils.numberToHex(`${number}`)
}

export const getGasPrice = async () => {
  return await web3.eth.getGasPrice()
}
