<template>
  <div>
    <!-- 导航栏 -->
    <van-row>
      <!-- 导航栏客户展示选择 -->
      <van-col span="8">
        <van-dropdown-menu>
          <van-dropdown-item v-model="cusVal" :options="cusOpt" />
        </van-dropdown-menu>
      </van-col>
      <!-- 搜索功能 -->
      <!-- 搜索框 -->
      <form action="/">
        <van-search
          v-if="!isSearch"
          v-model="searchVal"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onSearchCancel"
        />
      </form>
      <!-- 搜索图标 -->
      <van-col span="2" offset="12" v-if="isSearch"
        ><van-icon name="search" size="30" @click="toSearch"
      /></van-col>
      <!-- 新建图标 -->
      <van-col span="2" v-if="isSearch"
        ><van-icon name="plus" size="30" @click="toAdd" />
      </van-col>
    </van-row>
    <!-- 标签栏 -->
    <van-row>
      <van-tabbar v-model="barAct" :fixed="false">
        <!-- 最近浏览 -->
        <van-tabbar-item icon="home-o">最近浏览</van-tabbar-item>
        <!-- 筛选 -->
        <van-tabbar-item icon="search" @click="toScreen">筛选</van-tabbar-item>
        <!-- 多选 -->
        <van-tabbar-item icon="friends-o" @click="toCheckbox"
          >多选</van-tabbar-item
        >
      </van-tabbar>
    </van-row>
    <!-- 筛选内容 -->
    <van-popup v-model="scrShow" closeable position="right">
      <van-row v-for="item in scrList" :key="item.name">
        <p>{{ item.name }}</p>
        <van-button
          v-for="item1 in item.class"
          :key="item1.name"
          :class="item1.isSelected ? 'active1' : ''"
          @click="cutTabClick(item1)"
        >
          {{ item1.name }}</van-button
        >
      </van-row>
      <!-- 筛选内容提交 -->
      <van-button type="info" @click="screen">确定</van-button>
      <!-- 筛选内容重置 -->
      <van-button type="default" @click="reset">重置</van-button>
    </van-popup>

    <!-- 多选内容 -->
    <van-popup
      v-model="cheShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      close-icon="close"
    >
      <!-- 多选内容导航栏 -->
      <van-nav-bar title="客户详情">
        <template #right> 已选中{{ scrnum }}人 </template>
      </van-nav-bar>
      <!-- 多选内容客户信息 -->
      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in cusList"
            :key="item.customerID"
            v-show="item.isShow"
            clickable
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" />
            </template>
            <van-row @click="onDetail">
              <van-col span="4" offset="1">
                <van-image
                  round
                  width="40"
                  height="40"
                  :src="item.basicMsg[0].customerPhoto"
                />
              </van-col>
              <van-col span="8">{{ item.basicMsg[0].customerName }}</van-col>
              <van-col span="8"
                >{{ item.distributeMsg[0].enterPoolDate }}进入客户池</van-col
              >
              <van-col span="16">{{ item.companyMsg[0].company }}</van-col>
              <van-col span="5"
                ><van-tag type="success">{{
                  item.distributeMsg[0].cuostomerStatus
                }}</van-tag></van-col
              >
              <van-col span="5"
                ><van-tag type="danger">{{
                  item.contactMsg[0].ageRange
                }}</van-tag></van-col
              >
              <van-col span="5"
                ><van-tag type="warning">{{
                  item.contactMsg[0].source
                }}</van-tag></van-col
              >
            </van-row>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <!-- 多选内容标签栏 -->
      <van-tabbar>
        <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
        <van-tabbar-item icon="search">分配客户</van-tabbar-item>
        <van-tabbar-item icon="friends-o">打标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o">发短信</van-tabbar-item>
        <van-tabbar-item icon="setting-o">批量删除</van-tabbar-item>
      </van-tabbar>
    </van-popup>

    <!-- 客户列表内容 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-swipe-cell
        v-for="item in cusList"
        :key="item.customerID"
        v-show="item.isShow"
      >
        <van-row @click="onDetail">
          <van-col span="4" offset="1">
            <van-image
              round
              width="40"
              height="40"
              :src="item.basicMsg[0].customerPhoto"
            />
          </van-col>
          <van-col span="8">{{ item.basicMsg[0].customerName }}</van-col>
          <van-col span="8"
            >{{ item.distributeMsg[0].enterPoolDate }}进入客户池</van-col
          >
          <van-col span="16">{{ item.companyMsg[0].company }}</van-col>
          <van-col span="5"
            ><van-tag type="success">{{
              item.distributeMsg[0].cuostomerStatus
            }}</van-tag></van-col
          >
          <van-col span="5"
            ><van-tag type="danger">{{
              item.contactMsg[0].ageRange
            }}</van-tag></van-col
          >
          <van-col span="5"
            ><van-tag type="warning">{{
              item.contactMsg[0].source
            }}</van-tag></van-col
          >
        </van-row>
        <!-- 滑动删除 -->
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" />
        </template>
      </van-swipe-cell>
    </van-list>

    <!-- 编辑添加跳转 -->
    <van-action-sheet
      v-model="addShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="onCancel"
    />

    <!-- 添加表单 -->
    <van-popup
      v-model="showform"
      closeable
      position="bottom"
      close-icon-position="top-right"
      close-icon="close"
    >
      <van-form @submit="onSubmit">
        <p>客户信息</p>
        <van-field name="uploader" label="头像">
          <template #input>
            <van-uploader v-model="uploader" />
          </template>
        </van-field>
        <van-field
          v-model="value2"
          name="validator"
          label="姓名"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="手机"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="微信昵称"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="微信号"
          placeholder="请输入"
        />
        <van-field name="uploader" label="标签">
          <template #input>
            <van-tag type="warning">标签</van-tag>
          </template>
        </van-field>
        <p>公司信息</p>
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </van-popup>

    <!-- test按钮 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 列表信息-展示
      cusVal: 0,
      // 列表信息-内容
      cusOpt: [
        { text: "全部客户", value: 0 },
        { text: "潜在客户", value: 1 },
        { text: "客户", value: 2 },
      ],
      // 搜索-搜索内容
      searchVal: "",
      // 搜索-搜索图标展示
      isSearch: true,

      // 新增客户-弹出层信息
      actions: [
        { name: "新增用户", callback: this.formClick },
        { name: "扫描名片" },
      ],
      // 编辑界面
      addShow: false,
      // 筛选界面
      scrShow: false,
      // 多选界面
      cheShow: false,
      // 标签栏绑定标识符
      barAct: 0,

      addShow: false,
      // 多选-记录选中客户的数量
      scrnum: 0,
      value: "",
      list: [],
      username: "",
      password: "",
      loading: false,
      finished: false,
      show: false,
      //新建客户界面
      showform: false,
      active: 0,
      list3: ["a", "b"],
      result: [],
      checkVal: [],
      //客户列表
      cusList: [
        {
          customerID: "1",
          isShow: true,
          basicMsg: [
            {
              customerPhoto:
                "https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=f240ee32c7160924c325a41be406359b/a08b87d6277f9e2f43b5946c0830e924b999f3d6.jpg",
              customerName: "祖佳晟",
              customerPhone: "1234",
            },
          ],
          contactMsg: [
            {
              wxName: "",
              wxID: "",
              sex: "男",
              ageRange: "青少年",
              label: "",
              source: "高管推荐",
              position: "",
              birthday: "",
              hobby: "",
            },
          ],
          companyMsg: [
            {
              company: "电子科技大学",
              legalStaff: "",
              customerLevel: "",
              companyType: "",
              industrudyType: "",
              registerCapital: "",
              staffAmount: "",
              region: "",
              address: "",
              businessRange: "",
              trademark: "",
              channelCapability: "",
              hasDZAbility: "",
              notes: "",
              enclosure: "",
            },
          ],
          distributeMsg: [
            {
              cuostomerStatus: "成交",
              followStaff: "",
              helpStaff: "",
              enterPoolDate: "10-12",
              orderAmount: "",
              orderNumber: "",
            },
          ],
        },
        {
          customerID: "2",
          isShow: true,
          basicMsg: [
            {
              customerPhoto:
                "https://img0.baidu.com/it/u=1853361355,1254294851&fm=26&fmt=auto",
              customerName: "杨幂",
              customerPhone: "1234",
            },
          ],
          contactMsg: [
            {
              wxName: "",
              wxID: "",
              sex: "女",
              ageRange: "中青年",
              label: "",
              source: "手动新建",
              position: "",
              birthday: "",
              hobby: "",
            },
          ],
          companyMsg: [
            {
              company: "欢瑞世纪影视传媒股份有限公司",
              legalStaff: "",
              customerLevel: "",
              companyType: "",
              industrudyType: "",
              registerCapital: "",
              staffAmount: "",
              region: "",
              address: "",
              businessRange: "",
              trademark: "",
              channelCapability: "",
              hasDZAbility: "",
              notes: "",
              enclosure: "",
            },
          ],
          distributeMsg: [
            {
              cuostomerStatus: "成交",
              followStaff: "",
              helpStaff: "",
              enterPoolDate: "10-13",
              orderAmount: "",
              orderNumber: "",
            },
          ],
        },
        {
          customerID: "3",
          isShow: true,
          basicMsg: [
            {
              customerPhoto:
                "https://img2.baidu.com/it/u=308626782,3533483582&fm=26&fmt=auto",
              customerName: "腾讯公司",
              customerPhone: "1234",
            },
          ],
          contactMsg: [
            {
              wxName: "",
              wxID: "",
              sex: "",
              ageRange: "中老年",
              label: "",
              source: "内容营销",
              position: "",
              birthday: "",
              hobby: "",
            },
          ],
          companyMsg: [
            {
              company: "深圳市腾讯计算机系统有限公司",
              legalStaff: "",
              customerLevel: "",
              companyType: "",
              industrudyType: "",
              registerCapital: "",
              staffAmount: "",
              region: "",
              address: "",
              businessRange: "",
              trademark: "",
              channelCapability: "",
              hasDZAbility: "",
              notes: "",
              enclosure: "",
            },
          ],
          distributeMsg: [
            {
              cuostomerStatus: "成交",
              followStaff: "",
              helpStaff: "",
              enterPoolDate: "10-15",
              orderAmount: "",
              orderNumber: "",
            },
          ],
        },
      ],
      wpList: [
        {
          name: "食品饮料",
        },
        {
          name: "鲜花",
        },
        {
          name: "蛋糕",
        },
        {
          name: "水果生鲜",
        },
        {
          name: "服装鞋帽",
        },
        {
          name: "其它",
        },
      ],
      // 筛选列表
      scrList: [
        {
          name: "性别",
          class: [
            { name: "男", isSelected: false },
            { name: "女", isSelected: false },
          ],
        },
        {
          name: "年龄范围",
          class: [
            { name: "青少年", isSelected: false },
            { name: "中青年", isSelected: false },
            { name: "中老年", isSelected: false },
          ],
        },
        { name: "标签", class: [] },
        { name: "来源", class: [] },
        { name: "查关系", class: [] },
        { name: "企微-客户等级", class: [] },
        { name: "企业类型", class: [] },
        { name: "行业分类", class: [] },
        { name: "注册资本", class: [] },
        { name: "员工数量", class: [] },
        { name: "公司产品", class: [] },
      ],
      selectList: [],
      checked: false,
      active1: "",
    };
  },
  methods: {
    // 搜索功能
    onSearch(val) {
      console.log(val);
      let i;
      for (i = 0; i < this.cusList.length; i++) {
        this.cusList[i].isShow = false;
      }
      this.cusList.forEach((item) => {
        if (item.basicMsg[0].customerName.indexOf(val) !== -1) {
          item.isShow = true;
        }
      });
    },
    // 取消搜索
    onSearchCancel() {
      this.isSearch = !this.isSearch;
      for (let i = 0; i < this.cusList.length; i++) {
        this.cusList[i].isShow = true;
      }
    },
    // 搜索功能跳转
    toSearch() {
      this.isSearch = !this.isSearch;
    },
    // 编辑功能跳转
    toAdd() {
      this.addShow = true;
    },
    // 筛选功能跳转
    toScreen() {
      this.scrShow = !this.scrShow;
    },
    // 多选功能跳转
    toCheckbox() {
      this.cheShow = !this.cheShow;
    },

    onCancel() {
      this.show = false;
    },
    onClick(name, title) {
      Toast(title);
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= 10) {
          this.finished = true;
        }
      }, 1000);
    },

    onDetail() {
      this.$router.replace("/perinfor");
    },

    selected(name) {
      this.active1 = name;
    },
    cutTabClick(item) {
      //然后通过这个属性判断是否选中点亮和取消
      item.isSelected = !item.isSelected;
    },
    //复选框单选
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
      if (!this.$refs.checkboxes[index].checked) {
        this.scrnum++;
      } else {
        this.scrnum--;
      }
    },
    //通过扫描方式获取多选的标签
    screen() {
      this.selectList = [];
      let i, j;
      //读取选中的标签
      for (i = 0; i < this.scrList.length; i++) {
        for (j = 0; j < this.scrList[i].class.length; j++) {
          if (this.scrList[i].class[j].isSelected == true) {
            this.selectList.push(this.scrList[i].class[j].name);
          }
        }
      }
      console.log(this.selectList);
      // console.log(this.scrList[1].class[2].name);
      // 先将所有列表内容设置为不显示
      for (i = 0; i < this.cusList.length; i++) {
        this.cusList[i].isShow = false;
      }
      // 如果查到相应标签就显示相关内容
      for (i = 0; i < this.selectList.length; i++) {
        this.cusList.forEach((item) => {
          if (item.contactMsg[0].sex.indexOf(this.selectList[i]) !== -1) {
            item.isShow = true;
          }
          if (item.contactMsg[0].ageRange.indexOf(this.selectList[i]) !== -1) {
            item.isShow = true;
          }
          if (item.contactMsg[0].source.indexOf(this.selectList[i]) !== -1) {
            item.isShow = true;
          }
        });
      }
    },
    //重置多选标签
    reset() {
      let i, j;
      for (i = 0; i < this.scrList.length; i++) {
        for (j = 0; j < this.scrList[i].class.length; j++) {
          if (this.scrList[i].class[j].isSelected == true) {
            this.scrList[i].class[j].isSelected = false;
          }
        }
      }
      for (i = 0; i < this.cusList.length; i++) {
        this.cusList[i].isShow = true;
      }
    },
    //全选单选设置
    checkAll() {
      if (this.checked) {
        this.$refs.checkboxGroup.toggleAll(false);
        this.$refs.checkboxGroup.toggleAll(true);
        this.scrnum = this.result.length;
      } else {
        this.$refs.checkboxGroup.toggleAll(false);
        this.scrnum = this.result.length;
      }
    },
    formClick() {
      this.showform = !this.showform;
    },
    onSubmit(values) {
      console.log("submit", values);
    },
    onTest(value) {
      console.log(value);
    },
  },
};
</script>

<style lang="less" scoped>
.active1 {
  background: #fd7522;
  border: 1px solid #fd7522;
  color: #fff;
}
</style>