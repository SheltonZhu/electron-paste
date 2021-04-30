<template>
  <div id="app">
    <h1>Hello clipboard!</h1>
    <el-button @click="copy">复制</el-button>
    <el-button @click="paste">粘贴</el-button>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { hideAndPaste } from '../../ipc';
export default {
  data() {
    return {};
  },
  computed: mapState(['href']),
  methods: {
    copy() {
      hideAndPaste({ content: this.href });
    },
    paste() {
      hideAndPaste({ content: this.href, directPaste: true });
    },
  },
};
</script>
