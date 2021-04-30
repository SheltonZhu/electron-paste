import Vue from 'vue';
import Vuex from 'vuex';
import defaultConfig from '../../shared/config';
import { getUpdatedKeys, merge } from '../../shared/utils';
import { createPersistedState, createSharedMutations } from 'electron-vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appConfig: defaultConfig,
    meta: {
      version: '',
      electron: '',
      defaultDownloadDir: '',
    },
    page: '1',
    href: 'https://www.bilibili.com',
  },

  mutations: {
    updateHref(state, nState) {
      state.href = nState;
    },
    // 更新应用配置
    updateConfig(state, [targetConfig, sync = false]) {
      const changed = getUpdatedKeys(state.appConfig, targetConfig);
      if (changed.length) {
        const extractConfig = {};
        changed.forEach((key) => {
          extractConfig[key] = targetConfig[key];
        });
        merge(state.appConfig, extractConfig);
        console.log('[store][updateConfig]: config updated: ', extractConfig);
        if (sync && process.type === 'renderer') {
          const { syncConfig } = require('../ipc');
          syncConfig(extractConfig);
        }
      }
    },
    // 更新应用元数据
    updateMeta(state, targetMeta) {
      merge(state.meta, targetMeta);
      console.log('[store][updateMeta]: meta updated: ', targetMeta);
    },
    // 更新设置页面
    updateView(state, targetView) {
      state.page = targetView.page;
      console.log('[store][updateMeta]: page updated: ', targetView);
    },
  },
  actions: {
    changeHref({ commit }, href) {
      commit('updateHref', href);
    },
    initConfig({ commit }, { config, meta }) {
      commit('updateConfig', [config]);
      commit('updateMeta', meta);
      if (meta.version && process.type === 'renderer') {
        document.title = `${document.title} v${meta.version}`;
      }
    },
    changePage({ commit }, page) {
      commit('updateView', { page: page });
    },
  },
  plugins: [
    createPersistedState({
      whitelist: ['changeHref'],
      storageName: 'electron-paste',
      delay: 500,
    }),
    createSharedMutations(),
  ],
});
