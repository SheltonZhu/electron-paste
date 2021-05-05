<template>
  <div id="app">
    <div class="title-bar" style="-webkit-app-region: drag">
      <title-bar />
    </div>
    <div class="nav-menu">
      <nav-menu />
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import TitleBar from '../../components/TitleBar';
import NavMenu from '../../views/setting/NavMenu';
import Personalization from '../../views/setting/Personalization';
// import { getInitConfig } from '../../ipc';

export default {
  components: { TitleBar, NavMenu, Personalization },
  mounted() {
    // 启动应用时获取初始化数据
    // getInitConfig();
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
<style>
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
</style>
