<template>
  <div class="container">
    <div v-for="(item,index) in pageInit" :key="index">
      <div class="header">
        <van-icon name="chart-trending-o" color="#4876f1"/>
        <p>{{ item.title }}</p>
      </div>
      <div class="context">
        <div class="context_leftArea" @click="statisticsDetail(item.leftContextTitle)">
          <div class="context_text">
            <p>{{ item.leftContextTitle }}</p>
            <p class="context-desc">{{ item.leftContextDesc }}</p>
          </div>
          <div class="context_image">
            <van-icon class-prefix="icon-third" :name="item.leftIcon" :size='item.leftSize'
                      :color="item.leftIconColor"/>
          </div>
        </div>
        <div class="context_rightArea" @click="statisticsDetail(item.rightContextTitle)">
          <div class="context_text">
            <p>{{ item.rightContextTitle }}</p>
            <p class="context-desc">{{ item.rightContextDesc }}</p>
          </div>
          <div class="context_image">
            <van-icon class-prefix="icon-third" :name="item.rightIcon" :size='item.rightSize'
                      :color="item.rightIconColor"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dataHome",
  data() {
    return {
      pageInit: [
        {
          title: '文章阅读数据',
          leftContextTitle: '单篇文章',
          leftContextDesc: '数据看板>',
          leftIcon: 'articleRecord',
          leftIconColor: '#ffac16',
          rightContextTitle: '微信阅读',
          rightContextDesc: '数据看板>',
          rightIcon: 'wx-user',
          rightIconColor: '#00bb72',
          leftSize: 36,
          rightSize: 36
        },
        {
          title: '产品浏览数据',
          leftContextTitle: '产品浏览',
          leftContextDesc: '数据看板>',
          leftIcon: 'productRead',
          leftIconColor: '#80ddff',
          rightContextTitle: '微信阅读',
          rightContextDesc: '数据看板>',
          rightIcon: 'readData',
          rightIconColor: '#ffac16',
          leftSize: 36,
          rightSize: 36
        },
        {
          title: '产品购买数据',
          leftContextTitle: '产品购买',
          leftContextDesc: '数据看板>',
          leftIcon: 'purchase',
          leftIconColor: '#ffac16',
          rightContextTitle: '客户购买',
          rightContextDesc: '数据看板>',
          rightIcon: 'customers',
          rightIconColor: '#7fddff',
          leftSize: 30,
          rightSize: 36
        },
      ]
    }
  },
  methods: {
    statisticsDetail(item) {
      switch (item) {
        case '单篇文章':
          this.$router.push('/articleList');
          break;
      }
    }
  }
}
</script>

<style scoped lang="less">
.container {
  margin-top: 50px;
  padding-bottom: 2rem;
}

.header {
  display: inline-flex;
  box-sizing: border-box;
  padding: 0 8px;

  p {
    font-family: 'PingFangSC-Medium';
    font-weight: 600;
  }
}

/deep/ .van-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 5px;
}

.context {
  display: inline-flex;
  box-sizing: border-box;
  width: 100vw;
  padding: 1vw 1vw;
  justify-content: space-around;
}

.context_leftArea, .context_rightArea {
  width: 45vw;
  height: 6rem;
  box-sizing: border-box;
  display: inline-flex;
  box-shadow: 3px 12px 32px 0px rgba(81, 125, 242, 0.14);
  border-radius: 10px;
  padding: 1rem;

  p {
    line-height: 2rem;
    margin-block-start: 0em;
    margin-block-end: 0em;
  }
}

.context_image, .context_image {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  box-sizing: border-box;
}

.context-desc {
  color: #a5a5a5;
}
</style>
