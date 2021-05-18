import Vue from 'vue';
import Vuex from 'vuex';
import defaultConfig from '../../shared/config';
import { getUpdatedKeys, merge } from '../../shared/utils';
import { createSharedMutations } from 'electron-vuex';
import { defaultHistoryFavorite } from '../../shared/env';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    appConfig: defaultConfig,
    meta: {
      version: '',
      electron: '',
      chrome: '',
      nodejs: '',
      v8: '',
      os: '',
    },
    page: '1',
    favorite: defaultHistoryFavorite,
    searchType: '',
    isSearching: false,
    query: '',
    clipboardData: [],
    favoritesData: [],
    dragData: {},
    iconMap: {},
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
        if (sync && process.type === 'renderer') {
          const { syncConfig } = require('../ipc');
          syncConfig(extractConfig);
        }
      }
    },
    // 更新应用元数据
    updateMeta(state, targetMeta) {
      merge(state.meta, targetMeta);
    },
    // 更新设置页面
    updateView(state, targetView) {
      state.page = targetView.page;
    },
    // 更新剪贴板页面
    updateClipboardData(state, data) {
      state.clipboardData = data;
    },
    // 更新查询字段
    updateQuery(state, query) {
      state.query = query;
    },
    // 更新查询类型
    updateSearchType(state, searchType) {
      state.searchType = searchType;
    },
    // 更新当前收藏栏
    updateFavorite(state, favorite) {
      state.favorite = favorite;
    },
    // 更新收藏栏数据
    updateFavoritesData(state, data) {
      state.favoritesData = data;
    },
    // 更新拖拽数据
    updateDragData(state, data) {
      state.dragData = data;
    },
    // 更新搜索状态
    updateIsSearch(state, stat) {
      state.isSearching = stat;
    },
    // 更新icon映射
    updateIconMap(state, map) {
      state.iconMap = map;
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
    changeSearch({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('updateQuery', params.query);
        commit('updateSearchType', params.searchType);
        resolve();
      });
    },
    changeFavorite({ commit }, favorite) {
      return new Promise((resolve, reject) => {
        commit('updateFavorite', favorite);
        resolve();
      });
    },
    saveDragData({ commit }, data) {
      commit('updateDragData', data);
    },
    changeIsSearch({ commit }, stat) {
      return new Promise((resolve, reject) => {
        commit('updateIsSearch', stat);
        resolve();
      });
    },
    changeIconMap({ commit }, map) {
      commit('updateIconMap', map);
    },
  },
  plugins: [createSharedMutations()],
});
