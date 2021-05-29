<template>
  <div id="app">
    <div class="title-bar" style="-webkit-app-region: drag">
      <title-bar />
    </div>
    <div class="nav-menu">
      <nav-menu />
    </div>
    <div class="content">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import TitleBar from '../../components/TitleBar';
import NavMenu from '../../views/setting/NavMenu';
import Personalization from '../../views/setting/Personalization';
import { getInitConfig, hideSetting } from '../../ipc';
import Mousetrap from 'mousetrap';
export default {
  components: { TitleBar, NavMenu, Personalization },
  mounted() {
    // 启动应用时获取初始化数据
    getInitConfig();
    this.initShortcut();
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    initShortcut() {
      Mousetrap.bind('esc', () => {
        hideSetting();
      });
    },
  },
};
</script>
<style>
/* 引入图标 */
[class^='icon-iconfont'],
[class*=' icon-iconfont'] {
  font-family: 'iconfont' !important;
  font-size: 18px !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0 auto;
  background: #eae9ea;
}

#app {
  background: #eae9ea;
}

#app > .nav-menu {
  background: #d6d0d5;
  text-align: center;
  height: 40px;
}

#app > .content {
  margin-top: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
