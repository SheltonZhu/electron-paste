import Vue from 'vue';
import Vuex from 'vuex';
import defaultConfig from '../../shared/config';
import { getUpdatedKeys, merge } from '../../shared/utils';
import { createPersistedState, createSharedMutations } from 'electron-vuex';
import { defaultHistoryFavorite } from '../../shared/env';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    appConfig: defaultConfig,
    meta: {
      version: '',
      electron: '',
      defaultDownloadDir: '',
    },
    page: '1',
    favorite: defaultHistoryFavorite,
    searchType: '',
    query: '',
    clipboardData: [
      {
        type: 'Text',
        text: 'text',
        // html: '<h1>html</h1>',
        html: `<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head><body><pre style="background-color:#2b2b2b;color:#a9b7c6;font-family:'JetBrains Mono',monospace;font-size:9.
8pt;"><span style="color:#e8bf6a;">&lt;span&#32;</span><span style="color:#bababa;">v-if</span><span style="color:#a5c261;">="</span><span style="color:#9876aa;">data</span>.<span style="color:#9876aa;">ht
ml</span><span style="color:#a5c261;">"&#32;</span><span style="color:#bababa;">v-html</span><span style="color:#a5c261;">="</span><span style="color:#9876aa;">data</span>.<span style="color:#9876aa;">html
</span><span style="color:#a5c261;">"&#32;</span><span style="color:#e8bf6a;">/&gt;</span></pre></body></html>`,
        meta: { charLength: 25 },
      },
    ],
    favoritesData: [],
    dragData: {},
  },
  mutations: {
    // 更新应用配置
    updateConfig(state, [targetConfig, sync = false]) {
      const changed = getUpdatedKeys(state.appConfig, targetConfig);
      if (changed.length) {
        const extractConfig = {};
        changed.forEach((key) => {
          extractConfig[key] = targetConfig[key];
        });
        merge(state.appConfig, extractConfig);
        // console.log('[store][updateConfig]: config updated: ', extractConfig);
        if (sync && process.type === 'renderer') {
          const { syncConfig } = require('../ipc');
          syncConfig(extractConfig);
        }
      }
    },
    // 更新应用元数据
    updateMeta(state, targetMeta) {
      merge(state.meta, targetMeta);
      // console.log('[store][updateMeta]: meta updated: ', targetMeta);
    },
    // 更新设置页面
    updateView(state, targetView) {
      state.page = targetView.page;
      // TODO 跳转到页面
      // if (process.type === 'renderer') {
      // const { router } = require('../router')
      // router.push({ 'name': targetView.name }).then()
      // }
      // console.log('[store][updateMeta]: page updated: ', targetView);
    },
  },
  actions: {
    initConfig({ commit }, { config, meta }) {
      commit('updateConfig', [config]);
      commit('updateMeta', meta);
      if (meta.version && process.type === 'renderer') {
        document.title = `${document.title} v${meta.version}`;
      }
    },
    changeConfig({ commit }, targetConfig) {
      commit('updateConfig', [targetConfig, true]);
    },

    changePage({ commit }, targetView) {
      commit('updateView', targetView);
    },
  },
  plugins: [
    createPersistedState({
      storageName: 'electron-paste',
      delay: 500,
    }),
    createSharedMutations(),
  ],
});
