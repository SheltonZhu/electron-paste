<template>
  <div class="clipboard-panel" @wheel.prevent="onMouseWheel" ref="clipboard">
    <clipboard-card
      v-for="(card, index) in clipboardData"
      :key="card._id"
      :data="card"
      :favorite="favorite"
      :cardIcons="cardIcons"
      :data-index="index"
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
import { listClipboardData } from '../../ipc';
import Mousetrap from 'mousetrap';
export default {
  name: 'ClipboardPanel',
  components: {
    ClipboardCard,
  },
  data() {
    return {
      cardIcons: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(['favorite', 'searchType', 'query', 'clipboardData']),
    isEmpty() {
      return this.clipboardData.length === 0;
    },
  },
  methods: {
    ...mapMutations(['updateClipboardData']),
    init() {
      listClipboardData();
      this.initShortcut();
    },
    initShortcut() {
      for (const index in [...Array(9)]) {
        const shortcut = parseInt(index) + 1;
        Mousetrap.bind(`alt+${shortcut}`, () => {
          this.$refs[`cc${index}`][0].copyPasteAndHide();
        });
      }
    },
    onMouseWheel(e) {
      e.preventDefault();
      this.$refs.clipboard.scrollLeft += parseInt(e.deltaY);
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
