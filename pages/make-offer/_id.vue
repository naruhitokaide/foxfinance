<template>
  <div id="production-detail">
    <ProductAuctionView v-if="product" :product="product" />
  </div>
</template>

<script>
import ProductAuctionView from '../../components/product/ProductAuctionView'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MakeOffer',
  components: { ProductAuctionView },
  asyncData ({ params, redirect }) {
    return { id: params.id }
  },
  data () {
    return {
      product: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({ productGetter: 'products/getProduct' })
  },
  async mounted () {
    this.loading = true
    await this.getAuctionProduct({ nftAddress: this.$route.query.contractAddress, id: this.id })
    this.product = this.productGetter
    this.loading = false
  },
  methods: {
    ...mapActions({ getAuctionProduct: 'products/getAuctionProduct' })
  }
}
</script>
