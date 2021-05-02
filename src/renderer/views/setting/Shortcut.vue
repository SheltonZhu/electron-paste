<template>
  <div>
    <el-divider>全局快捷键</el-divider>

    <el-row
      class="row vertically-center"
      v-for="(funcText, funcName) in globalShortcutMaps"
      :key="funcName"
    >
      <el-col class="type">
        {{ funcText }}
      </el-col>
      <el-col>
        <el-input
          style="width: 200px"
          v-model="form.globalShortcuts[funcName].key"
          readonly
          :disabled="!form.globalShortcuts[funcName].enable"
          @keydown.native="(e) => keydown(e, 'globalShortcuts', funcName)"
          @keyup.native="(e) => keyup(e, 'globalShortcuts', funcName)"
        >
        </el-input>
      </el-col>
    </el-row>

    <el-divider>窗口快捷键</el-divider>

    <el-row
      class="row vertically-center"
      v-for="(funcText, funcName) in windowShortcutsMaps"
      :key="funcName"
    >
      <el-col class="type">
        {{ funcText }}
      </el-col>
      <el-col>
        <el-input
          style="width: 200px"
          v-model="form.windowShortcuts[funcName].key"
          readonly
          :disabled="!form.windowShortcuts[funcName].enable"
          @keydown.native="(e) => keydown(e, 'windowShortcuts', funcName)"
          @keyup.native="(e) => keyup(e, 'windowShortcuts', funcName)"
        >
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { debounce } from '../../../shared/utils';

export default {
  name: 'Shortcut',
  data() {
    const appConfig = this.$store.state.appConfig;
    return {
      globalShortcutMaps: {
        showClipboard: '呼出剪贴板',
      },
      windowShortcutsMaps: {
        hideClipboard: '隐藏剪贴板',
      },
      form: {
        globalShortcuts: appConfig.globalShortcuts,
        windowShortcuts: appConfig.windowShortcuts,
      },
      funcKeys: new Set(),
      actionKey: '',
    };
  },
  // computed: mapState(['appConfig']),
  methods: {
    ...mapActions(['changeConfig']),
    changeConfigDebounce: debounce(function (config) {
      this.changeConfig(config);
    }, 100),
    keydown: function (e) {
      e.preventDefault();
      if (e.metaKey) {
        this.funcKeys.add('Command');
      }
      if (e.ctrlKey) {
        this.funcKeys.add('Ctrl');
      }
      if (e.shiftKey) {
        this.funcKeys.add('Shift');
      }
      if (e.altKey) {
        this.funcKeys.add('Alt');
      }

      // if (e.) {
      //   this.funcKeys.add('Alt')
      // }
      // 不包括上述组合键
      if ([16, 17, 18, 19, 91, 93].indexOf(e.keyCode) < 0) {
        this.actionKey = e.key.toUpperCase();
      }
    },
    keyup: debounce(function (e, parent, field) {
      if (this.funcKeys.size || this.actionKey) {
        const keys = Array.from(this.funcKeys);
        if (this.actionKey) {
          keys.push(this.actionKey);
        }
        const shortcutStr = keys.join('+');
        // 全局快捷键的判断
        if (parent === 'globalShortcuts') {
          if (this.$electron.remote.globalShortcut.isRegistered(shortcutStr)) {
            this.$message({
              showClose: true,
              message: `快捷键 ${shortcutStr} 已被注册，请更换`,
              type: 'error',
            });
            return;
          }
        }
        this.form[parent][field].key = shortcutStr;
        this.funcKeys.clear();
        this.actionKey = '';
        this.changeConfigDebounce(this.form);
      }
    }, 200),
  },
};
</script>

<style scoped>
.row {
  padding: 10px 5px;
}

.type {
  text-align: right;
}

.type:after {
  content: '：';
  text-align: left;
}

.vertically-center {
  display: flex;
  /*justify-content: center;*/
  align-items: center;
}
</style>
