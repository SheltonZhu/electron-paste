<template>
  <div id="app">
    <h1>Hello clipboard!</h1>
    <el-button @click="copy">复制</el-button>
    <el-button @click="paste">粘贴</el-button>
    <h1>{{ appConfig }}</h1>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { hideAndPaste } from '../../ipc';

export default {
  data() {
    return {};
  },
  computed: mapState(['appConfig']),
  methods: {
    copy() {
      hideAndPaste({ content: 'copy only' });
    },
    paste() {
      hideAndPaste({
        content: 'direct paste',
        directPaste: this.appConfig.directPaste,
      });
    },
  },
};
</script>
