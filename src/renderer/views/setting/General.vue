<template>
  <div class="general">
    <el-divider>基本设置</el-divider>

    <el-row class="row">
      <el-col :span="12">
        <div class="type">开机启动</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="autoLaunch"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="12">
        <div class="type">开启 Direct Paste</div>
        <div class="tip">自动插入片段到当前应用</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="directPaste"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>

    <el-row class="row">
      <el-col :span="12">
        <div class="type">纯文本模式</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="textMode"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>
    <el-divider>图标</el-divider>

    <el-row class="row">
      <el-col :span="12">
        <div class="type">在通知区域显示托盘图标</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="enableTrayIcon"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="12">
        <div class="type">显示卡片图标</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="cardIconEnable"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>

    <el-divider>剪贴板</el-divider>

    <el-row class="row">
      <el-col :span="12">
        <div class="type">窗口失焦隐藏剪贴板</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="enableHideWhenBlur"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>

    <el-row class="row vertically-center">
      <el-col :span="12">
        <div class="type">历史记录容量</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-slider
            style="width: 350px"
            tooltip-class="capacity-slider"
            :show-tooltip="false"
            v-model="historyCapacity"
            :min="0"
            :max="4"
            :step="1"
            :marks="{ 0: '10', 1: '50', 2: '100', 3: '500', 4: '∞' }"
          >
          </el-slider>
        </div>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col
        class="warn-info"
        :offset="12"
        :span="12"
        v-if="historyCapacity === 4"
      >
        ⚠设置为无限会使用更多的存储，进而导致卡顿⚠
      </el-col>
    </el-row>
    <div style="text-align: center">
      <el-button class="clear-history" @click="clearHistory">
        清除剪贴板历史
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { debounce } from '../../../shared/utils';
import { clearClipboardData, checkHistoryCapacity } from '../../ipc';

export default {
  name: 'General',
  data() {
    return {
      // switch color
      activeColor: '#15bbf9',
      inactiveColor: '#aaabab',
    };
  },
  computed: {
    ...mapState(['appConfig']),
    autoLaunch: {
      get() {
        return this.appConfig.autoLaunch;
      },
      set(value) {
        this.changeConfig({ autoLaunch: value });
      },
    },
    directPaste: {
      get() {
        return this.appConfig.directPaste;
      },
      set(value) {
        this.changeConfig({ directPaste: value });
      },
    },
    textMode: {
      get() {
        return this.appConfig.textMode;
      },
      set(value) {
        this.changeConfig({ textMode: value });
      },
    },
    enableHideWhenBlur: {
      get() {
        return this.appConfig.enableHideWhenBlur;
      },
      set(value) {
        this.changeConfig({ enableHideWhenBlur: value });
      },
    },
    enableTrayIcon: {
      get() {
        return this.appConfig.enableTrayIcon;
      },
      set(value) {
        this.changeConfig({ enableTrayIcon: value });
      },
    },
    cardIconEnable: {
      get() {
        return this.appConfig.cardIconEnable;
      },
      set(value) {
        this.changeConfig({ cardIconEnable: value });
      },
    },
    historyCapacity: {
      get() {
        return this.appConfig.historyCapacity;
      },
      set(value) {
        const historyCapacityNumMap = {
          0: '10',
          1: '50',
          2: '100',
          3: '500',
          4: '∞',
        };
        if (this.appConfig.historyCapacity !== value) {
          this.changeConfigDebounce({
            historyCapacity: value,
            historyCapacityNum: historyCapacityNumMap[value],
          });
        }
      },
    },
  },
  methods: {
    ...mapActions(['changeConfig']),
    changeConfigDebounce: debounce(function (config) {
      this.changeConfig(config);
      if (config.historyCapacityNum) {
        checkHistoryCapacity();
      }
    }, 100),
    clearHistory() {
      this.$confirm('清空剪贴板历史?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const affectedNum = clearClipboardData();
          this.$message({
            message: `${affectedNum} 条记录已删除！`,
            type: 'success',
            duration: 1000,
          });
        })
        .catch();
    },
  },
};
</script>

<style scoped>
.row {
  padding: 8px 5px;
}

.type {
  text-align: right;
}

.type:after {
  content: '：';
  text-align: left;
}

.tip {
  text-align: right;
  color: #aaabab;
  font-size: smaller;
  margin-top: 2px;
}

.tip:after {
  content: ' ';
}

.switch {
  margin: 0 10px;
}

.warn-info {
  color: #ffc259;
  font-size: small;
}

.clear-history {
  padding: 2px 20px;
}

.vertically-center {
  display: flex;
  align-items: center;
}
</style>
