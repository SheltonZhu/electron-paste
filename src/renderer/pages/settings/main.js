import Vue from "vue";
import '../../ipc'
import store from "../../store";
import router from  "../../router"
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import { getInitConfig } from '../../ipc'
// import { init as initShortcut } from './shortcut'

Vue.config.productionTip = false;
Vue.use(ElementUI)
if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
// 启动应用时获取初始化数据
// getInitConfig()
// initShortcut(store.state.appConfig)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
