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

export default {
  components: { TitleBar, NavMenu, Personalization },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
<style>
body {
  margin: unset;
  background: #eae9ea;
}

#app {
  background: #eae9ea;
}

.nav-menu {
  background: #d6d0d5;
  text-align: center;
  height: 40px;
}

.content {
  margin-top: 10px;
}
</style>
