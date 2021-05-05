<template>
  <div class="about">
    <div style="text-align: center">
      <el-row
        class="row"
        style="display: flex; align-items: center; margin: 15px 110px"
      >
        <external-link :href="homepage">
          <el-image
            src="../static/icon.png"
            fit="center"
            style="
              width: 100px;
              height: 100px;
              margin: 0 20px 10px 100px;
              cursor: pointer;
            "
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </external-link>

        <div style="font-size: 30px; font-weight: bold">
          {{ formattedAppName }}
        </div>
        <div style="margin: 10px 0 0 10px">v{{ meta.version }}</div>
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import pkg from '../../../../package.json';
import ExternalLink from '../../components/ExternalLink';

export default {
  name: 'About',
  components: { ExternalLink },
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
