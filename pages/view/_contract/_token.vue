<template>
  <div id="production-detail">
    <NFTMetadataView v-if="product" :product="product" />
  </div>
</template>

<script>
import NFTMetadataView from '../../../components/product/NFTMetadataView.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Token',
  components: { NFTMetadataView },
  asyncData ({ params }) {
    // console.log(params)
    return { contract: params.contract, tokenID: params.token }
  },
  data () {
    return {
      product: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({ productGetter: 'genesis/getContractNFT' })
  },
  async mounted () {
    this.loading = true
    await this.getNFTByContractAndTokenID({ contractAddress: this.contract, tokenID: this.tokenID })
    this.product = this.productGetter
    this.loading = false
  },
  methods: {
    ...mapActions({ getNFTByContractAndTokenID: 'genesis/getNFTByContractAndTokenID' })
  }
}
</script>
