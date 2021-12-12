import { makeBatchCall } from '~/helpers/contractFunctions/genesisNFT'
import { makeBatchCall as nftGeneralBatchCall } from '~/helpers/contractFunctions/nftToken'
import { requestAPICall } from '~/helpers/apiService'

const IsMainnet = true
const scanURL = IsMainnet ? 'https://api.bscscan.com/' : 'https://api-testnet.bscscan.com/'

export const state = () => ({
  genesis: [],
  savedResults: [],
  toUnstake: [],
  contractNft: null
})

export const mutations = {
  SET_GENESIS (state, genesis) {
    state.genesis = genesis
  },
  UPDATE_GENESIS (state, genesis) {
    state.savedResults = genesis.map(el => {
      el.selected = false
      return el
    })
    return state.savedResults
  },
  SET_NFT (state, nft) {
    state.contractNft = nft
  }

}

export const actions = {
  async getGenesis ({ commit }, owner) {
    const [balance] = await makeBatchCall([{ methodName: 'balanceOf', args: [owner] }])
    if (balance < 1) {
      return
    }
    const methods = []
    for (let i = 0; i < balance; i++) {
      methods.push({ methodName: 'tokenOfOwnerByIndex', args: [owner, i] })
    }

    const tokens = await makeBatchCall(methods)
    let genesis = []
    await Promise.all(tokens.map(async (tokenId) => {
      const [tokenURI] = await makeBatchCall([{ methodName: 'tokenURI', args: [tokenId] }])
      const genesisIPFSData = await requestAPICall(tokenURI).then(res => {
        // console.log('IPFS Data', res.data)
        return res.data
      })
      genesis = [...genesis, {
        id: tokenId,
        img: genesisIPFSData.image,
        title: genesisIPFSData.name,
        description: genesisIPFSData.description,
        selected: false
      }]
    }))
    commit('SET_GENESIS', genesis)
  },

  async getNFTs ({ commit }, owner) {
    const allContracts = await requestAPICall(`${scanURL}api?module=account&action=tokennfttx&address=${owner}&startblock=0&endblock=999999999&sort=asc&apikey=8RJ5P3R8V9YYUPTU1NWA8R4FE5Q17VFY13`).then(res => {
      console.log('All Tnx Data: ', res.data)
      let contracts = []
      res.data.result.forEach(element => {
        if (!contracts.includes(element.contractAddress)) {
          contracts = [...contracts, element.contractAddress]
        }
      })
      return contracts
    })
    // console.log('All Contract Addresses: ', allContracts)
    let genesis = []
    await Promise.all(allContracts.map(async element => {

      // console.log('contract address: ', element)
      const [balance] = await nftGeneralBatchCall([{ methodName: 'balanceOf', args: [owner] }], element)
      if (balance < 1) {
        return
      }
      // console.log('balance: ', balance)
      const methods = []
      for (let i = 0; i < balance; i++) {
        methods.push({ methodName: 'tokenOfOwnerByIndex', args: [owner, i] })
      }

      const tokens = await nftGeneralBatchCall(methods, element)
      // console.log('tokens: ', tokens)
      tokens.forEach(async (tokenId) => {
        const [tokenURI] = await nftGeneralBatchCall([{ methodName: 'tokenURI', args: [tokenId] }], element)
        const genesisIPFSData = await requestAPICall(tokenURI).then(res => {
          // console.log('IPFS Data', res.data)
          return res.data
        })
        genesis = [...genesis, {
          id: tokenId,
          img: genesisIPFSData.image,
          title: genesisIPFSData.name,
          description: genesisIPFSData.description,
          selected: false,
          contractAddress: element
        }]
      })
    }))

    commit('SET_GENESIS', genesis)
  },

  async getNFTByContractAndTokenID ({ commit }, payload) {
    const [tokenURI] = await nftGeneralBatchCall([{ methodName: 'tokenURI', args: [payload.tokenID] }], payload.contractAddress)
    const genesisIPFSData = await requestAPICall(tokenURI).then(res => {
      // console.log('IPFS Data', res.data)
      return res.data
    })
    const nft = {
      img: genesisIPFSData.image,
      title: genesisIPFSData.name,
      description: genesisIPFSData.description
    }
    commit('SET_NFT', nft)
  },

  setSavedGenesis ({ commit }, data) {
    commit('UPDATE_GENESIS', data)
  },
  setUpdatedState ({ commit }, data) {
    commit('UPDATE_SAVED_STATE', data)
  },
  setInitialGenesis ({ commit }, data) {
    commit('UPDATE_INITIAL', data)
  },
  setUnstakeItems ({ commit }, data) {
    commit('UPDATE_UNSTAKE', data)
  }
}

export const getters = {
  allGenesis (state) {
    return state.genesis
  },
  getContractNFT (state) {
    return state.contractNft
  }
}
