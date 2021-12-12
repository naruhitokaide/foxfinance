<template>
  <div id="nav" class="navbar is-fixed-top is-spaced has-background-transparent p-4">
    <div v-if="!isRightNetwork && accountWallet" class="network-wallet">
      Please choose the Binance Smart Chain as the current network in your wallet app.
    </div>
    <div class="container">
      <div class="navbar-brand">
        <a href="/#hero">
          <img class="logo navbar-item" src="/img/logos/logo.png" width="85px">
        </a>
        <a id="navBurger" class="navbar-burger" role="button" @click="burgerClick">
          <span />
          <span />
          <span />
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-end" @click="burgerClick">
            <router-link
              v-slot="{ href, navigate }"
              to="/"
            >
              <a :href="href" class="navbar-item has-text-white" @click="navigate">Home</a>
            </router-link>

            <router-link
              v-if="isAdmin"
              v-slot="{ href, navigate }"
              to="/create"
            >
              <a :href="href" class="navbar-item has-text-white" @click="navigate">Create</a>
            </router-link>
            <!-- <router-link
              v-slot="{ href, navigate }"
              to="/auction"
            >
              <a :href="href" class="navbar-item has-text-white" @click="navigate">Auction</a>
            </router-link> -->
            <!-- My NFTs -->
            <router-link
              v-if="accountWallet"
              v-slot="{ href, navigate }"
              to="/my-asset"
            >
              <a :href="href" class="navbar-item has-text-white" @click="navigate">My NFTs</a>
            </router-link>
            <!-- My Auctions -->
            <!-- <router-link
              v-if="accountWallet"
              v-slot="{ href, navigate }"
              to="/my-auction"
            >
              <a :href="href" class="navbar-item has-text-white" @click="navigate">My Auctions</a>
            </router-link> -->
            <a v-if="accountWallet" :href="'https://bscscan.com/address/'+accountWallet+'#tokentxnsErc721'" target="_blank" class="navbar-item has-text-white">
              {{ accountWallet.slice(0,9) }}
            </a>
            <a v-else class="navbar-item has-text-white" @click="connectAccount">
              Connect
            </a>
          </div>
        </div>
      </div>
    </div>
    <ConnectProviderPopup v-if="showConnectPopup" />
  </div>
</template>

<script>

import ConnectProviderPopup from './ConnectProviderPopup'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  components: {
    ConnectProviderPopup
  },
  data () {
    return {
      dialogVisible: false,
      hideConnectPopup: false,
      isAdmin: false
    }
  },
  computed: {
    ...mapGetters({
      showConnectPopup: 'showConnectPopup',
      accountWallet: 'ethereum/account',
      isRightNetwork: 'ethereum/isRightNetwork'
    })
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    if (this.account === '0xb655a92b4dc14a7db2d96872a270659e310b83234a0681f01d1337fa9e026e7a') {
      this.isAdmin = true
    } else if (this.account === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }
  },
  methods: {
    ...mapActions({ setShowConnectPopup: 'setShowConnectPopup', connectToWallet: 'ethereum/connectToWallet' }),
    burgerClick () {
      const burger = document.querySelector('.navbar-burger')
      const navMenu = document.querySelector('.navbar-menu')

      navMenu.classList.toggle('is-active')
      burger.classList.toggle('is-active')
    },
    handleScroll () {
      const nav = document.getElementById('nav')

      if (window.scrollY < 100) {
        nav.classList.add('has-background-transparent')
        nav.classList.remove('has-background')
      } else {
        nav.classList.remove('has-background-transparent')
        nav.classList.add('has-background')
      }
    },
    popupclosed () {
      this.$store.commit('setPopupclosed', false)
    },
    async connectAccount () {
      // await this.connectToWallet()
      await this.setShowConnectPopup(true)
    }
  }

}
</script>

<style lang="scss" scoped>
  .account-number{
    display: flex;
  }

  .my-asset{
    margin-left: 20px;
    margin-right:20px;
    a {
      color: #fff !important;
    }
  }

  .navbar-menu.is-active{
    display: flex;
    align-items: center;
    background-color: #081833;
    .navbar-end {
      display: flex;
    }
  }

  .account-address{
    display: flex;
  }

  @media (max-width: 540px) {
    .nav, .container{
      display: flex;
      flex-direction: column;
    }

    .navbar-brand{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .navbar-menu.is-active{
      display: flex;
      flex-direction: column;

      .navbar-end{
        flex-direction: column;
      }
    }

    .account-number{
      flex-direction: column;

      .account-address{
        justify-content: center;
      }
    }
  }
</style>

<style>
#nav {
  transition: box-shadow 400ms linear;
  transition: background 400ms linear;
  flex-direction: column;
}

.navbar-burger {
  margin-top: auto;
  margin-bottom: auto;
}

.has-background-transparent {
  background: transparent !important;
}

.has-background {
  background: #081833 !important;
}

a.navbar-item:hover {
  background-color: #ff8936 !important;
}

a.navbar-item:focus {
  background-color: transparent !important;
}

a.navbar-burger {
  color: white !important;
}

#nav .container {
  display: flex;
  justify-content: space-between;
}

@media only screen and (max-width: 1023px) {
  #nav {
    margin: 0 !important;
    padding: 0 !important;
  }

  .navbar-menu.is-active {
    background-color: #070b22 !important;
    color: white !important;
  }

  a.navbar-item {
    color: white !important;
  }

  a.navbar-item:hover {
    color: #ff8936 !important;
    background-color: transparent !important;
  }
}
</style>
