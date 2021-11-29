<template>
  <div>
    <div :class="this.sortShow ? 'main-fix' : ''">
      <!-- 导航栏 -->
      <van-row>
        <!-- 导航-客户类型筛选-->
        <van-col span="8">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item
              v-model="cusVal"
              :options="cusOpt"
              @change="onOrderList(cusVal)"
            >
            </van-dropdown-item>
          </van-dropdown-menu>
        </van-col>

        <van-col class="nav-cusnum-font" v-if="isSearch"
          >客户总数:{{ this.cusNum }}</van-col
        >
        <!-- 导航-搜索 -->
        <form action="/">
          <van-search
            v-if="!isSearch"
            v-model="searchVal"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onSearchCancel"
            class="nav-search-box"
          />
        </form>
        <!-- 导航-搜索-搜索图标 -->
        <van-col class="nav-search-btn" span="1" offset="4" v-if="isSearch"
          ><van-icon name="search" size="30" @click="toSearch"
        /></van-col>
        <!-- 导航-分割线 -->
        <van-col class="nav-separate" span="1" v-if="isSearch">|</van-col>
        <!-- 导航-新建图标 -->
        <van-col class="nav-add-btn" span="1" v-if="isSearch"
          ><van-icon name="plus" size="30" @click="toAdd" />
        </van-col>
      </van-row>
      <!-- 标签栏 -->
      <van-row>
        <van-tabbar v-model="barAct" :fixed="false" class="nav-tabar">
          <!-- 最近浏览 -->
          <van-tabbar-item class="nav-option" @click="sortPop">
            <van-icon
              :name="cus_new"
              :class="barAct == 0 ? 'nav-icon-colorful' : ''"
            />排序
          </van-tabbar-item>
          <!-- 筛选 -->
          <van-tabbar-item class="nav-option" @click="toScreen"
            ><van-icon
              :name="cus_scr"
              :class="barAct == 1 ? 'nav-icon-colorful' : ''"
            />筛选</van-tabbar-item
          >
          <!-- 多选 -->
          <van-tabbar-item class="nav-option" @click="toCheckbox"
            ><van-icon
              :name="cus_chc"
              :class="barAct == 2 ? 'nav-icon-colorful' : ''"
            />多选</van-tabbar-item
          >
        </van-tabbar>
      </van-row>
      <!-- 客户列表 -->

      <van-list
        class="list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="van-clearfix">
          <!-- 客户列表-滑动单元格 -->
          <van-swipe-cell v-for="item in cusList" :key="item.id">
            <van-row @click="onDetail(item)" class="list-content">
              <!--客户信息行-->
              <van-row>
                <!-- 客户列表-头像 -->
                <van-col span="4" offset="1">
                  <van-image
                    round
                    width="40"
                    height="40"
                    :src="item.customerIcon"
                    v-if="item.customerIcon"
                  />
                  <div v-if="!item.customerIcon" class="list-img-none">
                    {{ item.customerName[0] }}
                  </div>
                </van-col>
                <!-- 客户列表-客户姓名 -->
                <van-col span="11" class="list-content-name"
                  ><div class="van-ellipsis">
                    {{ item.customerName }}
                  </div></van-col
                >
                <!-- 客户列表-进入客户池时间 -->
                <van-col span="8" class="list-content-time"
                  >{{ item.enterPoolDate }}进入客户池</van-col
                >
                <!-- 客户列表-客户公司信息 -->
                <van-col span="16" class="list-content-msg">{{
                  item.belongCompany
                }}</van-col>
              </van-row>
              <!-- 客户标签行 -->
              <van-row>
                <van-col span="4"></van-col>
                <!-- 显示标签 -->
                <van-col class="list-content-tag"
                  ><van-tag
                    color="#E7F7E3"
                    text-color="#67C74D"
                    v-for="item2 in item.customerLabels"
                    :key="item2.id"
                    >{{ item2.labelType + ":" + item2.labelName }}</van-tag
                  ></van-col
                >
              </van-row>
            </van-row>
            <!-- 客户列表-滑动删除 -->
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="detOn(item.id)"
              />
            </template>
            <van-divider />
          </van-swipe-cell>
        </div>
      </van-list>
    </div>
    <!-- 客户列表-滑动单元格-删除对话框 -->
    <van-dialog
      v-model="detDiaShow"
      title="是否删除选中项"
      show-cancel-button
      @confirm="onDetOne"
    >
    </van-dialog>
    <!-- 点击加号-点击选择框 -->
    <van-action-sheet
      v-model="addShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
    >
    </van-action-sheet>
    <!-- 点击加号 上传扫描图片 -->
    <van-popup v-model="pictureShow" round position="bottom">
      <van-row>
        <van-col class="add-choose-font">点击选择上传文件</van-col>
        <van-col offset="4" class="add-choose-margin"
          ><van-uploader :after-read="afterRead"
        /></van-col>
      </van-row>
      <van-button type="info" @click="pictureConfirm" class="screen-confirm-btn"
        >确定</van-button
      >
      <van-button
        type="default"
        @click="pictureCancel"
        class="screen-reset-btn"
        hairline
        >取消</van-button
      >
    </van-popup>
    <!-- 筛选内容 -->
    <van-popup v-model="scrShow" closeable position="right" class="screen">
      <van-row v-for="item in scrList" :key="item.name">
        <p class="screen-name">{{ item.name }}</p>
        <van-button
          v-for="(item1, index) in item.class"
          :key="item1.name"
          :class="item1.isSelected ? 'active-screen-btn' : 'screen-btn'"
          @click="cutTabClick(item1, item, index)"
        >
          {{ item1.name }}</van-button
        >
      </van-row>
      <!-- 筛选-地区选择 -->
      <van-row>
        <p class="screen-name">地区</p>
        <p class="follow-choose" @click="toScreArea" v-show="this.ifAreaChoose">
          请选择>>>
        </p>
        <p
          class="follow-choose"
          @click="toScreArea"
          v-show="!this.ifAreaChoose"
        >
          {{ this.scrCity }}
        </p>
      </van-row>
      <!-- 筛选-跟进人信息 -->
      <van-row>
        <p class="screen-name">跟进人</p>
        <p class="follow-choose" @click="toFollow" v-show="this.ifChoose">
          请选择>>>
        </p>
        <p class="follow-choose" @click="toFollow" v-show="!this.ifChoose">
          {{ this.followChsVal.val }}
        </p>
      </van-row>
      <!-- 筛选-商机负责人 -->
      <van-row>
        <p class="screen-name">商机负责人</p>
        <p class="follow-choose" @click="toOppo" v-show="this.ifoppoChoose">
          请选择>>>
        </p>
        <p class="follow-choose" @click="toOppo" v-show="!this.ifoppoChoose">
          {{ this.oppoChsVal.val }}
        </p>
      </van-row>
      <!-- 筛选-创建人信息 -->
      <van-row>
        <p class="screen-name">创建人</p>
        <p class="follow-choose" @click="toBuild" v-show="this.ifbulidChoose">
          请选择>>>
        </p>
        <p class="follow-choose" @click="toBuild" v-show="!this.ifbulidChoose">
          {{ this.bulidChsVal.val }}
        </p>
      </van-row>

      <!-- 筛选内容重置 -->

      <van-button
        type="default"
        @click="reset"
        class="screen-reset-btn"
        hairline
        >重置</van-button
      >
      <!-- 筛选内容提交 -->
      <van-button type="info" @click="screen" class="screen-confirm-btn"
        >确定</van-button
      >
    </van-popup>
    <!--筛选-跟进人弹出框 -->
    <van-popup
      v-model="followShow"
      position="bottom"
      :style="{ height: '100%' }"
      :overlay="false"
      duration="0"
    >
      <van-button class="follow-cancel-btn" @click="folCancel">取消</van-button>
      <van-search
        v-model="followVal"
        placeholder="请输入搜索关键词"
        @search="onFollowSearch"
        @cancel="onFollowSearchCancel"
      />
      <van-cell
        v-for="item in followList"
        :key="item.id"
        @click="followConfirm(item)"
      >
        <!-- 跟进人-跟进人信息 -->
        <van-row>
          <!-- 跟进人-跟进人头像 -->
          <van-col span="4"
            ><van-image
              round
              width="40"
              height="40"
              :src="item.userIcon"
              v-if="item.userIcon"
            />
            <div v-if="!item.userIcon" class="list-img-none">
              {{ item.username[0] }}
            </div>
          </van-col>
             
          <!-- 跟进人-跟进人姓名 -->
          <van-col span="6" class="list-content-name"
            ><div class="van-ellipsis">
              {{ item.username }}
            </div></van-col
          >
          <!-- 跟进人-跟进人公司信息 -->
          <van-col offset="2" class="list-content-msg">{{
            item.telephone
          }}</van-col>
        </van-row>
      </van-cell>
    </van-popup>
    <!-- 创建人弹出框 -->

    <!-- 筛选-地区弹窗 -->
    <van-popup v-model="showScrArea" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onScrConfirm"
        @cancel="showScrArea = false"
      />
    </van-popup>
    <!-- 多选内容 -->
    <van-popup
      v-model="cheShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      close-icon="close"
      class="check"
      :overlay="false"
      duration="0"
    >
      <!-- 多选-导航栏 -->
      <van-nav-bar title="客户详情">
        <template #right> 已选中{{ scrnum }}项 </template>
      </van-nav-bar>
      <!-- 多选-客户信息 -->
      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <!-- 多选-单元格 -->
        <van-cell
          v-for="(item, index) in cusList"
          :key="item.id"
          clickable
          @click="toggle(index)"
        >
          <!-- 多选-客户头像 -->
          <van-row class="check-list">
            <van-col span="4">
              <van-image
                round
                width="40"
                height="40"
                :src="item.customerIcon"
                v-if="item.customerIcon"
              />
              <div v-if="!item.customerIcon" class="list-img-none">
                {{ item.customerName[0] }}
              </div>
            </van-col>
            <!-- 多选-客户姓名 -->
            <van-col span="10" class="list-content-name"
              ><div class="van-ellipsis">
                {{ item.customerName }}
              </div></van-col
            >
            <!-- 多选-客户进入客户池时间 -->
            <van-col span="10" class="list-content-time"
              >{{ item.enterPoolDate }}进入客户池</van-col
            >
            <!-- 多选-客户公司信息 -->
            <van-col span="16" class="list-content-msg">{{
              item.customerName
            }}</van-col>
          </van-row>
          <!-- 多选-客户标签行 -->
          <van-row>
            <van-col span="3"></van-col>
            <!-- 显示标签 -->
            <van-col class="list-content-tag"
              ><van-tag
                color="#E7F7E3"
                text-color="#67C74D"
                v-for="item2 in item.customerLabels"
                :key="item2.id"
                >{{ item2.labelType + ":" + item2.labelName }}</van-tag
              ></van-col
            >
          </van-row>
          <!-- 多选-选择按钮 -->
          <template #right-icon>
            <van-checkbox :name="item" ref="checkboxes" />
          </template>
        </van-cell>

      </van-checkbox-group>
      <!-- 多选-功能导航 -->
      <van-tabbar active-color="#7d7e80">
        <!-- 多选-全选 -->
        <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
        <!-- 多选-打标签 -->
        <van-tabbar-item :icon="cus_lable" @click="showCh"
          >打标签</van-tabbar-item
        >
        <!-- 多选-发短信 -->
        <van-tabbar-item :icon="cus_msg" @click="toShrtMsg"
          >发短信</van-tabbar-item
        >
        <!-- 多选-批量删除 -->
        <van-tabbar-item :icon="cus_delete" @click="toAllDelete"
          >批量删除</van-tabbar-item

        >
      </van-tabbar>
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
        class="shortmsg-nar"
      >
        <!-- 短信-自定义短信模块 -->
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
        <!-- 短信-模板短信模块 -->
        <van-tab title="模板短信">
          <van-cell-group>
            <van-cell title="请选择短信模板" />
          </van-cell-group>
        </van-tab>
      </van-tabs>
    </van-popup>
    <!-- 多选-打标签弹出框 -->
    <van-popup v-model="ckShow" closeable position="bottom">
      <van-row v-for="(item, index) in putLabelList" :key="item.name">
        <p class="screen-name">{{ item.name }}</p>
        <van-button
          v-for="item1 in item.class"
          :key="item1.name"
          :class="!item1.isSelected ? 'active-screen-btn' : 'screen-btn'"
          @click="cutTabClick(item1, item, index)"
        >
          {{ item1.name }}</van-button
        >
      </van-row>
      <!-- 打标签-重置 -->
      <van-button type="default" class="screen-reset-btn" hairline
        >重置</van-button
      >
      <!-- 打标签-提交 -->
      <van-button type="info" class="screen-confirm-btn" @click="putLabel"
        >确定</van-button
      >
    </van-popup>
    <!-- 排序-弹窗 -->
    <div class="browse-container" v-show="this.sortShow">
      <!--排序-创建时间从晚到早 -->
      <van-cell-group class="browse-content">
        <van-cell
          title="创建时间从晚到早"
          @click="cFromNbtn"
          :class="this.cFromN ? 'browse-active-btn' : ''"
        >
          <van-icon name="passed" v-show="cFromN" color="#4876f1" />
        </van-cell>
        <!--排序-创建时间从早到晚 -->
        <van-cell
          title="创建时间从早到晚"
          @click="cFromMbtn"
          :class="this.cFromM ? 'browse-active-btn' : ''"
        >
          <van-icon name="passed" v-show="cFromM" color="#4876f1" />
        </van-cell>
        <!--排序-最近动态时间从晚到早 -->
        <van-cell
          title="最近动态时间从晚到早"
          @click="dFromMbtn"
          :class="this.dFromM ? 'browse-active-btn' : ''"
        >
          <van-icon name="passed" v-show="dFromM" color="#4876f1" />
        </van-cell>
        <!--排序-最近动态时间从早到晚 -->
        <van-cell
          title="最近动态时间从早到晚"
          @click="dFromNbtn"
          :class="this.dFromN ? 'browse-active-btn' : ''"
        >
          <van-icon name="passed" v-show="dFromN" color="#4876f1" />
        </van-cell>
      </van-cell-group>
      <!-- 弹窗关闭区域 -->
      <div class="browse-shady" @click="latCancel"></div>
      <div class="browse-shady-other" @click="latCancel"></div>
    </div>
    <!-- 新建客户 -->
    <van-popup
      v-model="showform"
      position="bottom"
      :overlay="false"
      duration="0"
    >
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
              :max-size="500 * 1024"
              @oversize="onOversize"
              v-model="uploader"
              :max-count="1"
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
    <TabBar />
  </div>
</template>

<script>
import qs from "qs"; // axios参数包
import { areaList } from "@vant/area-data";
import { Toast } from "vant";
import TabBar from "../component/TabBar";
export default {
  name: "customer",
  components: {
    TabBar,
  },
  data() {
    return {
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
        { name: "新增用户", callback: this.formClick },
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
      dateVal: "",
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
      ],
      // 新建客户-表单
      addList: {
        id: "",
        customerType: "",
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
        customerType: "",
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
          name: "客户类别",
          class: [
            { name: "公司客户", isSelected: false },
            { name: "个人客户", isSelected: false },
          ],
          ename: "customerType",
        },
        {
          name: "性别",
          class: [
            { name: "男", isSelected: false },
            { name: "女", isSelected: false },
          ],
          ename: "sex",
        },
        {
          name: "年龄范围",
          class: [
            { name: "青少年", isSelected: false },
            { name: "中青年", isSelected: false },
            { name: "中老年", isSelected: false },
          ],
          ename: "ageRange",
        },
        // {
        //   name: "标签",
        //   class: [
        //     { name: "高管客户", isSelected: false },
        //     { name: "C端客户", isSelected: false },
        //     { name: "B端客户", isSelected: false },
        //     { name: "爱酒", isSelected: false },
        //     { name: "慈善", isSelected: false },
        //     { name: "科技公司", isSelected: false },
        //     { name: "红酒", isSelected: false },
        //     { name: "啤酒", isSelected: false },
        //     { name: "集团合作客户", isSelected: false },
        //     { name: "定制酒", isSelected: false },
        //     { name: "旅游", isSelected: false },
        //     { name: "其他", isSelected: false },
        //   ],
        // },
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
          ename: "origin",
        },
        {
          name: "客户等级",
          class: [
            { name: "一般", isSelected: false },
            { name: "重要", isSelected: false },
            { name: "核心", isSelected: false },
          ],
          ename: "customerLevel",
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
          ename: "companyType",
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
          ename: "industry",
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
          ename: "registeredCapital",
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
          ename: "companySize",
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
            { name: "为空", isSelected: false },
          ],
          ename: "businessTime",
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
            { name: "为空", isSelected: false },
          ],
          ename: "createTime",
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
      // 自定义字段
      cusField: [],
    };
  },
  methods: {
    // async getCusField() {
    //   let url = "/se/customer/customizedField";
    //   const res = await this.$http.get(url);
    //   console.log(res.data.data)

    // },

    // 获取用户标签值
    async getCusLabel() {
      let url = "/api/se/label/query";
      const res = await this.$http.get(url, {
        params: {
          object: 1,
        },
      });
      console.log(res.data.data);
      // console.log(res.data.data[1]);
      // console.log(res.data.data[0][0]);
      var labelColType = { name: "", class: [] };
      var labelColIndex = { name: "", isSelected: "false", id: "" };
      var labelList = [];
      for (let i = 0; i < res.data.data.length; i++) {
        labelColType.name = res.data.data[i][0].labelType;
        for (let j = 0; j < res.data.data[i].length; j++) {
          labelColIndex.name = res.data.data[i][j].labelName;
          labelColIndex.id = res.data.data[i][j].id;
          let obj = {
            name: labelColIndex.name,
            isSelected: "false",
            id: labelColIndex.id,
          };
          labelColType.class.push(obj);

          // console.log(labelColType)
        }
        let obj = { name: labelColType.name, class: labelColType.class };
        this.putLabelList.push(obj);
        labelColType = { name: "", class: [] };
        labelColIndex = { name: "", isSelected: "false" };
      }
      // console.log(this.putLabelList);
      // console.log(this.putLabelList[1].name);
      //  console.log(this.putLabelList[1].class[0].name);
      //   console.log(this.putLabelList[1].class[1].name);
      // console.log(this.putLabelList[1].class[0].isSelected);
    },
    // 用户标签值处理

    // 客户排序-客户分类选择-排序
    onOrderList(cusVal) {
      if (cusVal == 0) {
        this.cusClass = "全部客户";
        this.cusList = [];
        this.finished = false;
        this.pageProps.pageNum = 1;
        this.onLoad();
        Toast("选择全部客户");
      } else if (cusVal == 1) {
        this.cusClass = "未分配";
        this.cusList = [];
        this.finished = false;
        this.pageProps.pageNum = 1;
        this.onLoad();
        Toast("选择待分配客户");
      } else if (cusVal == 2) {
        this.cusClass = "跟进中";
        this.cusList = [];
        this.finished = false;
        this.pageProps.pageNum = 1;
        this.onLoad();
        Toast("选择跟进中客户");
      }
    },
    // 客户列表-客户分类选择-分配
    // 客户列表-搜索功能
    onSearch() {
      this.cusList = [];
      this.finished = false;
      this.pageProps.pageNum = 1;
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
    async onLoad() {
      let url = "/api/se/customer/query";
      url = this.urlSortChoose(url);
      url = this.urlCusTypeChoose(url);
      url = this.urlCusNameChoose(url);
      url = this.urlCusScreen(url);
      url += "&eq_potential=0";
      console.log(url);
      const res = await this.$http.get(url, {
        params: {
          currentPage: this.pageProps.pageNum++,
          pageCount: this.pageProps.pageSize,
        },
      });
      // 加载状态结束
      this.loading = false;
      const tempList = res.data.data;
      this.cusNum = res.data.totalCount;
      if (tempList.length == 0) {
        // 已加载全部数据
        this.finished = true;
        Toast("已加载全部数据！");
      } else {
        for (let i = 0; i < tempList.length; i++) {
          this.cusList.push(tempList[i]);
        }
      }
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
      this.$router.push({ name: "perinfor", query: { cuslist: item } });
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
        this.finished = false;
        this.pageProps.pageNum = 1;
        this.onLoad();
      }
      // console.log(result);
    },
    // 点击加号-弹出
    toAdd() {
      this.addShow = true;
    },
    // 最近浏览-最近浏览弹出框
    sortPop() {
      this.sortShow = !this.sortShow;
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
      this.sortCusType = "createTime";
      this.sortCusTime = "night";
      this.cusList = [];
      this.pageProps.pageNum = 1;
      this.finished = false;
      this.onLoad();
      Toast("创建时间从晚到早");
    },
    cFromMbtn() {
      this.cFromM = true;
      this.listOrder = "创建时间从早到晚";
      this.sortShow = false;
      this.dFromN = false;
      this.cFromN = false;
      this.dFromM = false;
      this.sortCusType = "createTime";
      this.sortCusTime = "morning";

      this.finished = false;
      this.pageProps.pageNum = 1;
      this.cusList = [];
      this.onLoad();
      Toast("创建时间从早到晚");
    },
    dFromNbtn() {
      this.dFromN = true;
      this.listOrder = "最近动态从早到晚";
      this.sortShow = false;
      this.dFromM = false;
      this.cFromN = false;
      this.cFromM = false;
      this.sortCusType = "updateTime";
      this.sortCusTime = "morning";

      this.finished = false;
      this.pageProps.pageNum = 1;
      this.cusList = [];
      this.onLoad();
      Toast("最近动态从早到晚");
    },
    dFromMbtn() {
      this.dFromM = true;
      this.listOrder = "最近动态从晚到早";
      this.sortShow = false;
      this.dFromN = false;
      this.cFromN = false;
      this.cFromM = false;
      this.sortCusType = "updateTime";
      this.sortCusTime = "night";
      this.finished = false;
      this.pageProps.pageNum = 1;
      this.cusList = [];
      this.onLoad();
      Toast("最近动态从晚到早");
    },
    // 筛选-筛选功能弹出框
    toScreen() {
      this.scrShow = !this.scrShow;
    },
    // 筛选-按钮点击高亮
    cutTabClick(item, list, index) {
      //然后通过这个属性判断是否选中点亮和取消
      if (list.name == "商机创建时间" || list.name == "创建时间") {
        for (let i = 0; i < list.class.length; i++) {
          if (i == index) {
            list.class[i].isSelected = !list.class[i].isSelected;
          } else {
            list.class[i].isSelected = false;
          }
        }
      } else {
        item.isSelected = !item.isSelected;
      }
    },
    // 筛选-跟进人列表-弹窗
    toFollow() {
      this.followShow = true;
      this.userType = 0;
      this.followList = [];
      this.getUserList();
    },
    // 筛选-跟进人列表-弹窗
    toOppo() {
      this.followShow = true;
      this.userType = 1;
      this.followList = [];
      this.getUserList();
    },
    // 筛选-跟进人列表-弹窗
    toBuild() {
      this.followShow = true;
      this.userType = 2;
      this.followList = [];
      this.getUserList();
    },
    toAddFollow() {
      this.followShow = true;
      this.userType = 3;
      this.followList = [];
      this.getUserList();
    },
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
        if (
          selectNum == 1 &&
          this.scrList[i].ename != "businessTime" &&
          this.scrList[i].ename != "createTime"
        ) {
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
        // 商机和创建时间单选
        if (
          selectNum == 1 &&
          (this.scrList[i].ename == "businessTime" ||
            this.scrList[i].ename == "createTime")
        ) {
          select = "&" + this.scrList[i].ename + "=" + val;
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
      this.finished = false;
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
        for (let i = 0; i < this.result.length; i++) {
          this.newCusRelation(this.result[i].id, "打标签");
        }
        this.putLabelVal = [];
        this.cusList = [];
        this.finished = false;
        this.pageProps.pageNum = 1;
        this.onLoad();
        this.ckShow = false;
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
          this.cusList = [];
          this.finished = false;
          this.pageProps.pageNum = 1;
          this.scrnum = 0;
          this.result = [];
          this.onLoad();
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
        this.result = [];
        this.scrnum = 0;
        this.shortShow = false;
        Toast.success("短信发送");
        this.message = "";
        for (let i = 0; i < this.result.length; i++) {
          this.newCusRelation(this.result[i].id, "发短信");
        }
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
    // 新建客户-保存
    onClickAddSave() {
      this.showform = false;
      this.onClickSumbmit();
    },
    // 新建客户-提交
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
        }

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
        this.showform = false;
        this.cusList = [];
        this.finished = false;
        this.pageProps.pageNum = 1;
        this.onLoad();
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
      // 筛选-商机负责人
      else if (this.userType == 1) {
        this.oppoChsVal.val = item.username;
        this.oppoChsVal.id = item.id;
        this.ifoppoChoose = false;
      }
      // 筛选-创建人
      else if (this.userType == 2) {
        this.bulidChsVal.val = item.username;
        this.oppoChsVal.id = item.id;
        this.ifbulidChoose = false;
      }
      // 新建-跟进人
      else if (this.userType == 3) {
        this.addList.followStaffName = item.username;
        this.addList.followStaffId = item.id;
      }
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
        Toast("操作成功");
      }
    },
  },
  created() {
    this.getCusLabel();
    this.onLoad();
    this.$store.commit("updateTabBarActive", 1);
    // this.getCusField();
  },
};
</script>

<style lang="less" scoped>
// 全部客户
/deep/.van-dropdown-menu__title {
  color: #1e1c27;
  font-size: 13px;
}
/deep/.van-dropdown-menu__bar {
  box-shadow: unset !important;
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
  // overflow: scroll;
  // height: 150px;
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
//多选弹出层
.check {
  height: 100%;
}
//多选列表
.check-list {
  margin-bottom: 10px;
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

// 标签栏颜色改变
.colorful {
  filter: invert(43%) sepia(65%) saturate(2735%) hue-rotate(208deg)
  brightness(97%) contrast(95%);
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
<<<<<<< HEAD

=======
  font-size: 15px;
>>>>>>> zjs
}
</style>
