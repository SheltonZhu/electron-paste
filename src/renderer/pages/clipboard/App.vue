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
      <el-header>
        <favorites-bar
          :labelFontColor="appConfig.favoritesFontColor"
          :labelFontColorSelect="appConfig.favoritesFontColorSelected"
          :labelBgColorSelect="appConfig.favoritesBgColorSelected"
        />
      </el-header>
      <el-main>
        <clipboard :table="table" :clipboardData="this.clipboardData" />
      </el-main>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { hideAndPaste } from '../../ipc';
import { init as initShortcut } from '../../shortcut';
import { getInitConfig } from '../../ipc';
import { FavoritesBar } from '../../views/clipboard/FavoritesBar';
import { Clipboard } from '../../views/clipboard/Clipboard';

export default {
  components: { FavoritesBar, Clipboard },
  mounted() {
    // 启动应用时获取初始化数据
    getInitConfig();
    initShortcut(this.appConfig);
    this.$nextTick(() => {
      this.init();
    });
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
    init() {
      this.initFileDragEvent();
    },
    initFileDragEvent() {
      const holder = document.getElementById('home');
      holder.ondragover = () => false;
      holder.ondragleave = () => false;
      holder.ondragend = () => false;
      holder.ondrop = (e) => {
        e.preventDefault();
        for (const f of e.dataTransfer.files) {
          console.log('File(s) you dragged here: ', f.path);
          console.log(f.name, f.type, f.size);
        }
        return false;
      };
    },
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
