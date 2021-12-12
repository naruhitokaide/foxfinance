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
            <div v-if="!isEdited">
              <div class="has-text-left">
                <p>
                  <span class="has-text-weight-semibold">Price:</span> {{ Number(product.price).toLocaleString() }} FOX
                </p>
                <p>
                  <span class="has-text-weight-semibold">Available:</span> {{ Number(product.quantity).toLocaleString() }}
                </p>
              </div>
            </div>
            <div v-else>
              <div class="editable-box">
                <div class="edit-has-text">
                  <p>Price</p>
                  <div class="edit-text-form">
                    <el-input v-model="price" type="number" min="0" />
                    <p>FOX</p>
                  </div>
                </div>
                <div class="edit-has-text">
                  <p>Available</p>
                  <div class="edit-text-form">
                    <el-input v-model="quantity" type="number" min="0" />
                  </div>
                </div>
              </div>
            </div>
            <div class="product-purchase">
              <div v-if="!isActive">
                <div v-if="!isEdited">
                  <button class="button edit" @click="editAble()">
                    Edit
                  </button>
                </div>
                <div v-else>
                  <button class="button edit" @click="save(product.title, product.description, product.hash)">
                    Save
                  </button>
                </div>
              </div>
              <button class="button" @click="buyProdcut(product.hash, product.price)">
                Acquire
              </button>
              <div v-if="!isActive">
                <button class="button remove" @click="removeReq()">
                  Remove
                </button>
              </div>
              <vue-final-modal v-model="removeAlert" classes="modal-container" content-class="modal-content" :drag="true">
                <button class="modal__close" @click="removeAlert = false">
                  <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.2678 1.26776L6.96447 6.57106M6.96447 6.57106L1.66117 11.8744M6.96447 6.57106L12.2678 11.8744M6.96447 6.57106L1.66117 1.26776" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </button>
                <span class="modal__title">Remove this NFT</span>
                <div class="modal__content">
                  <p>Please serious. This operation is irreversible.</p>
                </div>
                <div class="modal__action">
                  <button class="modal__button remove" @click="removeConfirm()">
                    Remove
                  </button>
                  <button class="modal__button" @click="removeAlert = false">
                    Cancel
                  </button>
                </div>
              </vue-final-modal>
              <button class="button go-back" @click="goBack()">
                Go Back
              </button>
            </div>
          </div>
          <vue-final-modal v-model="errorAlert" classes="modal-container error" content-class="modal-content" :drag="true">
            <button class="modal__close" @click="removeAlert = false">
              <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.2678 1.26776L6.96447 6.57106M6.96447 6.57106L1.66117 11.8744M6.96447 6.57106L12.2678 11.8744M6.96447 6.57106L1.66117 1.26776" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <div class="modal__content">
              <p>You can't access this action!</p>
            </div>
          </vue-final-modal>
          <div class="product-description">
            <p class="has-text-weight-semibold">
              Description:
            </p>
            <p>
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapActions } from 'vuex'
import { vfmPlugin } from 'vue-final-modal'
import Vue from 'vue'
export default {
  name: 'ProductDetail',
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
      }
    }
  },
  data () {
    return {
      price: '',
      quantity: '',
      isEdited: false,
      isActive: false,
      loading: false,
      removeAlert: false,
      localProduct: null,
      errorAlert: false
    }
  },
  computed: {
    ...mapGetters({
      account: 'ethereum/account', productGetter: 'products/getProduct'
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
    Vue.use(vfmPlugin({
      key: '$vfm',
      componentName: 'VueFinalModal',
      dynamicContainerName: 'ModalsContainer'
    }))
  },
  methods: {
    ...mapActions({ getProduct: 'products/getProduct', buy: 'ethereum/buyProduct', set: 'products/setProduct', remove: 'products/removeProduct' }),

    async buyProdcut (hash, price) {
      this.showLoading()
      await this.buy({ price, hash })
      await this.getProduct(hash)
      this.product = this.productGetter
      this.closeLoading()
    },
    async save (name, description, hash) {
      this.showLoading()
      const price = this.price
      const quantity = this.quantity
      await this.set({ name, description, price, quantity, hash })
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
    editAble () {
      this.isEdited = true
      this.price = this.product.price
      this.quantity = this.product.quantity
    },
    edit () {
      this.isEdited = false
    },
    removeReq () {
      this.removeAlert = true
    },
    async removeConfirm () {
      this.showLoading()
      this.removeAlert = false
      const hash = this.product.hash
      const removeAction = await this.remove({ hash })
      if (!removeAction) {
        this.errorAlert = true
      }
      this.closeLoading()
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
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
      .edit-has-text {
        margin-bottom: 10px;
        p {
          text-align: left;
          font-weight: bold;
          color: #333 !important;
        }
        .edit-text-form {
          display: flex;
          align-items: center;
          p {
            font-size: 16px;
            margin-left: 5px;
            margin-right: 5px;
            color: #777 !important;
            font-weight: 300;
          }
        }
        textarea {
          width: 100%;
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
      }

      .product-purchase{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .button{
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
        .remove{
          background-color: #f83d3d;
          color: #3f0000;
          &:hover {
            background-color: #e21313;
          }
        }
        .edit {
          background-color: #3ef93e;
          color: #002400;
          &:hover {
            background-color: #23d823;
          }
        }

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
            button {
            width: 120px;
            font-size: 12px;
            height: 30px;
            }
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
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  text-align: left;
  border-bottom: 1px solid #ccc;
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
  p {
    font-size: 15px;
    text-align: left;
    padding-top: 10px;
    color: #333;
  }
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}
.modal__button {
  font-size: 14px;
  padding: 10px 20px;
  background: #ccc;
  border-radius: 5px;
  font-weight: 500;
  margin: 0 10px !important;
  .action {
    background: crimson;
    color: #fff;
  }
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  width: 20px;
  color: #333;
  height: 20px;
}
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}

::v-deep .modal-container.error {
  align-items: flex-start;
  margin-top: 10px;
  .modal-content {
    width: 300px;
    .modal__close {
      top: 50%;
      right: 0.5rem;
      transform: translateY(-50%);
    }
    border: 1px solid #c30000;
    background: #c30000;
    .modal__content {
      p {
        margin-top: 0;
        padding-top: 0;
        color: #fff;
      }
    }
  }
}
</style>
