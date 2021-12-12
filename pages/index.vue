<template lang="pug">
  .page
</template>

<script>
export default {
  asyncData ({ store, redirect, route }) {
    redirect({ name: 'homepage' })
  }
}
</script>
