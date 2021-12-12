import { getContract, makeBatchCall, sendTransaction } from '~/helpers/contractFunctions/productList'
import { makeBatchCall as auctionMakeBatchCall } from '~/helpers/contractFunctions/auction'
import { makeBatchCall as generalNFTMakeBatchCall } from '~/helpers/contractFunctions/nftToken'
// import { makeBatchCall as genesisNFTMakeBatchCall } from '~/helpers/contractFunctions/genesisNFT'
import { requestAPICall } from '~/helpers/apiService'
import { sendTransaction as sendFoxToken } from '~/helpers/contractFunctions/foxToken'
import networkConfig from '~/config/networkConfig'
import { MarketPlace } from '~/config/contractConfig'

export const state = () => ({
  products: [],
  auctions: [],
  offers: [],
  product: null,
  selectedProduct: null
})

export const mutations = {
  SET_PRODUCTS (state, products) {
    state.products = products
  },
  SET_PRODUCT (state, product) {
    state.product = product
  },
  SET_AUCTION_PRODUCTS (state, auctions) {
    state.auctions = auctions
  },
  SET_AUCTION_OFFERS (state, offers) {
    state.offers = offers
  }
}

export const actions = {
  async getProducts ({ commit }, owner) {
    const [hashes] = await makeBatchCall([{ methodName: 'getProdList', args: [] }])
    if (hashes.length < 1) {
      return
    }

    const tokenProducts = []
    for (let i = 0; i < hashes.length; i++) {
      const [product] = await makeBatchCall([{ methodName: 'getProdByHash', args: [hashes[i]] }])
      tokenProducts.push({
        ...product,
        hash: hashes[i]
      })
    }
    let products = []
    await Promise.all(tokenProducts.map(async item => {
      const prodcutURI = 'https://ipfs.io/ipfs/'
      const genesisIPFSData = await requestAPICall(prodcutURI + item.hash).then(res => {
        return res.data
      })
      products = [...products, {
        hash: item.hash,
        img: genesisIPFSData.image,
        title: genesisIPFSData.name,
        description: genesisIPFSData.description,
        price: item.price,
        quantity: item.quantity,
        isAuction: false
      }]
    }))

    // console.log('products', products)
    commit('SET_PRODUCTS', products)
  },

  async getAuctions ({ commit }, payload) {

    // console.log('payload', payload)
    const auctions = []
    // Get Auction NFT tokens
    const [nftContracts] = await auctionMakeBatchCall([{ methodName: 'getAllNFTAddress', args: [] }])
    nftContracts.forEach(async contract => {
      const [IDs] = await auctionMakeBatchCall([{ methodName: 'getIdsAuction', args: [contract] }])
      // IDs
      if (IDs) {
        IDs.forEach(async (tokenId) => {
          const [tokenURI] = await generalNFTMakeBatchCall([{ methodName: 'tokenURI', args: [tokenId] }], contract)
          const [auction] = await auctionMakeBatchCall([{ methodName: 'getAuction', args: [contract, tokenId] }])
          const genesisIPFSData = await requestAPICall(tokenURI).then(res => {
            // console.log('IPFS Data', res.data)
            return res.data
          })

          if (payload) {
            if (payload === auction.seller) {
              auctions.push({
                id: tokenId,
                img: genesisIPFSData.image,
                title: genesisIPFSData.name,
                description: genesisIPFSData.description,
                address: auction.seller,
                price: auction.startingPrice / 1000000000,
                startingPrice: auction.startingPrice / 1000000000,
                endingPrice: auction.endingPrice / 1000000000,
                startedAt: auction.startedAt,
                duration: auction.duration,
                nftAddress: auction.nftAddress,
                isAuction: true
              })
            }
          } else {
            auctions.push({
              id: tokenId,
              img: genesisIPFSData.image,
              title: genesisIPFSData.name,
              description: genesisIPFSData.description,
              address: auction.seller,
              price: auction.startingPrice / 1000000000,
              startingPrice: auction.startingPrice / 1000000000,
              endingPrice: auction.endingPrice / 1000000000,
              startedAt: auction.startedAt,
              duration: auction.duration,
              nftAddress: auction.nftAddress,
              isAuction: true
            })
          }
        })
      }
    })

    commit('SET_AUCTION_PRODUCTS', auctions)
  },

  async buyProduct ({ commit }, payload) {
    await sendFoxToken('approve', [MarketPlace.address[networkConfig.defaultNetwork], (payload.price * 1000000000).toString()], { from: payload.account }).then(async (res) => {
      if (res !== false) {
        await sendTransaction('buy', [payload.account, payload.hash, (payload.price * 1000000000).toString()], { from: payload.account })
      }
    }).catch(err => {
      console.error('error', err)
    })
  },

  async getProduct ({ commit }, payload) {
    const [hashProduct] = await makeBatchCall([{ methodName: 'getProdByHash', args: [payload] }])
    const prodcutURI = 'https://ipfs.io/ipfs/'
    const productIPFSData = await requestAPICall(prodcutURI + payload).then(res => {
      return res.data
    })
    const product = {
      hash: payload,
      img: productIPFSData.image,
      title: productIPFSData.name,
      description: productIPFSData.description,
      price: hashProduct.price,
      quantity: hashProduct.quantity,
      isAuction: false
    }
    commit('SET_PRODUCT', product)
  },

  async getAuctionProduct ({ commit }, payload) {
    const [tokenURI] = await generalNFTMakeBatchCall([{ methodName: 'tokenURI', args: [payload.id] }], payload.nftAddress)
    const [auction] = await auctionMakeBatchCall([{ methodName: 'getAuction', args: [payload.nftAddress, payload.id] }])
    const genesisIPFSData = await requestAPICall(tokenURI).then(res => {
      return res.data
    })

    const product = {
      id: payload.id,
      img: genesisIPFSData.image,
      title: genesisIPFSData.name,
      description: genesisIPFSData.description,
      address: auction.seller,
      startingPrice: auction.startingPrice / 1000000000,
      endingPrice: auction.endingPrice / 1000000000,
      startedAt: auction.startedAt,
      duration: auction.duration,
      nftAddress: auction.nftAddress,
      isAuction: true
    }
    commit('SET_PRODUCT', product)
  },

  async setProduct ({ commit }, payload) {
    try {
      const contract = await getContract()
      await contract.methods.setProdByHash(payload.name, payload.description, payload.price.toString(), payload.quantity.toString(), payload.hash).call()
    } catch (err) {
      console.log(err)
    }
  },

  async addProduct ({ commit }, payload) {
    try {
      const contract = await getContract()
      await contract.methods.addNewProduction(payload.name, payload.description, payload.price.toString(), payload.quantity.toString(), payload.hash).call()
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  },

  async removeProduct ({ commit }, payload) {
    try {
      const contract = await getContract()
      await contract.methods.deleteProdByHash(payload.hash).call()
    } catch (err) {
      console.log(err)
      return false
    }
  },

  async getOffersForAuction ({ commit }, payload) {
    const [offers] = await auctionMakeBatchCall([{ methodName: 'getBids', args: [payload.nftAddress, payload.id] }])
    commit('SET_AUCTION_OFFERS', offers)
  },

  setSavedProducts ({ commit }, data) {
    commit('UPDATE_PRODUCTS', data)
  },
  setUpdatedState ({ commit }, data) {
    commit('UPDATE_SAVED_STATE', data)
  },
  setInitialProducts ({ commit }, data) {
    commit('UPDATE_INITIAL', data)
  }
}

export const getters = {
  allProducts (state) {
    return state.products
  },
  auctionProducts (state) {
    return state.auctions
  },
  getProduct (state) {
    return state.product
  },
  getOffers (state) {
    return state.offers
  }
}
