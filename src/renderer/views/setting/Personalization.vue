<template>
  <div class="personalization">
    <!--  背景设置  -->
    <div>
      <el-divider>背景</el-divider>

      <!--   背景图 start   -->
      <div>
        <el-row class="row vertically-center">
          <el-col :span="6">
            <div class="type">使用背景图</div>
          </el-col>
          <el-col :span="4">
            <div class="switch">
              <el-switch
                v-model="enableBackgroundPic"
                :active-color="activeColor"
                :inactive-color="inactiveColor"
              >
              </el-switch>
            </div>
          </el-col>
          <el-col :span="4">
            <el-upload
              style="margin: 10px 0"
              class="upload-demo"
              action=""
              :limit="1"
              :before-upload="addLocalPic"
            >
              <el-button
                size="small"
                type="primary"
                :disabled="!appConfig.enableBackgroundPic"
                >浏览本地图片</el-button
              >
            </el-upload>
          </el-col>
          <el-col :span="6">
            <div class="type">背景颜色</div>
          </el-col>
          <el-col :span="4">
            <div class="switch">
              <el-color-picker
                v-model="backgroundColor"
                show-alpha
                :predefine="predefineBackgroundColors"
              ></el-color-picker>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="appConfig.enableBackgroundPic">
          <div class="bg-box" ref="bgBox" @wheel.prevent="onMouseWheel">
            <span v-for="(src, idx) in appConfig.backgroundPicList">
              <el-image
                :class="{ 'bg-selected': src === appConfig.backgroundPic }"
                class="bg-pic"
                :key="idx"
                :src="src"
                fit="cover"
                width="100px"
                @click="setBackgroundPic"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <el-button
                circle
                :style="{
                  padding: 0,
                  position: 'relative',
                  right: '25px',
                  bottom: '85px',
                  visibility:
                    src === appConfig.backgroundPic ? 'hidden' : 'visible',
                }"
                class="el-icon-close"
                @click="(e) => removeBackgroundPic(e, idx)"
              ></el-button>
            </span>
          </div>
        </el-row>
        <!--        <el-row class="vertically-center" v-if="appConfig.enableBackgroundPic">-->
        <!--          <el-input-->
        <!--            style="margin-right: 10px; width: 250px"-->
        <!--            placeholder="图片URI地址"-->
        <!--            v-model="newPicUrl"-->
        <!--            @keyup.enter.native="addBackgroundPic"-->
        <!--          >-->
        <!--            <el-button-->
        <!--              size="mini"-->
        <!--              slot="append"-->
        <!--              icon="el-icon-plus"-->
        <!--              @click="addBackgroundPic"-->
        <!--            ></el-button>-->
        <!--          </el-input>-->
        <!--        </el-row>-->
      </div>
      <!--   背景图 end   -->

      <el-row class="row vertically-center">
        <el-col :span="6">
          <div class="type">背景模糊</div>
        </el-col>
        <el-col :span="1">
          <div>
            <el-switch
              v-model="enableBackgroundBlur"
              :active-color="activeColor"
              :inactive-color="inactiveColor"
            >
            </el-switch>
          </div>
        </el-col>
        <el-col :span="6" class="bg-blur">
          <div class="type">背景模糊程度</div>
        </el-col>
        <el-col :span="11" class="bg-blur">
          <div class="switch" style="margin-left: 10px">
            <el-slider
              style="width: 350px"
              show-input
              :max="50"
              :min="1"
              v-model="backgroundBlurValue"
              :disabled="!appConfig.enableBackgroundBlur"
            ></el-slider>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--  收藏栏设置  -->
    <div>
      <el-divider>收藏栏</el-divider>
      <el-row class="row vertically-center">
        <el-col :span="6">
          <div class="type">字体颜色</div>
        </el-col>
        <el-col :span="3">
          <div class="switch">
            <el-color-picker
              v-model="favoritesFontColor"
              show-alpha
              :predefine="predefineFavoritesFontColors"
            >
            </el-color-picker>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="type">选中字体颜色</div>
        </el-col>
        <el-col :span="3">
          <div class="switch">
            <el-color-picker
              v-model="favoritesFontColorSelected"
              show-alpha
              :predefine="predefineFavoritesFontColorsSelected"
            ></el-color-picker>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="type">选中背景颜色</div>
        </el-col>
        <el-col :span="4">
          <div class="switch">
            <el-color-picker
              v-model="favoritesBgColorSelected"
              show-alpha
              :predefine="predefineFavoritesBgColorSelected"
            >
            </el-color-picker>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--  卡片设置  -->
    <div>
      <el-divider>卡片</el-divider>
      <el-row class="row vertically-center">
        <el-col :span="6">
          <div class="type">字体颜色</div>
        </el-col>
        <el-col :span="4">
          <div class="switch">
            <el-color-picker
              v-model="cardFontColor"
              show-alpha
              :predefine="predefineFavoritesFontColors"
            >
            </el-color-picker>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="type">背景颜色</div>
        </el-col>
        <el-col :span="3">
          <div class="switch">
            <el-color-picker
              v-model="cardBgColor"
              show-alpha
              :predefine="predefineFavoritesFontColorsSelected"
            ></el-color-picker>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="type">元信息字体颜色</div>
        </el-col>
        <el-col :span="4">
          <div class="switch">
            <el-color-picker
              v-model="cardMetaColor"
              show-alpha
              :predefine="predefineFavoritesBgColorSelected"
            >
            </el-color-picker>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { debounce } from '../../../shared/utils';
import { clone } from '../../../shared/utils';
import { isWin } from '../../../shared/env';
import path from 'path';

export default {
  name: 'Personalization',
  data() {
    return {
      newPicUrl: '',
      activeColor: '#4c96d7',
      inactiveColor: '#aaabab',
      predefineBackgroundColors: [
        '#FFFFFFB7', // 原版
        '#FFE6E6AD', // 紫粉套
        '#90F0907F', // 蓝黄套
        '#9D019144', // 粉黄蓝
        '#D0E8F284', // 灰蓝
        '#6F4A8EB5', // 黑紫
        '#FF4500AD',
        '#1F93FFBA',
        '#232523B5',
        '#FF7800FF',
        '#00BABDFF',
        '#FAD400FF',
      ],
      predefineFavoritesFontColors: [
        '#2C3E50FF', // 原版
        '#6155A6FF', // 紫粉套
        '#153E90FF', // 蓝黄套
        '#120078FF', // 粉黄蓝
        '#456268FF', // 灰蓝
        '#050505FF', // 黑紫
        '#6391E6FF',
        '#F9FC2CFF',
        '#EF2655FF',
        '#CA26EFFF',
        '#183055FF',
        '#FFFFFFFF',
      ],
      predefineFavoritesFontColorsSelected: [
        '#FFFFFFFF', // 原版
        '#FFABE1FF', // 紫粉套
        '#FFFAA4FF', // 蓝黄套
        '#FECD1AFF', // 粉黄蓝
        '#FCF8ECFF', // 灰蓝
        '#EBEBEBFF', // 黑紫
        '#183055FF',
      ],
      predefineFavoritesBgColorSelected: [
        '#B9B9B9D1', // 原版
        '#A685E2FF', // 紫粉套
        '#0E49B5FF', // 蓝黄套
        '#FD3A69FF', // 粉黄蓝
        '#79A3B1FF', // 灰蓝
        '#221F3BFF', // 黑紫
      ],
    };
  },
  computed: {
    ...mapState(['appConfig']),
    backgroundColor: {
      get() {
        return this.appConfig.backgroundColor;
      },
      set(value) {
        this.changeConfig({ backgroundColor: value });
      },
    },
    enableBackgroundBlur: {
      get() {
        return this.appConfig.enableBackgroundBlur;
      },
      set(value) {
        this.changeConfig({ enableBackgroundBlur: value });
      },
    },
    backgroundBlurValue: {
      get() {
        return this.appConfig.backgroundBlurValue;
      },
      set(value) {
        if (this.appConfig.backgroundBlurValue !== value) {
          this.changeConfigDebounce({ backgroundBlurValue: value });
        }
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
    cardFontColor: {
      get() {
        return this.appConfig.cardFontColor;
      },
      set(value) {
        this.changeConfig({ cardFontColor: value });
      },
    },
    cardBgColor: {
      get() {
        return this.appConfig.cardBgColor;
      },
      set(value) {
        this.changeConfig({ cardBgColor: value });
      },
    },
    cardMetaColor: {
      get() {
        return this.appConfig.cardMetaColor;
      },
      set(value) {
        this.changeConfig({ cardMetaColor: value });
      },
    },
  },
  methods: {
    ...mapActions(['changeConfig']),
    changeConfigDebounce: debounce(function (config) {
      this.changeConfig(config);
    }, 100),
    onMouseWheel(e) {
      e.preventDefault();
      this.$refs.bgBox.scrollLeft += parseInt(e.deltaY);
    },
    setBackgroundPic(e) {
      const url = e.target.src;
      let backgroundPic;
      if (this.isBuiltinPic(url)) {
        backgroundPic = '../static/bg/' + url.split('/').pop();
      } else {
        backgroundPic = url;
      }
      this.changeConfig({ backgroundPic });
    },
    addBackgroundPic() {
      if (this.newPicUrl) {
        const backgroundPicList = clone(this.appConfig.backgroundPicList);
        backgroundPicList.unshift(this.newPicUrl);
        this.changeConfig({
          backgroundPicList,
        });
      }
      this.newPicUrl = '';
    },
    removeBackgroundPic(e, idx) {
      const backgroundPicList = clone(this.appConfig.backgroundPicList);
      backgroundPicList.splice(idx, 1);
      this.changeConfig({ backgroundPicList });
    },
    isBuiltinPic(url) {
      if (process.env.NODE_ENV !== 'production') {
        return url.startsWith('http://localhost:9080/static/bg/');
      } else {
        return url.startsWith(
          `file:///${path.join(__dirname, '../static/bg/').replace(/\\/g, '/')}`
        );
      }
    },
    addLocalPic(file) {
      if (isWin) {
        this.newPicUrl = `file:///${file.path.replace(/\\/g, '/')}`;
      } else {
        this.newPicUrl = `file://${file.path.replace(/\\/g, '/')}`;
      }
      this.addBackgroundPic();
      return false;
    },
  },
};
</script>

<style scoped>
.row {
  padding: 5px 5px;
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
  justify-content: center;
  align-items: center;
}

.bg-box {
  overflow-x: scroll;
  overflow-y: hidden;
  max-height: 105px;
  white-space: nowrap;
  margin: 10px 100px 20px;
  text-align: center;
}

.bg-pic {
  width: 100px;
  height: 100px;
  border: 2px solid transparent;
  cursor: pointer;
}

.bg-selected {
  border: 2px solid #409eff;
}
</style>
<style>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.bg-blur .el-input--small .el-input__inner {
  height: 32px !important;
}

.el-divider__text {
  background-color: #eae9ea !important;
}
</style>
<style>
.bg-pic img:hover {
  transform: scale(1.1, 1.1);
  filter: contrast(130%);
}
</style>
