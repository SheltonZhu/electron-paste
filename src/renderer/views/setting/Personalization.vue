<template>
  <div class="personalization">
    <el-row class="row">
      <el-col :span="12">
        <div class="type">背景虚化</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="enableBackgroundBlur"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="12">
        <div class="type">使用背景图</div>
      </el-col>
      <el-col :span="12">
        <div class="switch">
          <el-switch
            v-model="enableBackgroundPic"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          >
          </el-switch>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Personalization',
  data() {
    return {
      activeColor: '#15bbf9',
      inactiveColor: '#aaabab',
    };
  },
  computed: {
    ...mapState(['appConfig']),
    enableBackgroundBlur: {
      get() {
        return this.appConfig.enableBackgroundBlur;
      },
      set(value) {
        this.changeConfig({ enableBackgroundBlur: value });
      },
    },
    enableBackgroundPic: {
      get() {
        return this.appConfig.enableBackgroundPic;
      },
      set(value) {
        this.changeConfig({ enableBackgroundPic: value });
      },
    },
    backgroundColor: {
      get() {
        return this.appConfig.backgroundColor;
      },
      set(value) {
        this.changeConfig({ backgroundColor: value });
      },
    },
    favoritesFontColor: {
      get() {
        return this.appConfig.favoritesFontColor;
      },
      set(value) {
        this.changeConfig({ favoritesFontColor: value });
      },
    },
    favoritesFontColorSelected: {
      get() {
        return this.appConfig.favoritesFontColorSelected;
      },
      set(value) {
        this.changeConfig({ favoritesFontColorSelected: value });
      },
    },
    favoritesBgColorSelected: {
      get() {
        return this.appConfig.favoritesBgColorSelected;
      },
      set(value) {
        this.changeConfig({ favoritesBgColorSelected: value });
      },
    },
  },
  methods: {
    ...mapActions(['changeConfig']),
  },
};
</script>

<style scoped></style>
