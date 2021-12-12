<template>
  <div class="withdraw-wrap">
    <h2 class="confirm-card__title">
      Claim FOX
    </h2>
    <div class="withdraw-card confirm-card">
      <div class="balance-info-wrap">
        <h4 class="balance-info-wrap__suptitle">
          BALANCE
        </h4>
        <h2 class="balance-info-wrap__title-balance">
          {{ 0 }} FOX
        </h2>
      </div>
      <div class="slide-block">
        <div class="slide-wrap">
          <div class="slide-inline">
            <span class="slider-mask" />
            <input type="text" class="slide-input">
            <span class="blue-mona small center">FOX</span>
          </div>
          <div class="percents">
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      <div class="btn-block small">
        <button class="btn-stake withdraw-btn" @click="redirect('/confirm-page')">
          withdraw fox
        </button>
      </div>
    </div>
    <div class="links-block">
      <!-- <nuxt-link to="https://digitalax.gitbook.io/digitalax/tokens" class="link fw-normal"> -->
      <a href="https://digitalax.gitbook.io/digitalax/tokens" target="_blank" class="link fw-normal">
        What is FOX?
      </a>
      <!-- </nuxt-link> -->
      <!-- <nuxt-link to="https://digitalax.gitbook.io/digitalax/tokens#usage" class="link fw-normal"> -->
      <a href="https://digitalax.gitbook.io/digitalax/tokens#usage" target="_blank" class="link fw-normal">
        What can I do with my FOX?
      </a>
      <!-- </nuxt-link> -->
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    const sliderElement = document.querySelector('.slider-mask')
    const timer = setInterval(() => {
      const number = parseFloat(sliderElement.style.width.split('%')[0])
      if (number) {
        if (number === 86) {
          clearInterval(timer)
        } else {
          sliderElement.style.width = number + 1 + '%'
        }
      } else {
        sliderElement.style.width = 1 + '%'
      }
    }, 10)
  },
  methods: {
    redirect (url) {
      this.$router.push({ path: url })
    }
  }
}
</script>

<style scoped>

</style>
