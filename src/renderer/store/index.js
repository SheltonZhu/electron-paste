import Vue from 'vue';
import Vuex from 'vuex';
import defaultConfig from '../../shared/config';
import { getUpdatedKeys, merge } from '../../shared/utils';
import {
  // createPersistedState,
  createSharedMutations,
} from 'electron-vuex';
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
    clipboardData: [],
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
    },
    updateClipboardData(state, data) {
      state.clipboardData = data;
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
    // createPersistedState({
    //   storageName: 'electron-paste',
    //   delay: 500,
    // }),
    createSharedMutations(),
  ],
});
