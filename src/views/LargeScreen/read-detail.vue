<template>
  <div class="detail-container">
    <div class="card-panel-title">
      <span>详情</span>
      <el-button
        class="filter-item-cancel"
        size="mini"
        type="primary"
        @click="cancel()">取消
      </el-button>
      <el-input type="text" placeholder="请输入内容" v-model="query.blurry"></el-input>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="searchClick">搜索
      </el-button>
    </div>
    <div class="detail-info">
      <div class="detail-info-title">
        {{ title1.title_detail.title }}<span style="padding: 0 10px">|</span>{{ title1.title_detail.level }}
      </div>
      <div class="detail-info-row">
        <el-row>
          <el-col :span="12">
            <span>报名时间</span> 2024-02-01
          </el-col>
          <el-col :span="12">
            <span>学习课时</span> 10
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="detail-table">
      <el-table ref="table" v-loading="loading" :data="detailInfos"
                :cell-style="cellStyle"
                :header-cell-style="headerRowStyle"
                border style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间"/>
        <el-table-column :show-overflow-tooltip="true" prop="readCount" label="阅读理解"/>
        <el-table-column :show-overflow-tooltip="true" prop="num" label="完形填空"/>
        <el-table-column :show-overflow-tooltip="true" prop="flow" label="书面表达"/>
      </el-table>
    </div>
  </div>
</template>

<script>

import Read from '@/api/LargeScreen/read.js'

export default {
  data() {
    return {
      title1: {
        "title": "小学",
        "childTitle": "杭州第一小学 · 三年级2班",
        "learnCount": 10,
        "title_detail": {
          "title": "小学",
          "level": "Level1",
          "learnCount": 5,
          "learnCount1": 5,
          "resContent": [
            {
              "title": "x",
              "total": 1100,
              "learnCount": 600
            },
            {
              "title": "k",
              "total": 1100,
              "learnCount": 500
            }
          ]
        },
      },
      query: {
        blurry: ""
      },
      detailInfos: [
        {createTime: "2024-06-03", readCount: 111, num: 5, flow: 100},
        {createTime: "2024-06-02", readCount: 111, num: 5, flow: 100},
        {createTime: "2024-06-01", readCount: 111, num: 5, flow: 100},
        {createTime: "2024-05-31", readCount: 111, num: 5, flow: 100}
      ],
      loading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log("阅读理解数据===")
    },
    searchClick() {
      console.log("搜索=====")
    },
    cancel() {
      this.$emit('send')
    },
    headerRowStyle() {
      return 'background: #D8D8D8; font-size: 20px; color: #000000; letter-spacing: 0; font-weight: 400;'
    },
    cellStyle() {
      return 'background: #F2F2F2; font-size: 14px; color: #000000; letter-spacing: 0; font-weight: 400;'
    }
  }
}
</script>

<style lang="scss" scoped>

.detail-container {
  background: #fff;
  height: 87vh;
  padding: 10px 40px 0 40px;

  .card-panel-title {
    height: 12vh;
    font-size: 28px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 600;

    .filter-item-cancel {
      margin-left: 60%;
      background: #B5DADF;
      border-radius: 40px;
      height: 40px;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 400;
    }

    .el-input {
      margin-top: 20px;
      width: 300px;
    }
  }

  .detail-info {
    background: #fff;
    height: 20vh;
    margin-top: 30px;

    .detail-info-title {
      height: 10vh;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 500;
    }

    .detail-info-row {
      margin-top: 20px;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 500;

      span {
        padding-right: 20px;
        color: #8A9495;
      }
    }
  }

  .detail-table {
    margin-top: 10px;
    height: 50.5vh;
  }
}


</style>
