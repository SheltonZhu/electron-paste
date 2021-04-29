<template>
  <div class="menu-block">
    <el-menu
      :default-active="page"
      class="el-menu-bar"
      mode="horizontal"
      @select="handleSelect"
      background-color="#d6d0d5"
      text-color="#000"
      :router="true"
      active-text-color="#000"
    >
      <el-menu-item index="1" :route="{ path: '/personalization' }"
        ><i class="el-icon-magic-stick" />个性化</el-menu-item
      >
      <el-menu-item index="2" :route="{ path: '/general' }"
        ><i class="el-icon-cpu" />通用</el-menu-item
      >
      <el-menu-item index="3" :route="{ path: '/shortcut' }"
        ><i class="el-icon-position" />快捷键</el-menu-item
      >
      <el-menu-item index="4" :route="{ path: '/rules' }"
        ><i class="el-icon-s-marketing" />规则</el-menu-item
      >
      <el-menu-item index="5" :route="{ path: '/about' }"
        ><i class="el-icon-info" />关于</el-menu-item
      >
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NavMenu',
  data() {
    return {};
  },
  computed: {
    ...mapState(['page']),
  },
  methods: {
    ...mapActions(['changePage']),
    handleSelect(key, keyPath) {
      this.changePage(key);
    },
  },
};
</script>

<style scoped>
.menu-block {
  display: inline-block;
}

.el-menu.el-menu--horizontal,
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
  background: #b8b6ba !important;
}

.el-menu--horizontal > .el-menu-item:not(hover) {
  background: #d6d0d5 !important;
}

.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
  border-bottom: none;
}

.el-menu-item {
  padding: 0 15px;
}
</style>
<style></style>
