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
    </div>
    <div class="detail-info" v-show="showDetail">
      <div class="detail-info-title">
        {{ readDetail.grade }}<span style="padding: 0 10px">|</span>Level{{ readDetail.level }}
      </div>
      <div class="detail-info-row">
        <el-row>
          <el-col :span="24">
            <span>报名时间：</span> {{ readDetail.createTime }}
          </el-col>
          <el-col :span="12">
            <span>填空：</span> {{ readDetail.completion }}
          </el-col>
          <el-col :span="12">
           <span> 作文：</span> {{ readDetail.composition }}
          </el-col>
          <el-col :span="12">
            <span>阅读理解：</span> {{ readDetail.comprehension }}
          </el-col>
        </el-row>
      </div>
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
      query: null,
      loading: false,
      studentInfoList:[],
      readDetail:{
        completion: null,
        createTime: null,
        level: null,
        composition: null,
        grade: null,
        comprehension: null
      },
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
      levelTest.getLargeInfo(this.query, 'read', '', '').then(res => {
        this.readDetail = res.content
        this.showDetail = true
      })
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
  height: 85vh;
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
  }

  .detail-info {
    background: #fff;
    margin-top: 30px;

    .detail-info-title {
      margin-top: 80px;
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
      .el-col{
        margin-bottom: 50px;
      }
    }
  }
}


</style>
