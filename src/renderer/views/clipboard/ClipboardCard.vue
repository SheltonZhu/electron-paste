<template>
  <el-card
    @keyup.enter.native="cardOnEnter"
    @dblclick.native="cardOnDblClick"
    class="box-card"
    :class="{ 'image-card': isImage, 'text-card': isText, 'link-card': isLink }"
    :style="{ 'background-color': appConfig.cardBgColor }"
    tabindex="100"
    @keyup.right.native="
      (e) => {
        select('right', e);
      }
    "
    @keyup.left.native="
      (e) => {
        select('left', e);
      }
    "
    @dragstart.native="onDragStart"
    @dragend.native="onDragEnd"
    draggable
  >
    <div slot="header" class="clearfix">
      <div style="display: inline-flex">
        <div style="width: 200px; height: 80px">
          <div class="type">
            <p class="type">{{ data['name'] || data.cardType }}</p>
          </div>
          <div class="time">
            <p class="time">{{ $date(data.copyDate).fromNow() }}</p>
          </div>
        </div>

        <div
          class="card-icon"
          style="height: 80px"
          v-if="appConfig.cardIconEnable"
        >
          <el-image
            style="width: 110px; height: 80px; pointer-events: none"
            :src="iconUrl"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>
    </div>
    <div class="card-text" :style="{ color: appConfig.cardFontColor }">
      <div v-if="isText">
        <span
          v-if="data.html"
          v-html="data.html"
          style="pointer-events: none; position: relative"
        />
        <p v-else style="padding: 10px 20px">
          {{ data.text }}
        </p>
      </div>
      <div style="height: 200px" v-if="isLink">
        <iframe
          :src="data.text"
          class="iframe-viewport"
          style="border: none; pointer-events: none; overflow: hidden"
        >
        </iframe>
      </div>
      <el-link
        type="primary"
        icon="el-icon-link"
        v-if="isLink"
        :underline="false"
      >
        {{ data.text }}
      </el-link>
      <el-image style="width: 330px" v-if="isImage" :src="data.base64data">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div>
    <div class="meta-info" :style="{ color: appConfig.cardMetaColor }">
      <div class="shortcut">
        {{ shortcut }}
      </div>
      <div class="info">
        {{ metaInfo }}
      </div>
      <div class="other">
        {{ shortcut }}
      </div>
    </div>
  </el-card>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { CARD_TYPE } from '../../../shared/env';
import { hideAndPaste, hideClipboard } from '../../ipc';
export default {
  name: 'ClipboardCard',
  props: {
    data: {
      type: Object,
      default: null,
    },
    favorite: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
    },
    cardIcons: {
      type: Array,
      default: [],
    },
  },
  mounted() {},
  data: () => {
    return { defaultIcon: '../static/icon.png' };
  },
  computed: {
    ...mapState(['appConfig', 'favoritesData']),
    shortcut() {
      if (this.index < 9) return `Alt+${this.index + 1}`;
      return '';
    },
    isText() {
      return this.data.cardType === CARD_TYPE.TEXT;
    },
    isImage() {
      return this.data.cardType === CARD_TYPE.IMAGE;
    },
    isLink() {
      return this.data.cardType === CARD_TYPE.LINK;
    },
    metaInfo() {
      switch (true) {
        case this.isText:
          return `${this.data.meta.charLength} 个字符`;
        case this.isImage:
          return `${this.data.meta.size.width} ✖ ${this.data.meta.size.height} 个像素`;
        default:
          return '';
      }
    },
    iconUrl() {
      return this.iconMap[this.data.icon] || this.defaultIcon;
    },
    iconMap() {
      const iconMap = {};
      for (const icon of this.cardIcons) {
        iconMap[icon.checksum] = icon.base64data;
      }
      return iconMap;
    },
  },
  methods: {
    ...mapActions(['saveDragData']),
    onDragStart() {
      console.log('dragStart');
      this.saveDragData(this.data);
    },
    onDragEnd() {
      console.log('dragEnd');
      this.saveDragData(null);
    },
    select(direction, e) {
      try {
        if (direction === 'right') {
          e.target.nextElementSibling.focus();
        } else {
          e.target.previousElementSibling.focus();
        }
      } catch (e) {
        e.toString();
      }
    },
    cardOnEnter() {
      this.pasteAndHide();
    },
    cardOnDblClick() {
      this.pasteAndHide();
    },
    copyAndHide() {
      hideAndPaste({
        data: this.data,
      });
    },
    pasteTextAndHide() {
      hideAndPaste({
        data: this.data,
        textMode: true,
        directPaste: this.appConfig.directPaste,
      });
    },
    pasteAndHide() {
      hideAndPaste({
        data: this.data,
        directPaste: this.appConfig.directPaste,
      });
    },
    openLink() {
      hideClipboard();
      this.execShellOpenLink(this.data.text);
    },
    share2twitter() {
      this.execShellOpenLink('https://twitter.com/compose/tweet');
      this.copyAndHide();
    },
    share2email() {
      this.execShellOpenLink('mailto: somebody@somewhere.io');
      this.copyAndHide();
    },
    execShellOpenLink(link) {
      this.$electron.shell.openExternal(link);
    },
    deleteOneData() {},
    rename() {
      // this.$electron.remote.getGlobal('shortcut').unregisterEsc();
      this.$prompt('', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          // this.$electron.remote
          //   .getGlobal('db')
          //   .rename(this.data._id, value)
          //   .then((ret) => {
          //     this.data.name = ret.name;
          //     this.$forceUpdate();
          //     window.log.info('renameCard: ', ret);
          //   });
        })
        .catch(() => {})
        .finally(() => {
          // this.$electron.remote.getGlobal('shortcut').registerEsc();
        });
    },
    // dataURL to blob
    dataURLtoBlob(dataUrl) {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    contextMenuSaveImage() {
      const blob = this.dataURLtoBlob(this.data.base64data);
      const type = blob.type.split('/')[1];
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        const link = document.createElement('a');
        link.download = `${this.data._id}.${type}`;
        link.href = e.target.result;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    },
    add2favorite(_id) {
      // const newData = Object.assign({}, this.data);
      // newData.table = _id;
      // delete newData._id;
      //
      // this.$electron.remote
      //   .getGlobal('db')
      //   .create(newData)
      //   .then((ret) => {
      //     window.log.info('add favorite :', ret);
      //   });
    },
    googleTranslate(url) {
      hideClipboard();
      this.execShellOpenLink(`${url}${this.data.text}`);
    },
    // 生成右键菜单
    // /*onContextmenu(event) {*/
    /*  const children = [];*/
    /*  for (const label of this.labelsData) {*/
    /*    if (label._id !== this.table) {*/
    /*      children.push({*/
    /*        label: label.name,*/
    /*        icon: 'el-icon-star-off',*/
    /*        onClick: () => {*/
    /*          this.add2favorite(label._id);*/
    /*        },*/
    /*      });*/
    /*    }*/
    /*  }*/
    /*  const items = [*/
    /*    {*/
    /*      label: '复制',*/
    /*      icon: 'el-icon-document-copy',*/
    /*      onClick: this.copyAndHide,*/
    /*    },*/
    /*    {*/
    /*      label: '粘贴',*/
    /*      icon: 'el-icon-document-add',*/
    /*      onClick: this.pasteAndHide,*/
    /*    },*/
    /*    { label: '重命名', icon: 'el-icon-edit', onClick: this.rename },*/

    /*    {*/
    /*      label: '删除',*/
    /*      icon: 'el-icon-delete',*/
    /*      divided: true,*/
    /*      onClick: this.deleteOneData,*/
    /*    },*/
    /*    {*/
    /*      label: '打开链接',*/
    /*      icon: 'el-icon-link',*/
    /*      onClick: this.openLink,*/
    /*      hidden: !this.isLink,*/
    /*    },*/
    /*    {*/
    /*      label: '保存图片',*/
    /*      icon: 'el-icon-picture-outline',*/
    /*      onClick: this.contextMenuSaveImage,*/
    /*      hidden: !this.isImage,*/
    /*    },*/
    /*    {*/
    /*      label: '快速查看（TODO）',*/
    /*      icon: 'el-icon-view',*/
    /*      hidden: true,*/
    /*    },*/
    /*    {*/
    /*      label: '添加到收藏',*/
    /*      icon: 'el-icon-collection-tag',*/
    /*      children: children,*/
    /*    },*/
    /*    {*/
    /*      label: '使用谷歌翻译',*/
    /*      icon: 'el-icon-camera',*/
    /*      hidden: !this.isText,*/
    /*      children: [*/
    /*        {*/
    /*          label: '中文(简)',*/
    /*          icon: 'el-icon-caret-right',*/
    /*          onClick: () => {*/
    /*            this.googleTranslate(*/
    /*              'https://translate.google.cn/?sl=auto&tl=zh-CN&text='*/
    /*            );*/
    /*          },*/
    /*        },*/
    /*        {*/
    /*          label: '英语',*/
    /*          icon: 'el-icon-caret-right',*/
    /*          onClick: () => {*/
    /*            this.googleTranslate(*/
    /*              'https://translate.google.cn/?sl=auto&tl=zh-CN&text='*/
    /*            );*/
    /*          },*/
    /*        },*/
    /*        {*/
    /*          label: '日语',*/
    /*          icon: 'el-icon-caret-right',*/
    /*          onClick: () => {*/
    /*            this.googleTranslate(*/
    /*              'https://translate.google.cn/?sl=auto&tl=ja&text='*/
    /*            );*/
    /*          },*/
    /*        },*/
    /*        {*/
    /*          label: '中文(繁)',*/
    /*          icon: 'el-icon-caret-right',*/
    /*          onClick: () => {*/
    /*            this.googleTranslate(*/
    /*              'https://translate.google.cn/?sl=auto&tl=zh-TW&text='*/
    /*            );*/
    /*          },*/
    /*        },*/
    /*      ],*/
    /*    },*/
    /*    {*/
    /*      label: '分享',*/
    /*      icon: 'el-icon-share',*/
    /*      minWidth: 0,*/
    /*      children: [*/
    /*        {*/
    /*          label: '邮件',*/
    /*          icon: 'el-icon-message',*/
    /*          onClick: this.share2email,*/
    /*        },*/
    /*        { label: 'Twitter', onClick: this.share2twitter },*/
    /*      ],*/
    //     },
    //   ];
    //
    //   this.$contextmenu({
    //     items: items,
    //     event,
    //     customClass: 'context-menu',
    //     zIndex: 3,
    //   });
    //   return false;
    // },
  },
};
</script>

<style scoped>
.iframe-viewport {
  width: 1360px;
  height: 768px;
  -webkit-transform: scale(0.2425);
  -webkit-transform-origin: 0 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.box-card p.time {
  color: #fff;
  margin: 0;
  font-size: smaller;
}

.box-card p.type {
  margin: 16px 0 5px 0;
  font-size: large;
  color: #fff;
}

.box-card .card-text {
  height: 265px;
  overflow: hidden;
  white-space: normal;
  word-break: break-all;
}

.box-card .card-text img {
  max-height: 265px;
  max-width: 330px;
}

.box-card .card-text p {
  text-align: left;
  margin: 0 auto;
}

.box-card .card-text a {
  text-align: left;
  padding: 0 20px;
}

.box-card .meta-info {
  font-size: smaller;
  margin-top: 1px;
  padding: 0 20px;
  text-align: center;
}

.box-card .meta-info .info {
  display: inline-block;
}

.box-card .meta-info .shortcut {
  float: left;
  display: inline-block;
  margin-top: 1px;
}

.box-card .meta-info .other {
  float: right;
  display: inline-block;
  margin-top: 1px;
  visibility: hidden;
}

.box-card {
  display: inline-block;
  width: 330px;
  height: 365px;
  margin-left: 20px;
  cursor: pointer;
  border: 5px solid #ffffff00;
  background-clip: padding-box !important;
  outline: none;
}

/*.box-card:hover,*/
.box-card:focus {
  border: 5px solid #2480fc;
}
</style>
<style>
.box-card .el-card__header {
  padding: 0 20px !important;
  height: 80px !important;
  text-align: left;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: none;
}

.box-card .el-card__header .card-icon .el-image__error,
.box-card .el-card__header .card-icon .el-image__inner {
  width: 120% !important;
}

/*灰: #aaabab 红: #ff625c 绿: #84e162 紫: #d58fe6 黄: #ffd74a 蓝#15bbf9*/
.text-card .el-card__header {
  background: #ffd74a;
}

.text-card p.type:before {
  content: '文本 | ';
}

.image-card .el-card__header {
  background: #d58fe6;
}

.image-card p.type:before {
  content: '图片 | ';
}

.link-card .el-card__header {
  background: #15bbf9;
}

.link-card p.type:before {
  content: '链接 | ';
}

.box-card .el-card__body {
  padding: 0 0 !important;
}

.box-card {
  border-radius: 10px !important;
}

.el-message-box input {
  background-color: #ffffff00 !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}
</style>
