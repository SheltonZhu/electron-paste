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
      <el-menu-item
        :index="PAGE_PERSONALIZATION.page"
        :route="{ name: PAGE_PERSONALIZATION.name }"
        ><i class="el-icon-magic-stick" />个性化
      </el-menu-item>
      <el-menu-item
        :index="PAGE_GENERAL.page"
        :route="{ name: PAGE_GENERAL.name }"
        ><i class="el-icon-set-up" />通用
      </el-menu-item>
      <el-menu-item
        :index="PAGE_SHORTCUT.page"
        :route="{ name: PAGE_SHORTCUT.name }"
        ><i class="el-icon-position" />快捷键
      </el-menu-item>
      <el-menu-item :index="PAGE_RULES.page" :route="{ name: PAGE_RULES.name }"
        ><i class="el-icon-s-marketing" />规则
      </el-menu-item>
      <!--      <el-menu-item index="5" :route="{ name: 'about' }"
        ><i class="el-icon-upload" />同步</el-menu-item
      >-->
      <el-menu-item :index="PAGE_ABOUT.page" :route="{ name: PAGE_ABOUT.name }"
        ><i class="el-icon-info" />关于
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
  PAGE_PERSONALIZATION,
  PAGE_SHORTCUT,
  PAGE_ABOUT,
  PAGE_GENERAL,
  PAGE_RULES,
} from '../../../shared/env';

export default {
  name: 'NavMenu',
  data() {
    return {
      PAGE_PERSONALIZATION,
      PAGE_SHORTCUT,
      PAGE_ABOUT,
      PAGE_GENERAL,
      PAGE_RULES,
    };
  },
  computed: {
    ...mapState(['page']),
  },
  methods: {
    ...mapActions(['changePage']),
    handleSelect(key, keyPath) {
      this.changePage({ page: key });
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
