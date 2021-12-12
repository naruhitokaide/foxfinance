<template>
  <div id="hero" class="section is-fullheight">
    <div class="hero-body box flexheight">
      <div class="container">
        <h1 class="title">
          My Fox NFTs
        </h1>
        <p class="subtitle">
          Here you can browse NFTs you've already acquired, which should also be visible in your MetaMask or Trust Wallet.
        </p>
        <div v-if="tableData" class="stake-table-wrap">
          <div v-for="(row, index) in tableData" :key="index" class="token-item">
            <div class="token-image">
              <img :src="row.img" :alt="row.img">
            </div>
            <div class="token-details">
              <p class="token-lable">
                <span> TOKEN ID : </span> {{ row.id }}
              </p>
              <p class="token-title break-word">
                {{ row.title }}
              </p>
              <p class="token-description break-word">
                {{ row.description }}
              </p>
              <div class="sell-btn">
                <a @click="showStacking(row.id, row.contractAddress)">Sell</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="staking-modal">
      <el-dialog
        custom-class="dialog-connect-wallet"
        title="Please set the conditions of your auction"
        :visible.sync="showStakingPopup"
        :before-close="handlerClosePopup"
        width="500px"
        top="25vh"
        class="nft-staking-popup"
      >
        <div class="staking-container">
          <div class="staking-price">
            <p>Starting price:</p>
            <b-input v-model="auctionStartPrice" type="number" placeholder="0,00" />
          </div>
          <div class="staking-price">
            <p>Ending price:</p>
            <b-input v-model="auctionEndPrice" type="number" placeholder="0,00" />
          </div>
          <div class="staking-duration">
            <p>Duration(day):</p>
            <b-input v-model="auctionDuration" type="number" placeholder="0" />
          </div>
          <div class="staking-btn-group">
            <button class="btn-staking cancel" @click="closeStakingPopup">
              Cancel
            </button>
            <button class="btn-staking staking" @click="stackingNFT">
              Stake
            </button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Assets',
  data () {
    return {
      tableData: [],
      loading: false,
      showStakingPopup: false,
      selectedNFTID: null,
      nftAddress: null,
      auctionStartPrice: 0,
      auctionEndPrice: 0,
      auctionDuration: 0
    }
  },
  computed: {
    ...mapGetters({ getters: 'genesis/allGenesis', productsGetter: 'products/allProducts', account: 'ethereum/account' })
  },
  async mounted () {
    this.loading = true
    const loadingComponent = this.$buefy.loading.open({
                    container: null
                })
    // await this.connectToWallet()
    // await this.getGenesis(this.account)
    await this.getAllNft(this.account)
    this.tableData = this.getters
    this.loading = false
    loadingComponent.close()
  },
  methods: {
    ...mapActions({
                    getGenesis: 'genesis/getGenesis',
                    getAllNft: 'genesis/getNFTs',
                    getProducts: 'products/getProducts',
                    connectToWallet: 'ethereum/connectToWallet',
                    setAcution: 'ethereum/setAuction'
                  }),
    switchToComponent (section) {
      window.location.href = section
    },
    showStacking (id, address) {
      this.selectedNFTID = id
      this.nftAddress = address
      this.showStakingPopup = true
    },
    handlerClosePopup () {

    },
    showLoading () {
      this.loading = this.$loading({
        lock: true,
        text: 'Sending transaction, please wait !',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    closeLoading () {
      this.loading.close()
    },
    async stackingNFT () {
      if (this.auctionStartPrice > 0 && this.auctionEndPrice > 0 && this.auctionDuration > 0) {
        this.showLoading()
        const auctionData = {
          tokenId: this.selectedNFTID,
          startPrice: this.auctionStartPrice,
          endPrice: this.auctionEndPrice,
          duration: this.auctionDuration,
          nftAddress: this.nftAddress
        }
        await this.setAcution(auctionData)
        this.showStakingPopup = false
        this.closeLoading()
      } else {
        alert('You have to input the auction price and duration')
      }
    },
    closeStakingPopup () {
      this.showStakingPopup = false
    }
  }
}
</script>

<style lang="scss" scoped>
.heroButtomButtons:hover {
  transform: scale(1.1);
}
.hero-body {
  margin-top: 50pt;
}
.flexheight {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height : 80vh;
}
.nft-fox-product{
  display: flex;
  justify-content: space-between;
  max-width: 90%;
  margin: auto;
}
.stake-table-wrap{
  color: #000;
}
p{
  color: #000;
}
.nft-img-container{
  height: 220px;
  width: 200px;
  overflow:hidden;
  text-align: center;
  margin:0 auto;
}
.nft-asset-img{
  height: 220px;
  max-width: none;
  margin:0 -100%;
  width: auto;
}
.break-word {
  word-break: break-word;
}
.token-item{
  display: flex;
  margin-bottom: 50px;
  .token-index{
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    padding-left: 20px;
  }

  .token-image{
    flex-basis: 50%;
    width: 100%;
    height: 300px;
    img{
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .token-details{
    flex-basis: 50%;
    text-align: left;
    padding: 30px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    span{
      font-weight: 800;
    }
    .token-title{
      font-size: 18px;
      font-weight: 600;
    }
    .token-description{
      font-size: 15px;
      margin-top: 10px;
    }
  }
  .sell-btn{
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    a{
      background-color: #f9a31b;
      height: 40px;
      line-height: 40px;
      width: 100px;
      text-align: center;
      border-radius: 5px;
      font-size: 15px;
      font-weight: 800;
      color: #73172d;
    }
    a:hover,
    a:focus {
      box-shadow: 0 0.5em 0.5em -0.4em #c97538;
      transform: translateY(-0.25em);
    }
  }
  @media (max-width: 780px) {
    flex-direction: column;
  }
}
.staking-container{
  width: 100%;
  .staking-price, .staking-duration{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
    p{
      font-size: 12px;
    }
    .control{
      width: 100%;
    }
    input{
      width: 100%;
      height: 30px;
      padding-left: 8px;
    }
  }
  .staking-btn-group{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    .cancel{
      border: solid 1px #f9a31b;
      height: 40px;
      padding: 10px;
      border-radius: 5px;
    }
    .staking{
      height: 40px;
      padding: 10px;
      border-radius: 5px;
      background-color: #f9a31b;
      color: #fff;
      margin-left: 20px;
    }
  }
  .el-icon-close{
    display: hidden;
  }
}
</style>
