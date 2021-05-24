import Vue from 'vue';
import '../../ipc';
import store from '../../store';
import router from '../../router';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../../assets/icon/iconfont.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
