<template>
  <div id="app">
    <div class="title-bar" style="-webkit-app-region: drag">
      <title-bar />
    </div>
    <div class="nav-menu">
      <nav-menu />
    </div>
    <div class="content">
      <router-view>
        <personalization />
      </router-view>
    </div>
    <!--    <input v-model="href"/>-->
  </div>
</template>
<script>
import TitleBar from "../../components/TitleBar";
import NavMenu from "../../views/setting/NavMenu";
import { mapActions } from "vuex";
import Personalization from "../../views/setting/Personalization";

export default {
  components: { TitleBar, NavMenu, Personalization },
  data() {
    return {};
  },
  computed: {
    href: {
      get() {
        return this.$store.state.href;
      },
      set(value) {
        this.changeTo(value);
      },
    },
  },
  methods: {
    ...mapActions({ changeTo: "changeHref" }),
  },
};
</script>
<style>
body {
  margin: unset;
  background: #eae9ea;
}

#app {
  background: #fff;
}

.nav-menu {
  background: #d6d0d5;
  text-align: center;
  height: 40px;
}

.content {
  background: #eae9ea;
}
</style>
