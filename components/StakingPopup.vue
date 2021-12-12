<template>
  <div class="popup">
    <el-dialog
      custom-class="dialog-connect-wallet"
      title="Please connect Metamask wallet"
      :visible.sync="showConnectPopup"
      :before-close="handlerClosePopup"
      width="54%"
      top="25vh"
      class="connect-wallet-popup"
    >
      <div class="metamask-wallet">
        <div class="metamask">
          <span>Metamask</span>
          <img src="/images/metamask.jpg" alt="">
        </div>
        <button class="connect-wallet u-button-black" @click="connectAccount">
          Connect Wallet
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ConnectProviderPopup',
  computed: {
    ...mapGetters({
      accountConnected: 'ethereum/accountConnected',
      showConnectPopup: 'showConnectPopup'
    })
  },
  methods: {
    ...mapActions({
      connectAcc: 'ethereum/connectAccount',
      setShowConnectPopup: 'setShowConnectPopup'
    }),
    handlerClosePopup () {
      this.$store.commit('setPopupclosed', true)
      this.setShowConnectPopup(false)
    },
    async connectAccount () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.$alert('<h1 class="popup-mobile-txt">Sorry...</h1> <div class="popup-mobile-desc">This function is not available on mobile. </div>', '', {
          dangerouslyUseHTMLString: true
        })
        return
      }
      const isFirefox = typeof window.InstallTrigger !== 'undefined'
      const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
      if (isChrome) {
        if (!window.ethereum) {
          this.$alert('You have to install metamask extension ', 'Notification', {
            confirmButtonText: 'OK',
            confirmButtonClass: 'confirm-button'

          })
          window.chrome.webstore.install()
          return
        }
      } else if (isFirefox) {
        if (!window.ethereum)
          window.InstallTrigger.install({
            MetaMask: {
              URL: 'https://addons.mozilla.org/firefox/downloads/file/3663669/metamask-8.1.2-an+fx.xpi'
            }
          })
      }

      await this.connectAcc()

      if (this.accountConnected) {
        this.setShowConnectPopup(false)
      }
      // await this.$store.dispatch('getTransactionDetail', { app: this.$apolloProvider, ids: this.accounts[0] })
    //   this.checkContributed()
    }
  }
}
</script>

<style lang="scss" >
.confirm-button {
  background-color: $color-grey-dark!important;
  border-color: $color-grey-dark!important;
  &:hover {
    background-color: $color-grey-dark;
  }
}
.popup{
  position: absolute;
  .connect-wallet-popup {
    .el-dialog{
      margin-top: 25vh!important;
    }
    .el-dialog__header{
      margin-bottom: 20px;
    }
  }
  .content-popup {
    color: $color-grey-dark;
    padding: 0px 28px 57px 28px;
    .content-desc {
      margin-bottom: 20px;
    }
    .name-title{
      font-size: $f8;
      font-weight: $fw-bold;
    }
    .description {
      font-size: $f7;
      min-height: 60px;
      line-height: 24px;
      margin-bottom: 6px;
      word-break: break-word;
    }
    .group-checkbox {
      border-top: thin solid #E5E5E5;
      border-bottom: thin solid #E5E5E5;
      padding: 20px 0px;
      .checkbox-item {
        label{
          word-break: break-word!important;
        }
        &.last {
          margin-bottom: 0;
        }
      }
    }
    .claim-button {
      // margin-left: 15px;
      padding: 11px 19px;
      vertical-align: top;
    }
    .meet-mona-title {
      font-weight: $fw-bold;
      font-size: $f8;
    }
    .el-input-number {
      width: 268px;
    }
    .note {
      font-weight: $fw-bold;
      margin-top:10px;
      span {
        font-size: $f10;
        font-weight: $fw-normal;
        color: $color-grey-dusty;
      }
    }
    .claim-nft-input {
      display: inline-block;
      max-width: 268px;
      .error-message {
        font-size: $f10;
        color: $color-red;
      }
    }
  }
  .el-dialog__header{
    padding-bottom: 10px;
  }
  input[type='checkbox'],
  input[type='radio'] {
    --active: #111111;
    --active-inner: #fff;
    --focus: 2px rgba(39, 94, 254, .3);
    --border: #BBC1E1;
    --border-hover: #111111;
    --background: #fff;
    --disabled: #F6F8FF;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 21px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background .3s, border-color .3s, box-shadow .2s;
    &:after {
      content: '';
      display: block;
      left: 0;
      top: 0;
      position: absolute;
      transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
    }
    &:checked {
      --b: var(--active);
      --bc: var(--active);
      --d-o: .3s;
      --d-t: .6s;
      --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
    }
    &:disabled {
      --b: var(--disabled);
      cursor: not-allowed;
      opacity: .9;
      &:checked {
        --b: var(--disabled-inner);
        --bc: var(--border);
      }
      & + label {
        cursor: not-allowed;
      }
    }
    &:hover {
      &:not(:checked) {
        &:not(:disabled) {
          --bc: var(--border-hover);
        }
      }
    }
    &:focus {
      box-shadow: 0 0 0 var(--focus);
    }
    &:not(.switch) {
      width: 21px;
      &:after {
        opacity: var(--o, 0);
      }
      &:checked {
        --o: 1;
      }
    }
    & + label {
      font-size: 14px;
      line-height: 21px;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      margin-left: 4px;
      width: calc(100% - 35px);
      vertical-align: middle;
    }
  }
  input[type='checkbox'] {
    &:not(.switch) {
      border-radius: 3px;
      vertical-align: top;
      &:after {
        width: 5px;
        height: 9px;
        border: 2px solid var(--active-inner);
        border-top: 0;
        border-left: 0;
        left: 7px;
        top: 4px;
        transform: rotate(var(--r, 20deg));
      }
      &:checked {
        --r: 43deg;
      }
    }
    &.switch {
      width: 38px;
      border-radius: 11px;
      &:after {
        left: 2px;
        top: 2px;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        background: var(--ab, var(--border));
        transform: translateX(var(--x, 0));
      }
      &:checked {
        --ab: var(--active-inner);
        --x: 17px;
      }
      &:disabled {
        &:not(:checked) {
          &:after {
            opacity: .6;
          }
        }
      }
    }
  }
  input[type='radio'] {
    border-radius: 50%;
    &:after {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--active-inner);
      opacity: 0;
      transform: scale(var(--s, .7));
    }
    &:checked {
      --s: .5;
    }
  }
  .dialog-connect-wallet {
    .el-dialog {
      &__body {
        padding: 0 48px 56px 48px;
      }
    }
    .metamask-wallet {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: thin solid $color-mercury-2;
      padding: 18px;
      color: $color-grey-dark;
      .metamask {
        span {
          font-size: $f7;
          font-weight: $fw-bold;
          vertical-align: middle;
          margin-right: 10px;
          color: #000;
        }
        img {
          vertical-align: middle;
        }
        button {
          padding: 11px 16px;
        }
      }
    }
  }
  .el-input {
    input {text-align: left;}
  }
}
@media (max-width: 640px) {
  .mobile-display-only{
    display: block;
  }
  .desktop-display-only{
    display: none;
  }
  .claim-popup {
    .dialog-connect-wallet {
      .el-dialog {
        &__title {
          width: 75%;
          display: block;
        }
        &__body {
          padding: 0 20px 20px 20px;
        }
      }
      .metamask-wallet {
        flex-direction: column;
        align-items: flex-start;
        button {
          width: 100%;
        }
        .metamask {
          margin-bottom: 17px;
           margin-left: auto;
           margin-right: auto;
        }
      }
    }
  }
}

@media (max-width: 519px) {

  .claim-button {
      margin-top: 10px;
      padding: 11px 19px;
      vertical-align: top;
    }
}

@media (max-width: 1300px) {
  .el-dialog {
    margin-top: 5vh!important;
  }
  .description {
     font-size: 15px!important;
  }
  .el-dialog__body {
    padding: 20px 10px;
  }
  .el-dialog__header {
    padding:38px;
  }
}

.popup-mobile-desc {
  text-align: center;
  font-size: $f8!important ;
  font-weight: $fw-normal;

}
.popup-mobile-txt {
  text-align: center;
  font-size: $f6;
  font-weight: $fw-black;

}
</style>
