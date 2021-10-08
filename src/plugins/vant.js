import Vue from 'vue'

import {
  Button as VButton,
  NavBar,
  Toast,
  Grid,
  GridItem,
  Tabbar,
  TabbarItem,
  Col,
  Row
} from "vant";

Vue.use(VButton)
Vue.use(NavBar)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Col)
Vue.use(Row)
Vue.prototype.$toast = Toast
