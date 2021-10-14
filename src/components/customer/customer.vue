<template>
  <div>
    <!-- 导航栏 -->
    <van-row>
      <!-- 导航栏客户展示选择 -->
      <div>
        <van-col span="8">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item v-model="cusVal" :options="cusOpt" />
          </van-dropdown-menu>
        </van-col>
      </div>
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
          class="schbox"
        />
      </form>
      <!-- 搜索图标 -->
      <van-col class="schbtn" span="2" offset="12" v-if="isSearch"
        ><van-icon name="search" size="30" @click="toSearch"
      /></van-col>
      <!-- 分割线 -->
      <van-col class="separate" v-if="isSearch">|</van-col>
      <!-- 新建图标 -->
      <van-col class="addbtn" span="2" v-if="isSearch"
        ><van-icon name="plus" size="30" @click="toAdd" />
      </van-col>
    </van-row>
    <!-- 标签栏 -->
    <van-row>
      <van-tabbar v-model="barAct" :fixed="false">
        <!-- 最近浏览 -->
        <van-tabbar-item class="navopt">
          <van-icon name="chat-o" />最近浏览
        </van-tabbar-item>
        <!-- 筛选 -->
        <van-tabbar-item class="navopt" @click="toScreen"
          ><van-icon name="chat-o" />筛选</van-tabbar-item
        >
        <!-- 多选 -->
        <van-tabbar-item class="navopt" @click="toCheckbox"
          ><van-icon name="chat-o" />多选</van-tabbar-item
        >
      </van-tabbar>
    </van-row>
    <!-- 筛选内容 -->
    <van-popup v-model="scrShow" closeable position="right" class="scrpop">
      <van-row v-for="item in scrList" :key="item.name">
        <p class="scrname">{{ item.name }}</p>
        <van-button
          v-for="item1 in item.class"
          :key="item1.name"
          :class="item1.isSelected ? 'actscrbtn' : 'scrbtn'"
          @click="cutTabClick(item1)"
        >
          {{ item1.name }}</van-button
        >
      </van-row>
      <!-- 筛选内容重置 -->
      <van-button type="default" @click="reset" class="scrresbtn" hairline
        >重置</van-button
      >
      <!-- 筛选内容提交 -->
      <van-button type="info" @click="screen" class="scrfirbtn"
        >确定</van-button
      >
    </van-popup>

    <!-- 多选内容 -->
    <van-popup
      v-model="cheShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      close-icon="close"
      class="chcgroup"
    >
      <!-- 多选内容导航栏 -->
      <van-nav-bar title="客户详情">
        <template #right> 已选中{{ scrnum }}项 </template>
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
            <van-row class="chelist">
              <van-row>
                <van-col span="4">
                  <van-image
                    round
                    width="40"
                    height="40"
                    :src="item.basicMsg[0].customerPhoto"
                  />
                </van-col>
                <van-col span="12" class="cusname"
                  ><div class="van-ellipsis">
                    {{ item.basicMsg[0].customerName }}
                  </div></van-col
                >
                <van-col span="8" class="custime"
                  >{{ item.distributeMsg[0].enterPoolDate }}进入客户池</van-col
                >
                <van-col span="16" class="cusmsg">{{
                  item.companyMsg[0].company
                }}</van-col>
              </van-row>

              <van-row>
                <van-col span="3" offset="4" class="tagmar"
                  ><van-tag color="#E7F7E3" text-color="#67C74D">{{
                    item.distributeMsg[0].cuostomerStatus
                  }}</van-tag></van-col
                >
                <van-col span="4"
                  ><van-tag color="#F5F5F5" text-color="#B1B1B1">{{
                    item.contactMsg[0].ageRange
                  }}</van-tag></van-col
                >
                <van-col span="5"
                  ><van-tag color="#F5F5F5" text-color="#B1B1B1">{{
                    item.contactMsg[0].source
                  }}</van-tag></van-col
                >
              </van-row>
            </van-row>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <!-- 多选内容标签栏 -->
      <van-tabbar active-color="#7d7e80">
        <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
        <van-tabbar-item icon="search" @click="showCh"
          >分配客户</van-tabbar-item
        >
        <van-tabbar-item icon="friends-o">打标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o">发短信</van-tabbar-item>
        <van-tabbar-item icon="setting-o">批量删除</van-tabbar-item>
      </van-tabbar>
    </van-popup>

    <!-- 客户列表内容 -->
    <van-list
      class="listcot"
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
        <van-row @click="onDetail" class="cuslist">
          <van-row>
            <van-col span="4" offset="1">
              <van-image
                round
                width="40"
                height="40"
                :src="item.basicMsg[0].customerPhoto"
              />
            </van-col>
            <van-col span="12" class="cusname"
              ><div class="van-ellipsis">
                {{ item.basicMsg[0].customerName }}
              </div></van-col
            >
            <van-col span="7" class="custime"
              >{{ item.distributeMsg[0].enterPoolDate }}进入客户池</van-col
            >
            <van-col span="16" class="cusmsg">{{
              item.companyMsg[0].company
            }}</van-col>
          </van-row>
          <van-row>
            <van-col span="3" offset="5" class="tagmar"
              ><van-tag color="#E7F7E3" text-color="#67C74D">{{
                item.distributeMsg[0].cuostomerStatus
              }}</van-tag></van-col
            >
            <van-col span="3"
              ><van-tag color="#F5F5F5" text-color="#B1B1B1">{{
                item.contactMsg[0].ageRange
              }}</van-tag></van-col
            >
            <van-col span="4"
              ><van-tag color="#F5F5F5" text-color="#B1B1B1">{{
                item.contactMsg[0].source
              }}</van-tag></van-col
            >
          </van-row>
        </van-row>
        <!-- 滑动删除 -->
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" />
        </template>
        <!-- <van-divider /> -->
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
        <p>联系信息</p>
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
        <van-field
          v-model="value2"
          name="validator"
          label="性别"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="年龄范围"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="标签"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="来源"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="职位"
          placeholder="请输入"
        />
        <!-- 生日信息 -->
        <van-field
          v-model="dateVal"
          name="validator"
          label="生日"
          placeholder="选择时间"
          @click="toDate"
        >
        </van-field>
        <van-field
          v-model="value2"
          name="validator"
          label="个人喜好"
          placeholder="请输入"
        />
        <van-field name="uploader" label="标签">
          <template #input>
            <van-tag type="warning">标签</van-tag>
          </template>
        </van-field>
        <p>公司信息</p>
        <van-field
          v-model="value2"
          name="validator"
          label="公司"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="法定代表人"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="企微-客户等级"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="企业类型"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="行业分类"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="注册资本"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="员工数量"
          placeholder="请输入"
        />
        <!-- 地区信息 -->
        <van-field
          readonly
          clickable
          name="area"
          :value="areaVal"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="地址"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="经营范围"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="商标"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="渠道能力"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="是否有定制能力"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="备注"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="客户状态"
          placeholder="请输入"
        />
        <van-field
          v-model="value2"
          name="validator"
          label="跟进人"
          placeholder="请输入"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </van-popup>

    <!-- 最近浏览弹窗 -->
    <van-popup v-model="sortShow"> </van-popup>
    <van-dropdown-menu>
      <van-dropdown-item name="test" v-model="value2" :options="option2" />
    </van-dropdown-menu>
    <!-- 时间弹窗 -->
    <van-popup v-model="dateShow" position="bottom" :style="{ height: '30%' }"
      ><van-datetime-picker
        v-model="dateVal"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateCancel"
        @confirm="dateConfirm"
    /></van-popup>
    <!-- 地区弹窗 -->
    <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showArea = false"
      />
    </van-popup>
  </div>
</template>

<script>
import qs from "qs"; // axios参数包
import { areaList } from "@vant/area-data";

export default {
  name: "customer",
  data() {
    return {
      areaList,
      uploader: [{ url: "https://img01.yzcdn.cn/vant/leaf.jpg" }],
      pageProps: {
        pageNum: 1,
        pageSize: 10,
      },
      value2: false,
      // 列表信息-展示
      cusVal: 0,
      // 列表信息-内容
      cusOpt: [
        { text: "全部客户", value: 0 },
        { text: "待分配客户", value: 1 },
        { text: "跟进中客户", value: 2 },
      ],
      option2: [
        { text: "默认排序", value: "a" },
        { text: "好评排序", value: "b" },
        { text: "销量排序", value: "c" },
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
      showArea: false,
      // 标签栏绑定标识符
      barAct: 0,
      // 多选-记录选中客户的数量
      scrnum: 0,
      value: "",
      list: [],
      username: "",
      password: "",
      loading: false,
      finished: false,
      show: false,
      dateShow: false,
      areaVal: "",
      //新建客户界面
      showform: false,
      sortShow: false,
      active: 0,
      list3: ["a", "b"],
      result: [],
      checkVal: [],
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17),
      dateVal: "",
      //客户列表
      cusList: [
        {
          customerID: "12",
          isShow: true,
          basicMsg: [
            {
              customerPhoto:
                "https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=f240ee32c7160924c325a41be406359b/a08b87d6277f9e2f43b5946c0830e924b999f3d6.jpg",
              customerName: "成都芙蓉映象商务服务有限",
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
              company: "成都芙蓉映象商务服务有限公司",
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
          customerID: "21",
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
          customerID: "33",
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
        {
          name: "标签",
          class: [
            { name: "高管客户", isSelected: false },
            { name: "C端客户", isSelected: false },
            { name: "B端客户", isSelected: false },
            { name: "爱酒", isSelected: false },
            { name: "慈善", isSelected: false },
            { name: "科技公司", isSelected: false },
            { name: "红酒", isSelected: false },
            { name: "啤酒", isSelected: false },
            { name: "集团合作客户", isSelected: false },
            { name: "定制酒", isSelected: false },
            { name: "旅游", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "来源",
          class: [
            { name: "手动新建", isSelected: false },
            { name: "高端推荐", isSelected: false },
            { name: "内容营销", isSelected: false },
            { name: "行业活动", isSelected: false },
            { name: "启信宝", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "企微-客户等级",
          class: [
            { name: "一般", isSelected: false },
            { name: "重要", isSelected: false },
            { name: "核心", isSelected: false },
          ],
        },
        {
          name: "企业类型",
          class: [
            { name: "国企", isSelected: false },
            { name: "民企", isSelected: false },
            { name: "中国500强", isSelected: false },
            { name: "世界500强", isSelected: false },
            { name: "上市公司", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "行业分类",
          class: [
            { name: "食品制造业", isSelected: false },
            { name: "酒", isSelected: false },
            { name: "饮料", isSelected: false },
            { name: "茶制造业", isSelected: false },
            { name: "批发零售业", isSelected: false },
            { name: "贸易业", isSelected: false },
            { name: "金融业", isSelected: false },
            { name: "建筑安装业", isSelected: false },
            { name: "房地产业", isSelected: false },
            { name: "交通运输仓储业", isSelected: false },
            { name: "软件信息技术业", isSelected: false },
            { name: "租赁与商业服务业", isSelected: false },
            { name: "住宿和餐饮业", isSelected: false },
            { name: "农副食品加工业", isSelected: false },
            { name: "公共管理与社会保障", isSelected: false },
            { name: "科学研究和技术服务业", isSelected: false },
            { name: "农林牧渔业", isSelected: false },
            { name: "文体旅游和卫生业", isSelected: false },
            { name: "采矿业", isSelected: false },
            { name: "其他制造业", isSelected: false },
            { name: "其他行业", isSelected: false },
          ],
        },
        {
          name: "注册资本",
          class: [
            { name: "200万以下", isSelected: false },
            { name: "500万以下", isSelected: false },
            { name: "1000万以下", isSelected: false },
            { name: "5000万以下", isSelected: false },
            { name: "5000万以上", isSelected: false },
          ],
        },
        {
          name: "员工数量",
          class: [
            { name: "20人以下", isSelected: false },
            { name: "100人以下", isSelected: false },
            { name: "500人以下", isSelected: false },
            { name: "1000人以下", isSelected: false },
            { name: "1000人以上", isSelected: false },
          ],
        },
      ],
      selectList: [],
      checked: false,
      active1: "",
    };
  },
  methods: {
    // 列表加载
    async onLoad() {
      let url = "/api/queryCustomerList";
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
      };
      const result = (await this.$http.post(url, qs.stringify(postData))).data
        .data;

      this.finished = true;
      console.log(result.length);
      for (let i = 0; i < result.length; i++) {
        this.cusList.push(result[i]);
      }
      // 加载状态结束
      this.loading = false;
    },
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
    showCh() {
      console.log(this.result);
    },
    toDate() {
      this.dateShow = true;
    },
    dateConfirm(val) {
      var y = val.getFullYear();
      var m = val.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = val.getDate();
      d = d < 10 ? "0" + d : d;
      const time = y + "-" + m + "-" + d;
      this.dateVal = time;
      this.dateShow = false;
    },
    dateCancel() {
      this.dateShow = false;
    },
    onConfirm(values) {
      this.areaVal = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("/");
      this.showArea = false;
    },
    sortpop() {
      this.sortShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
.cusDroMnu {
  background: #aa361a;
}
// 全部客户
/deep/.van-dropdown-menu__title {
  color: #1e1c27;
  font-size: 13px;
}
//搜索框
.schbtn {
  margin: 5px 2% 5px 140px;
  padding: 2px;
}
.schbox {
  height: 48px;
}
//分割线
.separate {
  margin: 10px 2% 5px 2%;
  opacity: 0.5;
}
//添加按钮
.addbtn {
  margin: 5px 2% 5px 2%;
  padding: 2px;
}
//最近浏览-选项
.navopt {
  margin: 5px 2% 10px 2%;
  padding: 0px;
  height: 30px;
  width: 95px;
  background-color: #f5f5f5;
}
//列表容器
.listcot {
  margin-top: 25px;
}
//列表内容
.cuslist {
  margin-bottom: 40px;
}
//客户姓名
.cusname {
  font-size: 15px;
}
//客户时间
.custime {
  font-size: 11px;
  color: #6e6f74;
}
.cusmsg {
  font-size: 12px;
  color: #6e6f74;
  margin-top: 4px;
}
.tagmar {
  margin-right: 0.5px;
}
//弹出层布局
.scrpop {
  width: 90%;
}
// 筛选按钮
.scrbtn {
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}
.actscrbtn {
  background-color: #4876f1;
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}
//筛选分类name
.scrname {
  margin-left: 20px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 6px;
}
//筛选提交按钮
.scrfirbtn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
  background-color: #4876f1;
}
//筛选重置按钮
.scrresbtn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
}
//多选弹出层
.chcgroup {
  height: 95%;
}
//多选列表
.chelist {
  margin-bottom: 10px;
}
//最近浏览下拉
.scrdrp {
  background-color: #fd7522 !important;
  width: 20px;
  height: 40px;
  color: #fd7522;
  background: salmon;
}
.van-dropdown-menu {
  height: 10px;
}
.van-dropdown-menu__item {
  height: 10px;
}
.beijing {
  background-color: #fd7522;
}
.main {
  margin: 5px 2% 5px 2%;
  padding: 200px;
  border-radius: 15px;
  border: 1px solid #f6f6f6;
  // background: #cc1d60;
}
</style>
