<template>
  <div id="app">
    <h1>Hello Settings!</h1>
    <input v-model="href"/>
    <h1>{{href}}</h1>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data: () => {
    return {}
  },
  computed: {
    href: {
      get () {
        return this.$store.state.href
      },
      set (value) {
        this.changeTo(value)
      }
    }
  },
  methods: {
    ...mapActions({ changeTo: 'changeHref' }),
  }
}
</script>
