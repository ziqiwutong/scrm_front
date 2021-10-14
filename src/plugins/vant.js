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
  Row,
  Search,
  DropdownMenu,
  DropdownItem,
  Icon,
  Form,
  Field,
  Popup,
  ActionSheet,
  Cell,
  CellGroup,
  ContactEdit,
  DatetimePicker
} from "vant";

Vue.use(VButton)
Vue.use(NavBar)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Col)
Vue.use(Row)
Vue.use(Search)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Icon)
Vue.use(Form)
Vue.use(Field)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(ContactEdit)
Vue.use(DatetimePicker)
Vue.prototype.$toast = Toast
