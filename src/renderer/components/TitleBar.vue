<template>
  <div class="fake-title-bar">
    <div class="handle-bar">
      <el-button
        circle
        class="el-icon-minus"
        @click="minimizeWindow"
      ></el-button>
      <el-button circle class="el-icon-close" @click="closeWindow"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBar',
  methods: {
    closeWindow() {
      this.$electron.remote.getCurrentWindow().hide();
    },
    minimizeWindow() {
      this.$electron.remote.getCurrentWindow().minimize();
    },
  },
};
</script>

<style scoped>
.fake-title-bar {
  text-align: right;
  background: #d6d0d5;
  padding: 2px 0;
}

.fake-title-bar .handle-bar {
  margin-right: 5px;
  margin-top: 4px;
}

.fake-title-bar .el-button {
  padding: 4px;
  font-weight: bold;
  -webkit-app-region: no-drag;
}

.fake-title-bar .el-icon-close {
  background: #ff6059;
  border: 1px solid #e28a8a;
}

.fake-title-bar .el-icon-minus {
  background: #ffc259;
  border: 1px solid #e2bf8a;
}
</style>
