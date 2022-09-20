import App from './App';
import Vue from 'vue';
import Vuex from 'vuex';
import Antd from 'ant-design-vue';
import router from './router';
import store from './store';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'ant-design-vue/dist/antd.css';
import './lib';
import './components';
import './assets/icons';
import './style/index.less';
import './directives';
import 'current-device';

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(moment);
Vue.use(Vuex);

Vue.prototype.$bus = new Vue();
Vue.filter('moment', (data, formatStr) => (sp.isNullOrEmpty(data) ? '' : moment(data).format(formatStr)));
moment.locale('zh-cn');
Vue.prototype.$moment = moment;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});