<template>
  <span
    :class="{ 'is-droppable': isDroppable }"
    @drop.prevent="onCardDrop"
    @dragenter="onCardDragIn"
    @dragleave="onCardDragOut"
  >
    <!--  右键菜单  -->
    <context-menu
      class="right-menu"
      :target="contextMenuTarget"
      :show="contextMenuVisible"
      @update:show="(show) => (contextMenuVisible = show)"
    >
      <el-button @click="clickRenameFavorite" class="el-icon-edit-outline">
        重命名</el-button
      >
      <el-button @click="clickRemoveFavorite" class="el-icon-delete">
        删除</el-button
      >
      <el-divider />
      <div class="color-selector">
        <div
          :style="{ background: color }"
          class="circle circle-border"
          :class="{ 'color-is-select': color === favoriteData.color }"
          @click="() => recolor(color)"
          v-for="color in colorList"
        />
      </div>
    </context-menu>

    <el-tooltip
      v-if="!isRenaming"
      :disabled="!isExpand"
      :content="favoriteData.name"
    >
      <el-button
        :style="{
          color: favoritesFontColor,
          color: isSelected
            ? favoritesFontColorSelected + '!important'
            : favoritesFontColor,
          background: isSelected
            ? favoritesBgColorSelected + '!important'
            : 'none',
          '--favoritesFontColorSelected': favoritesFontColorSelected,
          '--favoritesBgColorSelected': favoritesBgColorSelected,
        }"
        @click="clickFavorite"
        ref="dragBtn"
      >
        <spot :color="favoriteData.color" />
        <transition name="bounce" mode="out-in">
          <div
            v-if="!isExpand"
            style="margin-left: 10px; display: inline-block"
          >
            {{ favoriteData.name }}
          </div>
        </transition>
      </el-button>
    </el-tooltip>
    <!--  改名字  -->
    <div v-if="isRenaming" style="display: inline-block">
      <el-button
        class="add-box"
        :style="{
          color: favoritesFontColorSelected + '!important',
          background: favoritesBgColorSelected + '!important',
          'padding-top': '0 !important',
          'padding-bottom': '0 !important',
          border: 'none !important',
        }"
      >
        <spot :color="favoriteData.color" />
        <el-input
          class="rename-label"
          size="small"
          v-model="newName"
          style="width: 100px"
          @blur="renameFavorite"
          @keyup.enter.native="$event.target.blur"
          ref="renameLabelInput"
        ></el-input>
      </el-button>
    </div>
  </span>
</template>

<script>
import Spot from '../../components/Spot';
import { component as VueContextMenu } from '@xunlei/vue-context-menu';
import { mapActions, mapState } from 'vuex';
import { defaultHistoryFavorite } from '../../../shared/env';
import {
  move2Favorite,
  updateFavorite,
  removeFavorite,
  listFavoriteData,
  listClipboardDataDebounce,
} from '../../ipc';

export default {
  name: 'FavoriteLabel',
  props: {
    favoriteData: {
      type: Object,
    },
    isExpand: {
      type: Boolean,
      default: false,
    },
    favoritesFontColor: {
      type: String,
      default: '#2c3e50',
    },
    favoritesFontColorSelected: {
      type: String,
      default: '#fff',
    },
    favoritesBgColorSelected: {
      type: String,
      default: '#b9b9b9d1',
    },
  },
  components: {
    Spot,
    'context-menu': VueContextMenu,
  },
  data: () => {
    return {
      isRenaming: false,
      newName: '',
      isDroppable: false,
      dragEl: '',
      contextMenuVisible: false,
      contextMenuTarget: '',
      colorList: [
        '#ff625c',
        '#fe9700',
        '#ffd74a',
        '#84e162',
        '#15bbf9',
        '#d58fe6',
        '#aaabab',
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.newName = this.favoriteData.name;
      this.contextMenuTarget = this.$el;
    });
  },
  computed: {
    ...mapState(['favorite', 'dragData']),
    isSelected() {
      return this.favorite === this.favoriteData._id;
    },
  },
  methods: {
    ...mapActions(['changeFavorite']),
    onCardDrop() {
      console.log('[favorite]: drop');
      if (this.favoriteData._id !== this.dragData.favorite) {
        const newData = Object.assign({}, this.dragData);
        newData.favorite = this.favoriteData._id;
        delete newData._id;
        move2Favorite(newData);
      }
      this.isDroppable = false;
    },
    onCardDragIn(e) {
      console.log('[favorite]: in');
      this.dragEl = e.target;
      if (this.favoriteData._id !== this.dragData.favorite) {
        this.isDroppable = true;
      }
    },
    onCardDragOut(e) {
      console.log('[favorite]: out');
      if (this.dragEl === e.target) this.isDroppable = false;
    },
    clickFavorite() {
      if (!this.isSelected) {
        this.changeFavorite(this.favoriteData._id).then(
          listClipboardDataDebounce
        );
      }
    },
    clickRemoveFavorite() {
      this.$confirm(
        `确定删除【${this.favoriteData.name}】?删除的记录不可恢复！`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          const numRemoved = removeFavorite(this.favoriteData._id);
          listFavoriteData();
          if (this.isSelected) {
            this.changeFavorite(defaultHistoryFavorite).then(
              listClipboardDataDebounce
            );
          }
          this.$message({
            type: 'success',
            message: `【${this.favoriteData.name}】删除成功! 共删除 【${numRemoved}】条记录！`,
            duration: 1000,
          });
        })
        .catch(() => {});
    },
    clickRenameFavorite() {
      this.contextMenuVisible = false;
      this.isRenaming = true;
      this.$nextTick(() => {
        this.$refs.renameLabelInput.focus();
        this.$refs.renameLabelInput.select();
      });
    },
    renameFavorite() {
      if (
        !this.newName.trim() ||
        this.newName.trim() === this.favoriteData.name
      ) {
        this.newName = this.favoriteData.name;
        this.isRenaming = false;
      } else {
        updateFavorite(this.favoriteData._id, {
          name: this.newName,
        });
        listFavoriteData();
        this.isRenaming = false;
      }
    },
    recolor(color) {
      if (color !== this.favoriteData.color) {
        const newFavorite = updateFavorite(this.favoriteData._id, { color });
        this.favoriteData.color = newFavorite.color;
        this.contextMenuVisible = false;
      }
    },
  },
};
</script>

<style scoped>
.is-droppable {
  background: #15bbf9;
  border-radius: 5px;
}

.right-menu {
  position: fixed;
  min-width: 200px;
  padding: 0;
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
  border-radius: 5px;
  z-index: 999;
  display: none;
  border: none;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
}

.right-menu button {
  font-weight: unset !important;
  display: block;
  text-align: left;
  min-width: 200px;
  margin: 0 0 !important;
  padding: 10px 15px !important;
}

.right-menu button:hover,
.right-menu button:focus {
  color: #fff !important;
  background: #aaababbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.color-selector {
  display: flex;
  margin: 5px 10px 5px;
}

.right-menu .circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 5px 5px;
}

.right-menu .circle-border {
  border-radius: 50%;
  justify-content: center;
  flex-wrap: nowrap;
  border-color: #ffffff00;
  border-width: 2px;
  border-style: solid;
  cursor: pointer;
}

.right-menu .circle-border:hover {
  border-color: #0a98cb;
}

.right-menu .color-selector {
  display: flex;
  margin: 5px 15px;
}

.right-menu .color-is-select {
  border-color: #0a98cb;
}
</style>
<style>
.right-menu .el-divider--horizontal {
  margin: 0 !important;
}
</style>
