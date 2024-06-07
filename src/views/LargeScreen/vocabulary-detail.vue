<template>
  <div class="detail-container">
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
    <div class="chart-title">
      {{ title1.title_detail.title }}<span style="padding: 0 10px">|</span>{{ title1.title_detail.level }}
    </div>
    <div id="chart4" class="chart-bar"/>
    <div class="count_row">
      <el-row>
        <el-col :span="12">
          词汇频次 {{ title1.title_detail.learnCount }}
        </el-col>
        <el-col :span="12">
          短语频次 {{ title1.title_detail.learnCount }}
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import Vocabulary from '@/api/LargeScreen/vocabulary.js'

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
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Vocabulary.chart_4(this.title1.title_detail.resContent)
    },
    searchClick() {
      console.log("搜索=====")
    },
    cancel() {
      this.$emit('send')
    }
  }
}
</script>

<style lang="scss" scoped>

.detail-container {
  height: 87.5vh;
  padding-top: 2%;
  padding-left: 2%;
  background: #fff;
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
    margin-top: 30px;
    width: 300px;
  }

  .chart-title {
    padding-top: 80px;
    height: 55px;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 500;
  }

  .chart-bar {
    padding-top: 20px;
    height: 32vh;
  }

  .count_row {
    height: 33vh;
    padding-top: 70px;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 500;
  }

}


</style>
