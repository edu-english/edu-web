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
        {{ testInfo.grade }}<span style="padding: 0 10px">|</span>Level{{ testInfo.level }}
      </div>
      <div class="detail-info-row">
        <el-row>
          <el-col :span="12">
            <span>报名时间</span> {{ testInfo.createTime }}
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="detail-table" v-show="showDetail">
      <el-table ref="table" v-loading="loading" :data="testInfo.detailInfos"
                :cell-style="cellStyle"
                :header-cell-style="headerRowStyle"
                border style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="times" label="时间"/>
        <el-table-column :show-overflow-tooltip="true" prop="score" label="级别测试分数"/>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :page-size.sync="page.size"
        :total="page.total"
        :current-page.sync="page.currentPage"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChangeHandler($event)"
        @current-change="pageChangeHandler"
      />
    </div>
  </div>
</template>

<script>

import crudScore from "@/api/trainSchool/score";
import levelTest from "@/api/LargeScreen/level-test";

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
      testInfo: {
        level: null,
        grade: null,
        createTime: null,
        detailInfos: [],
      },
      loading: false,
      showDetail: false,
      studentInfoList: [],
      page: {
        // 页码
        page: 0,
        // 每页数据条数
        size: 10,
        // 总数据条数
        total: 0,
        currentPage: 1
      },
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
      levelTest.getLargeInfo(this.query, 'test', this.page.page, this.page.size).then(res => {
        this.testInfo.level = res.content.level
        this.testInfo.grade = res.content.grade
        this.testInfo.createTime = res.content.createTime
        this.testInfo.detailInfos = res.content.pageData.data
        this.page.total = res.content.pageData.total
        this.showDetail = true
      })
    },
    cancel() {
      this.$emit('send')
    },
    // 每页条数改变
    sizeChangeHandler(e) {
      this.page.size = e
      this.page.page = 0
      this.page.currentPage = 1
      //重新请求列表
      this.searchClick()
    },
    // 当前页改变
    pageChangeHandler(e) {
      this.page.page = e - 1
      this.page.currentPage = e
      //重新请求列表
      this.searchClick()
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
  height: 81.1vh;
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

    .el-input {
      margin-top: 20px;
      width: 300px;
    }
  }

  .detail-info {
    height: 12vh;
    background: #fff;
    margin-top: 30px;

    .detail-info-title {
      height: 55px;
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
    margin-top: 30px;
    height: 45vh;
  }

}


</style>
