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
      <el-header>
        <nav-bar
          :favoritesFontColor="appConfig.favoritesFontColor"
          :favoritesFontColorSelected="appConfig.favoritesFontColorSelected"
          :favoritesBgColorSelected="appConfig.favoritesBgColorSelected"
        />
      </el-header>
      <el-main>
        <clipboard-panel />
      </el-main>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { hideAndPaste } from '../../ipc';
import { init as initShortcut } from '../../shortcut';
import { getInitConfig } from '../../ipc';
import NavBar from '../../views/clipboard/NavBar';
import ClipboardPanel from '../../views/clipboard/ClipboardPanel';

export default {
  components: {
    NavBar,
    ClipboardPanel,
  },
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
    ...mapState(['appConfig', 'favorite']),
    backgroundPicUrl() {
      return 'url("' + this.appConfig.backgroundPic + '")';
    },
  },
  methods: {
    init() {
      this.initFileDragEvent();
    },
    initFileDragEvent() {
      const holder = document.getElementById('app');
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

.el-main {
  padding: 0 20px !important;
  height: 410px;
}

.el-header {
  height: unset !important;
}

.el-message-box__wrapper {
  backdrop-filter: saturate(180%) blur(5px);
}

.el-message-box {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px);
}
</style>
