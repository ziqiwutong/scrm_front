<template>
  <div class="back">
    <!-- 背景框 -->
    <div class="background">
      <van-button icon="arrow-left" class="renav" @click="onClickLeft">
        返回
      </van-button>
    </div>
    <!-- 客户信息 -->
    <van-image
      class="cusimg"
      round
      width="60"
      height="60"
      :src="cusDetail.customerIcon"
      v-if="cusDetail.customerIcon"
    />
    <div v-if="!cusDetail.customerIcon" class="list-img-none">
      {{ cusDetail.customerName[0] }}
    </div>
    <van-row class="cuscont">
      <!-- 共有-客户姓名 -->
      <van-row>
        <van-col class="detailnm">{{ cusDetail.customerName }}</van-col>
      </van-row>
      <!-- 个人-手机/号码归属地 -->
      <van-row v-if="cusDetail.customerType == 0">
        <van-col span="10" class="cusfont"
          >手机：{{ cusDetail.telephone }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          >号码归属地：{{ this.telAdress }}</van-col
        >
      </van-row>
      <!-- 共有-来源/地区 -->
      <van-row>
        <van-col span="10" class="cusfont"
          >来源：{{ cusDetail.origin }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          >地址：{{ cusDetail.address }}</van-col
        >
      </van-row>
      <!-- 共有-客户状态/跟进人 -->
      <van-row>
        <van-col span="10" class="cusfont"
          >客户状态：{{ cusDetail.customerStatus }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          >跟进人：{{ cusDetail.followStaffName }}</van-col
        >
      </van-row>
      <!-- 共有-成交订单/成交订单金额 -->
      <van-row>
        <van-col span="10" class="cusfont"
          >成交订单数：{{ this.cusDetail.orderNumber }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          >成交订单金额：{{ this.cusDetail.orderAmount }}</van-col
        >
      </van-row>
      <!-- 个人-微信/微信昵称 -->
      <van-row v-if="cusDetail.customerType == 0">
        <van-col span="10" class="cusfont">微信：{{ cusDetail.wx }}</van-col>
        <van-col span="12" offset="2" class="cusfont"
          ><div class="van-ellipsis">
            微信昵称：{{ cusDetail.wxName }}
          </div></van-col
        >
      </van-row>
      <!-- 个人-生日/性别 -->
      <van-row v-if="cusDetail.customerType == 0">
        <van-col span="10" class="cusfont">性别：{{ cusDetail.sex }}</van-col>
        <van-col offset="2" class="cusfont"
          >生日：{{ cusDetail.birthday }}</van-col
        >
      </van-row>
      <!-- 个人-职位/爱好 -->
      <van-row v-if="cusDetail.customerType == 0">
        <van-col span="10" class="cusfont" v-if="cusDetail.customerType == 0"
          >职位：{{ cusDetail.position }}</van-col
        >
        <van-col
          span="12"
          offset="2"
          class="cusfont"
          v-if="cusDetail.customerType == 0"
          >爱好：{{ cusDetail.hobby }}</van-col
        >
      </van-row>
      <!-- 共有-客户等级/标签 -->
      <van-row>
        <van-col span="10" class="cusfont"
          >客户等级：{{ cusDetail.customerLevel }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          ><div class="van-ellipsis">
            标签：{{ this.labelCusList }}
          </div></van-col
        >
      </van-row>
      <van-row>
        <van-col span="10" class="cusfont"
          >公司：{{ cusDetail.belongCompany }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          >所在省市：{{ cusDetail.city }}</van-col
        >
      </van-row>
      <!-- 公司-法人代表/员工数量 -->
      <van-row v-if="cusDetail.customerType == 1">
        <van-col span="10" class="cusfont" v-if="cusDetail.customerType == 1"
          >法人代表：{{ cusDetail.legalPerson }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          >员工数量：{{ cusDetail.companySize }}</van-col
        >
      </van-row>
      <!-- 公司-经营状态/注册资本 -->
      <van-row v-if="cusDetail.customerType == 1">
        <van-col span="10" class="cusfont"
          >经营状态：{{ cusDetail.operatingStatus }}</van-col
        >
        <van-col span="12" offset="2" class="cusfont"
          >注册资本：{{ cusDetail.registeredCapital }}</van-col
        >
      </van-row>
      <!-- 公司-所属行业/经营范围 -->
      <van-row v-if="cusDetail.customerType == 1">
        <van-col class="cusfont">所属行业：{{ cusDetail.industry }}</van-col>
      </van-row>
      <!-- 公司-经营范围 -->
      <van-row v-if="cusDetail.customerType == 1">
        <van-col class="cusfont"
          >经营范围：{{ cusDetail.businessRange }}</van-col
        >
      </van-row>
      <!-- 共有-进入客户池时间 -->
      <van-row>
        <van-col class="cusfont"
          >进入客户池：{{ cusDetail.enterPoolDate }}</van-col
        >
      </van-row>
      <!-- 查看详情 -->
      <div v-if="showCus">
        <!-- 个人-手机/号码归属地 -->
        <van-row v-if="showCusType == 0">
          <van-col span="10" class="cusfont"
            >手机：{{ cusDetail.telephone }}</van-col
          >
          <van-col span="12" offset="2" class="cusfont"
            >号码归属地：{{ this.telAdress }}</van-col
          >
        </van-row>
        <!-- 个人-微信/微信昵称 -->
        <van-row v-if="showCusType == 0">
          <van-col span="10" class="cusfont">微信：{{ cusDetail.wx }}</van-col>
          <van-col span="12" offset="2" class="cusfont"
            ><div class="van-ellipsis">
              微信昵称：{{ cusDetail.wxName }}
            </div></van-col
          >
        </van-row>
        <!-- 个人-生日/性别 -->
        <van-row v-if="showCusType == 0">
          <van-col span="10" class="cusfont">性别：{{ cusDetail.sex }}</van-col>
          <van-col offset="2" class="cusfont"
            >生日：{{ cusDetail.birthday }}</van-col
          >
        </van-row>
        <!-- 个人-职位/爱好 -->
        <van-row v-if="showCusType == 0">
          <van-col span="10" class="cusfont"
            >职位：{{ cusDetail.position }}</van-col
          >
          <van-col span="12" offset="2" class="cusfont"
            >爱好：{{ cusDetail.hobby }}</van-col
          >
        </van-row>
        <!-- 公司-法人代表/员工数量 -->
        <van-row v-if="showCusType == 1">
          <van-col span="10" class="cusfont"
            >法人代表：{{ cusDetail.legalPerson }}</van-col
          >
          <van-col span="12" offset="2" class="cusfont"
            >员工数量：{{ cusDetail.companySize }}</van-col
          >
        </van-row>
        <!-- 公司-经营状态/注册资本 -->
        <van-row v-if="showCusType == 1">
          <van-col span="10" class="cusfont"
            >经营状态：{{ cusDetail.operatingStatus }}</van-col
          >
          <van-col span="12" offset="2" class="cusfont"
            >注册资本：{{ cusDetail.registeredCapital }}</van-col
          >
        </van-row>
        <!-- 公司-所属行业/经营范围 -->
        <van-row v-if="showCusType == 1">
          <van-col class="cusfont">所属行业：{{ cusDetail.industry }}</van-col>
        </van-row>
        <!-- 公司-经营范围 -->
        <van-row v-if="showCusType == 1">
          <van-col class="cusfont"
            >经营范围：{{ cusDetail.businessRange }}</van-col
          >
        </van-row>
      </div>
      <van-row>
        <van-col class="cusfont2" @click="showCusAll" v-if="showCus"
          >收起</van-col
        >
      </van-row>
      <van-row>
        <van-col class="cusfont2" @click="showCusAll" v-if="!showCus"
          >查看详情</van-col
        >
      </van-row>
    </van-row>

    <!-- 标签页 -->
    <div class="listcont">
      <van-tabs
        color="#4876F1"
        title-active-color="#4876F1"
        @click="onTabChange"
      >
        <van-tab title="客户关系">
          <!-- 状态更新 -->
          <div class="list-tab-fa">
            <van-steps
              direction="vertical"
              :active="-1"
              class="list-tab-content"
            >
              <van-step
                v-for="item in cusRelation"
                :key="item.id"
                class="list-step"
              >
                <div v-if="item.relationType == cusRelationType.addCusPoll">
                  <van-icon name="add-o" color="#3ABD16" />
                  {{ item.relationType }}
                </div>
                <div v-if="item.relationType == cusRelationType.addLabel">
                  <van-icon name="upgrade" color="#3ABD16" />
                  {{ item.relationType }}
                </div>
                <div v-if="item.relationType == cusRelationType.call">
                  <van-icon name="phone-circle-o" color="#4876F1" />
                  {{ item.relationType }}
                </div>
                <div v-if="item.relationType == cusRelationType.msg">
                  <van-icon name="comment-circle-o" color="#f3a108" />
                  {{ item.relationType }}
                </div>
                <div v-if="item.relationType == cusRelationType.wx">
                  <van-icon name="chat-o" color="#08f5ce" />
                  {{ item.relationType }}
                </div>
                <div v-if="item.relationType == cusRelationType.newCusDetail">
                  <van-icon name="upgrade" color="#3ABD16" />
                  {{ item.relationType }}
                </div>
                <p>{{ item.createTime }}</p>
              </van-step>
            </van-steps>
          </div>
        </van-tab>
        <!-- 订单总览 -->
        <van-tab title="订单">
          <van-row class="orderTitle">
            <van-col span="8"
              >成交订单：<span style="color: #ff5b5b">{{
                this.cusDetail.orderNumber
              }}</span
              >个</van-col
            >
            <van-col span="15"
              >成交订单金额：<span style="color: #ff5b5b"
                >￥{{ this.cusDetail.orderAmount }}</span
              ></van-col
            >
          </van-row>
          <!-- 订单列表 -->
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
          >
            <!-- 订单详情 -->
            <van-cell v-for="item in orderList" :key="item.orderID">
              <div class="ordercell">
                <van-row>
                  <van-col span="1"><van-icon :name="monImg" /></van-col>

                  <van-col offset="1">订单号：{{ item.orderID }}</van-col>
                  <van-col span="1" offset="2"
                    ><van-icon name="edit"
                  /></van-col>
                  <van-col span="1"><van-icon name="revoke" /></van-col>
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">订单状态：</span
                    >{{ item.orderType }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">实收金额：</span
                    >{{ item.receivedAmount }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">成交员工：</span
                    >{{ item.orderStaff }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">备注：</span>{{ item.notes }}
                  </van-col>
                  <van-col offset="1"><van-icon name="edit" /></van-col>
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">成交时间：</span
                    >{{ item.orderFinish }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">订单来源：</span
                    >{{ item.orderSource }}</van-col
                  >
                </van-row>
              </div>
            </van-cell>
          </van-list></van-tab
        >
      </van-tabs>
      <div class="label-temp"></div>
    </div>
    <!-- 标签栏 -->
    <div class="nav-margin">
      <van-tabbar active-color="#7d7e80">
        <van-tabbar-item :icon="callImg" @click="onCallPhone"
          >打电话
        </van-tabbar-item>
        <van-tabbar-item
          :icon="wchatImg"
          @click="sendWx"
          v-clipboard:copy="cusDetail.telephone"
          v-clipboard:success="copyCode"
          v-clipboard:error="copyCodeError"
          >发微信</van-tabbar-item
        >
        <van-tabbar-item :icon="msgImg" @click="toShrtMsg"
          >发短信</van-tabbar-item
        >
        <van-tabbar-item :icon="contImg" @click="toMore"
          >更多操作</van-tabbar-item
        >
      </van-tabbar>
    </div>
    <!-- 更多操作 -->
    <van-action-sheet
      v-model="addShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
    />
    <!-- 更多操作-编辑 -->
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
        <van-row class="addcustit">客户信息</van-row>
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
        <van-row class="addcustit">联系信息</van-row>
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
        <van-row class="addcustit">公司信息</van-row>
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
            @click="onClickSumbmit"
            >提交</van-button
          >
        </div>
      </van-form>
    </van-popup>
    <!-- 发微信 -->
    <van-popup v-model="wxShow" position="bottom" :style="{ height: '40%' }">
      <van-image :src="wx" class="wx-img"></van-image>
      <van-button class="screen-confirm-btn" @click="onOpenWx"
        >打开微信</van-button
      >
    </van-popup>
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
    <!-- 更多操作-删除客户 -->
    <van-dialog
      v-model="moreDeleteShow"
      title="是否删除当前客户"
      show-cancel-button
      @confirm="deleteCusConfirm"
    >
    </van-dialog>
    <!-- 编辑客户-地区选择 -->
    <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showArea = false"
      />
      <!--  -->
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
import qs from "qs"; // axios参数包
import { areaList } from "@vant/area-data";
import { Toast } from "vant";
import AbbList from "../component/AbbList.vue";
export default {
  components: {
    AbbList,
  },
  data() {
    return {
      telAdress: "",
      list: [],
      loading: false,
      finished: false,
      show: false,
      addShow: false,
      showform: false,
      callShow: false,
      wxShow: false,
      // 筛选-跟进人-弹窗
      followShow: false,
      // 新建客户-客户状态选择-弹窗
      addCusStaShow: false,
      // 新建客户-客户状态选择-内容
      columns: ["跟进中", "未分配"],
      orderList: [
        // {
        //   orderID: "12345689089",
        //   orderType: "交易成功",
        //   receivedAmount: "￥100000000.00",
        //   orderStaff: "朱源杰",
        //   notes: "尾款未支付",
        //   orderFinish: "2021-10-15",
        //   orderSource: "销售创建",
        // },
      ],
      actions: [
        { name: "发送推文", callback: this.toContShare },
        { name: "新建商机", callback: this.toBusOpprtunity },
        { name: "新建订单", callback: this.toOrder },
        { name: "改跟进人", callback: this.changeFollow },
        { name: "编辑客户", callback: this.changeCus },
        { name: "删除客户", callback: this.deleteCus },
      ],
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
            { name: "个人客户", isSelected: false },
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
      // 新建客户时间类别
      addDateType: "",
      // 新建客户-时间弹窗
      dateShow: false,
      // 新建客户-时间选择值
      dateVal: new Date(2000, 0, 1),
      // 新建客户-时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 新建客户-时间-时间最大值
      maxDate: new Date(2025, 10, 1),
      // 新建客户-地区-地区列表
      areaList,
      // 新建客户-地区-弹窗
      showArea: false,
      cusDetail: [],
      //自定义图标打电话
      callImg: require("../../assets/cusicon/per_call.png"),
      wchatImg: require("../../assets/cusicon/per_wchat.png"),
      msgImg: require("../../assets/cusicon/per_msg.png"),
      contImg: require("../../assets/cusicon/per_context.png"),
      monImg: require("../../assets/cusicon/per_mon.png"),
      wx: require("../../assets/cusicon/wx.png"),
      // 新建客户-头像数据
      uploader: [],
      // 新建客户-扫描数据
      scruploader: [],
      // 多选-短信发送-弹窗
      shortShow: false,
      // 多选-短信发送-短信内容
      message: "",
      // 短信-消息
      ckShortMsg: { customerID: [], customerMsg: "" },
      // 客户关系
      cusRelation: [
        // {
        //   id: "1",
        //   customerID: "",
        //   relationType: "进入客户池",
        //   relationDetail: "阿巴",
        //   createTime: "",
        //   updateTime: "",
        // },
      ],
      // 客户关系-分类
      cusRelationType: {
        addCusPoll: "进入客户池",
        addLabel: "打标签",
        call: "打电话",
        msg: "发短信",
        wx: "发微信",
        newCusDetail: "更新客户资料",
      },
      test: "打标签",
      test2: "进入客户池",
      // 更多操作-删除客户-弹窗
      moreDeleteShow: false,
      // 标签数组
      labelCusList: "",
      // 筛选-跟进人-搜索
      followVal: "",
      // 筛选-跟进人列表
      followList: [],
      //分类
      userType: 0,
      // 跟进人加载-分页
      followPageProps: {
        pageNum: 1,
        pageSize: 10,
      },
      //
      showCus: false,
      showCusType: "",
    };
  },
  created() {
    let cuslist = this.$route.query.cuslist;
    this.cusDetail.customerName = cuslist.customerName;
    this.getCusDetailByID(cuslist.id);
    console.log(this.cusDetail);
  },
  methods: {
    // 根据id查询客户信息
    async getCusDetailByID(id) {
      let url = "/api/se/customer/queryById";
      const res = await this.$http.get(url, {
        params: {
          id: id,
        },
      });
      if (res.data.code == 200) {
        this.cusDetail = res.data.data;
        for (let i = 0; i < this.cusDetail.customerLabels.length; i++)
          if (i != this.cusDetail.customerLabels.length - 1) {
            this.labelCusList +=
              this.cusDetail.customerLabels[i].labelType +
              ":" +
              this.cusDetail.customerLabels[i].labelName +
              "/ ";
          } else
            this.labelCusList +=
              this.cusDetail.customerLabels[i].labelType +
              ":" +
              this.cusDetail.customerLabels[i].labelName;
        this.getCusRelation();
        this.getTelAdress();
      } else {
        Toast("加载失败");
      }
    },

    // 号码归属地查询
    async getTelAdress() {
      if (this.cusDetail.telephone != null) {
        let url = "/api/se/customerRest/attribution";
        const res = await this.$http.get(url, {
          params: {
            phone: this.cusDetail.telephone,
          },
        });
        if (res.data.data != null)
          this.telAdress = res.data.data.province + res.data.data.city;
      }
    },
    // 查看客户所有信息
    showCusAll() {
      this.showCus = !this.showCus;
      if (this.cusDetail.customerType == 1) {
        this.showCusType = 0;
      } else if (this.cusDetail.customerType == 0) {
        this.showCusType = 1;
      }
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
    toAddFollow() {
      this.followShow = true;
      this.userType = 1;
      this.followList = [];
      this.getUserList();
    },
    // 跟进人-选择
    followConfirm(item) {
      this.followShow = false;
      this.followList = [];
      if (this.userType == 0) {
        this.cusDetail.followStaffName = item.username;
        this.cusDetail.followStaffId = item.id;
        this.cusDetail.customerStatus = "跟进中";
        this.onClickSumbmit();
      } else if (this.userType == 1) {
        this.cusDetail.followStaffName = item.username;
        this.cusDetail.followStaffId = item.id;
      }
    },
    // 跟进人-页面取消
    folCancel() {
      this.followShow = false;
    },
    // 新建客户-客户状态-取消
    onCusStaCancel() {
      this.addCusStaShow = false;
    },
    // 新建客户-单选限定
    cutTabClickOnly(item, index) {
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
      for (let j = 0; j < item.class.length; j++) {
        if (item.class[j].isSelected == true) {
          empt = false;
          let val = item.class[j].name;
          this.onSubmitVal(key, val);
        }
      }
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
      if (key == "客户类型") {
        this.cusDetail.customerType = val;
        console.log(this.cusDetail.customerType);
      }
    },
    // 客户详情-返回
    onClickLeft() {
      this.$router.back("/customer");
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
      if (this.message == "" || this.cusDetail.telephone == "") {
        Toast.fail("发送失败");
        this.message = "";
      } else {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var msg = this.message;

        if (isAndroid) {
          // sms:后面跟收件人的手机号,body后接短信内容
          window.location.href =
            "sms:" + this.cusDetail.telephone + "?body=" + msg;
        } else if (isIOS) {
          window.location.href =
            "sms:" + this.cusDetail.telephone + "&body=" + msg;
        }
        Toast.success("短信发送成功");
        this.cusRelation = [];
        this.newCusRelation(this.cusDetail.id, "发短信", "");

        this.getCusRelation();
        this.message = "";
      }
    },
    // 新建客户-客户状态确认
    onCusStaConfirm(value) {
      this.addCusStaShow = false;
      this.cusDetail.customerStatus = value;
    },
    //发微信
    sendWx() {
      this.wxShow = true;
    },
    //发推文

    //更多操作
    toMore() {
      this.addShow = true;
    },
    // 更多操作-发送推文
    toContShare() {
      this.$router.push("/contextShareList");
    },
    // 更多操作-新建商机
    toBusOpprtunity() {
      // Toast("跳转商机界面");
      this.$router.push({
        name: "addBizOpp",
        params: {
          customerId: this.cusDetail.id,
          customerName: this.cusDetail.customerName,
          from: "/perinfor",
        },
      });
    },
    // 更多操作-新建订单
    toOrder() {
      // Toast("跳转订单界面");
      this.$router.push({
        path: "/orderCreate",
        query: {
          id: this.cusDetail.id,
          customerName: this.cusDetail.customerName,
        },
      });
    },
    // 更多操作-改跟进人
    changeFollow() {
      this.followShow = true;
    },
    onFollowCancel() {
      this.followShow = false;
    },
    onFollowAdd(val) {
      this.cusDetail.followStaffName = val.name;
      this.cusDetail.followStaffId = val.id;
      this.cusDetail.customerStatus = "跟进中";
      this.onClickSumbmit();
    },
    // 更多操作-改协助人
    changeHelper() {
      Toast("改变协助人");
    },
    // 更多操作-编辑客户-编辑高亮显示
    changeCus() {
      this.showform = true;
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
    // 更多操作-删除客户
    deleteCus() {
      this.moreDeleteShow = true;
    },
    async deleteCusConfirm() {
      let url = "/api/se/customer/delete";
      const result = await this.$http.get(
        url,
        { params: { id: this.cusDetail.customerID } },
        {
          emulateJSON: true,
        }
      );
      if (result.data.code == "200") {
        Toast("成功删除");
        this.$router.replace("/customer");
      }
    },
    // 获取客户详情信息
    getCusDetail(cuslist) {
      this.cusDetail = cuslist;
      for (let i = 0; i < this.cusDetail.customerLabels.length; i++)
        if (i != this.cusDetail.customerLabels.length - 1) {
          this.labelCusList +=
            this.cusDetail.customerLabels[i].labelType +
            ":" +
            this.cusDetail.customerLabels[i].labelName +
            "/ ";
        } else
          this.labelCusList +=
            this.cusDetail.customerLabels[i].labelType +
            ":" +
            this.cusDetail.customerLabels[i].labelName;
      console.log(this.cusDetail);
    },
    // 编辑客户-打开弹窗

    // 新建表单-返回
    onClickAddRe() {
      this.showform = false;
    },
    //新建表单-保存
    onClickAddSave() {
      this.showform = false;
      this.onClickSumbmit();
    },
    // 新建客户-时间-时间弹窗
    toDate() {
      this.dateShow = true;
      this.addDateType = "生日";
    },
    // 新建客户-时间-时间弹窗
    toDate1() {
      this.dateShow = true;
      this.addDateType = "成立日期";
    },
    // 新建客户-时间-时间录入处理
    dateConfirm(val) {
      var y = val.getFullYear();
      var m = val.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = val.getDate();
      d = d < 10 ? "0" + d : d;
      const time = y + "-" + m + "-" + d;
      if (this.addDateType == "生日") this.cusDetail.birthday = time;
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
        this.newCusRelation(
          this.cusDetail.id,
          "更新客户资料",
          result.data.updateTime
        );
      }
      // this.addList = this.addListTemp;
      this.getCusRelation();
      this.showform = false;
    },
    // 编辑客户-提交
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
          // 传输
          let url = "/api/se/customer/update";
          let postData = this.cusDetail;
          console.log(postData);
          const result = (await this.$http.post(url, postData)).data;
          // console.log(result)
          if (result.code == "200") {
            Toast("成功修改客户");
            this.showform = false;
            this.newCusRelation(
              this.cusDetail.id,
              "更新客户资料",
              result.data.updateTime
            );
          }
        }
        // this.addList = this.addListTemp;
        this.getCusRelation();
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
    // 新建客户-头像上传
    uploadCusIcon(pic, type, len) {
      let url = "/api/file/pic/base64StrToPic";
      let picture;
      if (len == 3) {
        picture = pic.slice(22);
      } else if (len == 4) {
        picture = pic.slice(23);
      }
      console.log(picture);
      let params = new FormData();
      params.append("picBase64Str", picture);
      params.append("picFormat", type);
      params.append("picType", "customerIcon");
      this.$http
        .post(url, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then((res) => {
          console.log(res.data.data);
          this.cusDetail.customerIcon = res.data.data;
        });
    },
    // 标签页-切换
    onTabChange(title) {
      console.log(this.cusDetail);
      if (title == 0) this.getCusStatus();
      if (title == 1) this.getCusOrder();
    },
    // 标签页-订单请求
    async getCusOrder() {
      Toast("获取订单请求");
      let url = "/api/se/order/queryOrderByCustomerID";
      let postData = {
        customerID: this.cusDetail.id,
      };
      const result = await this.$http.post(url, qs.stringify(postData));
      if (result.data.code == "200") {
        Toast("订单加载成功");
        this.orderList = result.data.data;
        this.finished = true;
      } else this.finished = true;
    },
    // 标签页-客户关系请求
    getCusStatus() {
      this.cusRelation = [];
      this.getCusRelation();
    },
    // 打电话
    onCallPhone() {
      let tel = "tel:" + this.cusDetail.telephone;
      window.location.href = tel;
      this.cusRelation = [];
      this.newCusRelation(this.cusDetail.id, "打电话", "");
      this.getCusRelation();
    },
    // 打开微信
    onOpenWx() {
      window.location.href = "weixin://";
      this.cusRelation = [];
      this.newCusRelation(this.cusDetail.id, "发微信", "");
      this.getCusRelation();
      this.getCusRelation();
    },

    // 复制电话号码
    copyCode() {
      Toast.success("客户电话号码已复制");
    },
    // 复制失败
    copyCodeError() {
      Toast.fail("复制失败");
    },
    // 新建客户-头像-大小限制
    onOversize(file) {
      console.log(file);
      Toast("文件大小不能超过 500kb");
    },
    //客户关系-标签分类
    chooseCusType(val) {
      if (val == "打标签") {
        this.cusRelationType = "browsing-history-o";
        console.log(this.cusRelationType);
      } else if (val == "发微信") {
        this.cusRelationType = "more-o";
        console.log(this.cusRelationType);
      } else if (val == "发短信") {
        this.cusRelationType = "more-o";
      } else {
        this.cusRelationType = "video-o";
        console.log(this.cusRelationType);
      }
    },

    // 获取客户关系
    async getCusRelation() {
      this.cusRelation = [];
      let url = "/api/se/customer/relation/query";
      const result = await this.$http.get(url + "?id=" + this.cusDetail.id);
      if (result.data.code == "200") {
        this.cusRelation = result.data.data;
      }
      console.log(this.cusRelation);
    },

    // 客户关系-新建
    async newCusRelation(id, type, detail) {
      let url = "/api/se/customer/relation/insert";
      const result = await this.$http.post(url, {
        customerId: id,
        relationType: type,
        relationDetail: detail,
      });
      if (result.data.code == "200") {
        // Toast("成功插入");
        this.getCusStatus();
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (to.path == "/customer") {
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
//背景
.back {
  background-color: #f8f8f8;
  position: fixed;
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
  height: 275px;
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
</style>
