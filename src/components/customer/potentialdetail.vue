<template>
  <div>
    <!--返回按钮  -->
    <van-cell class="returnbtn" @click="onReturn">
      <van-icon name="arrow-left" />返回
    </van-cell>
    <!-- 客户姓名 -->
    <van-row class="busname">{{ this.cusDetail.customerName }}</van-row>
    <!-- 客户详情 -->
    <div class="busdetail">
      <van-row
        ><van-col class="title">法定代表人</van-col
        ><van-col class="detail">{{
          this.cusDetail.legalPerson
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">注册资本</van-col
        ><van-col class="detail">{{
          this.cusDetail.registeredCapital
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">经营状态</van-col
        ><van-col class="detail">{{
          this.cusDetail.operatingStatus
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">实缴资本</van-col
        ><van-col class="detail">{{
          this.cusDetail.paidCapital
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">成立日期</van-col
        ><van-col class="detail">{{
          this.cusDetail.establishDate
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">批准日期</van-col
        ><van-col class="detail">{{
          this.cusDetail.approvalDate
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">公司类型</van-col
        ><van-col class="detail">{{
          this.cusDetail.companyType
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">所属行业</van-col
        ><van-col class="detail">{{
          this.cusDetail.industry
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">企业地址</van-col
        ><van-col class="detail1">{{
          this.cusDetail.address
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">所属省市区</van-col
        ><van-col class="detail">{{ this.cusDetail.city }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">统一社会信用代码</van-col
        ><van-col class="detail">{{
          this.cusDetail.socialCreditCode
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">工商注册号</van-col
        ><van-col class="detail">{{
          this.cusDetail.industryCode
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">组织机构号</van-col
        ><van-col class="detail">{{
          this.cusDetail.organizationCode
        }}</van-col></van-row
      >
      <van-row
        ><van-col class="title">所属工商局</van-col
        ><van-col class="detail">{{
          this.cusDetail.registrationAuthority
        }}</van-col></van-row
      >
    </div>
    <div>
      <van-button class="button-hang" @click="toAddCus">转化为客户</van-button>
      <van-button class="button-hang1" @click="changeCusDetail"
        >修改信息</van-button
      >
      <div class="buttom"></div>
    </div>
    <!-- 新建潜在客户 -->
    <van-popup
      v-model="showform"
      position="bottom"
      :overlay="false"
      duration="0"
    >
      <van-nav-bar
        title="修改信息"
        left-text="返回"
        right-text="保存"
        @click-left="onClickAddRe"
        @click-right="onClickAddSave"
      />
      <van-form>
        <van-row class="add-title">潜在客户信息</van-row>
        <!-- 客户信息-头像 -->
        <van-field name="uploader" label="头像">
          <template #input>
            <van-uploader multiple v-model="uploader" :max-count="1" />
          </template>
        </van-field>
        <!-- 客户信息-姓名 -->
        <van-field
          v-model="cusDetail.customerName"
          name="validator"
          label="姓名*"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <!-- 客户信息-地区选择 -->
        <van-field
          readonly
          clickable
          name="area"
          :value="cusDetail.city"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
        />
        <!-- 客户信息-地址 -->
        <van-field
          v-model="cusDetail.address"
          name="validator"
          label="地址"
          placeholder="请输入"
        />
        <!-- 公司信息-法定代表人 -->
        <van-field
          v-model="cusDetail.legalPerson"
          name="validator"
          label="法定代表人"
          placeholder="请输入"
        />
        <!-- 公司信息-企业类型 -->
        <van-field
          v-model="cusDetail.companyType"
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
          v-model="cusDetail.industry"
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
          v-model="cusDetail.registeredCapital"
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
        <!-- 公司信息-实缴资本 -->
        <van-field
          v-model="cusDetail.paidCapital"
          name="validator"
          label="实缴资本"
          placeholder="请输入"
        >
          <template #input>
            <van-cell class="add-van-cell">
              <van-button
                v-for="(item, index) in addLabelList[10].class"
                :key="item.name"
                :class="item.isSelected ? 'active-screen-btn1' : 'screen-btn1'"
                @click="cutTabClickOnly(addLabelList[10], index)"
                >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <!-- 公司信息-成立日期 -->
        <van-field
          v-model="cusDetail.establishDate"
          readonly
          name="validator"
          label="成立日期"
          placeholder="选择时间"
          @click="toDate1()"
        />
        <!-- 公司信息-批准日期 -->
        <van-field
          v-model="cusDetail.approvalDate"
          readonly
          name="validator"
          label="批准日期"
          placeholder="选择时间"
          @click="toDate()"
        />

        <!-- 公司信息-经营状态 -->
        <van-field
          v-model="cusDetail.operatingStatus"
          name="validator"
          label="经营状态"
          placeholder="请输入"
        />

        <!-- 公司信息-行业代码 -->
        <van-field
          v-model="cusDetail.industryCode"
          name="validator"
          label="行业代码"
          placeholder="请输入"
        />

        <!-- 公司信息-统一社会信用代码 -->
        <van-field
          v-model="cusDetail.socialCreditCode"
          name="validator"
          label="统一社会信用代码"
          placeholder="请输入"
        />

        <!-- 公司信息-组织机构代码 -->
        <van-field
          v-model="cusDetail.organizationCode"
          name="validator"
          label="组织机构代码"
          placeholder="请输入"
        />

        <!-- 公司信息-登记机关 -->
        <van-field
          v-model="cusDetail.registrationAuthority"
          name="validator"
          label="登记机关"
          placeholder="请输入"
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
    </van-popup>
    <!-- 转化客户-补充信息 -->
    <van-popup
      v-model="showCusform"
      position="bottom"
      :overlay="false"
      duration="0"
    >
      <van-nav-bar
        title="新建客户"
        left-text="返回"
        right-text="保存"
        @click-left="onClickAddNew"
        @click-right="onClickAddSave1"
      />
      <van-form>
        <van-row class="add-title">客户类型</van-row>
        <!-- 客户类型 -->
        <van-field
          v-model="cusDetail.customerType"
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
            <van-uploader multiple v-model="uploader" :max-count="1" />
          </template>
        </van-field>
        <!-- 客户信息-姓名 -->
        <van-field
          v-model="cusDetail.customerName"
          name="validator"
          label="姓名"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <!-- 客户信息-手机号 -->
        <van-field
          v-model="cusDetail.telephone"
          name="validator"
          label="手机"
          placeholder="请输入"
        />
        <!-- 公司信息-地区选择 -->
        <van-field
          readonly
          clickable
          name="area"
          :value="cusDetail.city"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
        />
        <!-- 公司信息-地址 -->
        <van-field
          v-model="cusDetail.address"
          name="validator"
          label="地址"
          placeholder="请输入"
        />
        <van-row class="add-title">联系信息</van-row>
        <!-- 联系信息-微信昵称 -->
        <van-field
          v-model="cusDetail.wxName"
          name="validator"
          label="微信昵称"
          placeholder="请输入"
        />
        <!-- 联系信息-微信号 -->
        <van-field
          v-model="cusDetail.wx"
          name="validator"
          label="微信号"
          placeholder="请输入"
        />
        <!-- 联系信息-性别 -->
        <van-field
          v-model="cusDetail.sex"
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
          v-model="cusDetail.ageRange"
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
          v-model="cusDetail.origin"
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
          v-model="cusDetail.position"
          name="validator"
          label="职位"
          placeholder="请输入"
        />
        <!-- 联系信息-生日信息 -->
        <van-field
          v-model="cusDetail.birthday"
          readonly
          name="validator"
          label="生日"
          placeholder="选择时间"
          @click="toDate()"
        />
        <!-- 联系信息-个人喜好 -->
        <van-field
          v-model="cusDetail.hobby"
          name="validator"
          label="个人喜好"
          placeholder="请输入"
        />
        <van-row class="add-title">公司信息</van-row>
        <!-- 公司信息-公司 -->
        <van-field
          v-model="cusDetail.belongCompany"
          name="validator"
          label="公司"
          placeholder="请输入"
        />
        <!-- 公司信息-法定代表人 -->
        <van-field
          v-model="cusDetail.legalPerson"
          name="validator"
          label="法定代表人"
          placeholder="请输入"
        />
        <!-- 公司信息-客户等级 -->
        <van-field
          v-model="cusDetail.customerLevel"
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
          v-model="cusDetail.companyType"
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
          v-model="cusDetail.industry"
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
          v-model="cusDetail.registeredCapital"
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
          v-model="cusDetail.addStafNum"
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
          v-model="cusDetail.establishDate"
          readonly
          name="validator"
          label="成立日期"
          placeholder="选择时间"
          @click="toDate1()"
        />
        <!-- 公司信息-经营状态 -->
        <van-field
          v-model="cusDetail.operatingStatus"
          name="validator"
          label="经营状态"
          placeholder="请输入"
        />
        <!-- 公司信息-经营范围 -->
        <van-field
          v-model="cusDetail.businessRange"
          name="validator"
          label="经营范围"
          placeholder="请输入"
        />

        <!-- 公司信息-备注 -->
        <van-field
          v-model="cusDetail.addNote"
          name="validator"
          label="备注"
          placeholder="请输入"
        />
        <!-- 公司信息-客户状态 -->
        <van-field
          v-model="cusDetail.customerStatus"
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
          v-model="cusDetail.followStaffName"
          name="validator"
          label="跟进人"
          placeholder="请输入"
          readonly
          clickable
          v-if="cusDetail.customerStatus == this.columns[0]"
          @click="toAddFollow"
        />
        <!-- 提交按钮 -->
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            @click="onClickSumbmit1"
            >提交</van-button
          >
        </div>
      </van-form>
    </van-popup>
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
    <van-dialog
      v-model="dialogShow"
      title="是否转化为正式客户"
      show-cancel-button
      @confirm="changeCusType"
    ></van-dialog>
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
    <!-- 跟进人弹出框 -->
    <van-popup
      v-model="followShow"
      position="bottom"
      :style="{ height: '100%' }"
      :overlay="false"
      duration="0"
    >
      <AbbList
        :type="1"
        v-show="followShow"
        @returnClick="onFollowCancel"
        @onCh="onFollowAdd"
      />
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
import qs from "qs"; // axios参数包
import { areaList } from "@vant/area-data";
import AbbList from "../component/AbbList.vue";
export default {
  components: {
    AbbList,
  },
  data() {
    return {
      showCusform: false,
      cusDetail: [],
      dialogShow: false,
      // 客户类型-排序-种类
      sortCusType: "createTime",
      // 客户类型-排序-时间
      sortCusTime: "night",
      // 导航-客户类型-选择值
      cusVal: 0,
      // 导航-客户类型-数组
      cusOpt: [
        { text: "全部客户", value: 0 },
        { text: "待分配客户", value: 1 },
        { text: "跟进中客户", value: 2 },
      ],
      // 导航-客户数量
      cusNum: 0,
      // 搜索-搜索内容
      searchVal: "",
      // 搜索-搜索图标展示（同时绑定新建和分割线的显示）
      isSearch: true,
      // 客户列表-是否加载完毕
      loading: false,
      // 客户列表-是否加载完毕
      finished: false,
      // 客户列表-头像展示
      cusImgShow: false,
      // 客户列表
      cusList: [],
      // 客户列表-滑动-删除
      detDiaShow: false,
      // 客户列表-滑动-删除id
      detId: "",
      // 点击加号-弹出层界面展示
      addShow: false,
      // 点击加号-弹出层信息
      actions: [
        { name: "新增潜在客户", callback: this.formClick },
        { name: "扫描名片", callback: this.onPicture },
      ],
      // 点击加号-扫描名片-弹出层
      pictureShow: false,
      // 扫描名片-传入文件

      // 新建客户-弹出层
      showform: false,
      // 新建客户-时间-弹窗
      dateShow: false,
      // 新建客户-时间-选择值
      dateVal: new Date(2000, 0, 1),
      // 新建客户-时间-时间最小值
      minDate: new Date(1920, 0, 1),
      // 新建客户-时间-时间最大值
      maxDate: new Date(2025, 10, 1),
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
        {
          name: "实缴资本",
          class: [
            { name: "200万以下", isSelected: false },
            { name: "500万以下", isSelected: false },
            { name: "1000万以下", isSelected: false },
            { name: "5000万以下", isSelected: false },
            { name: "5000万以上", isSelected: false },
          ],
          ename: "paidCapital",
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
      // 筛选-弹出层界面
      scrShow: false,
      // 筛选-筛选列表
      scrList: [
        {
          name: "注册资本",
          class: [
            { name: "200万以下", isSelected: false },
            { name: "500万以下", isSelected: false },
            { name: "1000万以下", isSelected: false },
            { name: "5000万以下", isSelected: false },
            { name: "5000万以上", isSelected: false },
          ],
          ename: "registeredCapital",
        },
        {
          name: "实缴资本",
          class: [
            { name: "200万以下", isSelected: false },
            { name: "500万以下", isSelected: false },
            { name: "1000万以下", isSelected: false },
            { name: "5000万以下", isSelected: false },
            { name: "5000万以上", isSelected: false },
          ],
          ename: "paidCapital",
        },
      ],
      // 筛选-跟进人列表是否被选取
      ifChoose: true,
      // 筛选-地区列表是否被选取
      ifAreaChoose: true,
      // 筛选-跟进人-弹窗
      followShow: false,
      // 筛选-跟进人-搜索
      followVal: "",
      // 筛选-标签选择数组
      selectList: [],
      // 筛选-地区-地区弹窗
      showScrArea: false,
      // 筛选-地区-地区选择值
      scrCity: "",
      // 筛选-跟进人列表
      followList: [],
      // 最近浏览-弹出层
      sortShow: false,
      // 多选-界面弹出层
      cheShow: false,
      // 多选-多选选取的标识符信息
      result: [],
      // 多选-全选标识
      checked: false,
      // 多选-批量删除-弹窗
      deleteShow: false,
      // 多选-短信发送-弹窗
      shortShow: false,
      // 多选-短信发送-短信内容
      message: "",
      // 多选-打标签-弹窗
      ckShow: false,
      // 多选-打标签-标签数组
      putLabelList: [],
      // 多选-打标签-所选标签值
      putLabelVal: [],
      // 多选-选择数组
      ckChsList: [],
      // 多选-全部删除ID
      detAllCusID: [],
      // 多选-记录选中客户的数量
      scrnum: 0,
      // 多选-短信-消息
      ckShortMsg: { customerID: [], customerMsg: "" },
      // 标签栏-绑定标识符
      barAct: 0,
      // 列表加载-分页
      pageProps: {
        pageNum: 1,
        pageSize: 10,
      },
      // 跟进人加载-分页
      followPageProps: {
        pageNum: 1,
        pageSize: 10,
      },
      // 跟进人-选择列表
      followChsVal: { name: "跟进人", val: "", id: "" },
      // 客户排序-客户分类
      cusClass: "全部客户",
      // 客户排序-列表顺序
      listOrder: "创建时间从晚到早",
      // 图标
      cus_new: require("../../assets/cusicon/cus_new.png"),
      cus_scr: require("../../assets/cusicon/cus_scr.png"),
      cus_chc: require("../../assets/cusicon/cus_ckc.png"),
      cus_delete: require("../../assets/cusicon/cus_delete.png"),
      cus_lable: require("../../assets/cusicon/cus_lable.png"),
      cus_msg: require("../../assets/cusicon/cus_msg.png"),
      // 商机负责人
      oppoChsVal: { name: "商机负责人", val: "", id: "" },
      ifoppoChoose: true,
      // 创建人
      bulidChsVal: { name: "创建人", val: "", id: "" },
      ifbulidChoose: true,
      //分类
      userType: 0,
    };
  },
  created() {
    let cuslist = this.$route.query.cuslist;
    this.getCusDetailByID(cuslist.socialCreditCode);
  },
  methods: {
    changeCusForm(res) {
      console.log(res);
      this.cusDetail = this.addList;
      this.cusDetail.operatingStatus = res.engageStatus;
      this.cusDetail.establishDate = res.startDate;
      this.cusDetail.approvalDate = res.checkDate;
      this.cusDetail.legalPerson = res.legalPerson;
      this.cusDetail.customerName = res.companyName;
      this.cusDetail.socialCreditCode = res.creditNo;
      this.cusDetail.companyType = res.companyKind;
      this.cusDetail.address = res.address;
      this.cusDetail.registrationAuthority = res.belongOrg;
      this.cusDetail.organizationCode = res.orgNo;
      this.cusDetail.industryCode = res.registerNo;
    },
    // 根据id查询客户信息
    async getCusDetailByID(id) {
      let url = "/api/se/customerRest/companyDetail";
      const res = await this.$http.get(url, {
        params: {
          keyword: id,
        },
      });
      if (res.data.code == 200) {
        this.changeCusForm(res.data.data);
      } else {
        Toast("加载失败");
      }
    },
    toAddFollow() {
      this.followShow = true;
    },
    onFollowCancel() {
      this.followShow = false;
    },
    onFollowAdd(val) {
      this.cusDetail.followStaffName = val.name;
      this.cusDetail.followStaffId = val.id;
      this.cusDetail.customerStatus = "跟进中";
    },
    // 更多操作-编辑客户-编辑高亮显示
    changeCus() {
      if (this.cusDetail.customerType == 1) {
        this.cusDetail.customerType = "公司客户";
      } else if (this.cusDetail.customerType == 0) {
        this.cusDetail.customerType = "个人客户";
      }
      for (let i = 0; i < this.addLabelList.length; i++) {
        for (let j = 0; j < this.addLabelList[i].class.length; j++) {
          let val = this.addLabelList[i].class[j].name;
          if (this.addLabelList[i].name == "性别") {
            if (val == this.cusDetail.sex) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "年龄范围") {
            if (val == this.cusDetail.ageRange) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "来源") {
            if (val == this.cusDetail.origin) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "客户等级") {
            if (val == this.cusDetail.customerLevel) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "企业类型") {
            if (val == this.cusDetail.companyType) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "行业分类") {
            if (val == this.cusDetail.industry) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "员工数量") {
            if (val == this.cusDetail.companySize) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "客户类型") {
            if (val == this.cusDetail.customerType) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "实缴资本") {
            if (val == this.cusDetail.paidCapital) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
          if (this.addLabelList[i].name == "注册资本") {
            if (val == this.cusDetail.registeredCapital) {
              this.addLabelList[i].class[j].isSelected = true;
            }
          }
        }
      }
      if (this.cusDetail.customerType == "公司客户") {
        this.cusDetail.customerType = 1;
      } else if (this.cusDetail.customerType == "个人客户") {
        this.cusDetail.customerType = 0;
      }
    },
    toAddCus() {
      this.dialogShow = true;
    },
    // 客户信息修改
    changeCusDetail() {
      this.changeCus();
      this.showform = true;
    },
    //返回列表页面
    onReturn() {
      this.$router.back("/procustomer");
    },
    //获取客户详情
    getCusDetail(cuslist) {
      this.cusDetail = cuslist;
      console.log(this.cusDetail);
    },
    //客户类型转化
    changeCusType() {
      this.changeCus();
      this.showCusform = true;
    },
    async userImg1(base64) {
      let str = this.uploader[0].content;
      let type = this.uploadPicType(str);
      // this.uploadCusIcon(str, type, type.length);
      let url = "/api/file/pic/base64StrToPic";
      let picture;
      str = base64;
      if (type.length == 3) {
        picture = str.slice(22);
      } else if (type.length == 4) {
        picture = str.slice(23);
      } else {
        Toast("图片格式错误");
        this.uploader = [];
      }
      console.log(picture);
      if (type.length == 3 || type.length == 4) {
        let params = new FormData();
        params.append("picBase64Str", picture);
        params.append("picFormat", type);
        params.append("picType", "customerIcon");
        await this.$http
          .post(url, params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((res) => {
            console.log(res.data.data);
            this.cusDetail.customerIcon = res.data.data;
          });
      }
      this.cusDetail.establishDate = "";
      this.cusDetail.approvalDate = "";
      if (this.cusDetail.customerType == "0") {
        this.cusDetail.customerType = 0 * 1;
      } else if (this.cusDetail.customerType == "1") {
        this.cusDetail.customerType = 1 * 1;
      }
      this.cusDetail.potential = 0;
      if (
        this.cusDetail.customerStatus == "未分配" ||
        this.cusDetail.customerStatus == "潜在客户"
      ) {
        this.cusDetail.followStaffId = "";
        this.cusDetail.followStaffName = "";
      }
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

          return newObj;
        }
      }
      this.addList = removeEmptyField(this.cusDetail);
      this.getCurrentTime();
      // 传输
      url = "/api/se/customer/insert";
      let postData = this.addList;
      console.log(postData);
      const result = (await this.$http.post(url, postData)).data;
      // console.log(result)
      if (result.code == "200") {
        Toast("成功转换");
        this.showCusform = false;
        this.newCusRelation(result.data.id, "进入客户池");
      }
      this.showCusform = false;
      this.$router.back("/procustomer");
    },
    // 转化客户-提交
    async onClickSumbmit1() {
      if (this.cusDetail.customerName == "") {
        Toast("请输入用户名");
      } else {
        // 提交文件不为空
        if (this.uploader != "") {
          let str = this.uploader[0].content;
          let type = this.uploadPicType(str);
          let url = "/api/file/pic/base64StrToPic";
          let picture;
          this.dealImage(str, 1000, this.userImg1);
        } else {
          this.cusDetail.establishDate = "";
          this.cusDetail.approvalDate = "";
          if (this.cusDetail.customerType == "0") {
            this.cusDetail.customerType = 0 * 1;
          } else if (this.cusDetail.customerType == "1") {
            this.cusDetail.customerType = 1 * 1;
          }
          if (
            this.cusDetail.customerStatus == "未分配" ||
            this.cusDetail.customerStatus == "潜在客户"
          ) {
            this.cusDetail.followStaffId = "";
            this.cusDetail.followStaffName = "";
          }
          this.cusDetail.potential = 0;
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
          console.log(this.cusDetail);
          this.addList = removeEmptyField(this.cusDetail);
          this.getCurrentTime();
          // 传输
          let url = "/api/se/customer/insert";
          let postData = this.addList;
          console.log(postData);
          const result = (await this.$http.post(url, postData)).data;
          // console.log(result)
          if (result.code == "200") {
            Toast("成功转换");
            this.showCusform = false;
            this.newCusRelation(result.data.id, "进入客户池");
          }
          this.showCusform = false;
          this.$router.back("/procustomer");
        }
        // this.addList = this.addListTemp;
      }
    },

    // 客户排序-客户分类选择-排序
    onOrderList(cusVal) {
      if (cusVal == 0) {
        this.cusClass = "全部客户";
        this.cusList = [];
        this.onLoad();
        Toast("选择全部客户");
      } else if (cusVal == 1) {
        this.cusClass = "未分配";
        this.cusList = [];
        this.onLoad();
        Toast("选择待分配客户");
      } else if (cusVal == 2) {
        this.cusClass = "跟进中";
        this.cusList = [];
        this.onLoad();
        Toast("选择跟进中客户");
      }
    },
    // 客户列表-客户分类选择-分配
    // 客户列表-搜索功能
    onSearch() {
      this.cusList = [];
      this.onLoad();
    },
    // 客户列表-搜索功能-关闭弹窗
    onSearchCancel() {
      this.isSearch = !this.isSearch;
    },
    // 客户列表-搜索功能展示
    toSearch() {
      this.isSearch = !this.isSearch;
    },
    // 客户列表-列表加载
    async onLoad() {
      // let url = "/api/queryCustomerList";
      let url = "/api/se/customer/query";
      url = this.urlSortChoose(url);
      url = this.urlCusTypeChoose(url);
      url = this.urlCusNameChoose(url);
      url = this.urlCusScreen(url);
      url += "&eq_potential=" + "1";
      console.log(url);
      // console.log(url);

      const res = await this.$http.get(url, {
        params: {
          currentPage: this.pageProps.pageNum,
          pageCount: this.pageProps.pageSize,
        },
      });

      this.cusNum = res.data.totalCount;
      if (this.cusNum != 0)
        for (let i = 0; i < this.pageProps.pageSize; i++) {
          this.cusList.push(res.data.data[i]);
          if (this.cusList.length >= this.cusNum) {
            this.finished = true;
            this.pageProps.pageNum = 1;
            break;
          }
        }
      if (this.cusList.length >= this.cusNum) {
        this.finished = true;
      } else {
        this.pageProps.pageNum++;
        this.onLoad();
      }
      // this.cusNum = res.data.code;
      console.log(this);
    },
    // 客户列表-url参数设置-排序设计
    urlSortChoose(url) {
      if (this.sortCusType == "createTime" && this.sortCusTime == "morning")
        return url + "?" + "asc=" + this.sortCusType;
      else if (this.sortCusType == "createTime" && this.sortCusTime == "night")
        return url + "?" + "desc=" + this.sortCusType;
      else if (
        this.sortCusType == "updateTime" &&
        this.sortCusTime == "morning"
      )
        return url + "?" + "asc=" + this.sortCusType;
      else if (this.sortCusType == "updateTime" && this.sortCusTime == "night")
        return url + "?" + "desc=" + this.sortCusType;
    },
    // 客户列表-url参数设置-客户分类设计
    urlCusTypeChoose(url) {
      if (this.cusClass == "全部客户")
        return url + "&" + "customerStatus=" + "all";
      else if (this.cusClass == "未分配")
        return url + "&eq_" + "customerStatus=" + "未分配";
      else if (this.cusClass == "跟进中")
        return url + "&eq_" + "customerStatus=" + "跟进中";
    },
    // 客户列表-url参数设置-模糊查询
    urlCusNameChoose(url) {
      if (this.searchVal != "")
        return url + "&" + "like_customerName=" + this.searchVal;
      else return url;
    },
    // 筛选-url参数设置-筛选内容
    urlCusScreen(url) {
      return (url += this.selectList);
    },

    // 客户列表-客户详情跳转
    onDetail(item) {
      // this.$router.replace("/perinfor");
      this.$router.push({ name: "potentialdetail", query: { cuslist: item } });
    },
    // 客户列表-滑动删除-弹出框
    detOn(val) {
      this.detDiaShow = true;
      this.detId = val;
    },
    // 客户列表-滑动删除-确认
    async onDetOne() {
      // console.log(this.detId)
      let url = "/api/se/customer/delete";
      const result = await this.$http.get(url, { params: { id: this.detId } });
      if (result.data.code == "200") {
        Toast("成功删除");
        this.cusList = [];
        this.onLoad();
      }
      // console.log(result);
    },
    // 点击加号-弹出
    toAdd() {
      this.addShow = true;
    },
    // 筛选-筛选功能弹出框
    toScreen() {
      this.scrShow = !this.scrShow;
    },
    // 筛选-按钮点击高亮
    cutTabClick(item) {
      //然后通过这个属性判断是否选中点亮和取消
      item.isSelected = !item.isSelected;
    },
    // 筛选-跟进人列表-弹窗
    toFollow() {
      this.followShow = true;
    },
    // 筛选-跟进人列表-弹窗
    // 获取用户消息
    async getUserList() {
      let url = "/api/cms/user/query";
      if (this.followVal != "") {
        url += "?name=" + this.followVal;
      }
      const res = await this.$http.get(url, {
        params: {
          currentPage: this.followPageProps.pageNum,
          pageCount: this.followPageProps.pageSize,
        },
      });

      let userNum = res.data.totalCount;
      if (userNum != 0)
        for (let i = 0; i < this.followPageProps.pageSize; i++) {
          this.followList.push(res.data.data[i]);
          if (this.followList.length >= userNum) {
            this.finished = true;
            this.followPageProps.pageNum = 1;
            break;
          }
        }
      if (this.followList.length >= userNum) this.finished = true;
      else {
        console.log(this.followList.length);
        this.followPageProps.pageNum++;
        this.getUserList();
      }

      console.log(this.followList);
    },
    // 筛选-地区选择
    toScreArea() {
      this.showScrArea = true;
    },
    // 筛选-重置
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
      this.ifChoose = true;
      this.followChsVal.val = "";
      this.followChsVal.id = "";
      this.ifoppoChoose = true;
      this.oppoChsVal.val = "";
      this.oppoChsVal.id = "";
      this.ifbulidChoose = true;
      this.bulidChsVal.val = "";
      this.bulidChsVal.id = "";
      this.ifAreaChoose = true;
      this.scrCity = [];
    },
    // 筛选-提交
    screen() {
      this.selectList = [];
      let i, j, k;
      let selectNum;
      var select = [];
      var val = [];
      // 读取选中的标签
      for (i = 0; i < this.scrList.length; i++) {
        selectNum = 0;
        for (j = 0; j < this.scrList[i].class.length; j++) {
          // 读取选中的标签并记录，通过selectNum判断当前种类是单值还是多值
          // 通过val记录当前选中的标签值
          if (this.scrList[i].class[j].isSelected == true) {
            selectNum += 1;
            val.push(this.scrList[i].class[j].name);
          }
        }

        if (this.scrList[i].ename == "customerType") {
          if (val.length == 1) {
            if (val == "个人客户") val = 0;
            else if (val == "公司客户") val = 1;
          } else if (val.length > 1) {
            (val[0] = 0), (val[1] = 1);
          }
        }
        // 如果当前种类是单值
        if (selectNum == 1) {
          select = "&eq_" + this.scrList[i].ename + "=" + val;
        } // 当前种类是多值
        else if (selectNum > 1) {
          select = "&in_" + this.scrList[i].ename + "=";
          for (k = 0; k < val.length; k++) {
            if (k != val.length - 1) {
              select += val[k] + "▓";
            } else {
              select += val[k];
            }
          }
        }
        val = [];
        console.log(select);
        if (select != "") this.selectList += select;
        this.selectNum = 0;
        select = [];
      }
      // this.selectList.push(
      //   this.followChsVal.name + ":" + this.followChsVal.val
      // );
      if (this.scrCity != "") {
        this.selectList += "&eq_city=" + this.scrCity;
      }
      if (this.followChsVal.id != "") {
        this.selectList += "&eq_followStaffId=" + this.followChsVal.id;
      }
      if (this.bulidChsVal.id != "") {
        this.selectList += "&eq_createUserId=" + this.bulidChsVal.id;
      }
      console.log(this.selectList);
      this.cusList = [];
      this.pageProps.pageNum = 1;
      this.onLoad();
      this.scrShow = false;
    },
    // 多选-弹出框
    toCheckbox() {
      this.cheShow = !this.cheShow;
    },
    // 多选-选中项目数
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
      if (!this.$refs.checkboxes[index].checked) {
        this.scrnum++;
      } else {
        this.scrnum--;
      }
    },
    // 多选-全选功能
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
    // 多选-打标签功能
    showCh() {
      for (let i = 0; i < this.result.length; i++)
        this.ckChsList.push(this.result[i].customerID);
      console.log(this.ckChsList);
      this.ckShow = true;
    },
    // 多选-打标签-确认
    async putLabel() {
      let i, j;
      for (i = 0; i < this.putLabelList.length; i++) {
        for (j = 0; j < this.putLabelList[i].class.length; j++) {
          if (this.putLabelList[i].class[j].isSelected == false) {
            let temp = { class: { id: "" } };
            temp.class.id = this.putLabelList[i].class[j].id;
            console.log(temp.class.id);
            this.putLabelVal.push(temp.class.id);
          }
        }
      }

      let url = "/api/se/customer/label?";
      for (let k = 0; k < this.result.length; k++) {
        // putLabel.push(this.result[k].id);
        if (k != this.result.length - 1)
          url = url + "id=" + this.result[k].id + "&";
        else url = url + "id=" + this.result[k].id;
      }
      console.log(url);
      console.log(this.putLabelVal);
      const result = await this.$http.post(url, this.putLabelVal);
      if (result.data.code == "200") {
        Toast("成功打标签");
        this.putLabelVal = [];
        this.cusList = [];
        this.onLoad();
      }
    },
    // 多选-批量删除-弹窗
    toAllDelete() {
      this.deleteShow = true;
    },
    //多选-批量删除-确认
    async detAllConfirm() {
      for (let i = 0; i < this.result.length; i++)
        this.detAllCusID.push(this.result[i].id);
      // 所选不为空
      if (this.detAllCusID.length != "") {
        console.log(this.detAllCusID);
        let url = "/api/se/customer/deleteBatch";
        const result = await this.$http.post(url, this.detAllCusID);
        if (result.data.code == "200") {
          console.log(result.data.data);
          Toast("批量删除成功");
        } else {
          Toast("批量删除失败");
        }
      } else {
        Toast("所选项目为空");
      }
      this.detAllCusID = [];
      this.result = [];
    },
    // 多选-发短信-弹窗
    toShrtMsg() {
      this.shortShow = true;
    },
    // 多选-短信-界面关闭
    onClickMsgLeft() {
      this.shortShow = false;
    },
    // 多选-短信-发送短信
    onClickMsgRight() {
      if (this.message == "" || this.result == "") {
        Toast.fail("发送失败");
        this.message = "";
      } else {
        var telephone;
        for (let i = 0; i < this.result.length; i++) {
          this.ckShortMsg.customerID.push(this.result[i].telephone);
          telephone += this.result[i].telephone + ";";
        }
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var msg = this.message;

        if (isAndroid) {
          // sms:后面跟收件人的手机号,body后接短信内容
          window.location.href = "sms:" + telephone + "?body=" + msg;
        } else if (isIOS) {
          window.location.href = "sms:" + telephone + "&body=" + msg;
        }
        Toast.success("短信发送成功");
        console.log(this.message);
        this.message = "";
        this.message = "";
        this.ckShortMsg.customerID = [];
      }
    },
    // 新建客户-弹窗
    formClick() {
      this.showform = !this.showform;
      // 客户类型保持一致
      this.addList.customerType = "个人客户";
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
      if (key == "性别") this.cusDetail.sex = val;
      if (key == "年龄范围") this.cusDetail.ageRange = val;
      if (key == "来源") this.cusDetail.origin = val;
      if (key == "客户等级") this.cusDetail.customerLevel = val;
      if (key == "企业类型") this.cusDetail.companyType = val;
      if (key == "行业分类") this.cusDetail.industry = val;
      if (key == "注册资本") this.cusDetail.registeredCapital = val;
      if (key == "员工数量") this.cusDetail.companySize = val;
      if (key == "实缴资本") this.cusDetail.paidCapital = val;
      if (key == "客户类型") {
        this.cusDetail.customerType = val;
        console.log(this.cusDetail.customerType);
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
      this.cusDetail.customerStatus = value;
    },
    // 新建客户-时间-时间录入处理
    dateConfirm(val) {
      var y = val.getFullYear();
      var m = val.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = val.getDate();
      d = d < 10 ? "0" + d : d;
      const time = y + "-" + m + "-" + d;
      if (this.addDateType == "生日") this.cusDetail.approvalDate = time;
      else if (this.addDateType == "成立日期")
        this.cusDetail.establishDate = time;
      this.dateShow = false;
      this.addDateType = "";
    },
    // 新建客户-时间-取消
    dateCancel() {
      this.dateShow = false;
    },
    // 新建客户-地区弹窗-获取地址信息
    onConfirm(values) {
      this.cusDetail.city = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("/");
      this.showArea = false;
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
      this.showform = false;
    },
    onClickAddNew() {
      this.showCusform = false;
    },
    // 新建客户-保存
    onClickAddSave() {
      this.showform = false;
      this.onClickSumbmit();
    },
    // 新建客户-保存
    onClickAddSave1() {
      this.showCusform = false;
      this.onClickSumbmit1();
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
    // 处理回调函数的坑 冗杂没救了
    async userImg(base64) {
      let str = this.uploader[0].content;
      let type = this.uploadPicType(str);
      // this.uploadCusIcon(str, type, type.length);
      let url = "/api/file/pic/base64StrToPic";
      let picture;
      str = base64;
      if (type.length == 3) {
        picture = str.slice(22);
      } else if (type.length == 4) {
        picture = str.slice(23);
      } else {
        Toast("图片格式错误");
        this.uploader = [];
      }
      console.log(picture);
      if (type.length == 3 || type.length == 4) {
        let params = new FormData();
        params.append("picBase64Str", picture);
        params.append("picFormat", type);
        params.append("picType", "customerIcon");
        await this.$http
          .post(url, params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((res) => {
            console.log(res.data.data);
            this.cusDetail.customerIcon = res.data.data;
          });
      }

      if (this.cusDetail.customerType == "个人客户") {
        this.cusDetail.customerType = 0;
      } else if (this.cusDetail.customerType == "公司客户") {
        this.cusDetail.customerType = 1;
      }
      this.cusDetail.potential = 1;
      console.log(2);
      console.log(this.cusDetail.customerType);
      if (
        this.cusDetail.customerStatus == "未分配" ||
        this.cusDetail.customerStatus == "潜在客户"
      ) {
        this.cusDetail.followStaffId = "";
        this.cusDetail.followStaffName = "";
      }
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

          return newObj;
        }
      }
      this.cusDetail = removeEmptyField(this.cusDetail);
      // 传输
      url = "/api/se/customer/update";
      let postData = this.cusDetail;
      console.log(postData);
      const result = (await this.$http.post(url, postData)).data;
      // console.log(result)
      if (result.code == "200") {
        Toast("成功修改客户");
        this.showform = false;
      }
      this.showform = false;
    },
    // 新建客户-提交
    async onClickSumbmit() {
      if (this.cusDetail.customerName == "") {
        Toast("请输入用户名");
      } else {
        // 提交文件不为空
        if (this.uploader != "") {
          let str = this.uploader[0].content;
          let type = this.uploadPicType(str);
          let url = "/api/file/pic/base64StrToPic";
          let picture;
          this.dealImage(str, 1000, this.userImg);
        } else {
          if (this.cusDetail.customerType == "个人客户") {
            this.cusDetail.customerType = 0;
          } else if (this.cusDetail.customerType == "公司客户") {
            this.cusDetail.customerType = 1;
          }
          this.cusDetail.potential = 1;
          console.log(1);
          console.log(this.cusDetail.customerType);
          if (
            this.cusDetail.customerStatus == "未分配" ||
            this.cusDetail.customerStatus == "潜在客户"
          ) {
            this.cusDetail.followStaffId = "";
            this.cusDetail.followStaffName = "";
          }
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
          this.cusDetail = removeEmptyField(this.cusDetail);
          let url = "/api/se/customer/update";
          let postData = this.cusDetail;
          const result = (await this.$http.post(url, postData)).data;
          if (result.code == "200") {
            Toast("成功修改客户");
            console.log(result.data);
          }
        }
        this.showform = false;
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
      this.cusDetail.followStaffName = item.username;
      this.cusDetail.followStaffId = item.id;
    },
    // 点击加号-扫描名片
    onPicture() {
      this.pictureShow = true;
    },
    // 点击加号-扫描名片-确认
    pictureConfirm() {
      Toast("上传图片成功");
      this.pictureShow = false;
    },
    // 点击加号-扫描名片-取消
    pictureCancel() {
      this.pictureShow = false;
    },
    // 点击加号-上传名片
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
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
        // Toast("成功插入");
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (to.path == "/procustome") {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next((vm) => {
      document.body.scrollTop = vm.scrollTop;
    });
  },
};
</script>
<style lang="less" scoped>
.back {
  background-color: #f8f8f8;
  position: absolute;
  width: 100%;
  height: 100%;
}

//背景样式
.background {
  background-color: #4876f1;
  width: 100%;
  height: 250px;
  //对象可层叠
  position: absolute;
  z-index: 1;
  overflow: auto;
}
//客户详情
.cuscont {
  background-color: #ffffff;
  position: absolute;
  top: 70px;
  left: 5%;
  width: 80%;
  height: 280px;
  padding: 5%;
  z-index: 2;
  overflow: auto;
}
//头像样式
.cusimg {
  position: absolute;
  z-index: 120;
  left: 70%;
  top: 5%;
}

//下边栏背景
.listcont {
  margin-top: 400px;
  padding: 5%;
  height: 50%;
}

//返回按钮
.renav {
  background-color: #4876f1;
  color: #ffffff;
  border: none;
}
.detailnm {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
.cusfont {
  font-size: 10pt;
  margin-bottom: 5px;
}
.cusfont2 {
  font-size: 10pt;
  margin-bottom: 5px;
  color: #4876f1;
}
//订单标题
.orderTitle {
  background-color: #faf3e6;
  font-size: 13px;
  padding: 5%;
  margin-bottom: 10px;
  font-weight: 550;
}
.ordercell {
  color: #201e2b;
}
//新建用户-标题样式
.addcustit {
  background-color: #f8f8f8;
  color: #bbbcbe;
  padding-left: 15px;
  padding-top: 5px;
  height: 30px;
  font-size: 14px;
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
.wx-btn {
}

//筛选提交按钮
.screen-confirm-btn {
  border-radius: 5px;
  width: 100%;
  background-color: #4876f1;
  color: #ffffff;
}
// 客户关系字体设置
.state-font {
  color: #201e2b;
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

.list-img-none {
  width: 60px;
  height: 60px;
  background-color: #4876f1;
  font-size: 20px;
  border-radius: 50%;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
  position: absolute;
  z-index: 120;
  left: 70%;
  top: 7%;
  border-style: solid;
  border-color: #ffffff;
}
.list-img-none1 {
  width: 40px;
  height: 40px;
  background-color: #4876f1;
  border-radius: 50%;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
}

.list-tab-content {
  height: 80%;
  overflow: auto;
}
.list-tab-fa {
  height: 300px;
}
.wx-img {
  margin-left: 8px;
}
//跟进人-取消
.follow-cancel-btn {
  border: none;
}
.list-step {
  height: 50px;
}
.nav-margin {
  margin-top: 20px;
}
//搜索框
.nav-search-btn {
  // margin: 5px 2% 5px 0%;
  // padding: 2px;
  margin-top: 5px;
  margin-right: 2%;
  margin-bottom: 5px;
}
.nav-search-box {
  height: 48px;
}
//分割线
.nav-separate {
  margin: 10px 2% 5px 5%;
  opacity: 0.5;
}
//添加按钮
.nav-add-btn {
  margin: 5px 2% 5px 0%;
  // padding: 2px;
}
//最近浏览-选项
.nav-option {
  margin: 5px 2% 10px 2%;
  padding: 0px;
  height: 30px;
  width: 95px;
  background-color: #f5f5f5;
}
.nav-cusnum-font {
  font-size: 10px;
  // margin-top: 5%;
  margin-left: 5%;
  margin-top: 15px;
  color: #bbbcbe;
}
// 标签栏颜色改变
.nav-icon-colorful {
  filter: invert(43%) sepia(65%) saturate(2735%) hue-rotate(208deg)
    brightness(97%) contrast(95%);
}
// 标签栏边距
.nav-tabar {
  margin-top: 2%;
  margin-bottom: 2%;
}
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0px 0;
}
// 列表容器
.list {
  margin-top: 25px;
}
//列表内容
.list-content {
  margin-bottom: 10px;
}
//客户姓名
.list-content-name {
  font-size: 15px;
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
  margin-top: 2px;
  margin-left: 10px;
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
//多选弹出层
.check {
  height: 100%;
}
//多选列表
.check-list {
  margin-bottom: 10px;
}

.follow-choose {
  margin-left: 3%;
  color: #4876f1;
  font-size: 10pt;
}
//跟进人-取消
.follow-cancel-btn {
  border: none;
}
//短信模板-导航
.shortmsg-nar {
  margin-top: 20px;
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
//最近浏览-容器
.browse-container {
  height: 100%;
  width: 100%;
  position: absolute;

  top: 110px;
  z-index: 1;
  overflow: hidden;
}
//最近浏览-内容
.browse-content {
  height: 20%;
  width: 100%;
  position: absolute;
  z-index: 1;
  position: fixed;
}

//最近浏览-阴影
.browse-shady {
  background-color: #232228;
  position: absolute;
  height: 1200px;
  width: 100%;
  top: 180px;
  opacity: 0.8;
  z-index: 0;
  position: fixed;
}
//最近浏览-阴影补充
.browse-shady-other {
  height: 10%;
  width: 100%;
  top: 0%;
  position: absolute;
  z-index: 500;
  // opacity: 0;
  position: fixed;
}
//最近浏览-激活效果
.browse-active-btn {
  color: #4876f1;
}
// 新增-调用手机相册扫描名片
.add-choose-font {
  margin-left: 5%;
  margin-top: 10%;
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
  position: fixed;
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
}
.returnbtn {
  padding: auto;
}

.busname {
  font-size: 20px;
  padding: 5%;
  font-weight: bold;
}
.busdetail {
  padding: 3%;
}
.title {
  background-color: #f0f4fe;
  width: 35%;
  height: 60px;
  text-align: center;
  padding: 5%;
  color: #1f2752;
}
.detail {
  background-color: #ffffff;
  width: 65%;
  height: 60px;
  text-align: center;
  padding: 5%;
  color: #1f2752;
  border-color: #f5f5f5;
  border-style: solid;
  border-width: 1px;
}
.detail1 {
  background-color: #ffffff;
  width: 65%;
  height: 60px;
  text-align: center;
  padding: 5%;
  color: #1f2752;
  border-color: #f5f5f5;
  border-style: solid;
  border-width: 1px;
  overflow: auto;
}
.button-hang {
  height: 50px;
  width: 120px;
  margin-left: 3%;
  font-size: 15px;
  color: #ffffff;
  background-color: #6487e0;
}
.buttom {
  height: 20px;
}
.button-hang1 {
  height: 50px;
  width: 120px;
  margin-left: 28%;
  font-size: 15px;
  color: #ffffff;
  background-color: #6487e0;
}
</style>
