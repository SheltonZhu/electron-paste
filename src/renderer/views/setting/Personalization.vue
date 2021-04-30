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
    背景颜色
    <el-color-picker
      v-model="backgroundColor"
      show-alpha
      :predefine="predefineBackgroundColors"
    >
    </el-color-picker>
    收藏字体颜色
    <el-color-picker
      v-model="favoritesFontColor"
      show-alpha
      :predefine="predefineFavoritesFontColors"
    >
    </el-color-picker>
    收藏选中字体颜色
    <el-color-picker
      v-model="favoritesFontColorSelected"
      show-alpha
      :predefine="predefineFavoritesFontColorsSelected"
    >
    </el-color-picker>
    收藏选中背景颜色
    <el-color-picker
      v-model="favoritesBgColorSelected"
      show-alpha
      :predefine="predefineFavoritesBgColorSelected"
    >
    </el-color-picker>
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
      predefineBackgroundColors: [
        'rgba(255, 255, 255, 0.72)', // 原版
        'rgba(255, 230, 230, 0.68)', // 紫粉套
        'rgba(144, 240, 144, 0.5)', // 蓝黄套
        'rgba(157, 1, 145, 0.27)', // 粉黄蓝
        'rgba(208, 232, 242, 0.52)', // 灰蓝
        'rgba(111, 74, 142, 0.71)', // 黑紫
        'rgba(255, 69, 0, 0.68)',
        'hsla(209, 100%, 56%, 0.73)',
        'rgba(35, 37, 35, 0.71)',
        'rgb(255, 120, 0)',
        'hsl(181, 100%, 37%)',
        'rgba(250, 212, 0, 1)',
      ],
      predefineFavoritesFontColors: [
        'rgba(44, 62, 80, 1)', // 原版
        'rgba(97, 85, 166, 1)', // 紫粉套
        'rgba(21, 62, 144, 1)', // 蓝黄套
        'rgba(18, 0, 120, 1)', // 粉黄蓝
        'rgba(69, 98, 104, 1)', // 灰蓝
        'rgba(5, 5, 5, 1)', // 黑紫
        'rgba(99, 145, 230, 1)',
        'rgba(249, 252, 44, 1)',
        'rgba(239, 38, 85, 1)',
        'rgba(202, 38, 239, 1)',
      ],
      predefineFavoritesFontColorsSelected: [
        'rgba(255, 255, 255, 1)', // 原版
        'rgba(255, 171, 225, 1)', // 紫粉套
        'rgba(255, 250, 164, 1)', // 蓝黄套
        'rgba(254, 205, 26, 1)', // 粉黄蓝
        'rgba(252, 248, 236, 1)', // 灰蓝
        'rgba(235, 235, 235, 1)', // 黑紫
      ],
      predefineFavoritesBgColorSelected: [
        'rgba(185, 185, 185, 0.82)', // 原版
        'rgba(166, 133, 226, 1)', // 紫粉套
        'rgba(14, 73, 181, 1)', // 蓝黄套
        'rgba(253, 58, 105, 1)', // 粉黄蓝
        'rgba(121, 163, 177, 1)', // 灰蓝
        'rgba(34, 31, 59, 1)', // 黑紫
      ],
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
