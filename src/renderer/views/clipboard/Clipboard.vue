<template>
  <div
    class="clipboard"
    @wheel.prevent="onMouseWheel"
    ref="clipboard"
    v-loading="loading"
  >
    <clipboard-card
      v-for="(data, index) in clipboardData"
      :key="data._id"
      :data="data"
      :table="table"
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
import ClipboardCard from '@/renderer/components/ClipboardCard';
import { mapState } from 'vuex';

export default {
  props: {
    table: {
      type: String,
      default: 'historyData',
    },
    clipboardData: {
      type: Array,
    },
  },
  name: 'Clipboard',
  components: {
    ClipboardCard,
  },
  data: () => {
    return {
      cardIcons: [],
    };
  },
  watch: {
    table() {
      this.$nextTick(() => {
        setTimeout(this.focusFirst, 200);
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(['searchType', 'query', 'loading']),
    isEmpty() {
      return this.clipboardData.length === 0;
    },
  },
  methods: {
    init() {
      this.$electron.ipcRenderer.on(
        'clipboard-text-changed',
        this.insertOneData
      );
      this.$electron.ipcRenderer.on(
        'clipboard-image-changed',
        this.insertOneData
      );
      this.initCardIcon();
      this.initShortcut();
      this.initFocus();
    },
    initShortcut() {
      let template = [];
      for (let index in [...Array(9)]) {
        let shortcut = parseInt(index) + 1;
        template.push({
          label: `Alt+${shortcut}`,
          accelerator: `Alt+${shortcut}`,
          click: () => {
            try {
              this.$refs[`cc${index}`][0].copyPasteAndHide();
            } catch (e) {
              if (!(e instanceof TypeError)) {
                window.log.error(e);
              }
            }
          },
        });
      }
      const Menu = this.$electron.remote.Menu;
      let menu = Menu.buildFromTemplate(template);
      this.$electron.remote.getCurrentWindow().setMenu(menu);
    },
    initCardIcon() {
      this.$electron.remote
        .getGlobal('cardIconDb')
        .readAll()
        .then((cardIcons) => {
          window.log.info('icon num: ', cardIcons.length);
          this.cardIcons = cardIcons;
        });
    },
    initFocus() {
      this.$electron.remote.getCurrentWindow().on('show', this.focusFirst);
    },
    focusFirst() {
      try {
        this.$refs[`cc0`][0].$el.focus();
      } catch (e) {
        if (!(e instanceof TypeError)) {
          window.log.error(e);
        }
      }
    },
    onMouseWheel(e) {
      e.preventDefault();
      this.$refs.clipboard.scrollLeft += parseInt(e.deltaY);
    },
    insertOneData(event, args) {
      let data = args.data;
      let isExist = args.isExist;
      if (!isExist) this.initCardIcon();

      if (this.table === 'historyData') {
        if (this.query) {
          if (data.copyType === 'Image') {
            if (this.searchType === 'Image') this.updateClipboardData(data);
          } else {
            if (
              (!this.searchType || this.searchType === data.copyType) &&
              new RegExp(this.query, 'i').test(data.copyContent)
            )
              this.updateClipboardData(data);
          }
        } else {
          if (!this.searchType || this.searchType === data.copyType) {
            this.updateClipboardData(data);
          }
        }
      }
    },
    updateClipboardData(data) {
      this.clipboardData.unshift(data);
      const limit = this.$electron.remote
        .getGlobal('config')
        .get('historyCapacityNum');
      if (this.clipboardData.length > limit) {
        this.clipboardData.pop();
      }
    },
    deleteOneData(data) {
      this.$electron.remote
        .getGlobal('db')
        .removeOne(this.table, data._id)
        .then((numRemoved) => {
          window.log.info(`${numRemoved} removed.`);
          let position = this.clipboardData.indexOf(data);
          this.clipboardData.splice(position, 1);
        });
    },
  },
};
</script>
<style scoped>
.clipboard {
  height: 410px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  outline: none;
}
</style>
