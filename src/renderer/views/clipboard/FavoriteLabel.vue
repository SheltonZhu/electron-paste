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
      :content="labelData.name"
    >
      <el-button
        :style="{
          color: labelFontColor,
          color: isSelected
            ? labelFontColorSelect + '!important'
            : labelFontColor,
          background: isSelected ? labelBgColorSelect + '!important' : 'none',
          '--labelFontColorSelect': labelFontColorSelect,
          '--labelBgColorSelect': labelBgColorSelect,
        }"
        @click="onLabelClick"
        @contextmenu.native="onContextmenu"
        ref="dragBtn"
      >
        <spot :color="labelData.color" />
        <transition name="bounce" mode="out-in">
          <div
            v-if="!isSearching"
            style="margin-left: 10px; display: inline-block"
          >
            {{ labelData.name }}
          </div>
        </transition>
      </el-button>
    </el-tooltip>
    <!--  改名字  -->
    <div v-if="isRenaming" style="display: inline-block">
      <el-button
        class="add-box"
        :style="{
          color: labelFontColorSelect + '!important',
          background: labelBgColorSelect + '!important',
          'padding-top': '0 !important',
          'padding-bottom': '0 !important',
          border: 'none !important',
        }"
      >
        <spot :color="labelData.color" />
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
import { mapState } from 'vuex';

export default {
  name: 'FavoriteLabel',
  props: {
    labelData: {
      type: Object,
    },
    isSearching: {
      type: Boolean,
      default: false,
    },
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
      this.newName = this.labelData.name;
    });
  },
  computed: {
    ...mapState(['favorite', 'dragData']),
    isSelected() {
      return this.favorite === this.labelData._id;
    },
  },
  methods: {
    onCardDrop() {
      window.log.info('drop');
      if (this.labelData._id !== this.dragData.table) {
        const newData = Object.assign({}, this.dragData);
        newData.table = this.labelData._id;
        delete newData._id;
        this.$electron.remote
          .getGlobal('db')
          .create(newData)
          .then((ret) => {
            window.log.info('add favorite :', ret);
          });
      }
      this.isDroppable = false;
    },
    onCardDragIn(e) {
      window.log.info('in');
      this.dragEl = e.target;
      if (this.labelData._id !== this.dragData.table) {
        this.isDroppable = true;
      }
    },
    onCardDragOut(e) {
      window.log.info('out');
      if (this.dragEl === e.target) this.isDroppable = false;
    },
    onLabelClick() {
      if (!this.isSelected)
        this.$store.commit('updateTable', this.labelData._id);
    },
    removeLabel() {
      // this.$parent.doRemoveLabel(this.labelData);
    },
    onRenameLabel() {
      this.isRenaming = true;
      this.$nextTick(() => {
        this.$refs.renameLabelInput.focus();
        this.$refs.renameLabelInput.select();
      });
    },
    doRenameLabel() {
      if (!this.newName.trim() || this.newName.trim() === this.labelData.name) {
        this.newName = this.labelData.name;
        this.isRenaming = false;
      } else {
        // this.$electron.remote
        //   .getGlobal('labelDb')
        //   .rename(this.labelData._id, this.newName)
        //   .then((newLabel) => {
        //     window.log.info('update: ', newLabel);
        //     this.labelData.name = newLabel.name;
        //     this.isRenaming = false;
        //   });
      }
    },
    onSelectColor(color) {
      if (color !== this.labelData.color) {
        // this.$electron.remote
        //   .getGlobal('labelDb')
        //   .recolor(this.labelData._id, color)
        //   .then((newLabel) => {
        //     window.log.info('update: ', newLabel);
        //     this.labelData.color = newLabel.color;
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
    //     `context-menu__${this.labelData._id}`
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
    //     customClass: `context-menu__${this.labelData._id} context-menu`,
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
.context-menu {
  min-width: 170px !important;
  padding: 0 !important;
}

.color-selector {
  display: flex;
  margin: 5px 10px 5px;
}

.rename-label input {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}
</style>
