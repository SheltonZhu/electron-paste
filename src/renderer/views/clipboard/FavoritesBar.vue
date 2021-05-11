<template>
  <div class="nav">
    <div class="nav-content">
      <!--   搜索框   -->
      <transition name="slide" mode="out-in">
        <el-input
          prefix-icon="el-icon-search"
          v-if="isSearching"
          ref="searchBar"
          placeholder="请输入检索内容（支持正则）"
          size="small"
          v-model="searchValue"
          class="input-with-select"
          @keyup.native="doSearch"
          @clear="doSearch"
          clearable
        >
          <el-select
            style="width: 80px"
            v-model="selectType"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="文本" :value="CARD_TYPE.TEXT"></el-option>
            <el-option label="链接" :value="CARD_TYPE.LINK"></el-option>
            <el-option label="图片" :value="CARD_TYPE.IMAGE"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-close"
            @click="closeSearch"
          ></el-button>
        </el-input>
      </transition>
      <transition name="fade" mode="out-in">
        <!--    搜索按钮    -->
        <el-button
          v-if="!isSearching"
          @click="clickSearchBtn"
          ref="searchBtn"
          class="el-icon-search search-btn"
          :style="{ color: labelFontColor }"
        ></el-button>
      </transition>

      <!--   收藏栏按钮组   -->
      <div class="clipboard-tag">
        <!--   剪贴板历史标签   -->
        <el-tooltip :disabled="!isSearching" content="剪贴板历史">
          <el-button
            :style="{
              color: labelFontColor,
              color: isSelected
                ? labelFontColorSelect + '!important'
                : labelFontColor,
              background: isSelected
                ? labelBgColorSelect + '!important'
                : 'none',
              '--labelFontColorSelect': labelFontColorSelect,
              '--labelBgColorSelect': labelBgColorSelect,
            }"
            @click="clickDefaultFavorite"
          >
            <span class="el-icon-timer" style="font-weight: bolder" />
            <transition name="bounce" mode="out-in">
              <div
                v-if="!isSearching"
                style="margin-left: 10px; display: inline-block"
              >
                剪贴板历史
              </div>
            </transition>
          </el-button>
        </el-tooltip>

        <favorite-label
          :is-searching="isSearching"
          :labelFontColor="labelFontColor"
          :labelFontColorSelect="labelFontColorSelect"
          :labelBgColorSelect="labelBgColorSelect"
          v-for="labelData in labels"
          :key="labelData._id"
          :label-data="labelData"
        />
        <!--    添加新标签输入框    -->
        <div v-if="newLabelVisible">
          <el-button
            :style="{
              color: labelFontColorSelect + '!important',
              background: labelBgColorSelect + '!important',
              'padding-top': '0 !important',
              'padding-bottom': '0 !important',
              border: 'none !important',
            }"
          >
            <spot color="#fe9700" />
            <el-input
              size="small"
              v-model="newLabelValue"
              style="width: 100px"
              @blur="doAddLabel"
              @keyup.enter.native="$event.target.blur"
              ref="newLabelInput"
            ></el-input>
          </el-button>
        </div>
      </div>

      <!--   添加标签按钮   -->
      <el-button
        v-if="!isSearching"
        class="el-icon-plus add-btn"
        :style="{ color: labelFontColor }"
        @click="clickLabelAdder"
      ></el-button>

      <!--   more按钮   -->
      <el-dropdown style="float: right; cursor: pointer" trigger="click">
        <el-button
          :style="{ color: labelFontColor }"
          class="el-dropdown-link el-icon-more-outline more-btn"
        >
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!--          <el-dropdown-item icon="el-icon-delete" @click.native="clearClipboard"-->
          <!--            >清空剪贴板历史-->
          <!--          </el-dropdown-item>-->
          <el-dropdown-item icon="el-icon-setting" @click.native="openSetting"
            >设置
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-info"
            divided
            @click.native="openAbout"
            >关于
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-question" @click.native="openHelp"
            >帮助
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-s-promotion"
            divided
            @click.native="quitApp"
            >退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Spot from '../../components/Spot';
import FavoriteLabel from './FavoriteLabel';
import { openSetting, listClipboardData } from '../../ipc';
import { mapActions, mapMutations, mapState } from 'vuex';
import { debounce } from '../../../shared/utils';
import { CARD_TYPE, defaultHistoryFavorite } from '../../../shared/env';
import Mousetrap from 'mousetrap';

export default {
  name: 'FavoritesBar',
  components: {
    Spot,
    FavoriteLabel,
  },
  props: {
    labelFontColor: {
      type: String,
      default: '#2c3e50',
    },
    labelFontColorSelect: {
      type: String,
      default: '#fff',
    },
    labelBgColorSelect: {
      type: String,
      default: '#b9b9b9d1',
    },
  },
  data: () => {
    return {
      CARD_TYPE: CARD_TYPE,
      searchValue: '',
      selectType: '',
      isSearching: false,
      labels: [],
      newLabelValue: '未命名',
      newLabelVisible: false,
    };
  },
  mounted() {
    // this.initLabels();
    this.initShortCut();
  },
  watch: {
    selectType() {
      this.changeSearchType();
    },
  },
  computed: {
    ...mapState(['clipboardData', 'query', 'favorite', 'searchType']),
    isSelected() {
      return this.favorite === defaultHistoryFavorite;
    },
  },
  methods: {
    ...mapActions(['changeSearch']),
    ...mapMutations(['updateFavorite']),
    initLabels() {
      // this.$electron.remote
      //   .getGlobal('labelDb')
      //   .readAll()
      //   .then((ret) => {
      //     this.labels = ret;
      //     this.$store.commit('updateLabelsData', this.labels);
      //   });
    },
    initShortCut() {
      Mousetrap.bind('alt+s', () => {
        if (!this.isSearching) {
          this.$refs.searchBtn.$el.click();
        } else {
          this.$refs.searchBar.focus();
          this.$refs.searchBar.select();
        }
      });
    },
    clickLabelAdder() {
      this.newLabelVisible = true;
      this.$nextTick(() => {
        this.$refs.newLabelInput.focus();
        this.$refs.newLabelInput.select();
      });
    },
    doAddLabel() {
      if (!this.newLabelValue.trim() || this.newLabelValue === '未命名') {
        this.newLabelValue = '未命名';
        this.newLabelVisible = false;
      } else {
        // this.$electron.remote
        //   .getGlobal('labelDb')
        //   .create({
        //     name: this.newLabelValue,
        //     color: '#fe9700',
        //   })
        //   .then((ret) => {
        //     this.labels.push(ret);
        //     this.newLabelVisible = false;
        //     window.log.info('addOneLabel: ', ret);
        //     this.$store.commit('updateLabelsData', this.labels);
        //     this.newLabelValue = '未命名';
        //   });
      }
    },
    doRemoveLabel(labelData) {
      // this.$electron.remote.getGlobal('shortcut').unregisterEsc();
      this.$confirm(
        `确定删除【${labelData.name}】?删除的记录不可恢复！`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          // this.$electron.remote
          //   .getGlobal('labelDb')
          //   .removeLabelAndData(labelData._id)
          //   .then((numRemoved) => {
          //     window.log.info(`${numRemoved} removed.`);
          //     const position = this.labels.indexOf(labelData);
          //     this.labels.splice(position, 1);
          //     this.$store.commit('updateLabelsData', this.labels);
          //     if (this.isSelected) {
          //       this.$store.commit('updateTable', 'historyData');
          //     }
          //   });
          this.$message({
            type: 'success',
            message: `【${labelData.name}】删除成功!`,
            duration: 1000,
          });
        })
        .catch(() => {})
        .finally(() => {
          // this.$electron.remote.getGlobal('shortcut').registerEsc();
        });
    },
    clickSearchBtn() {
      this.isSearching = true;
      this.$nextTick(() => {
        this.$refs.searchBar.focus();
      });
    },
    execSearchDebounce: debounce(function () {
      this.execSearch();
    }, 200),
    doSearch() {
      this.execSearchDebounce();
    },
    closeSearch() {
      this.isSearching = false;
      this.resetSearch();
    },
    resetSearch() {
      this.searchValue = '';
      if (this.selectType) {
        this.selectType = '';
      } else {
        this.execSearchDebounce();
      }
    },
    changeSearchType() {
      this.execSearch();
    },
    execSearch() {
      this.changeSearch({
        query: this.searchValue,
        searchType: this.selectType,
      }).then(() => {
        listClipboardData(this.favorite, this.query, this.searchType);
      });
    },
    clickDefaultFavorite() {
      if (!this.isSelected) this.updateFavorite(defaultHistoryFavorite);
    },
    quitApp() {
      this.$electron.remote.app.quit();
    },
    openAbout() {},
    openHelp() {},
    openSetting() {
      openSetting();
    },
  },
};
</script>

<style scoped>
.nav {
  padding: 15px 0;
}

.nav .nav-content {
  text-align: center;
}

.nav .clipboard-tag {
  display: inline-flex;
}

.input-with-select {
  width: 450px;
  margin: 0 35px;
}

.add-btn,
.search-btn,
.more-btn {
  border-radius: 50%;
  padding: 0 9px;
}

.add-btn,
.search-btn {
  margin: 0 15px;
}

.more-btn {
  float: right;
}

.el-select-dropdown__item.selected,
.el-select-dropdown__item.focus,
.el-select-dropdown__item:hover {
  background-color: #b9b9b9d1;
  color: #fff;
}

.el-dropdown-menu__item:hover,
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item.selected {
  background-color: #b9b9b9d1 !important;
  color: #fff !important;
}
</style>
<style>
.nav .el-button {
  /*color: #2c3e50 !important;*/
  background: #ffffff00 !important;
  font-weight: bold !important;
  padding: 8px 10px !important;
  border-color: #ffffff00 !important;
  border-width: 1px !important;
}

.clipboard-tag .el-button {
  margin: 0 5px;
}

.clipboard-tag .el-button:hover {
  color: var(--labelFontColorSelect) !important;
  background: var(--labelBgColorSelect) !important;
}

.el-select-dropdown {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.input-with-select > .el-input__inner {
  background-color: #ffffffa3;
}

.el-input--suffix .el-input-group__prepend .el-input__inner {
  padding: 0 20px !important;
}

.el-message--success {
  background-color: #f0f9ebbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.el-dropdown-menu {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.el-dropdown-menu__item--divided:before {
  content: none !important;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2, 1.2);
  }
  80% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
