<template>
  <div
    id="app"
    class="bg"
    :style="{
      'background-image': appConfig.enableBackgroundPic
        ? imageUrl
          ? 'url(' + imageUrl + ')'
          : 'url(' + defaultBg + ')'
        : 'none',
    }"
  >
    <div
      style="height: 500px"
      :style="{
        'background-color': appConfig.backgroundColor,
        'backdrop-filter': appConfig.enableBackgroundBlur
          ? appConfig.backgroundBlurValue
            ? 'saturate(180%) blur(' + appConfig.backgroundBlurValue + 'px)'
            : 'saturate(180%) blur(5px)'
          : 'none',
      }"
    >
      <h1>Hello clipboard!</h1>
      <el-button @click="copy">复制</el-button>
      <el-button @click="paste">粘贴</el-button>
      <h1>{{ appConfig }}</h1>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { hideAndPaste } from '../../ipc';

export default {
  data() {
    return {
      imageUrl: '',
      defaultBg: 'https://www.twcode01.com/images/demo/demo2.jpg',
    };
  },
  computed: { ...mapState(['appConfig']) },
  methods: {
    copy() {
      hideAndPaste({ content: 'copy only' });
    },
    paste() {
      hideAndPaste({
        content: 'direct paste',
        directPaste: this.appConfig.directPaste,
      });
    },
  },
};
</script>
<style>
body {
  margin: 0 auto;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.bg {
  height: 472px;
  background-size: cover;
}
</style>
