<template>
  <div>
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
    <el-row class="row">
      <el-col :span="12">
        <div class="type">在通知区域显示图标</div>
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
        <div class="type">卡片图标</div>
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
    <el-row class="row vertically-center">
      <el-col :span="12">
        <div class="type">历史记录容量</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-slider
            tooltip-class="capacity-slider"
            :show-tooltip="false"
            v-model="historyCapacity"
            :min="0"
            :max="4"
            :step="1"
            :marks="{ 0: '10', 1: '50', 2: '100', 3: '500', 4: '∞' }"
            @change="changeNum"
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
    <el-row class="row">
      <el-col :offset="12" :span="12">
        <div>
          <el-button class="clear-history" @click="clearHistory">
            清除剪贴板历史
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { syncConfig } from '../../ipc';

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
        this.appConfig.autoLaunch = value;
        syncConfig(this.appConfig);
      },
    },
    directPaste: {
      get() {
        return this.appConfig.directPaste;
      },
      set(value) {
        this.appConfig.directPaste = value;
        syncConfig(this.appConfig);
      },
    },
    enableHideWhenBlur: {
      get() {
        return this.appConfig.enableHideWhenBlur;
      },
      set(value) {
        this.appConfig.enableHideWhenBlur = value;
        syncConfig(this.appConfig);
      },
    },
    enableTrayIcon: {
      get() {
        return this.appConfig.enableTrayIcon;
      },
      set(value) {
        this.appConfig.enableTrayIcon = value;
        syncConfig(this.appConfig);
      },
    },
    cardIconEnable: {
      get() {
        return this.appConfig.cardIconEnable;
      },
      set(value) {
        this.appConfig.cardIconEnable = value;
        syncConfig(this.appConfig);
      },
    },
    historyCapacity: {
      get() {
        return this.appConfig.historyCapacity;
      },
      set(value) {
        this.appConfig.historyCapacity = value;
        const historyCapacityNumMap = {
          0: '10',
          1: '50',
          2: '100',
          3: '500',
          4: '∞',
        };
        this.appConfig.historyCapacityNum = historyCapacityNumMap[value];
        syncConfig(this.appConfig);
      },
    },
  },
  methods: {
    clearHistory() {},
    changeNum() {},
  },
};
</script>

<style scoped></style>
