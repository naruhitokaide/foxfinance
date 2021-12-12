import { makeBatchCall } from '~/helpers/contractFunctions/auction'
import { requestAPICall } from '~/helpers/apiService'

export const state = () => ({
  auctions: []
})

export const mutations = {
  SET_AUCTIONS (state, auctions) {
    state.auctions = auctions
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
    const genesis = []

    tokens.forEach(async (tokenId) => {
      const [tokenURI] = await makeBatchCall([{ methodName: 'tokenURI', args: [tokenId] }])
      const genesisIPFSData = await requestAPICall(tokenURI).then(res => {
        // console.log('IPFS Data', res.data)
        return res.data
      })
      genesis.push({
        id: tokenId,
        img: genesisIPFSData.image,
        title: genesisIPFSData.name,
        description: genesisIPFSData.description,
        selected: false
      })
    })
    commit('SET_GENESIS', genesis)
  },

  async stakingNFT ({ commit }, payload) {
    // console.log(payload)
    await makeBatchCall([{ methodName: 'createAuction', args: [payload.tokenId, payload.startPrice, payload.endPrice, payload.duration, payload.seller] }])
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
  allStakedNFTs (state) {
    return state.auctions
  }
}
