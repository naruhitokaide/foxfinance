<template>
  <div id="production-detail">
    <AuctionOfferView v-if="product" :product="product" :offers="offers" />
  </div>
</template>

<script>
import AuctionOfferView from '../../components/MyAuction/AuctionOfferView.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MakeOffer',
  components: { AuctionOfferView },
  asyncData ({ params, redirect }) {
    return { id: params.id }
  },
  data () {
    return {
      product: null,
      offers: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({ productGetter: 'products/getProduct', offerGetter: 'products/getOffers' })
  },
  async mounted () {
    this.loading = true
    await this.getAuctionProduct({ nftAddress: this.$route.query.contractAddress, id: this.id })
    await this.getOffers({ nftAddress: this.$route.query.contractAddress, id: this.id })
    this.product = this.productGetter
    this.offers = this.offerGetter
    this.loading = false
  },
  methods: {
    ...mapActions({ getAuctionProduct: 'products/getAuctionProduct', getOffers: 'products/getOffersForAuction' })
  }
}
</script>
