<template>
  <div class="error-page">
    <h1 class="title">
      404 error.
    </h1>
    <p class="message">
      Sorry, we couldn’t find this page.
    </p>
  </div>
</template>

<style lang="scss">
  .error-page {
    padding: 13.5vh 60px 60px 13vw;
    .title {
      font-size: $f1;
      font-weight: $fw-black;
      line-height: 70px;
      margin-bottom: 12px;
    }
    .message {
      max-width: 59%;
      font-size: $f7;
      line-height: 24px;
      a {
        text-decoration: underline;
      }
    }
  }
  @media (max-width: 640px) {
    .error-page {
      padding: 8vh 16px 16px 16px;
      .title {
        font-size: $f3;
      }
      .message {
        font-size: $f8;
        max-width: 80%;
      }
    }
  }
  @media (max-width: 768px) {
    .footer-error-page {
      position: absolute !important;
    }
  }
</style>
