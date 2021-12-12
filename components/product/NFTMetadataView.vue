<template>
  <div class="product-detail">
    <div class="product-detail-container">
      <div class="product-details-section">
        <div class="product-img-container">
          <img class="product-img" :src="product.img" alt="">
        </div>
        <div class="product-attribute">
          <p class="product-title">
            {{ product.title }}
          </p>
          <div class="product-description">
            <p class="has-text-weight-semibold">
              Description:
            </p>
            <p>
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

// import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NFTMetadataView',
  props: {
    // eslint-disable-next-line
    product: {
      type: Object,
      require: true,
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      img: {
        type: String,
        required: true
      }
    }
  },
  data () {
    return {
      loading: false,
      localProduct: null
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail{
    padding: 3rem 1.5rem;
    color: #000;

    &-container{
        margin-top: 45pt;
        width: 100%;
        padding: 50px;

        padding-bottom: 80px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-bottom: 30px;
        display: flex;

        .product-details-section {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          max-width: 100%;
          margin: auto;

          @media (max-width: 780px) {
            display: flex;
            flex-direction: column;
          }
        }

        .product-img-container{
            flex-basis: 50%;
            width: 100%;
            text-align: center;
            margin:0 auto;
            .product-img{
                max-height: 400px;
                max-width: none;
                margin:0 -100%;
                max-width: 400px;
            }
        }

        .product-attribute{
            display: flex;
            flex-basis: 50%;
            flex-direction: column;
            h1{
                color: black;
                font-size: 22px;
            }

            .product-title{
                font-size: 22px;
                color: black;
                padding-bottom: 10px;
                text-align: left;
            }

            .product-description{
                margin-top: 30px;
                font-size: 14px;
                text-align: left;
                p{
                    color: rgb(43, 43, 43);
                }
            }
        }

        @media (max-width: 540px) {

          padding: 20px;
          padding-top: 40px;

            .product-img-container{
              display: block;
              flex-basis: 100%;
              width: 100%;
              .product-img{
                width: 250px;
              }
            }
            .product-title{
              font-size: 17px !important;
              text-align: center!important;
            }

            .product-attribute-label{
              font-size: 14px;
            }
            .product-attribute{
              display: block;
              justify-content: space-between;
                p{
                  font-size: 13px;
                }
            }
        }
    }
}
</style>
