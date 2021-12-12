<template>
  <div class="product-item">
    <div class="product-item-container">
      <p class="product-title">
        {{ productData.title }}
      </p>
      <div v-if="productData.isAuction" class="product-img-container" @click="gotoOffer(productData.id)">
        <img class="product-img" :src="productData.img" alt="">
      </div>
      <div v-else class="product-img-container" @click="gotoDetail(productData.hash)">
        <img class="product-img" :src="productData.img" alt="">
      </div>
      <div v-if="productData.isAuction" class="product-attribute auction-attribute">
        <p class="product-attribute-price">
          <span class="attribute-label">
            Price
          </span>
          <span>
            <img class="price-symbol" src="/img/logos/logo.png" width="15px" alt=""> {{ Number(productData.startingPrice).toLocaleString() }}
          </span>
        </p>
        <p class="product-attribute-quantity">
          <span class="attribute-label">
            This Auction will end in {{ leftDays( Number(productData.startedAt)+ Number(productData.duration)) }}
          </span>
        </p>
      </div>
      <div v-else class="product-attribute">
        <p class="product-attribute-price">
          <span class="attribute-label">
            Price
          </span>
          <span>
            <img class="price-symbol" src="/img/logos/logo.png" width="15px" alt="">{{ Number(productData.price).toLocaleString() }}
          </span>
        </p>
        <p class="product-attribute-quantity">
          <span class="attribute-label">
            Available
          </span>
          {{ Number(productData.quantity).toLocaleString() }}
        </p>
      </div>
      <div class="product-purchase">
        <button v-if="productData.isAuction" @click="gotoOffer(productData.nftAddress, productData.id)">
          Offer
        </button>
        <button v-else @click="buyProdcut(productData.hash, productData.price)">
          Acquire
        </button>
        <button v-if="isActive" class="edit" @click="gotoDetail(productData.hash)">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'ProductItem',
  props: {
    buyProduct: {
      type: Function,
      required: true
    },
    productData: {
      type: Object,
      required: true,
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      img: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      hash: {
        type: String,
        required: true
      },
      id: {
        type: Number
      },
      startedAt: {
        type: Number
      },
      duration: {
        type: Number
      },
      isAuction: {
        type: Boolean
      },
      nftAddress: {
        type: String
      }
    }
  },
  data () {
    return {
      loading: false,
      isActive: false
    }
  },
  computed: {
    ...mapGetters({
      account: 'ethereum/account'
    })
  },
  mounted () {
    if (this.account === '0xb655a92b4dc14a7db2d96872a270659e310b83234a0681f01d1337fa9e026e7a') {
      this.isActive = true
    } else if (this.account === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      this.isActive = true
    } else {
      this.isActive = false
    }
  },
  methods: {
    ...mapActions({ buy: 'ethereum/buyProduct' }),
    async buyProdcut (hash, price) {
      this.showLoading()
      await this.buy({ price, hash })
      this.closeLoading()
      this.buyProduct()
    },
    gotoDetail (hash) {
      this.$router.push('/production-detail/' + hash)
    },
    gotoOffer (nftAddress, id) {
      this.$router.push(`/make-offer/${id}?contractAddress=${nftAddress}`)
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
    leftDays (endDay) {
      return moment.unix(endDay).fromNow()
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-item{
    height: 100%;
    &-container{
      max-width: 350px;
      width: 100%;
      height: 100%;
      margin: auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      margin-bottom: 10px;
      h1{
        color: black;
        font-size: 20px;
      }
      .product-title{
        font-size: 20px;
        padding-bottom: 10px;
        white-space: nowrap;
        width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: auto;
      }
      .product-img-container{
        width: 300px;
        overflow:hidden;
        text-align: center;
        margin:0 auto;
        border-radius: 5px;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;

        @media (max-width: 560px){
          width: 220px;
        }

        @media (max-width: 320px){
          width: 180px;
        }
      }
      .product-img{
        height: 300px;
        max-width: none;
        margin:0 -100%;
      }
      .product-attribute{
        display: flex;
        justify-content: space-between;
        p{
          font-size: 14px;
        }
        .attribute-label{
          font-size: 16px;
          font-weight: 600;
        }
        &-price{
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        &-quantity{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
      }
      .auction-attribute{
        flex-direction: column;
        .product-attribute-quantity{
          text-align: center;
          align-items: center;
          .attribute-label{
            font-size: 14px;
            font-weight: 500;
            padding-top: 10px;
          }
        }
      }
      .product-attribute-label{
        font-size: 17px;
      }
      .product-purchase{
        max-width: 150px;
        margin: auto;
        margin-top: 20px;
        button{
          border-radius: 5px;
          background-color: #e9950e;
          font-size: 15px;
          font-weight: 800;
          color: #73172d;
          width:100%;
          height: 35px;
        }
        .edit {
          background-color: #3ef93e;
          color: #002400;
          margin-top: 15px;
          &:hover {
            background-color: #23d823;
          }
        }
      }
      .product-purchase button:hover,
      .product-purchase button:focus {
        box-shadow: 0 0.5em 0.5em -0.4em #c97538;
        transform: translateY(-0.25em);
      }
      .product-purchase button.edit:hover,
      .product-purchase button.edit:focus {
        box-shadow: 0 0.5em 0.5em -0.4em #002400;
        transform: translateY(-0.25em);
      }
      @media (max-width: 540px) {
        .product-title{
          font-size: 17px;
        }
        .product-attribute-label{
          font-size: 14px;
        }
        .product-attribute{
          display: flex;
          justify-content: space-between;
          p{
            font-size: 13px;
          }
        }
      }
    }
  }
</style>
