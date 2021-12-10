<template>
  <div>
    <!-- 新建客户 -->
    <div>
      <!-- 新建客户-导航栏 -->
      <van-nav-bar
        title="新建客户"
        left-text="返回"
        right-text="保存"
        @click-left="onClickAddRe"
        @click-right="onClickAddSave"
      />
      <!-- 新建客户-表单 -->
      <van-form>
        <van-row class="add-title">客户类型</van-row>
        <!-- 客户类型 -->
        <van-field
          v-model="addList.sex"
          name="validator"
          label="客户类型"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[8].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[8], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <van-row class="add-title">客户信息</van-row>
        <!-- 客户信息-头像 -->
        <van-field name="uploader" label="头像">
          <template #input>
            <van-uploader
              multiple
              v-model="uploader"
              :max-count="1"
              v-if="type == 1"
            />
            <van-uploader
              multiple
              v-model="uploader2"
              :deletable="false"
              :max-count="1"
              v-if="type == 2"
            />
          </template>
        </van-field>
        <!-- 客户信息-姓名 -->
        <van-field
          v-model="addList.customerName"
          name="validator"
          label="姓名*"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <!-- 客户信息-手机号 -->
        <van-field
          v-model="addList.telephone"
          name="validator"
          label="手机"
          placeholder="请输入"
        />
        <!-- 客户信息-地区选择 -->
        <van-field
          readonly
          clickable
          name="area"
          :value="addList.city"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
        />
        <!-- 客户信息-地址 -->
        <van-field
          v-model="addList.address"
          name="validator"
          label="地址"
          placeholder="请输入"
        />
        <van-row class="add-title">联系信息</van-row>
        <!-- 个人信息-微信昵称 -->
        <van-field
          v-model="addList.wxName"
          name="validator"
          label="微信昵称"
          placeholder="请输入"
        />
        <!-- 个人信息-微信号 -->
        <van-field
          v-model="addList.wx"
          name="validator"
          label="微信号"
          placeholder="请输入"
        />
        <!-- 个人信息-性别 -->
        <van-field
          v-model="addList.sex"
          name="validator"
          label="性别"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[0].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[0], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 联系信息-年龄范围 -->
        <van-field
          v-model="addList.ageRange"
          name="validator"
          label="年龄范围"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[1].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[1], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 联系信息-来源 -->
        <van-field
          v-model="addList.origin"
          name="validator"
          label="来源"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[3].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[3], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 联系信息-职位 -->
        <van-field
          v-model="addList.position"
          name="validator"
          label="职位"
          placeholder="请输入"
        />
        <!-- 联系信息-生日信息 -->
        <van-field
          v-model="addList.birthday"
          readonly
          name="validator"
          label="生日"
          placeholder="选择时间"
          @click="toDate()"
        />
        <!-- 联系信息-个人喜好 -->
        <van-field
          v-model="addList.hobby"
          name="validator"
          label="个人喜好"
          placeholder="请输入"
        />
        <van-row class="add-title">公司信息</van-row>
        <!-- 公司信息-公司 -->
        <van-field
          v-model="addList.belongCompany"
          name="validator"
          label="公司"
          placeholder="请输入"
        />
        <!-- 公司信息-法定代表人 -->
        <van-field
          v-model="addList.legalPerson"
          name="validator"
          label="法定代表人"
          placeholder="请输入"
        />
        <!-- 公司信息-客户等级 -->
        <van-field
          v-model="addList.customerLevel"
          name="validator"
          label="客户等级"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[4].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[4], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 公司信息-企业类型 -->
        <van-field
          v-model="addList.companyType"
          name="validator"
          label="企业类型"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[5].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[5], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 公司信息-行业分类 -->
        <van-field
          v-model="addList.industry"
          name="validator"
          label="行业分类"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[6].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn2' : 'screen-btn2'"
                @click="cutTabClickOnly(addLabelList[6], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 公司信息-注册资本 -->
        <van-field
          v-model="addList.registeredCapital"
          name="validator"
          label="注册资本"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[7].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[7], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 公司信息-员工数量 -->
        <van-field
          v-model="addList.companySize"
          name="validator"
          label="员工数量"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[9].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[9], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 公司信息-成立日期 -->
        <van-field
          v-model="addList.establishDate"
          readonly
          name="validator"
          label="成立日期"
          placeholder="选择时间"
          @click="toDate1()"
        />

        <!-- 公司信息-经营状态 -->
        <van-field
          v-model="addList.operatingStatus"
          name="validator"
          label="经营状态"
          placeholder="请输入"
        />
        <!-- 公司信息-经营范围 -->
        <van-field
          v-model="addList.businessRange"
          name="validator"
          label="经营范围"
          placeholder="请输入"
        />
        <!-- 公司信息-备注 -->
        <van-field
          v-model="addList.addNote"
          name="validator"
          label="备注"
          placeholder="请输入"
        />
        <!-- 公司信息-客户状态 -->
        <van-field
          v-model="addList.customerStatus"
          readonly
          clickable
          name="area"
          label="客户状态"
          placeholder="点击选择客户状态"
          @click="addCusStaShow = true"
        >
        </van-field>
        <!-- 公司信息-跟进人 -->
        <van-field
          v-model="addList.followStaffName"
          name="validator"
          label="跟进人"
          placeholder="请输入"
          readonly
          clickable
          v-if="addList.customerStatus == this.columns[0]"
          @click="toAddFollow"
        />
        <!-- 提交按钮 -->
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            @click="onClickSumbmit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
    <AbbList
      :type="1"
      v-show="followShow"
      @returnClick="onFollowCancel"
      @onCh="onFollowAdd"
    />

    <!-- 新建客户-时间弹窗 -->
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
    <!-- 新建客户-地区弹窗 -->
    <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showArea = false"
      />
    </van-popup>
    <!-- 新建客户-客户状态选择弹出框 -->
    <van-popup
      v-model="addCusStaShow"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-picker
        title="客户状态"
        show-toolbar
        :columns="columns"
        @confirm="onCusStaConfirm"
        @cancel="onCusStaCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import { areaList } from "@vant/area-data";
import { Toast } from "vant";
import AbbList from "./AbbList.vue";
export default {
  name: "AddForm",
  components: {
    AbbList,
  },
  props: ["type"],
  data() {
    return {
      cusLock: false,
      // 监听页面变化
      lisState: true,
      uploader2: [{ url: "" }],
      // 新建客户-弹出层
      showform: true,
      // 新建客户-时间-弹窗
      dateShow: false,
      // 新建客户-时间-选择值
      dateVal: "",
      // 新建客户-时间-时间最小值
      minDate: new Date(1920, 0, 1),
      // 新建客户-时间-时间最大值
      maxDate: new Date(2025, 10, 1),
      dateVal: new Date(2000, 0, 1),

      currentDate: new Date(2021, 0, 17),
      // 新建客户-时间-生日/公司创建分类
      addDateType: "",
      // 新建客户-地区-地区列表
      areaList,
      // 新建客户-地区-弹窗
      showArea: false,
      // 新建客户-地区-地区值
      areaVal: "",
      // 新建客户-客户状态选择-弹窗
      addCusStaShow: false,
      // 新建客户-客户状态选择-内容
      columns: ["跟进中", "未分配"],
      // 新建客户-头像数据
      uploader: [],
      // 新建客户-表单按钮选择项
      addLabelList: [
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
          name: "客户等级",
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
          name: "客户类型",
          class: [
            { name: "个人客户", isSelected: true },
            { name: "公司客户", isSelected: false },
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
      // 新建客户-表单
      addList: {
        id: "",
        customerType: "个人客户",
        belongCompany: "",
        potential: "",
        customerName: "",
        historyName: "",
        customerIcon: "",
        telephone: "",
        city: "",
        customerStatus: "未分配",
        followStaffId: "",
        followStaffName: "",
        enterPoolDate: "",
        origin: "",
        orderAmount: "",
        orderNumber: "",
        customerLevel: "",
        customizeField: "",
        wx: "",
        wxName: "",
        sex: "",
        ageRange: "",
        birthday: "",
        position: "",
        hobby: "",
        legalPerson: "",
        operatingStatus: "",
        establishDate: "",
        approvalDate: "",
        registeredCapital: "",
        paidCapital: "",
        companyType: "",
        companySize: "",
        industry: "",
        industryCode: "",
        address: "",
        businessRange: "",
        socialCreditCode: "",
        organizationCode: "",
        registrationAuthority: "",
        potentialType: "",
        creditStatus: "",
        createTime: "",
        updateTime: "",
      },
      // 新建客户表单-刷新模板
      addListTemp: {
        id: "",
        customerType: "个人客户",
        potential: "",
        belongCompany: "",
        customerName: "",
        historyName: "",
        customerIcon: "",
        telephone: "",
        city: "",
        cuostomerStatus: "未分配",
        followStaffId: "",
        followStaffName: "",
        enterPoolDate: "",
        origin: "",
        orderAmount: "",
        orderNumber: "",
        customerLevel: "",
        customizeField: "",
        wx: "",
        wxName: "",
        sex: "",
        ageRange: "",
        birthday: "",
        position: "",
        hobby: "",
        legalPerson: "",
        operatingStatus: "",
        establishDate: "",
        approvalDate: "",
        registeredCapital: "",
        paidCapital: "",
        companyType: "",
        companySize: "",
        industry: "",
        industryCode: "",
        address: "",
        businessRange: "",
        socialCreditCode: "",
        organizationCode: "",
        registrationAuthority: "",
        potentialType: "",
        creditStatus: "",
        createTime: "",
        updateTime: "",
      },
      // 跟进人加载-分页
      followPageProps: {
        pageNum: 1,
        pageSize: 10,
      },
      // 跟进人-选择列表
      followChsVal: { name: "跟进人", val: "", id: "" },
      // 筛选-跟进人列表是否被选取
      ifChoose: true,
      // 筛选-地区列表是否被选取
      ifAreaChoose: true,
      // 筛选-跟进人-弹窗
      followShow: false,
      // 筛选-跟进人-搜索
      followVal: "",
      // 筛选-跟进人列表
      followList: [],
      userType: "",
    };
  },
  methods: {
    onFollowCancel() {
      this.followShow = false;
    },
    onFollowAdd(val) {
      this.addList.followStaffName = val.name;
      this.addList.followStaffId = val.id;
    },
    followCancel() {
      this.followShow = false;
    },
    followBind(val) {
      this.addList.followStaffName = val.username;
      this.addList.followStaffId = val.id;
    },
    // 新建客户-单选限定
    cutTabClickOnly(item, index) {
      // 特殊处理客户类型没有单选
      if (item.name == "客户类型") {
        for (let i = 0; i < item.class.length; i++) {
          if (i == index) {
            item.class[i].isSelected = true;
          } else {
            item.class[i].isSelected = false;
          }
        }
      } else {
        // 点击高亮逻辑
        for (let i = 0; i < item.class.length; i++) {
          if (i == index) {
            item.class[i].isSelected = !item.class[i].isSelected;
          } else {
            item.class[i].isSelected = false;
          }
        }
      }
      let empt = true;
      let key = item.name;
      // 单类选择逻辑
      for (let j = 0; j < item.class.length; j++) {
        if (item.class[j].isSelected == true) {
          empt = false;
          let val = item.class[j].name;
          // 读取当前类别名和选中值，处理选中值在当前类别中仅能亮一个
          this.onSubmitVal(key, val);
        }
      }
      // 处理点击取消高亮
      if (empt && key != "客户类型") {
        let val = "";
        this.onSubmitVal(key, val);
      }
    },
    // 新建客户-单选处理
    onSubmitVal(key, val) {
      if (key == "性别") this.addList.sex = val;
      if (key == "年龄范围") this.addList.ageRange = val;
      if (key == "来源") this.addList.origin = val;
      if (key == "客户等级") this.addList.customerLevel = val;
      if (key == "企业类型") this.addList.companyType = val;
      if (key == "行业分类") this.addList.industry = val;
      if (key == "注册资本") this.addList.registeredCapital = val;
      if (key == "员工数量") this.addList.companySize = val;
      if (key == "客户类型") {
        this.addList.customerType = val;
        console.log(this.addList.customerType);
      }
    },
    // 新建客户-头像-大小限制
    onOversize(file) {
      console.log(file);
      Toast("文件大小不能超过 500kb");
    },
    getCurrentTime() {
      //获取当前时间并打印
      let time;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      time = yy + "-" + mm + "-" + dd;
      this.addList.enterPoolDate = time;
    },
    // 新建客户-生日时间-弹窗
    toDate() {
      this.dateShow = true;
      this.addDateType = "生日";
    },
    // 新建客户-公司时间时间-弹窗
    toDate1() {
      this.dateShow = true;
      this.addDateType = "成立日期";
    },
    // 新建客户-客户状态确认
    onCusStaConfirm(value) {
      console.log(value);
      this.addCusStaShow = false;
      this.addList.customerStatus = value;
    },
    // 新建客户-时间-时间录入处理
    dateConfirm(val) {
      var y = val.getFullYear();
      var m = val.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = val.getDate();
      d = d < 10 ? "0" + d : d;
      const time = y + "-" + m + "-" + d;
      if (this.addDateType == "生日") this.addList.birthday = time;
      else if (this.addDateType == "成立日期")
        this.addList.establishDate = time;
      this.dateShow = false;
      this.addDateType = "";
    },
    // 新建客户-时间-取消
    dateCancel() {
      this.dateShow = false;
    },
    // 新建客户-地区弹窗-获取地址信息
    onConfirm(values) {
      this.addList.city = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("/");
      this.showArea = false;
    },
    toAddFollow() {
      this.followShow = true;
    },
    onScrConfirm(values) {
      this.scrCity = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("/");
      this.ifAreaChoose = false;
      this.showScrArea = false;
    },
    // 新建客户-返回
    onClickAddRe() {
      this.addList = this.addListTemp
      this.$emit("returnClick");
    },
    // 新建客户-保存
    onClickAddSave() {
      this.onClickSumbmit();
    },
    // 处理回调函数的坑 冗杂没救了
    async userImg(base64) {
      let str = this.uploader[0].content;
      let type = this.uploadPicType(str);
      // this.uploadCusIcon(str, type, type.length);
      let url = "/api/file/pic/base64StrToPic";
      let picture;
      str = base64;
      // console.log(str);
      if (type.length == 3) {
        picture = str.slice(22);
      } else if (type.length == 4) {
        picture = str.slice(23);
      }
      console.log(picture);
      let params = new FormData();
      params.append("picBase64Str", picture);
      params.append("picFormat", type);
      params.append("picType", "customerIcon");
      await this.$http
        .post(url, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then((res) => {
          console.log(res.data.data);
          this.addList.customerIcon = res.data.data;
        });
      // 传输
      if (this.addList.customerType == "个人客户") {
        this.addList.customerType = 0;
      } else {
        this.addList.customerType = 1;
      }

      if (
        this.addList.customerStatus == "未分配" ||
        this.addList.customerStatus == "潜在客户"
      ) {
        this.addList.followStaffId = "";
        this.addList.followStaffName = "";
      }
      // 客户不是潜在客户
      this.addList.potential = 0;

      function removeEmptyField(obj) {
        var newObj = {};
        if (typeof obj === "string") {
          obj = JSON.parse(obj);
        }
        if (obj instanceof Array) {
          newObj = [];
        }
        if (obj instanceof Object) {
          for (var attr in obj) {
            // 属性值不为'',null,undefined才加入新对象里面(去掉'',null,undefined)
            if (
              obj.hasOwnProperty(attr) &&
              obj[attr] !== "" &&
              obj[attr] !== null &&
              obj[attr] !== undefined
            ) {
              if (obj[attr] instanceof Object) {
                // 空数组或空对象不加入新对象(去掉[],{})
                if (
                  JSON.stringify(obj[attr]) === "{}" ||
                  JSON.stringify(obj[attr]) === "[]"
                ) {
                  continue;
                }
                // 属性值为对象,则递归执行去除方法
                newObj[attr] = removeEmptyField(obj[attr]);
              } else if (
                typeof obj[attr] === "string" &&
                ((obj[attr].indexOf("{") > -1 && obj[attr].indexOf("}") > -1) ||
                  (obj[attr].indexOf("[") > -1 && obj[attr].indexOf("]") > -1))
              ) {
                // 属性值为JSON时
                try {
                  var attrObj = JSON.parse(obj[attr]);
                  if (attrObj instanceof Object) {
                    newObj[attr] = removeEmptyField(attrObj);
                  }
                } catch (e) {
                  newObj[attr] = obj[attr];
                }
              } else {
                newObj[attr] = obj[attr];
              }
            }
          }
        }
        return newObj;
      }
      this.addList = removeEmptyField(this.addList);
      console.log(this.addList);
      url = "/api/se/customer/insert";
      let postData = this.addList;
      const result = (await this.$http.post(url, postData)).data;
      if (result.code == "200") {
        Toast("成功添加客户");
        console.log(result.data);
        this.newCusRelation(result.data.id, "进入客户池");
      }
      this.addList = this.addListTemp;
      this.uploader = [];
      this.$emit("returnClick");
    },
    dealImage(base64, w, callback) {
      var newImage = new Image();
      var quality = 0.6; //压缩系数0-1之间
      newImage.src = base64;
      newImage.setAttribute("crossOrigin", "Anonymous"); //url为外域时需要
      var imgWidth, imgHeight;
      newImage.onload = function () {
        imgWidth = this.width;
        imgHeight = this.height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        if (Math.max(imgWidth, imgHeight) > w) {
          if (imgWidth > imgHeight) {
            canvas.width = w;
            canvas.height = (w * imgHeight) / imgWidth;
          } else {
            canvas.height = w;
            canvas.width = (w * imgWidth) / imgHeight;
          }
        } else {
          canvas.width = imgWidth;
          canvas.height = imgHeight;
          quality = 0.6;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        var base64 = canvas.toDataURL("image/jpeg", quality);
        callback(base64);
      };
    },
    async onClickSumbmit() {
      if (this.addList.customerName == "") {
        Toast("请输入用户名");
      } else {
        let i, j;
        for (i = 0; i < this.addLabelList.length; i++) {
          for (j = 0; j < this.addLabelList[i].class.length; j++) {
            if (this.addLabelList[i].class[j].isSelected == true) {
              this.addLabelList[i].class[j].isSelected = false;
            }
          }
        }
        this.getCurrentTime();
        // 客户类型选择高亮
        this.addLabelList[8].class[0].isSelected = true;

        // 提交文件不为空
        if (this.uploader != "") {
          let str = this.uploader[0].content;
          let type = this.uploadPicType(str);
          // this.uploadCusIcon(str, type, type.length);
          let url = "/api/file/pic/base64StrToPic";
          let picture;
          this.dealImage(str, 1000, this.userImg);
        } else {
          // 传输
          if (this.addList.customerType == "个人客户") {
            this.addList.customerType = 0;
          } else {
            this.addList.customerType = 1;
          }

          if (
            this.addList.customerStatus == "未分配" ||
            this.addList.customerStatus == "潜在客户"
          ) {
            this.addList.followStaffId = "";
            this.addList.followStaffName = "";
          }
          // 客户不是潜在客户
          this.addList.potential = 0;

          function removeEmptyField(obj) {
            var newObj = {};
            if (typeof obj === "string") {
              obj = JSON.parse(obj);
            }
            if (obj instanceof Array) {
              newObj = [];
            }
            if (obj instanceof Object) {
              for (var attr in obj) {
                // 属性值不为'',null,undefined才加入新对象里面(去掉'',null,undefined)
                if (
                  obj.hasOwnProperty(attr) &&
                  obj[attr] !== "" &&
                  obj[attr] !== null &&
                  obj[attr] !== undefined
                ) {
                  if (obj[attr] instanceof Object) {
                    // 空数组或空对象不加入新对象(去掉[],{})
                    if (
                      JSON.stringify(obj[attr]) === "{}" ||
                      JSON.stringify(obj[attr]) === "[]"
                    ) {
                      continue;
                    }
                    // 属性值为对象,则递归执行去除方法
                    newObj[attr] = removeEmptyField(obj[attr]);
                  } else if (
                    typeof obj[attr] === "string" &&
                    ((obj[attr].indexOf("{") > -1 &&
                      obj[attr].indexOf("}") > -1) ||
                      (obj[attr].indexOf("[") > -1 &&
                        obj[attr].indexOf("]") > -1))
                  ) {
                    // 属性值为JSON时
                    try {
                      var attrObj = JSON.parse(obj[attr]);
                      if (attrObj instanceof Object) {
                        newObj[attr] = removeEmptyField(attrObj);
                      }
                    } catch (e) {
                      newObj[attr] = obj[attr];
                    }
                  } else {
                    newObj[attr] = obj[attr];
                  }
                }
              }
            }
            return newObj;
          }
          this.addList = removeEmptyField(this.addList);
          console.log(this.addList);
          let url = "/api/se/customer/insert";
          let postData = this.addList;
          const result = (await this.$http.post(url, postData)).data;
          if (result.code == "200") {
            Toast("成功添加客户");
            console.log(result.data);
            this.newCusRelation(result.data.id, "进入客户池");
          }
          this.addList = this.addListTemp;
          this.uploader = [];
          this.$emit("returnClick");
        }
      }
    },
    // 新建客户-头像格式判断
    uploadPicType(str) {
      if (str.slice(11, 14) == "png") {
        return "png";
      }
      if (str.slice(11, 14) == "svg") {
        return "svg";
      }
      if (str.slice(11, 14) == "bmp") {
        return "bmp";
      }
      if (str.slice(11, 14) == "ico") {
        return "ico";
      }
      if (str.slice(11, 14) == "jpg") {
        return "jpg";
      }
      if (str.slice(11, 15) == "jpeg") {
        return "jpeg";
      }
      if (str.slice(11, 15) == "tiff") {
        return "tiff";
      }

      return "wrong";
    },
    // 跟进人-页面取消
    folCancel() {
      this.followShow = false;
    },
    // 跟进人搜素
    onFollowSearch() {
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.getUserList();
    },
    // 跟进人搜索取消
    onFollowSearchCancel() {
      this.followVal = "";
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.getUserList();
    },
    // 跟进人-选择
    followConfirm(item) {
      this.followShow = false;
      // 筛选-跟进人
      if (this.userType == 0) {
        this.followChsVal.val = item.username;
        this.followChsVal.id = item.id;
        this.ifChoose = false;
      }
      // 新建-跟进人
      else if (this.userType == 3) {
        this.addList.followStaffName = item.username;
        this.addList.followStaffId = item.id;
      }
    },

    // 新建客户-客户状态-取消
    onCusStaCancel() {
      this.addCusStaShow = false;
    },
    // 客户关系-新建
    async newCusRelation(id, type) {
      let url = "/api/se/customer/relation/insert";
      console.log(id);
      console.log(type);
      const result = await this.$http.post(url, {
        customerId: id,
        relationType: type,
      });
      if (result.data.code == "200") {
        Toast("操作成功");
      }
    },
    // 筛选-跟进人列表-弹窗
    toFollow() {
      this.followShow = true;
    },
    // 获取用户消息
  },
  created() {
    if (this.type == 2) {
      console.log(1);
      this.addList.wxName = this.$store.state.wxUser.nickName;
      this.uploader2[0].url = this.$store.state.wxUser.imgUrl;
      //   this.addList.wxName =  this.$store.state.;
    }
  },
};
</script>
<style lang="less" scoped>
.nav-cusnum-font {
  font-size: 10px;
  // margin-top: 5%;
  margin-left: 5%;
  margin-top: 15px;
  color: #bbbcbe;
}

//客户时间
.list-content-time {
  font-size: 11px;
  color: #6e6f74;
}
.list-content-msg {
  font-size: 12px;
  color: #6e6f74;
  margin-top: 4px;
}
.list-content-tag {
  margin-right: 0.5px;
  margin-left: 3%;
}
//弹出层布局
.screen {
  width: 90%;
}
// 筛选按钮
.screen-btn {
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}
.active-screen-btn {
  background-color: #4876f1;
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}

// 新增筛选按钮-可自适应
.screen-btn2 {
  margin: 5px 2% 10px 0%;
  padding: 5px;
  height: 30px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn2 {
  background-color: #4876f1;
  margin: 5px 2% 10px 0%;
  padding: 5px;
  height: 30px;
  font-size: 12px;
  color: #ffffff;
}
// 新增筛选
// 筛选按钮
.screen-btn1 {
  margin: 5px 2% 10px 0%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn1 {
  background-color: #4876f1;
  margin: 5px 2% 10px 0%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}
.add-van-cell {
  padding: 0;
}
//筛选分类name
.screen-name {
  margin-left: 20px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 6px;
}
//筛选提交按钮
.screen-confirm-btn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
  background-color: #4876f1;
}
//筛选重置按钮
.screen-reset-btn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
}

.follow-choose {
  margin-left: 10%;
  color: #4876f1;
  font-size: 10pt;
}
//跟进人-取消
.follow-cancel-btn {
  border: none;
}

//新建用户-标题样式
.add-title {
  background-color: #f8f8f8;
  color: #bbbcbe;
  padding-left: 15px;
  padding-top: 5px;
  height: 30px;
  font-size: 14px;
}

// 新增-手动新增客户
.add-choose-hand-font {
  margin-left: 5%;
  height: 50px;
}
// 新增-页面边距
.add-choose-margin {
  margin-top: 5%;
  margin-left: 20%;
}
.main-fix {
  // position: fixed;
  width: 100%;
}

.main {
  margin: 5px 2% 5px 2%;
  padding: 200px;
  border-radius: 15px;
  border: 1px solid #f6f6f6;
  // background: #cc1d60;
}
.list-img-none {
  width: 40px;
  height: 40px;
  background-color: #4876f1;
  border-radius: 50%;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
  font-size: 15px;
}
</style>
