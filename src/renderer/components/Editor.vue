<template>
  <div>
    <div class="editor"></div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { clone } from '../../shared/utils';

export default {
  name: 'Editor',
  props: {
    data: Object,
  },
  data() {
    return {
      quill: null,
      options: {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
        placeholder: '请输入文本...',
      },
    };
  },
  mounted() {
    const dom = this.$el.querySelector('.editor');
    this.quill = new Quill(dom, this.options);
    if (this.data.html) {
      if (this.data.html.length < 5000) {
        this.quill.pasteHTML(0, this.data.html, 'silent');
        // this.quill.root.innerHTML = this.data.html
      } else {
        this.quill.root.innerHTML = this.data.html;
      }
    } else {
      this.quill.pasteHTML(0, this.data.text, 'silent');
    }
    // this.quill.on('text-change', () => {
    //   this.$emit('input', this.quill.getContents());
    // });
  },
  methods: {
    returnData() {
      const nData = clone(this.data, true);
      nData.html = this.quill.root.innerHTML;
      nData.text = this.quill.getText(0, this.quill.getLength());
      nData.rtf = '';
      nData.meta = { charLength: nData.text.length };
      return nData;
    },
  },
};
</script>

<style scoped>
.editor {
  height: 270px;
}
</style>
<style>
.el-dialog--center .el-dialog__body {
  padding: 10px 25px !important;
}
</style>
