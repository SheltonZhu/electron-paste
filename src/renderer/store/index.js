import Vue from 'vue'
import Vuex from 'vuex'
import defaultConfig from '../../shared/config'
import { getUpdatedKeys, merge } from '../../shared/utils'
import { syncConfig } from '../ipc'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appConfig: defaultConfig,
    meta: {
      version: '',
      defaultDownloadDir: ''
    }
  },
  mutations: {
    // 更新应用配置
    updateConfig (state, [targetConfig, sync = false]) {
      const changed = getUpdatedKeys(state.appConfig, targetConfig)
      if (changed.length) {
        const extractConfig = {}
        changed.forEach(key => {
          extractConfig[key] = targetConfig[key]
        })
        merge(state.appConfig, extractConfig)
        console.log('[store][updateConfig]: config updated: ', extractConfig)
        if (sync) {
          syncConfig(extractConfig)
        }
      }
    },
    // 更新应用元数据
    updateMeta (state, targetMeta) {
      merge(state.meta, targetMeta)
      console.log('[store][updateMeta]: meta updated: ', targetMeta)
    }
  },
  actions: {
    initConfig ({ commit }, { config, meta }) {
      commit('updateConfig', [config])
      commit('updateMeta', meta)
      if (meta.version) {
        document.title = `${document.title} v${meta.version}`
      }
    }
  }
})
