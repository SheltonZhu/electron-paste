<template>
  <div>
    <div style="text-align: center">
      <div>自定义关键字</div>
      <div class="tip">（包含关键字的内容不会被复制，可使用正则表达式）</div>
      <div class="regex-container">
        <regex-input
          v-for="(regex, idx) in appConfig.regexList"
          :key="idx"
          :index="idx"
          :data="regex"
        >
        </regex-input>
      </div>
      <div>
        <el-button @click="addRegex" class="el-icon-plus"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import RegexInput from '../../components/RegexInput';
import { clone } from '../../../shared/utils';

export default {
  name: 'Rules',
  components: { RegexInput },
  computed: {
    ...mapState(['appConfig']),
  },
  methods: {
    ...mapActions(['changeConfig']),
    addRegex() {
      const regexList = clone(this.appConfig.regexList);
      regexList.unshift('新规则');
      this.changeConfig({ regexList: regexList });
    },
  },
};
</script>

<style scoped>
.regex-container {
  background: #fff;
  height: 400px;
  overflow-y: scroll;
  margin: 10px 0;
}

.tip {
  padding-top: 5px;
  font-size: smaller;
}
</style>
