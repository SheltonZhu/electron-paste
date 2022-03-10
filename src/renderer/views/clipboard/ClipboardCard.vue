<template>
  <el-card
    @contextmenu.native="mountContextMenu($event, $root, index)"
    @keyup.113.native="rename"
    @keyup.enter.native="cardOnEnter"
    @dblclick.native="cardOnDblClick"
    class="box-card"
    :class="{
      'image-card': isImage,
      'text-card': isText,
      'link-card': isLink,
    }"
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
    <div
      slot="header"
      class="clearfix"
      :style="{ background: cardHeaderColor, padding: '0 20px' }"
    >
      <div style="display: inline-flex">
        <div
          style="width: 220px; height: 80px"
          :style="{ color: appConfig.cardHeaderFontColor }"
        >
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
            style="width: 90px; height: 80px; pointer-events: none"
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
      <div v-if="isText" class="card-content">
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
          sandbox="allow-scripts allow-same-origin"
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
      <el-image
        class="card-image card-content"
        style="width: 330px"
        v-if="isImage"
        :src="data.base64data"
      >
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

    <!--  右键菜单  -->
    <context-menu
      :list="contextMenu"
      :tag="index"
      :arrow="true"
      :itemWidth="200"
    ></context-menu>

    <el-dialog
      title="编辑内容"
      :visible.sync="editable"
      width="30%"
      :modal-append-to-body="false"
      :fullscreen="true"
      :append-to-body="true"
      :close-on-press-escape="true"
      custom-class="rtf-editor"
      :destroy-on-close="true"
      center
    >
      <editor ref="quill" :data="data"></editor>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="editable = false">取 消</el-button>
        <el-button size="small" type="primary" @click="updateContent"
        >提 交</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { CARD_TYPE } from '../../../shared/env'
import {
  hideAndPaste,
  hideClipboard,
  renameClipboardData,
  removeClipboardData,
  move2Favorite,
  listClipboardData,
  editClipboardData
} from '../../ipc'
import { dataURLtoBlob } from '../../../shared/utils'
import ContextMenu from '../../components/ContextMenu'
import Editor from '../../components/Editor'
import { isLinux } from '../../../shared/env'
import { unBind, bind } from '../../shortcut'

export default {
  name: 'ClipboardCard',
  props: {
    data: {
      type: Object,
      default: null
    },
    index: {
      type: Number
    }
  },
  components: { ContextMenu, Editor },
  data: () => {
    return {
      defaultIcon: '../static/icon.png',
      editable: false
    }
  },
  watch: {
    editable (stat) {
      const shortcut = this.appConfig.windowShortcuts.hideClipboard
      if (stat) {
        unBind(shortcut.key)
      } else {
        bind('hideClipboard', shortcut.key)
      }
    }
  },
  computed: {
    ...mapState([
      'appConfig',
      'favoritesData',
      'favorite',
      'iconMap',
      'isRenaming',
      'fullscreen'
    ]),
    shortcut () {
      if (this.index < 9) return `Alt+${this.index + 1}`
      return ''
    },
    isText () {
      return this.data.cardType === CARD_TYPE.TEXT
    },
    isImage () {
      return this.data.cardType === CARD_TYPE.IMAGE
    },
    isLink () {
      return this.data.cardType === CARD_TYPE.LINK
    },
    cardHeaderColor () {
      switch (true) {
        case this.isText:
          return this.appConfig.cardHeaderBgColorText
        case this.isLink:
          return this.appConfig.cardHeaderBgColorLink
        case this.isImage:
          return this.appConfig.cardHeaderBgColorImage
        default:
          return '#aaabab'
      }
      // const colors = ['#ff625c', '#fe9700', '#ffd74a', '#84e162', '#15bbf9', '#d58fe6', '#aaabab']
      // const idx = Math.floor(Math.random() * colors.length)
      // const idx = this.index % colors.length
      // return colors[idx]
    },
    metaInfo () {
      switch (true) {
        case this.isText:
          return `${this.data.meta.charLength} 个字符`
        case this.isImage:
          return `${this.data.meta.size.width} ✖ ${this.data.meta.size.height} 个像素`
        default:
          return ''
      }
    },
    iconUrl () {
      return this.iconMap[this.data.icon] || this.defaultIcon
    },
    contextMenu () {
      return [
        {
          text: '复制',
          icon: 'el-icon-document-copy',
          onClick: this.copyAndHide
        },
        {
          text: '粘贴',
          icon: 'el-icon-document-add',
          hidden: !this.appConfig.directPaste,
          onClick: this.pasteAndHide
        },
        {
          text: '粘贴纯文本',
          icon: 'el-icon-document',
          hidden:
            !this.isText ||
            this.appConfig.textMode ||
            !this.appConfig.directPaste,
          onClick: this.pasteTextAndHide
        },
        {
          text: '重命名',
          icon: 'el-icon-edit',
          onClick: this.rename
        },
        {
          text: '编辑',
          icon: 'el-icon-edit-outline',
          hidden: !this.isText && !this.isLink,
          onClick: () => {
            this.editable = true
          }
        },
        {
          text: '删除',
          icon: 'el-icon-delete',
          divided: true,
          onClick: this.deleteOneData
        },
        {
          text: '打开链接',
          icon: 'el-icon-link',
          onClick: this.openLink,
          hidden: !this.isLink
        },
        {
          text: '快速查看',
          icon: 'el-icon-view',
          hidden: this.isLink || isLinux,
          onClick: this.togglePreview
        },
        {
          text: '保存图片',
          icon: 'el-icon-picture-outline',
          onClick: this.contextMenuSaveImage,
          hidden: !this.isImage || isLinux
        },
        {
          text: '添加到收藏',
          icon: 'el-icon-star-off',
          children: this.favoriteChildren
        },
        {
          text: '谷歌翻译',
          icon: 'icon-iconfont-google-translate',
          hidden: !this.isText,
          children: [
            {
              text: '英文',
              icon: 'icon-iconfont-en',
              onClick: () => {
                this.googleTranslate(
                  'https://translate.google.cn/?sl=auto&tl=zh-CN&text='
                )
              }
            },
            {
              text: '日文',
              icon: 'icon-iconfont-jp',
              onClick: () => {
                this.googleTranslate(
                  'https://translate.google.cn/?sl=auto&tl=ja&text='
                )
              }
            },
            {
              text: '中文',
              icon: 'icon-iconfont-simple',
              onClick: () => {
                this.googleTranslate(
                  'https://translate.google.cn/?sl=auto&tl=zh-CN&text='
                )
              }
            },
            {
              text: '中文',
              icon: 'icon-iconfont-traditional',
              onClick: () => {
                this.googleTranslate(
                  'https://translate.google.cn/?sl=auto&tl=zh-TW&text='
                )
              }
            }
          ]
        },
        {
          text: 'Deepl翻译',
          icon: 'icon-iconfont-deepl',
          hidden: !this.isText,
          children: [
            {
              text: '英文',
              icon: 'icon-iconfont-en',
              onClick: () => {
                this.googleTranslate('https://www.deepl.com/translator#zh/ja/')
              }
            },
            {
              text: '日文',
              icon: 'icon-iconfont-jp',
              onClick: () => {
                this.googleTranslate('https://www.deepl.com/translator#zh/ja/')
              }
            },
            {
              text: '中文',
              icon: 'icon-iconfont-cn',
              onClick: () => {
                this.googleTranslate('https://www.deepl.com/translator#en/zh/')
              }
            }
          ]
        },
        {
          text: '分享',
          icon: 'el-icon-share',
          children: [
            {
              text: '邮件',
              icon: 'el-icon-message',
              onClick: this.share2email
            },
            {
              text: 'Twitter',
              icon: 'icon-iconfont-twitter',
              onClick: this.share2twitter
            }
          ]
        }, {
          text: '其他',
          icon: 'el-icon-more',
          hidden: !this.isText,
          children: [
            {
              text: '大写',
              icon: 'el-icon-male',
              onClick: this.toUpperCase,
              hidden: !this.isText
            },
            {
              text: '小写',
              icon: 'el-icon-female',
              onClick: this.toLowerCase,
              hidden: !this.isText
            }
          ]
        }
      ]
    },
    favoriteChildren () {
      const children = []
      for (const favorite of this.favoritesData) {
        if (favorite._id !== this.favorite) {
          children.push({
            text: favorite.name,
            icon: 'el-icon-collection-tag',
            onClick: () => {
              this.add2favorite(favorite._id)
            }
          })
        }
      }
      return children
    }
  },
  methods: {
    ...mapActions(['saveDragData', 'changeFullscreen']),
    fullscreenChange (fullscreen) {
      this.changeFullscreen(fullscreen).then(() => {
        const shortcut = this.appConfig.windowShortcuts.hideClipboard
        if (this.fullscreen) {
          unBind(shortcut.key)
        } else {
          bind('hideClipboard', shortcut.key)
        }
      })
    },
    togglePreview () {
      this.$fullscreen.toggle(this.$el.querySelector('.card-content'), {
        wrap: true,
        fullscreenClass: 'fullscreen',
        callback: this.fullscreenChange
      })
    },
    mountContextMenu (e, root, tag) {
      e.stopPropagation()
      e.preventDefault()
      root.$emit('easyAxis', {
        tag: tag,
        x: e.clientX,
        y: e.clientY
      })
    },
    onDragStart () {
      this.saveDragData(this.data)
    },
    onDragEnd () {
      this.saveDragData(null)
    },
    select (direction, e) {
      try {
        if (direction === 'right') {
          e.target.nextElementSibling.focus()
        } else {
          e.target.previousElementSibling.focus()
        }
      } catch (e) {
        e.toString()
      }
    },
    cardOnEnter () {
      if (!this.isRenaming) this.pasteAndHide()
    },
    cardOnDblClick () {
      this.pasteAndHide()
    },
    copyAndHide () {
      hideAndPaste({
        data: this.data
      })
    },
    pasteTextAndHide () {
      hideAndPaste({
        data: this.data,
        textMode: true,
        directPaste: this.appConfig.directPaste
      })
    },
    pasteTextAndHideWithContent (content) {
      const newData = {
        data: this.data,
        textMode: true,
        directPaste: this.appConfig.directPaste
      }
      newData.data.text = content
      hideAndPaste(newData)
    },
    pasteAndHide (timeout) {
      hideAndPaste({
        data: this.data,
        isPaste: true,
        directPaste: this.appConfig.directPaste,
        timeout
      })
    },
    openLink () {
      hideClipboard()
      this.execShellOpenLink(this.data.text)
    },
    share2twitter () {
      this.execShellOpenLink('https://twitter.com/compose/tweet')
      this.pasteAndHide(2500)
    },
    share2email () {
      this.execShellOpenLink('mailto: somebody@somewhere.io')
      this.pasteAndHide()
    },

    toUpperCase () {
      this.pasteTextAndHideWithContent(this.data.text.toUpperCase())
    },
    toLowerCase () {
      this.pasteTextAndHideWithContent(this.data.text.toLowerCase())
    },
    execShellOpenLink (link) {
      this.$electron.shell.openExternal(link)
    },
    deleteOneData () {
      removeClipboardData(this.data._id)
      listClipboardData()
    },
    rename () {
      this.$store.dispatch('changeRenaming', true).then(async () => {
        try {
          const ret = await this.$prompt(this.data.name, '重命名', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '输入新名称'
          })
          renameClipboardData(this.data._id, ret.value)
          listClipboardData()
        } catch (e) {
        } finally {
          setTimeout(() => {
            this.$store.dispatch('changeRenaming', false)
          }, 200)
        }
      })
    },
    updateContent () {
      this.editable = false
      const data = this.$refs.quill.returnData()
      editClipboardData(data)
      listClipboardData()
    },
    contextMenuSaveImage () {
      const blob = dataURLtoBlob(this.data.base64data)
      const type = blob.type.split('/')[1]
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = (e) => {
        const link = document.createElement('a')
        link.download = `${this.data._id}.${type}`
        link.href = e.target.result
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    add2favorite (_id) {
      const newData = Object.assign({}, this.data)
      newData.favorite = _id
      delete newData._id
      move2Favorite(newData)
    },
    googleTranslate (url) {
      hideClipboard()
      this.execShellOpenLink(`${url}${this.data.text}`)
    }
  }
}
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
  margin: 0;
  font-size: smaller;
}

.box-card p.type {
  margin: 16px 0 5px 0;
  font-size: large;
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
  padding: 0 !important;
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
.text-card p.type:before {
  content: '文本 | ';
}

.image-card p.type:before {
  content: '图片 | ';
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

.el-dialog.is-fullscreen {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.el-message-box input {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.card-image {
  /*pointer-events: none;*/
}

.card-image img:hover {
  transform: scale(1.1, 1.1);
  filter: contrast(130%);
  pointer-events: auto;
}

.el-card.is-always-shadow {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

.el-card__header .clearfix {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.fullscreen {
  padding: 0 10%;
  pointer-events: none;
  background: rgba(255, 0, 0, 0) !important;
  width: auto !important;
  display: block !important;
}

pre.ql-syntax {
  background-color: #23241f;
  color: #f8f8f2;
}
</style>
