/* eslint-disable */
import { ERC721ABI } from '../../config/contractConfig'
import networkConfig from '../../config/networkConfig'
import { makeBatchCall as _makeBatchCall } from "./base";

let contractInstance

const initContractInstance = async (contractAddress) => {
  contractInstance = await new window.web3.eth.Contract(ERC721ABI, contractAddress)
}
export const makeBatchCall = async (methods, contractAddress) => {
  console.log(contractAddress)
  contractInstance = await new window.web3.eth.Contract(ERC721ABI, contractAddress)
  // await initContractInstance(contractAddress);
  return await _makeBatchCall(contractInstance, methods)
}

export const sendTransaction = async (methodName, args, options) => {
  console.log(methodName, args, options)
  initContractInstance();
  const method = contractInstance.methods[methodName](...args)
  return await _sendTransaction(method, options)
}

export const getAddress = () => {
  initContractInstance();
  return contractInstance.options.address
}