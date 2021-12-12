/* eslint no-use-before-define: 0 */

import path from 'path'
require('dotenv').config()

export default {
  /*
	 ** Nuxt rendering mode
	 ** See https://nuxtjs.org/api/configuration-mode
	 */
  ssr: false,
  
  target: 'static',
  router: {
    base: '/nuxt-fox-marketplace/'
  },
  /*
	 ** Nuxt target
	 ** See https://nuxtjs.org/api/configuration-target
	 */
  server: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT
  },
  // User env variables.
  publicRuntimeConfig: {
    network: process.env.NETWORK,
    mainnetInfura: process.env.MAINNET_INFURA,
    testnetInfura: process.env.TESTNET_INFURA,
  },
  /*
	 ** Headers of the page
	 ** See https://nuxtjs.org/api/configuration-head
	 */
  head: {
    titleTemplate: '%s',
    title: 'Fox Finance NFT Shop',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
					'Welcome to the official NFT shop for Fox Finance, where you can spend your Fox tokens on the BSC to collect cool artwork!'
      },
      { hid: 'og:image', property: 'og:image', content: '/img/logos/logo.png' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Welcome to the official NFT shop for Fox Finance, where you can spend your Fox tokens on the BSC to collect cool artwork!'
      },
      { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:site', property: 'twitter:site', content: '@foxfinancebsc' },
      { hid: 'twitter:creator', property: 'twitter:creator', content: '@foxfinancebsc' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'The Fox Finance NFT Shop' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'Welcome to the official alpha release of the NFT shop for Fox Finance, where you can spend your Fox tokens on the BSC to collect cool artwork!' },
      { hid: 'twitter:image', property: 'twitter:image', content: 'https://shop.foxfinance.io/img/logos/logo.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
					'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap'
      },
      {
        rel: 'chrome-webstore-item',
        href: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
      }
    ]
  },

  loading: false,
  /*
	 ** Global CSS
	 */
  css: [
    // css
    '~assets/scss/elements.css',
    '~assets/scss/styles.scss'
  ],

  styleResources: {
    scss: ['~assets/scss/abstracts/_variables.scss', '~assets/scss/abstracts/_mixins.scss']
  },
  /*
	 ** Plugins to load before mounting the App
	 ** https://nuxtjs.org/guide/plugins
	 */
  plugins: [
    { src: '@/plugins/element-ui', mode: 'client' },
    { src: '@/plugins/bsc.js', mode: 'client' },
    { src: '@/plugins/vue-final-modal.js', mode: 'client' },
    // '@/plugins/ipfs-plugin'
    '@/plugins/web3'
  ],
  /*
	 ** Auto import components
	 ** See https://nuxtjs.org/api/configuration-components
	 */
  components: true,
  /*
	 ** Nuxt.js dev-modules
	 */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/vuetify',
  ],
  /*
	 ** Nuxt.js modules
	 */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/apollo',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'nuxt-fontawesome',
    'nuxt-compress'
  ],
  'nuxt-compress': {
    gzip: {
      threshold: 8192,
    },
    brotli: {
      threshold: 8192,
    },
  },
  // fontawesome: {
  //   imports: [
  //     {
  //       set: '@fortawesome/free-brands-svg-icons',
  //       icons: ['fab']
  //     }
  //   ]
  // },
  proxy: {
    '/api/': { target: process.env.API_ROOT, pathRewrite: { '^/api/': '' } }
  },
  /*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
  axios: {
    proxy: true
  },

  /*
	 ** set up apollo
	 */

  apollo: {
    clientConfigs: {
      default: '~/apollo/configs/client-config'
    },
    /**
		 * default 'apollo' definition
		 */
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading'
        // fetchPolicy: 'cache-and-network'
      }
    }
    // watchLoading: '~/apollo/configs/watch-loading-handler.js',
  },

  /*
	 ** Build configuration
	 ** See https://nuxtjs.org/api/configuration-build/
	 */
  build: {
    transpile: [/^element-ui/],
    transpile: ['vue-final-modal'],
    extend (config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: { name: '[path][name].[ext]' }
      })
      config.module.rules.push({
        test: /\.(pug)$/,
        loader: 'pug-plain-loader',
        options: {
          basedir: path.resolve(__dirname, 'templates')
        }
      })
    }
  }
}
