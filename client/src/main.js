import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import App from './App.vue';
import loginPage from './components/loginPage.vue';
import registerPage from './components/registerPage.vue';
import admin from './components/admin.vue';
import table from './components/table.vue';
import homePage from './components/homePage.vue';
import store from '../store';
import detailProduct from './components/detailProduct.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.prototype.$axios = axios.create({ baseURL: 'http://localhost:3000' });
const routes = [{
  path: '/login', component: loginPage, name: 'loginPage', meta: { Auth: false },
},
{
  path: '/',
  component: homePage,
  name: 'homePage',
  meta: { Auth: false },
},
{
  path: '/admin',
  component: admin,
  name: 'admin',
  meta: { Auth: true, isAdmin: true },
  children: [{
    path: '/', component: table, name: 'tableProduct',
  },
  {
    path: '/register', component: registerPage, name: 'registerPage',
  },
  {
    path: '/detail/:id', component: detailProduct, name: 'detailProduct',
  }],
},
];


const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  // next();
  if (!to.matched.some((record) => record.meta.Auth)) {
    if (localStorage.token) {
      if (localStorage.role === 'admin') {
        next({
          name: 'tableProduct',
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.Auth)) {
    if (!localStorage.token) {
      next({
        name: 'homePage',
      });
    } else if (to.matched.some((record) => record.meta.isAdmin)) {
      if (localStorage.role === 'admin') {
        next();
      } else {
        next({
          name: 'homePage',
        });
      }
    } else {
      next();
    }
  }
});
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount('#app');