import Vue from 'vue';
import '../../ipc';
import store from '../../store';
import App from './App';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../../assets/icon/iconfont.css';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
Vue.use(ElementUI);

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      return dayjs;
    },
  },
});

/* eslint-disable no-new */
new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
