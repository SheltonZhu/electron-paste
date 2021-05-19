<template>
  <div class="clipboard-panel" @wheel.prevent="onMouseWheel" ref="clipboard">
    <clipboard-card
      v-for="(card, index) in clipboardData"
      :key="card._id"
      :data="card"
      :index="index"
      :ref="'cc' + index"
    />
    <div v-if="isEmpty">
      <!--    無了無了...😅    -->
    </div>
  </div>
</template>
<script>
import ClipboardCard from './ClipboardCard';
import { mapState, mapMutations } from 'vuex';
import { listClipboardData, getIconMapData } from '../../ipc';
import Mousetrap from 'mousetrap';
export default {
  name: 'ClipboardPanel',
  components: {
    ClipboardCard,
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {
    clipboardData() {
      if (!this.isSearching)
        this.$nextTick(() => {
          this.focusFirst();
        });
    },
  },
  computed: {
    ...mapState([
      'favorite',
      'searchType',
      'query',
      'clipboardData',
      'isSearching',
    ]),
    isEmpty() {
      return this.clipboardData.length === 0;
    },
  },
  methods: {
    ...mapMutations(['updateClipboardData']),
    init() {
      listClipboardData();
      getIconMapData();
      this.initShortcut();
    },
    initShortcut() {
      for (const index in [...Array(9)]) {
        const shortcut = parseInt(index) + 1;
        Mousetrap.bind(`alt+${shortcut}`, () => {
          this.$refs[`cc${index}`][0].pasteAndHide(200);
        });
      }
    },
    onMouseWheel(e) {
      e.preventDefault();
      this.$refs.clipboard.scrollLeft += parseInt(e.deltaY);
    },
    focusFirst() {
      try {
        this.$refs[`cc0`][0].$el.focus();
      } catch (e) {
        if (!(e instanceof TypeError)) {
          console.error(e);
        }
      }
    },
  },
};
</script>
<style scoped>
.clipboard-panel {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  outline: none;
}
</style>
