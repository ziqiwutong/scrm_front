<template>
   <div class="clue_container">
     <!--下拉菜单-->
     <div class="dropdown_box1">
       <van-dropdown-menu class="dropdown_item1">
         <van-dropdown-item v-model="value1" :options="option1" />
       </van-dropdown-menu>
     </div>
     <!--搜索框-->
     <div class="search_box">
       <van-search   shape="round" placeholder="请输入搜索关键词" />
     </div>
     <!--新建线索-->
     <div class="plus">
       <van-icon name="plus" size="20" @click="addClick" />
     </div>
     <van-popup v-model="show" position="bottom" :style="{ height: '90%' }">
       <van-form @submit="onSubmit">
         <van-field
           v-model="clueName"
           name="线索名称"
           label="线索名称"
           placeholder="请输入线索名称"
         />
         <van-field
           v-model="clueDate"
           name="线索录入时间"
           label="线索录入时间"
           placeholder="请输入线索录入时间"
         />
         <van-field
           v-model="clueStatus"
           name="线索状态"
           label="线索状态"
           placeholder="请输入线索状态"
         />
         <van-field
           v-model="clueEditor"
           name="线索录入人"
           label="线索录入人"
           placeholder="请输入线索录入人"
         />
         <van-field
           v-model="clueDiscover"
           name="线索发现人"
           label="线索发现人"
           placeholder="请输入线索发现人"
         />
         <van-field
           v-model="clueResponsibleStaff"
           name="线索责任人"
           label="线索责任人"
           placeholder="请输入线索责任人"
         />
         <van-field
           v-model="clueUpdateStatus"
           name="线索跟进情况"
           label="线索跟进情况"
           placeholder="请输入线索跟进情况"
         />
         <div style="margin: 16px;">
           <van-button round block type="info" native-type="submit">新建线索</van-button>
         </div>
       </van-form>
     </van-popup>
     <!--线索表单区域-->
     <van-cell-group class="cluelist">
       <van-cell  title="超有爱科技责任有限公司有购酒意向" value="2021年9月15日" label="线索状态：新线索" />
       <van-cell  title="超有爱科技责任有限公司有购酒意向" value="2021年9月15日" label="线索状态：新线索" />
       <van-cell  title="超有爱科技责任有限公司有购酒意向" value="2021年9月15日" label="线索状态：新线索" />
       <van-cell  title="超有爱科技责任有限公司有购酒意向" value="2021年9月15日" label="线索状态：新线索" />
       <van-cell  title="超有爱科技责任有限公司有购酒意向" value="2021年9月15日" label="线索状态：新线索" />
       <van-cell  title="超有爱科技责任有限公司有购酒意向" value="2021年9月15日" label="线索状态：新线索" />
     </van-cell-group>
     <TabBar/>
   </div>
</template>

<script>
import TabBar from "../../component/TabBar";

export  default  {
  components: {
    TabBar
  },
  data() {
    return {
      components: {
        TabBar
      },
      value1: 0,
      show:false,
      option1: [
        { text: '全部线索', value: 0 },
        { text: '跟进中线索', value: 1 },
        { text: '待分配线索', value: 2 },
        { text: '我跟进的线索', value: 3 },
        { text: '我协助的线索', value: 4 },
      ],
      onSubmit: " ",
      clueName: " ",
      clueDate: " ",
      clueStatus: " ",
      clueEditor: " ",
      clueDiscover: " ",
      clueResponsibleStaff: " ",
      clueUpdateStatus: " ",
    };
  },
  methods: {
    addClick() {
      this.show = true;
    },
  }
}
</script>

<style lang="less" scoped>
.clue_container {
  height:100%;
}
.dropdown_box1 {
  height: 20px;
  border: 1px solid #f6f6f6;
  z-index: 100;
}
.dropdown_item1 {
  position: fixed;
  left: 5px;
}
.search_box {
  position: fixed;
  top:0px;
  left:100px;
}
.plus {
  position: fixed;
  top:20px;
  right:10px;
}
.cluelist {
  margin-top: 50px;
}
</style>
