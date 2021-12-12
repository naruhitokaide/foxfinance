<template>
  <div class="product-detail">
    <div class="product-detail-container">
      <div class="product-details-section">
        <div class="product-img-container">
          <img class="product-img" :src="product.img" alt="">
        </div>
        <div class="product-attribute">
          <p class="product-title">
            {{ product.title }}
          </p>
          <div class="product-price-purchase">
            <div class="has-text-left">
              <p>
                <span class="has-text-weight-semibold">Starting Price:</span> {{ Number(product.startingPrice).toLocaleString() }} FOX
              </p>
              <p>
                <span class="has-text-weight-semibold">Ending Price:</span> {{ Number(product.endingPrice).toLocaleString() }} FOX
              </p>
              <p>
                <span class="has-text-weight-semibold">Available:</span> This Auction will end in {{ leftDays( Number(product.startedAt)+ Number(product.duration)) }}
              </p>
            </div>
          </div>
          <div class="product-description">
            <p class="has-text-weight-semibold">
              Description:
            </p>
            <p>
              {{ product.description }}
            </p>
          </div>
          <div class="product-purchase bottom-section">
            <div>
              <label for=""> Offer Price</label>
              <b-input v-model="auctionPrice" type="number" placeholder="0,00" />
            </div>
            <div class="offer-btns">
              <button @click="offerProdcut(product.id)">
                Send an Offer
              </button>
              <button class="go-back" @click="goBack()">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'ProductAuctionView',
  props: {
    // eslint-disable-next-line
    product: {
      type: Object,
      require: true,
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
      startingPrice: {
          type: Number
      },
      nftAddress: {
        type: String
      }
    }
  },
  data () {
    return {
      loading: false,
      auctionPrice: 0,
      localProduct: null
    }
  },
  computed: {
    ...mapGetters({
      account: 'ethereum/account', productGetter: 'products/getProduct'
    })
  },
  mounted () {
  },
  methods: {
    ...mapActions({ buy: 'ethereum/buyProduct', makeOffer: 'ethereum/makeOffer' }),
    async offerProdcut (id) {
      if (this.auctionPrice <= 0) {
          alert('Please input the offer price', 'Input Error', {
            confirmButtonText: 'OK',
            confirmButtonClass: 'confirm-button'
           })
           return
      }
      this.showLoading()
      await this.makeOffer({
        nftAddress: this.product.nftAddress,
        id,
        auctionPrice: this.auctionPrice
      })
      this.$router.push('/')
      this.closeLoading()
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
    goBack () {
      this.$router.push('/')
    },
    leftDays (endDay) {
      return moment.unix(endDay).fromNow()
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail{
    padding: 3rem 1.5rem;
    color: #000;

    &-container{
        margin-top: 45pt;
        width: 100%;
        padding: 50px;

        padding-bottom: 80px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-bottom: 30px;
        display: flex;

        .product-details-section {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          max-width: 100%;
          margin: auto;

          @media (max-width: 780px) {
            display: flex;
            flex-direction: column;
          }
        }

        .product-img-container{
            flex-basis: 50%;
            width: 100%;
            text-align: center;
            margin:0 auto;
            .product-img{
                max-height: 400px;
                max-width: none;
                margin:0 -100%;
                max-width: 400px;
            }
        }

        .product-attribute{
            display: flex;
            flex-basis: 50%;
            flex-direction: column;
            h1{
                color: black;
                font-size: 22px;
            }

            .product-title{
                font-size: 22px;
                color: black;
                padding-bottom: 10px;
                text-align: left;
            }

            .product-price-purchase{
                display: flex;
                justify-content: space-between;
                p{
                    color: black;
                }
            }

            .product-description{
                margin-top: 30px;
                font-size: 14px;
                text-align: left;
                p{
                    color: rgb(43, 43, 43);
                }
            }

            .offer-btns{
                display: flex;
                margin-top: 20px;
            }
        }

        .product-purchase{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            button{
              height: 35px;
              width:150px;
              font-size: 15px;
              font-weight: 800;
              color: #73172d;
              height: 35px;
              background-color: #f9a31b;
              margin-bottom: 10px;
              border-radius: 5px;
              &:hover {
                background-color: #d88a0d;
              }
            }

            .go-back{
              background-color: transparent;
              &:hover {
                background-color: #ddd;
              }
            }

        }

        .bottom-section{
            align-items: flex-start;
        }

        @media (max-width: 540px) {

          padding: 20px;
          padding-top: 40px;

            .product-img-container{
              display: block;
              flex-basis: 100%;
              width: 100%;
              .product-img{
                width: 250px;
              }
            }
            .product-title{
              font-size: 17px !important;
              text-align: center!important;
            }

            .product-price-purchase{
              margin-top: 20px;
              flex-direction: column;

              .product-purchase{
                margin-top: 20px;
                margin-bottom: 20px;
              }
            }

            .product-attribute-label{
              font-size: 14px;
            }
            .product-attribute{
              display: block;
              justify-content: space-between;
                p{
                  font-size: 13px;
                }
            }
        }
    }
}
</style>
