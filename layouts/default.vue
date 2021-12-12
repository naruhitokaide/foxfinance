<template>
  <div id="app">
    <app-header />
    <nuxt />
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'

export default {
  name: 'DefaultLayout',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      isHomePage: true
    }
  },
  watch: {
    $route (to, from) {
      this.checkPage(this.$route.path)
    }
  },
  mounted () {
    document.title = 'Fox Finance'
  },
  created () {
    this.checkPage(this.$route.path)
  },
  methods: {
    checkPage (url) {
      if (url && url !== '/homepage' && url !== '/homepage/') {
        this.isHomePage = false
      } else {
        this.isHomePage = true
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~assets/scss/layouts/_default.scss";
</style>
