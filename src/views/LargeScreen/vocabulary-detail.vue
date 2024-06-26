<template>
  <div class="detail-container">
    <span>详情</span>
    <el-button
      class="filter-item-cancel"
      size="mini"
      type="primary"
      @click="cancel()">取消
    </el-button>

    <div style="margin-top: 20px">
      <el-select v-model="query" filterable placeholder="请选择">
        <el-option
          v-for="item in studentInfoList"
          :key="item.id"
          :label="item.studentName"
          :value="item.id"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="searchClick">搜索
      </el-button>
    </div>
    <div v-show="showDetail">
      <div class="chart-title">
        {{ vocabularyDetail.grade }}<span style="padding: 0 10px">|</span>Level{{ vocabularyDetail.level }}
      </div>
      <el-row  class="count_row">
        <el-col :span="24">
          <span>报名时间：</span> {{ vocabularyDetail.createTime }}
        </el-col>
        <el-col :span="12">
         <span> 短语量：</span> {{ vocabularyDetail.shortTextNum }}
        </el-col>
        <el-col :span="12">
          <span>单词量：</span> {{ vocabularyDetail.wordNum }}
        </el-col>
        <el-col :span="12">
          <span>词汇频次：</span> {{ vocabularyDetail.wordFrequency }}
        </el-col>
        <el-col :span="12">
         <span> 短语频次：</span> {{ vocabularyDetail.shortTextFrequency }}
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import levelTest from "@/api/LargeScreen/level-test";
import crudScore from "@/api/trainSchool/score";

export default {
  props:{
    eduLevel:{
      type:String,
      require:false
    }
  },
  data() {
    return {
      vocabularyDetail:{
        shortTextFrequency: null,
        createTime: null,
        level: null,
        grade: null,
        shortTextNum: null,
        wordNum: null,
        wordFrequency: null
      },
      query: null,
      studentInfoList: [],
      showDetail:false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      crudScore.getStudentInfoList(this.eduLevel).then(res => {
        this.studentInfoList = res.content
      })
    },
    searchClick() {
      levelTest.getLargeInfo(this.query, 'word', '', '').then(res => {
        this.vocabularyDetail = res.content
        this.showDetail = true
      })
    },
    cancel() {
      this.$emit('send')
    }
  }
}
</script>

<style lang="scss" scoped>

.detail-container {
  height: 84.7vh;
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

  .chart-title {
    padding-top: 50px;
    height: 55px;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 500;
  }

  .count_row {
    padding-top: 100px;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 500;

    .el-col{
      margin-bottom: 50px;
    }
    span {
      padding-right: 20px;
      color: #8A9495;
    }
  }

}


</style>
