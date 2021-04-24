<template>
  <div id="app">
    <h1>Hello clipboard!</h1>
    <a href @click.prevent="open">
      <slot>{{ href }}</slot>
    </a>
  </div>
</template>
<script>
import { ipcRenderer, clipboard } from 'electron'
export default {
  data: () => {
    return {
      href: 'https://www.bilibili.com'
    }
  },
  methods: {
    open () {
      ipcRenderer.send('test')
      clipboard.writeText(this.href)
    }
  }
}
</script>
