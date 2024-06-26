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
        {{ listenDetail.grade }}<span style="padding: 0 10px">|</span>Level{{ listenDetail.level }}
      </div>
      <div class="detail-info-row">
        <el-row>
          <el-col :span="12">
            <span>报名时间：</span> {{ listenDetail.createTime }}
          </el-col>
          <el-col :span="12">
            <span>听题数：</span> {{ listenDetail.listenCount }}
          </el-col>
        </el-row>
      </div>
    </div>
    <!--    <div class="detail-table">
          <el-table ref="table" v-loading="loading" :data="detailInfos"
                    :cell-style="cellStyle"
                    :header-cell-style="headerRowStyle"
                    border style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间" />
            <el-table-column :show-overflow-tooltip="true" prop="readCount" label="听力分数" />
          </el-table>
        </div>-->
  </div>
</template>

<script>

import levelTest from "@/api/LargeScreen/level-test";
import crudScore from "@/api/trainSchool/score";

export default {
  props: {
    eduLevel: {
      type: String,
      require: false
    }
  },
  data() {
    return {
      listenDetail: {
        createTime: null,
        level: null,
        grade: null,
        listenCount: null
      },
      query: null,
      detailInfos: [
        {createTime: "2024-06-03", readCount: 90},
        {createTime: "2024-06-02", readCount: 20},
        {createTime: "2024-06-01", readCount: 41},
        {createTime: "2024-05-31", readCount: 78}
      ],
      loading: false,
      studentInfoList: [],
      showDetail: false,
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
      levelTest.getLargeInfo(this.query, 'listen', '', '').then(res => {
        this.listenDetail = res.content
        this.showDetail = true
      })
    },
    cancel() {
      this.$emit('send')
    },
    headerRowStyle() {
      return 'background: #D8D8D8; font-size: 18px; color: #000000'
    },
    cellStyle() {
      return 'background: #F2F2F2; font-size: 14px; color: #000000'
    }
  }
}
</script>

<style lang="scss" scoped>

.detail-container {
  height: 65.8vh;
  background: #fff;
  padding: 3% 2.1% 8.2% 2.1%;

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
    height: 12vh;
    background: #fff;
    margin-top: 30px;

    .detail-info-title {
      margin-top: 80px;
      height: 55px;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 500;
    }

    .detail-info-row {
      margin-top: 80px;
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
    margin-top: 30px;
    height: 41.5vh;
  }

}


</style>
