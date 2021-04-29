<template>
  <div id="app">
    <h1>Hello clipboard!</h1>
    <a href @click.prevent="open">{{ href }}</a>
  </div>
</template>
<script>
import { ipcRenderer, clipboard } from 'electron'
import { mapState } from 'vuex'

export default {
  data: () => {
    return {}
  },
  computed: mapState(['href']),
  methods: {
    open () {
      ipcRenderer.send('test', this.href)
      this.$electron.remote.clipboard.writeText(this.href)
    }
  }
}
</script>
