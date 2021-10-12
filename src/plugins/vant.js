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
  DropdownMenu,
  DropdownItem,
  Search,
  Icon,
  Tag,
  Tab,
  Tabs,
  SwipeCell,
  List,
  Image as VanImage,
  Dialog,
  Cell, 
  CellGroup,
  Step, 
  Steps,
  Popup,
  RadioGroup,
  Radio,
  Checkbox, 
  CheckboxGroup,
  ActionSheet,  
  Form,
  Field,
  Uploader 
} from "vant";
Vue.use(Uploader);
Vue.use(Form);
Vue.use(Field);
Vue.use(ActionSheet);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Popup);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Dialog);
Vue.use(VanImage);
Vue.use(List);
Vue.use(SwipeCell);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Search);
Vue.use(VButton)  
Vue.use(NavBar)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Col)
Vue.use(Row)
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.prototype.$toast = Toast
