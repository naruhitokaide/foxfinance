<template>
  <div class="create-section">
    <h1>Create your NFT for marketplase</h1>
    <div class="create-box">
      <p>Please input the metadata</p>
      <div class="metadata-form">
        <input v-model="metadata" class="meta-input" :class="{'resError': isError }" placeholder="Enther or replace the meta URI" @change="metaChange()"></input>
        <button class="check" @click="getJson()">
          <div v-if="!isError">
            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 5.5L7 11L16.5 1.5" stroke="#0092C0" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
          <div v-else>
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.2678 1.26776L6.96447 6.57106M6.96447 6.57106L1.66117 11.8744M6.96447 6.57106L12.2678 11.8744M6.96447 6.57106L1.66117 1.26776" stroke="#D70000" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
        </button>
        <div v-if="isError" class="err-alert">
          This is the invalid URI. Please enter other URI.
        </div>
      </div>
      <div class="meta-form">
        <img :src="photo" alt="">
        <div class="meta-content">
          <p>Title</p>
          <h3 class="title">
            {{ title }}
          </h3>
          <p>Description</p>
          <h3>
            {{ description }}
          </h3>
        </div>
      </div>
      <div class="control-params">
        <div class="params-item">
          <p>Price :</p>
          <el-input v-model="price" type="number" />
          <div v-if="!priceValidation" class="validation">
            This is valid data.
          </div>
        </div>
        <div class="params-item">
          <p>Quantity :</p>
          <el-input v-model="quantity" type="number" />
          <div v-if="!quantiryValidation" class="validation">
            This is valid data.
          </div>
        </div>
      </div>
      <div class="create-action">
        <button v-if="isActive" class="save" @click="create()">
          Create
        </button>
        <button @click="goBack()">
          Go to home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

export default {
  data () {
    return {
      metadata: '',
      price: '',
      quantity: '',
      isLoading: true,
      photo: '/img/default.jpg',
      title: 'N/A',
      description: 'N/A',
      hash: '',
      isError: false,
      loading: false,
      priceValidation: true,
      quantiryValidation: true,
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
  inject: {
    theme: {
      default: { isDark: false }
    }
  },
  methods: {
    ...mapActions({ add: 'products/addProduct' }),

    goBack () {
      this.$router.push('/')
    },
    getJson () {
      fetch(this.metadata)
      .then(resp =>
        resp.json()
      )
      .catch((err) => {
        console.log(err)
        this.isError = true
        this.title = 'N/A'
        this.photo = '/img/default.jpg'
        this.description = 'N/A'
        this.hash = ''
      })
      .then((json) => {
        if (json.name) {
          this.title = json.name
          this.photo = json.image
          this.description = json.description
          const url = this.metadata.split('/')
          const hash = url[url.length - 1]
          this.hash = hash
          this.isError = false
        } else {
          this.isError = true
        }
      }
      )
    },
    metaChange () {
      this.isError = false
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
    async create () {
      if (this.price === '') this.priceValidation = false
      else this.priceValidation = true
      if (this.quantity === '') this.quantiryValidation = false
      else this.quantiryValidation = true
      if (this.price !== '' && this.quantity !== '' && this.hash !== '') {
        const name = this.title
        const description = this.description
        const price = this.price
        const quantity = this.quantity
        const hash = this.hash
        this.showLoading()
        const res = await this.add({ name, description, price, quantity, hash })
        if (res) Swal.fire('Congratulation', 'You created new NFT for marketplace!', 'success')
        else Swal.fire('Opps...', 'We found a error', 'error')
        this.closeLoading()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.create-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 60px;
  h1 {
    text-align: left;
    padding-top: 100px;
  }
  .create-box {
    width: 500px;
    .meta-form {
      display: flex;
      margin-top: 30px;
      img {
        width: 210px;
        height: 240px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 4px 10px #00000059;
      }
      .meta-content {
        margin-left: 20px;
        text-align: left;
        width: calc(100% - 230px);
        p {
          font-size: 12px;
        }
        .title {
          font-size: 20px;
          color: #fff;
          margin: 0;
        }
      }
    }
    .metadata-form {
      display: flex;
      position: relative;
      .err-alert {
        position: absolute;
        background: #ff3333;
        border-radius: 5px;
        padding: 10px;
        font-size: 12px;
        border: 1px solid #940000;
        top: 44px;
        left: 8px;;
      }
      .meta-input {
        width: calc(100% - 40px);
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        color: #333;
        outline: none;
        padding: 8px 10px;
        border: 1px solid #fff;
        background: #fff;
        &:focus {
          border-color: #008cff;
          background: #eee;
        }
      }
      button {
        width: 40px;
        border: 1px solid #eee;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #eee;
        border-left: 1px solid #ccc;
        &:hover {
          background: #bbb;
          border-color: #bbb;
        }
      }
    }
    p {
      padding: 10px 0;
      font-size: 1rem;
      color: #fff;
      text-align: left;
    }
  }
  .create-action {
    padding-top: 30px;
    button {
      border: none;
      background: #ccc;
      padding: 10px 20px;
      font-size: 1rem;
      min-width: 120px;
      border-radius: 4px;
      margin: 0 10px;
      font-weight: bold;
      color: #333;
      &:hover {
        background: #a5a5a5;
      }
    }
    .save {
      background: olivedrab;
      color: #fff;
      &:hover {
        background: #527015;
      }
    }
  }
  .control-params {
    display: flex;
    .params-item {
      position: relative;
      width: calc(50% - 10px);
      .validation {
        position: absolute;
        left: 0;
        top: auto;
        font-size: 12px;
        color: red;
        bottom: -22px;
      }
      &:first-child {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
    }
  }
}
.meta-input.resError {
  border-color: red !important;
  background: #ffbdbd !important;
  color: #bb0101 !important;
}
@media (max-width: 576px) {
  .create-box {
    width: calc(100% - 30px) !important;
    margin-left: 15px;
    margin-right: 15px;
    .meta-form {
      flex-direction: column;
      align-items: center !important;
      .meta-content {
        margin-left: 0 !important;
        width: calc(100% - 30px) !important;
      }
    }
  }
}
</style>
