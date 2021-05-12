<template>
  <span
    :class="{ 'is-droppable': isDroppable }"
    @drop.prevent="onCardDrop"
    @dragenter="onCardDragIn"
    @dragleave="onCardDragOut"
  >
    <el-tooltip
      v-if="!isRenaming"
      :disabled="!isSearching"
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
            v-if="!isSearching"
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
          @blur="doRenameLabel"
          @keyup.enter.native="$event.target.blur"
          ref="renameLabelInput"
        ></el-input>
      </el-button>
    </div>
  </span>
</template>

<script>
import Spot from '../../components/Spot';
import { mapActions, mapState } from 'vuex';
import { listClipboardData, move2Favorite } from '../../ipc';

export default {
  name: 'FavoriteLabel',
  props: {
    favoriteData: {
      type: Object,
    },
    isSearching: {
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
  },
  data: () => {
    return {
      isRenaming: false,
      newName: '',
      isDroppable: false,
      dragEl: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.newName = this.favoriteData.name;
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
        this.changeFavorite(this.favoriteData._id).then(listClipboardData);
      }
    },
    removeFavorite() {
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
          //       // this.$electron.remote
          //       //   .getGlobal('labelDb')
          //       //   .removeLabelAndData(labelData._id)
          //       //   .then((numRemoved) => {
          //       //     window.log.info(`${numRemoved} removed.`);
          //       //     const position = this.labels.indexOf(labelData);
          //       //     this.labels.splice(position, 1);
          //       //     this.$store.commit('updateLabelsData', this.labels);
          //       //     if (this.isSelected) {
          //       //       this.$store.commit('updateTable', 'historyData');
          //       //     }
          //         });
          this.$message({
            type: 'success',
            message: `【${this.favoriteData.name}】删除成功!`,
            duration: 1000,
          });
        })
        .catch(() => {})
        .finally(() => {
          // this.$electron.remote.getGlobal('shortcut').registerEsc();
        });
    },
    onRenameLabel() {
      this.isRenaming = true;
      this.$nextTick(() => {
        this.$refs.renameLabelInput.focus();
        this.$refs.renameLabelInput.select();
      });
    },
    doRenameLabel() {
      if (
        !this.newName.trim() ||
        this.newName.trim() === this.favoriteData.name
      ) {
        this.newName = this.favoriteData.name;
        this.isRenaming = false;
      } else {
        // this.$electron.remote
        //   .getGlobal('labelDb')
        //   .rename(this.favoriteData._id, this.newName)
        //   .then((newLabel) => {
        //     window.log.info('update: ', newLabel);
        //     this.favoriteData.name = newLabel.name;
        //     this.isRenaming = false;
        //   });
      }
    },
    onSelectColor(color) {
      if (color !== this.favoriteData.color) {
        // this.$electron.remote
        //   .getGlobal('labelDb')
        //   .recolor(this.favoriteData._id, color)
        //   .then((newLabel) => {
        //     window.log.info('update: ', newLabel);
        //     this.favoriteData.color = newLabel.color;
        //     this.$forceUpdate();
        //   });
      }
    },
    // initColorfulSpots() {
    //   /* 红: #ff625c 橘色：#fe9700 黄: #ffd74a 绿: #84e162 蓝#15bbf9 紫: #d58fe6 灰: #aaabab */
    //   const colorList = [
    //     '#ff625c',
    //     '#fe9700',
    //     '#ffd74a',
    //     '#84e162',
    //     '#15bbf9',
    //     '#d58fe6',
    //     '#aaabab',
    //   ];
    //   const createNodeList = (createElement) => {
    //     const spotList = [];
    //     for (const color of colorList) {
    //       const node = createElement(
    //         'div',
    //         {
    //           attrs: { class: 'circle-border' },
    //           on: {
    //             click: () => {
    //               this.onSelectColor(color);
    //             },
    //           },
    //         },
    //         [
    //           createElement('div', {
    //             attrs: { class: 'circle' },
    //             style: `background:${color};`,
    //           }),
    //         ]
    //       );
    //       spotList.push(node);
    //     }
    //     return spotList;
    //   };
    //
    //   const component = Vue.extend({
    //     render(createElement) {
    //       return createElement(
    //         'div',
    //         { attrs: { class: 'color-selector' } },
    //         createNodeList(createElement)
    //       );
    //     },
    //   });
    //   const dom = new component().$mount().$el;
    //   const el = document.getElementsByClassName(
    //     `context-menu__${this.favoriteData._id}`
    //   )[0].children[0];
    //   el.appendChild(dom);
    // },
    // onContextmenu(event) {
    //   const items = [
    //     {
    //       label: '重命名',
    //       icon: 'el-icon-edit-outline',
    //       onClick: this.onRenameLabel,
    //     },
    //     {
    //       label: '删除',
    //       icon: 'el-icon-delete',
    //       onClick: this.removeLabel,
    //       divided: true,
    //     },
    //   ];
    //   this.$contextmenu({
    //     items: items,
    //     event,
    //     customClass: `context-menu__${this.favoriteData._id} context-menu`,
    //     zIndex: 3,
    //   });
    //   this.$nextTick(this.initColorfulSpots);
    //   return false;
    // },
  },
};
</script>

<style scoped>
.is-droppable {
  background: #15bbf9;
  border-radius: 5px;
}
</style>
<style>
/*.context-menu {*/
/*  min-width: 170px !important;*/
/*  padding: 0 !important;*/
/*}*/

/*.color-selector {*/
/*  display: flex;*/
/*  margin: 5px 10px 5px;*/
/*}*/

/*.rename-label input {*/
/*  background-color: #ffffffbf !important;*/
/*  backdrop-filter: saturate(180%) blur(5px) !important;*/
/*}*/
</style>
