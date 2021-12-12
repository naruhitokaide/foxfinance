<template>
  <div id="production-detail">
    <ProductDetail v-if="product" :product="product" />
  </div>
</template>

<script>
import ProductDetail from '../../components/product/ProductDetail'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProductionDetail',
  components: { ProductDetail },
  asyncData ({ params, redirect }) {
    return { hash: params.hash }
  },
  data () {
    return {
      product: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({ productsGetter: 'products/allProducts', productGetter: 'products/getProduct', account: 'ethereum/account' })
  },
  async mounted () {
    this.loading = true
    await this.getProduct(this.hash)
    this.product = this.productGetter
    this.loading = false
  },
  methods: {
    ...mapActions({ getGenesis: 'genesis/getGenesis', getProducts: 'products/getProducts', getProduct: 'products/getProduct' })
  }
}
</script>
