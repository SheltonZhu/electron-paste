<template>
  <div class="about">
    <github-corner :href="homepage" class="github-corner" />

    <div style="text-align: center">
      <el-row
        class="row"
        style="display: flex; align-items: center; margin: 15px 100px"
      >
        <external-link :href="homepage">
          <pan-thumb
            image="../static/icon.png"
            width="100px"
            height="100px"
            style="margin: 0 20px 10px 100px; box-shadow: none"
          />
        </external-link>
        <div style="font-size: 32px; font-weight: bold">
          <mallki :text="formattedAppName"></mallki>
        </div>
        <div style="margin: 10px 0 0 10px">
          <mallki :text="'v' + meta.version"></mallki>
        </div>
        <el-badge
          v-if="hasUpdate"
          @click.native="downloadNewVersion"
          value="new"
          style="cursor: pointer"
        />
      </el-row>

      <el-row
        class="row vertically-center"
        v-for="(content, field) of about"
        :key="field"
      >
        <el-col :span="8">
          <div class="field">{{ field }}</div>
        </el-col>
        <el-col :span="16">
          <div class="content">{{ content }}</div>
        </el-col>
      </el-row>
      <!--      <el-row class="row vertically-center" v-for="(value, key) of meta">-->
      <!--        <el-col :span="12" >-->
      <!--          <div class="field">-->
      <!--            {{key}}-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--        <el-col :span="12">-->
      <!--          <div class="content">-->
      <!--            v{{value}}-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import pkg from '../../../../package.json';
import ExternalLink from '../../components/ExternalLink';
import GithubCorner from '../../components/GIthubCorner';
import Mallki from '../../components/Mallki';
import PanThumb from '../../components/PanThumb';
export default {
  name: 'About',
  components: { Mallki, ExternalLink, GithubCorner, PanThumb },
  data() {
    return {
      hasUpdate: false,
      downloadUrl: '',
      homepage: pkg.homepage,
      appName: pkg.name.split('-').join(' '),
      about: {
        项目地址: pkg.homepage,
        描述: pkg.description,
        作者: [pkg.author.split(' ')[0], pkg.author.split(' ')[1]].join(' '),
        联系方式: pkg.author.split(' ')[2],
      },
    };
  },
  computed: {
    ...mapState(['meta']),
    formattedAppName() {
      const [origin, name] = this.appName.split(' ');
      return [
        origin.charAt(0).toUpperCase(),
        origin.slice(1),
        ' ',
        name.charAt(0).toUpperCase(),
        name.slice(1),
      ].join('');
    },
    downloadNewVersion() {
      if (this.downloadUrl) {
        this.$electron.remote.shell.openExternal(this.downloadUrl);
      }
    },
  },
};
</script>

<style scoped>
.github-corner {
  position: absolute;
  bottom: 0;
  border: 0;
  right: 0;
  transform: rotate(90deg);
}

.row {
  padding: 10px 5px;
}

.field {
  text-align: right;
}

.field:after {
  content: '：';
  text-align: left;
}

.about .content {
  text-align: left;
}

.vertically-center {
  display: flex;
  align-items: center;
}
</style>
