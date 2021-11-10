<template>
  <div>
    <!-- 导航栏 -->
    <van-row>
      <!-- 导航-客户类型筛选-->
      <div>
        <van-col span="8">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item
              v-model="cusVal"
              :options="cusOpt"
              @change="onOrderList(cusVal)"
            />
          </van-dropdown-menu>
        </van-col>
      </div>
      <!-- 导航-搜索 -->
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
      <!-- 导航-搜索-搜索图标 -->
      <van-col class="schbtn" span="2" offset="12" v-if="isSearch"
      ><van-icon name="search" size="30" @click="toSearch"
      /></van-col>
      <!-- 导航-分割线 -->
      <van-col class="separate" v-if="isSearch">|</van-col>
      <!-- 导航-新建 -->
      <van-col class="addbtn" span="2" v-if="isSearch"
      ><van-icon name="plus" size="30" @click="toAdd" />
      </van-col>
    </van-row>
    <!-- 标签栏 -->
    <van-row>
      <van-tabbar v-model="barAct" :fixed="false">
        <!-- 最近浏览 -->
        <van-tabbar-item class="navopt" @click="sortPop">
          <van-icon
            :name="cus_new"
            :class="barAct == 0 ? 'colorful' : ''"
          />最近浏览
        </van-tabbar-item>
        <!-- 筛选 -->
        <van-tabbar-item class="navopt" @click="toScreen"
        ><van-icon
          :name="cus_scr"
          :class="barAct == 1 ? 'colorful' : ''"
        />筛选</van-tabbar-item
        >
        <!-- 多选 -->
        <van-tabbar-item class="navopt" @click="toCheckbox"
        ><van-icon
          :name="cus_chc"
          :class="barAct == 2 ? 'colorful' : ''"
        />多选</van-tabbar-item
        >
      </van-tabbar>
    </van-row>
    <!-- 客户列表 -->
    <van-list
      class="listcot"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-swipe-cell v-for="item in cusList" :key="item.customerID">
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
          <van-button
            square
            text="删除"
            type="danger"
            class="delete-button"
            @click="detOn"
          />
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
    />

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
      <van-row>
        <p class="scrname">跟进人</p>
        <p class="followchoose" @click="toFollow" v-show="this.ifChoose">
          请选择>>>
        </p>
        <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">
          {{ this.followChsVal.val }}
        </p>
      </van-row>
      <van-row>
        <p class="scrname">上次跟进人</p>
        <p class="followchoose" @click="toFollow" v-show="this.ifChoose">
          请选择>>>
        </p>
        <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">
          {{ this.followChsVal.val }}
        </p>
      </van-row>
      <van-row>
        <p class="scrname">商机负责人</p>
        <p class="followchoose" @click="toFollow" v-show="this.ifChoose">
          请选择>>>
        </p>
        <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">
          {{ this.followChsVal.val }}
        </p>
      </van-row>
      <van-row>
        <p class="scrname">协助人</p>
        <p class="followchoose" @click="toFollow" v-show="this.ifChoose">
          请选择>>>
        </p>
        <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">
          {{ this.followChsVal.val }}
        </p>
      </van-row>
      <van-row>
        <p class="scrname">创建人</p>
        <p class="followchoose" @click="toFollow" v-show="this.ifChoose">
          请选择>>>
        </p>
        <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">
          {{ this.followChsVal.val }}
        </p>
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
      :overlay="false"
      duration="0"
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
<<<<<<< HEAD
        <van-tabbar-item icon="search" @click="showCh">打标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o" @click="toShrtMsg"
        >发短信</van-tabbar-item
        >
        <van-tabbar-item icon="setting-o" @click="toAllDelete"
        >批量删除</van-tabbar-item
=======
        <van-tabbar-item :icon="cus_lable" @click="showCh">打标签</van-tabbar-item>
        <van-tabbar-item :icon="cus_msg" @click="toShrtMsg"
          >发短信</van-tabbar-item
        >
        <van-tabbar-item :icon="cus_delete" @click="toAllDelete"
          >批量删除</van-tabbar-item
>>>>>>> 5ec8619305777db881dd8ce7fa4e0ce4be76864c
        >
      </van-tabbar>
    </van-popup>
    <!-- 新建客户表单 -->
    <van-popup
      v-model="showform"
      position="bottom"
      :overlay="false"
      duration="0"
    >
      <van-nav-bar
        title="新建客户"
        left-text="返回"
        right-text="保存"
        @click-left="onClickAddRe"
        @click-right="onClickAddSave"
      />
      <van-form @submit="onSubmit">
        <van-row class="addcustit">客户信息</van-row>
        <van-field name="uploader" label="头像">
          <template #input>
            <van-uploader v-model="uploader" />
          </template>
        </van-field>
        <!-- 客户信息-姓名 -->
        <van-field
          v-model="addList.addNam"
          name="validator"
          label="姓名"
          placeholder="请输入"
        />
        <!-- 手机号 -->
        <van-field
          v-model="addList.addPho"
          name="validator"
          label="手机"
          placeholder="请输入"
        />
        <van-row class="addcustit">联系信息</van-row>
        <van-field
          v-model="addList.addWxNam"
          name="validator"
          label="微信昵称"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addWxNum"
          name="validator"
          label="微信号"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addSex"
          name="validator"
          label="性别"
          placeholder="请输入"
        >
          <template #input>
            <van-button
              v-for="item in scrList[0].class"
              :key="item.name"
              :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
              @click="cutTabClick(item)"
            >{{ item.name }}
            </van-button>
          </template>
        </van-field>
        <van-field
          v-model="addList.addAge"
          name="validator"
          label="年龄范围"
          placeholder="请输入"
        >
          <template #input>
            <van-button
              v-for="item in scrList[1].class"
              :key="item.name"
              :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
              @click="cutTabClick(item)"
            >{{ item.name }}
            </van-button>
          </template>
        </van-field>
        <van-field
          v-model="addList.addLabel"
          rows="1"
          autosize
          type="textarea"
          name="validator"
          label="标签"
          placeholder="请输入"
        >
          <template #input>
            <van-cell>
              <van-button
                v-for="item in scrList[2].class"
                :key="item.name"
                :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
                @click="cutTabClick(item)"
              >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <van-field
          v-model="addList.addSource"
          name="validator"
          label="来源"
          placeholder="请输入"
        >
          <template #input>
            <van-cell>
              <van-button
                v-for="item in scrList[3].class"
                :key="item.name"
                :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
                @click="cutTabClick(item)"
              >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <van-field
          v-model="addList.addPosition"
          name="validator"
          label="职位"
          placeholder="请输入"
        />
        <!-- 生日信息 -->
        <van-field
          v-model="addList.dateVal"
          name="validator"
          label="生日"
          placeholder="选择时间"
          @click="toDate"
        />
        <van-field
          v-model="addList.addHob"
          name="validator"
          label="个人喜好"
          placeholder="请输入"
        />
        <!-- <van-field name="uploader" label="标签">
          <template #input>
            <van-tag type="warning">标签</van-tag>
          </template>
        </van-field> -->
        <van-row class="addcustit">公司信息</van-row>
        <van-field
          v-model="addList.addCompany"
          name="validator"
          label="公司"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addLegStaff"
          name="validator"
          label="法定代表人"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addCusLv"
          name="validator"
          label="企微-客户等级"
          placeholder="请输入"
        >
          <template #input>
            <van-cell>
              <van-button
                v-for="item in scrList[4].class"
                :key="item.name"
                :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
                @click="cutTabClick(item)"
              >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <van-field
          v-model="addList.addComTyp"
          name="validator"
          label="企业类型"
          placeholder="请输入"
        >
          <template #input>
            <van-cell>
              <van-button
                v-for="item in scrList[4].class"
                :key="item.name"
                :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
                @click="cutTabClick(item)"
              >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <van-field
          v-model="addList.addInd"
          name="validator"
          label="行业分类"
          placeholder="请输入"
        >
          <template #input>
            <van-cell>
              <van-button
                v-for="item in scrList[5].class"
                :key="item.name"
                :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
                @click="cutTabClick(item)"
              >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <van-field
          v-model="addList.addRegCap"
          name="validator"
          label="注册资本"
          placeholder="请输入"
        >
          <template #input>
            <van-cell>
              <van-button
                v-for="item in scrList[6].class"
                :key="item.name"
                :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
                @click="cutTabClick(item)"
              >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>
        <van-field
          v-model="addList.addStafNum"
          name="validator"
          label="员工数量"
          placeholder="请输入"
        >
          <template #input>
            <van-cell>
              <van-button
                v-for="item in scrList[7].class"
                :key="item.name"
                :class="item.isSelected ? 'actscrbtn' : 'scrbtn'"
                @click="cutTabClick(item)"
              >{{ item.name }}
              </van-button>
            </van-cell>
          </template>
        </van-field>

        <!-- 地区信息 -->
        <van-field
          readonly
          clickable
          name="area"
          :value="addList.areaVal"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
        />
        <van-field
          v-model="addList.addAdr"
          name="validator"
          label="地址"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addBusRan"
          name="validator"
          label="经营范围"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addTrad"
          name="validator"
          label="商标"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addChaCap"
          name="validator"
          label="渠道能力"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addHasD"
          name="validator"
          label="是否有定制能力"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addNote"
          name="validator"
          label="备注"
          placeholder="请输入"
        />
        <van-field
          v-model="addList.addCusSta"
          readonly
          clickable
          name="area"
          label="客户状态"
          placeholder="点击选择客户状态"
          @click="addCusStaShow = true"
        >
        </van-field>
        <van-field
          v-model="addList.addFollSta"
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

    <!-- 最近浏览-弹窗 -->
    <div class="scrcontainer" v-show="this.sortShow">
      <van-cell-group class="scrcell">
        <van-cell
          title="创建时间从晚到早"
          @click="cFromNbtn"
          :class="this.cFromN ? 'actordbtn' : ''"
        >
          <van-icon name="passed" v-show="cFromN" color="#4876f1" />
        </van-cell>
        <van-cell
          title="创建时间从早到晚"
          @click="cFromMbtn"
          :class="this.cFromM ? 'actordbtn' : ''"
        >
          <van-icon name="passed" v-show="cFromM" color="#4876f1" />
        </van-cell>
        <van-cell
          title="最近动态时间从晚到早"
          @click="dFromNbtn"
          :class="this.dFromN ? 'actordbtn' : ''"
        >
          <van-icon name="passed" v-show="dFromN" color="#4876f1" />
        </van-cell>
        <van-cell
          title="最近动态时间从早到晚"
          @click="dFromMbtn"
          :class="this.dFromM ? 'actordbtn' : ''"
        >
          <van-icon name="passed" v-show="dFromM" color="#4876f1" />
        </van-cell>
      </van-cell-group>
      <!-- 弹窗关闭区域 -->
      <div class="scrshady" @click="latCancel"></div>
      <div class="scroth" @click="latCancel"></div>
    </div>

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
    <!-- 多选-批量删除对话框 -->
    <van-dialog
      v-model="deleteShow"
      title="是否删除选中项"
      show-cancel-button
      @confirm="detAllConfirm"
    >
    </van-dialog>
    <!-- 多选-短信弹出框 -->
    <van-popup v-model="shortShow" position="bottom" :style="{ height: '90%' }">
      <van-nav-bar
        title="发短信"
        left-text="取消"
        right-text="发送"
        @click-left="onClickMsgLeft"
        @click-right="onClickMsgRight"
      />
      <van-tabs
        type="card"
        color="#4876F1"
        title-active-color="#FFFFFF"
        class="shortmsgnar"
      >
        <van-tab title="自定义短信">
          <van-field
            v-model="message"
            rows="1"
            autosize
            label="短信内容"
            type="textarea"
            placeholder="请输入"
          />
        </van-tab>

        <van-tab title="模板短信">
          <van-cell-group>
            <van-cell title="请选择短信模板" />
          </van-cell-group>
        </van-tab>
      </van-tabs>
    </van-popup>
    <!-- 跟进人弹出框 -->
    <van-popup
      v-model="followShow"
      position="bottom"
      :style="{ height: '100%' }"
      :overlay="false"
      duration="0"
    >
      <van-button class="folcanbtn" @click="folCancel">取消</van-button>
      <van-search v-model="followVal" placeholder="请输入搜索关键词" />
      <van-cell-group>
        <van-cell
          v-for="item in cusList"
          :key="item.customerID"
          v-show="item.isShow"
          @click="followConfirm(item)"
        >
          <van-row>
            <van-col span="4"
            ><van-image
              round
              width="40"
              height="40"
              :src="item.basicMsg[0].customerPhoto"
            /></van-col>
            <van-col span="4" class="cusname"
            ><div class="van-ellipsis">
              {{ item.basicMsg[0].customerName }}
            </div></van-col
            >
            <van-col offset="2" class="cusmsg">{{
                item.basicMsg[0].customerName
              }}</van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
    </van-popup>
    <!-- 客户状态选择弹出框 -->
    <van-popup
      v-model="addCusStaShow"
      position="bottom"
      :style="{ height: '20%' }"
    >
      <van-picker title="客户状态" show-toolbar :columns="columns" />
    </van-popup>
    <!-- 协助人弹出框 -->
    <!-- 多选-打标签弹出框 -->
    <van-popup v-model="ckShow" closeable position="right" class="scrpop">
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
    </van-popup>
    <!-- 客户列表-滑动单元格-删除 -->
    <van-dialog v-model="detDiaShow" title="是否删除选中项" show-cancel-button>
    </van-dialog>
  </div>
</template>

<script>
import qs from "qs"; // axios参数包
import { areaList } from "@vant/area-data";
import { Toast } from "vant";

export default {
  name: "customer",
  data() {
    return {
      // 导航-客户类型-选择值
      cusVal: 0,
      // 导航-客户类型-数组
      cusOpt: [
        { text: "全部客户", value: 0 },
        { text: "待分配客户", value: 1 },
        { text: "跟进中客户", value: 2 },
      ],
      // 搜索-搜索内容
      searchVal: "",
      // 搜索-搜索图标展示（同时绑定新建和分割线的显示）
      isSearch: true,
      // 客户列表-是否加载完毕
      loading: false,
      // 客户列表-是否加载完毕
      finished: false,
      // 客户列表
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
      // 新增客户-弹出层界面展示
      addShow: false,
      // 新增客户-弹出层信息
      actions: [
        { name: "新增用户", callback: this.formClick },
        { name: "扫描名片" },
      ],
      // 标签栏-绑定标识符
      barAct: 0,
      // 筛选-弹出层界面
      scrShow: false,
      // 筛选-筛选列表
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
          name: "跟进阶段",
          class: [
            { name: "新客", isSelected: false },
            { name: "已加微信", isSelected: false },
            { name: "产品介绍", isSelected: false },
            { name: "合作模式洽谈", isSelected: false },
            { name: "签约协议", isSelected: false },
            { name: "已成交", isSelected: false },
            { name: "已打首付款", isSelected: false },
            { name: "阶段性付款", isSelected: false },
            { name: "已打尾款", isSelected: false },
            { name: "多次成交", isSelected: false },
            { name: "已输单", isSelected: false },
            { name: "无效客户", isSelected: false },
          ],
        },
        {
          name: "输单原因",
          class: [
            { name: "价格原因", isSelected: false },
            { name: "合作模式", isSelected: false },
            { name: "产品", isSelected: false },
            { name: "其它", isSelected: false },
          ],
        },
        {
          name: "无效原因",
          class: [
            { name: "其它", isSelected: false },
            { name: "客户无需求", isSelected: false },
            { name: "多次联系不上", isSelected: false },
            { name: "错误手机号码", isSelected: false },
          ],
        },
        {
          name: "商机创建时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "预计成交时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "成交时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "结束时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近跟进阶段",
          class: [
            { name: "新客", isSelected: false },
            { name: "已加微信", isSelected: false },
            { name: "产品介绍", isSelected: false },
            { name: "合作模式洽谈", isSelected: false },
            { name: "签约协议", isSelected: false },
            { name: "已成交", isSelected: false },
            { name: "已打首付款", isSelected: false },
            { name: "阶段性付款", isSelected: false },
            { name: "已打尾款", isSelected: false },
            { name: "多次成交", isSelected: false },
            { name: "已输单", isSelected: false },
            { name: "无效客户", isSelected: false },
          ],
        },
        {
          name: "成交状态",
          class: [
            { name: "未成交", isSelected: false },
            { name: "成交", isSelected: false },
          ],
        },
        {
          name: "客户状态",
          class: [
            { name: "未成交", isSelected: false },
            { name: "成交", isSelected: false },
          ],
        },
        {
          name: "创建时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "分配时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近通话时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近通话状态",
          class: [
            { name: "已接通", isSelected: false },
            { name: "未接通", isSelected: false },
            { name: "未知", isSelected: false },
          ],
        },
        {
          name: "回收时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近旅程时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
      ],
      // 筛选-跟进人列表是否被选取
      ifChoose: true,
      // 多选-界面弹出层
      cheShow: false,
      // 多选-多选选取的标识符信息
      result: [],
      // 多选-全选标识
      checked: false,
      // 新建客户-弹出层
      showform: false,
      // 新建客户-时间弹窗
      dateShow: false,
      // 新建客户-时间选择值
      dateVal: "",
      // 新建客户-时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 新建客户-时间-时间最大值
      maxDate: new Date(2025, 10, 1),
      // 新建客户-地区-地区列表
      areaList,
      // 新建客户-地区-弹窗
      showArea: false,
      // 最近浏览-弹出层
      sortShow: false,
      // 最近浏览-列表顺序-创建时间从晚到早
      cFromN: true,
      // 最近浏览-列表顺序-创建时间从早到晚
      cFromM: false,
      // 最近浏览-列表顺序-最近动态从晚到早
      dFromN: false,
      // 最近浏览-列表顺序-最近动态从早到晚
      dFromM: false,
      // 多选-批量删除-弹窗
      deleteShow: false,
      // 多选-短信发送-弹窗
      shortShow: false,
      // 多选-短信发送-短信内容
      message: "",
      // 筛选-跟进人-弹窗
      followShow: false,
      // 筛选-跟进人-搜索
      followVal: "",
      // 新建客户-客户状态选择-弹窗
      addCusStaShow: false,
      // 新建客户-客户状态选择-内容
      columns: ["跟进中", "未分配", "潜在客户"],
      // 多选-打标签-弹窗
      ckShow: false,
      // 新建客户-头像数据
      uploader: [{ url: "https://img01.yzcdn.cn/vant/leaf.jpg" }],
      // 列表加载-分页
      pageProps: {
        pageNum: 1,
        pageSize: 10,
      },
      //客户列表-滑动单元格-删除
      detDiaShow: false,
      // 多选-记录选中客户的数量
      scrnum: 0,

      value: "",
      list: [],
      show: false,
      // 新建客户-地区-地区值
      areaVal: "",
      //新建客户界面
      // 筛选-标签选择数组
      selectList: [],
      // 多选-选择数组
      ckChsList: [],
      // 添加表单标签列表（处理单选值）
      addLabelList: [
        {
          name: "性别",
          class: [
            { name: "男", isSelected: false },
            { name: "女", isSelected: false },
          ],
          onlySelect: false,
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
      ],
      // 添加表单
      addList: {
        addNam: "",
        addPho: "",
        addWxNam: "",
        addWxNum: "",
        addSex: "",
        addAge: "",
        addLabel: "",
        addSource: "",
        addPosition: "",
        addHobby: "",
        addCompany: "",
        addLegStaff: "",
        addCusLv: "",
        addComTyp: "",
        addInd: "",
        addRegCap: "",
        addStafNum: "",
        addAdr: "",
        addBusRan: "",
        addTrad: "",
        addChaCap: "",
        addHasD: "",
        addNote: "",
        addCusSta: "",
        addFollSta: "",
        addHob: "",
      },
      // 跟进人选择列表
      followChsVal: { name: "跟进人", val: "" },
      // 新建客户-客户状态选择
      addCusStaShow: false,
      show: false,
      ckShortMsg: { customerID: [], customerMsg: "" },
      //筛选列表
      newscrList: [],
      //客户分类
      cusClass: "全部客户",
      //列表顺序
      listOrder: "创建时间从晚到早",
      //多选-全部删除
      detAllCusID: [],
      // 图标
      cus_new: require("../../assets/cusicon/cus_new.png"),
      cus_scr: require("../../assets/cusicon/cus_scr.png"),
      cus_chc: require("../../assets/cusicon/cus_ckc.png"),
      cus_delete: require("../../assets/cusicon/cus_delete.png"),
      cus_lable: require("../../assets/cusicon/cus_lable.png"),
      cus_msg: require("../../assets/cusicon/cus_msg.png"),
    };
  },
  methods: {
    //orderList客户分类选择
    onOrderList(cusVal) {
      if (cusVal == 0) this.cusClass = "全部客户";
      else if (cusVal == 1) this.cusClass = "待分配客户";
      else if (cusVal == 2) this.cusClass = "跟进中客户";
      console.log(this.cusClass);
      console.log(this.listOrder);
    },
    // 客户列表-搜索功能
    onSearch(val) {
      console.log(val);
    },
    // 客户列表-搜索功能-取消
    onSearchCancel() {
      this.isSearch = !this.isSearch;
    },
    // 客户列表-搜索功能展示
    toSearch() {
      this.isSearch = !this.isSearch;
    },
    // 新建客户-新建客户弹出框
    toAdd() {
      this.addShow = true;
    },
    // 最近浏览-最近浏览弹出框
    sortPop() {
      this.sortShow = !this.sortShow;
    },
    // 筛选-筛选功能弹出框
    toScreen() {
      this.scrShow = !this.scrShow;
    },

    // 多选-多选功能弹出框
    toCheckbox() {
      this.cheShow = !this.cheShow;
    },
    // 客户列表-列表加载
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
    // 客户列表-客户详情跳转
    onDetail() {
      this.$router.replace("/perinfor");
    },
    // 客户列表-滑动删除-弹出框
    detOn() {
      this.detDiaShow = true;
    },
    // 筛选-按钮点击高亮事件
    cutTabClick(item) {
      //然后通过这个属性判断是否选中点亮和取消
      item.isSelected = !item.isSelected;
    },
    // 筛选-跟进人列表-弹窗
    toFollow() {
      this.followShow = true;
    },
    // 筛选-上次跟进人列表-弹窗

    // 筛选-重置-重置已经选中标签
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
      this.followChsVal = [];
    },
    // 筛选-筛选内容提交
    screen() {
      this.selectList = [];
      let i, j;
      //读取选中的标签
      for (i = 0; i < this.scrList.length; i++) {
        for (j = 0; j < this.scrList[i].class.length; j++) {
          if (this.scrList[i].class[j].isSelected == true) {
            this.selectList.push(
              this.scrList[i].name + ":" + this.scrList[i].class[j].name
            );
          }
        }
      }
      this.selectList.push(
        this.followChsVal.name + ":" + this.followChsVal.val
      );
      console.log(this.selectList);
      // // console.log(this.scrList[1].class[2].name);
      // // 先将所有列表内容设置为不显示
      // for (i = 0; i < this.cusList.length; i++) {
      //   this.cusList[i].isShow = false;
      // }
      // // 如果查到相应标签就显示相关内容
      // for (i = 0; i < this.selectList.length; i++) {
      //   this.cusList.forEach((item) => {
      //     if (item.contactMsg[0].sex.indexOf(this.selectList[i]) !== -1) {
      //       item.isShow = true;
      //     }
      //     if (item.contactMsg[0].ageRange.indexOf(this.selectList[i]) !== -1) {
      //       item.isShow = true;
      //     }
      //     if (item.contactMsg[0].source.indexOf(this.selectList[i]) !== -1) {
      //       item.isShow = true;
      //     }
      //   });
      // }
    },
    // 多选-复选框点击-右上角选中项目数目
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
    // 多选-发短信-弹窗
    toShrtMsg() {
      this.shortShow = true;
    },
    // 多选-批量删除-弹窗
    toAllDelete() {
      this.deleteShow = true;
    },
    // 新建客户-弹出层
    formClick() {
      this.showform = !this.showform;
    },
    // 新建客户-表单内容提交
    onSubmit(values) {
      //console.log("submit", values);
    },
    // 新建客户-时间-时间弹窗
    toDate() {
      this.dateShow = true;
    },
    // 新建客户-时间-时间录入处理
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
    // 新建客户-时间-取消
    dateCancel() {
      this.dateShow = false;
    },
    // 新建客户-地区弹窗-获取地址信息
    onConfirm(values) {
      this.areaVal = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("/");
      this.showArea = false;
    },

    //跟进人选择页面取消
    folCancel() {
      this.followShow = false;
    },
    //跟进人选择
    followConfirm(item) {
      console.log(item.basicMsg[0].customerName);
      this.followShow = false;
      this.followChsVal.val = item.basicMsg[0].customerName;
      this.ifChoose = false;
    },
    //多选-短信-界面关闭
    onClickMsgLeft() {
      this.shortShow = false;
    },
    //多选-短信-发送短信
    onClickMsgRight() {
      Toast.success("成功");
      for (let i = 0; i < this.result.length; i++)
        this.ckShortMsg.customerID.push(this.result[i].customerID);
      this.ckShortMsg.customerMsg = this.message;
      console.log(this.ckShortMsg);
    },
    //最近浏览-页面关闭
    latCancel() {
      this.sortShow = false;
    },
    //最近浏览-单选
    cFromNbtn() {
      this.cFromN = true;
      this.listOrder = "创建时间从晚到早";
      this.sortShow = false;
      this.dFromM = false;
      this.dFromN = false;
      this.cFromM = false;
    },
    cFromMbtn() {
      this.cFromM = true;
      this.listOrder = "创建时间从早到晚";
      this.sortShow = false;
      this.dFromN = false;
      this.cFromN = false;
      this.dFromM = false;
    },
    dFromNbtn() {
      this.dFromN = true;
      this.listOrder = "最近动态从早到晚";
      this.sortShow = false;
      this.dFromM = false;
      this.cFromN = false;
      this.cFromM = false;
    },
    dFromMbtn() {
      this.dFromM = true;
      this.listOrder = "最近动态从晚到早";
      this.sortShow = false;
      this.dFromN = false;
      this.cFromN = false;
      this.cFromM = false;
    },

    //多选-批量删除-确认
    detAllConfirm() {
      for (let i = 0; i < this.result.length; i++)
        this.detAllCusID.push(this.result[i].customerID);
      console.log(this.detAllCusID);
    },
    // 新建表单-返回
    onClickAddRe() {
      this.showform = false;
      console.log("新建用户-返回");
    },
    //新建表单-保存
    onClickAddSave() {
      this.showform = false;
      console.log("新建用户-保存");
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
  height: 100%;
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

.oversty {
}
.followchoose {
  margin-left: 10%;
  color: #4876f1;
  font-size: 10pt;
}
//跟进人-取消
.folcanbtn {
  border: none;
}
//短信模板-导航
.shortmsgnar {
  margin-top: 20px;
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
//最近浏览-容器
.scrcontainer {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 110px;
  z-index: 1;
}
//最近浏览-内容
.scrcell {
  height: 20%;
  width: 400px;
  position: absolute;
  z-index: 1;
}

//最近浏览-阴影
.scrshady {
  background-color: #232228;
  position: absolute;
  height: 1200px;
  width: 100%;
  top: 180px;
  opacity: 0.8;
  z-index: 0;
}
//最近浏览-阴影补充
.scroth {
  height: 10%;
  width: 100%;
  top: -100px;
  position: absolute;
  z-index: 50;
  opacity: 0;
}
//最近浏览-激活效果
.actordbtn {
  color: #4876f1;
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
// 标签栏颜色改变
.colorful {
  filter: invert(43%) sepia(65%) saturate(2735%) hue-rotate(208deg)
  brightness(97%) contrast(95%);
}
</style>
