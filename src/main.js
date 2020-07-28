import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { NavPlugin, NavbarPlugin } from "bootstrap-vue";
import { AlertPlugin } from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(AlertPlugin)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(NavPlugin)
Vue.use(NavbarPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
