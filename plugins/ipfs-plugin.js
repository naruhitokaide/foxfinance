import Vue from 'vue'
import IPFS from 'ipfs'

const plugin = {
  install (Vue, opts = {}) {
    Vue.prototype.$ipfs = IPFS.create(opts)
  }
}

Vue.use(plugin)
