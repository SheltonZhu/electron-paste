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
          :value="appConfig.globalShortcuts[funcName].key"
          readonly
          :disabled="!appConfig.globalShortcuts[funcName].enable"
          @blur="clearCache"
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
          :value="appConfig.windowShortcuts[funcName].key"
          readonly
          :disabled="!appConfig.windowShortcuts[funcName].enable"
          @blur="clearCache"
          @keydown.native="(e) => keydown(e, 'windowShortcuts', funcName)"
          @keyup.native="(e) => keyup(e, 'windowShortcuts', funcName)"
        >
        </el-input>
      </el-col>
    </el-row>
    <!--    显示下一个标签-->
    <!--    Alt + ]-->
    <!--    显示上一个标签-->
    <!--    Alt + [-->
    <!--    快速粘贴-->
    <!--    Alt + 1..9-->
    <!--    搜索-->
    <!--    Alt + S-->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { debounce, clone } from '../../../shared/utils';

export default {
  name: 'Shortcut',
  data() {
    return {
      globalShortcutMaps: {
        showClipboard: '呼出剪贴板',
      },
      windowShortcutsMaps: {
        hideClipboard: '隐藏剪贴板',
      },
      funcKeys: new Set(),
      actionKey: '',
    };
  },
  computed: mapState(['appConfig']),
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
        const config = clone(this.appConfig, true);
        try {
          if (parent === 'globalShortcuts') {
            if (
              this.$electron.remote.globalShortcut.isRegistered(shortcutStr)
            ) {
              this.$message({
                showClose: true,
                message: `快捷键 ${shortcutStr} 已被注册，请更换`,
                type: 'error',
              });
              return;
            }
          }
          config[parent][field].key = shortcutStr;
          this.changeConfigDebounce(config);
        } catch (e) {
          // console.log(e)
        } finally {
          this.clearCache();
        }
      }
    }, 200),
    clearCache() {
      this.funcKeys.clear();
      this.actionKey = '';
    },
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
