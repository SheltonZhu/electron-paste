import Vue from 'vue';
import Router from 'vue-router';
import Personalization from '../views/setting/Personalization';
import General from '../views/setting/General';
import Shortcut from '../views/setting/Shortcut';
import Rules from '../views/setting/Rules';
import About from '../views/setting/About';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/personalization',
      name: 'personalization',
      component: Personalization,
    },
    {
      path: '/general',
      name: 'general',
      component: General,
    },
    {
      path: '/shortcut',
      name: 'shortcut',
      component: Shortcut,
    },
    {
      path: '/rules',
      name: 'rules',
      component: Rules,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
  ],
});
