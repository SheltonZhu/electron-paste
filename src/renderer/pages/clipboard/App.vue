<template>
  <div
    id="app"
    class="bg"
    :style="{
      'background-image': appConfig.enableBackgroundPic
        ? appConfig.backgroundPic
          ? backgroundPicUrl
          : defaultBgUrl
        : 'none',
    }"
  >
    <div
      style="height: 472px"
      :style="{
        'background-color': appConfig.backgroundColor,
        'backdrop-filter': appConfig.enableBackgroundBlur
          ? appConfig.backgroundBlurValue
            ? 'saturate(180%) blur(' + appConfig.backgroundBlurValue + 'px)'
            : 'saturate(180%) blur(5px)'
          : 'none',
      }"
    >
      <el-button @click="copy">复制</el-button>
      <el-button @click="paste">粘贴</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { hideAndPaste } from '../../ipc';
import { init as initShortcut } from '../../shortcut';
import { getInitConfig } from '../../ipc';

export default {
  components: {},
  mounted() {
    // 启动应用时获取初始化数据
    getInitConfig();
    initShortcut(this.appConfig);
  },
  data() {
    return {
      defaultBgUrl: 'url("../static/bg/bg1.jpg")',
    };
  },
  computed: {
    ...mapState(['appConfig']),
    backgroundPicUrl() {
      return 'url("' + this.appConfig.backgroundPic + '")';
    },
  },
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
<style>
body {
  margin: 0 auto;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.bg {
  height: 472px;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
