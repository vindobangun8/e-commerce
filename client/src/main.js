import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import App from "./App.vue";
import loginPage from "./components/loginPage.vue";
import registerPage from "./components/registerPage.vue";
import admin from "./views/admin.vue";
import table from "./components/table.vue";
import homePage from "./views/homePage.vue";
import store from "../store";
import detailProduct from "./components/detailProduct.vue";
import tableCategory from "./components/tableCategory.vue";
import cartDetail from "./views/cartDetail.vue";
import errorPage from "./views/404.vue";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.prototype.$axios = axios.create({ baseURL: "https://ma-tea.herokuapp.com" });
// Vue.prototype.$axios = axios.create({ baseURL: "http://localhost:3000" });
Vue.prototype.$currencyFormatter = input => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  });
  return formatter.format(input);
};
const routes = [
  {
    path: "/",
    component: homePage,
    name: "homePage",
    meta: { Auth: false }
  },
  {
    path: "/register",
    component: registerPage,
    name: "registerPage",
    beforeEnter: (to, from, next) => {
      if (localStorage.token) {
        next({
          name: "homePage"
        });
      } else {
        next();
      }
    }
  },
  {
    path: "/login",
    component: loginPage,
    name: "loginPage",
    beforeEnter: (to, from, next) => {
      if (localStorage.token) {
        next({
          name: "homePage"
        });
      } else {
        next();
      }
    }
  },
  {
    path: "/cart",
    component: cartDetail,
    name: "cartDetail"
  },
  {
    path: "/admin",
    component: admin,
    name: "admin",
    meta: { Auth: true, isAdmin: true },
    children: [
      {
        path: "/",
        component: table,
        name: "tableProduct"
      },
      {
        path: "/detail/:id",
        component: detailProduct,
        name: "detailProduct"
      },
      {
        path: "/category",
        component: tableCategory,
        name: "categoryDetail"
      }
    ]
  },
  {
    path: "*",
    component: errorPage,
    name: "errorPage"
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  // next();
  if (!to.matched.some(record => record.meta.Auth)) {
    if (localStorage.token) {
      if (localStorage.role === "admin") {
        next({
          name: "tableProduct"
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.Auth)) {
    if (!localStorage.token) {
      next({
        name: "homePage"
      });
    } else if (to.matched.some(record => record.meta.isAdmin)) {
      if (localStorage.role === "admin") {
        next();
      } else {
        next({
          name: "homePage"
        });
      }
    } else {
      next();
    }
  }
});
new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
