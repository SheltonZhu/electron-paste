import Vue from 'vue';
import Router from 'vue-router';
import Personalization from '../views/setting/Personalization';
import General from '../views/setting/General';
import Shortcut from '../views/setting/Shortcut';
import Rules from '../views/setting/Rules';
import About from '../views/setting/About';
import {
  PAGE_PERSONALIZATION,
  PAGE_SHORTCUT,
  PAGE_ABOUT,
  PAGE_GENERAL,
  PAGE_RULES,
} from '../../shared/env';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/personalization',
      name: PAGE_PERSONALIZATION.name,
      component: Personalization,
    },
    {
      path: '/general',
      name: PAGE_GENERAL.name,
      component: General,
    },
    {
      path: '/shortcut',
      name: PAGE_SHORTCUT.name,
      component: Shortcut,
    },
    {
      path: '/rules',
      name: PAGE_RULES.name,
      component: Rules,
    },
    {
      path: '/about',
      name: PAGE_ABOUT.name,
      component: About,
    },
    {
      path: '/',
      name: 'index',
      component: Personalization,
    },
  ],
});

export default router;
