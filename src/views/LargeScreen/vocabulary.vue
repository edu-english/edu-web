<template>
  <div class="vocabulary-div">
    <el-row :gutter="23" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="card-panel-title">
          <span>{{ this.title1.title }}</span>
            <el-button
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-search"
              v-if="showStatistics"
              @click="getCount(title1.title)">查询
            </el-button>
        </div>
        <div class="chart-col">
          <!--          <div class="chart-title">-->
          <!--            <span>{{ this.title1.childTitle }}</span>-->
          <!--            <el-divider direction="vertical"/>-->
          <!--            {{ this.title1.learnCount }}-->
          <!--            <span style="color: #8A9495">人参加学习</span>-->
          <!--          </div>-->
          <div id="chart1" class="chart-bar"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" v-if="showStatistics">
        <div class="card-panel-title">
          <span>{{ this.title2.title }}</span>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="getCount(title2.title)">查询
          </el-button>
        </div>
        <div class="chart-col">
          <!--          <div class="chart-title">-->
          <!--            <span>{{ this.title2.childTitle }}</span>-->
          <!--            <el-divider direction="vertical"/>-->
          <!--            {{ this.title2.learnCount }}-->
          <!--            <span style="color: #8A9495">人参加学习</span>-->
          <!--          </div>-->
          <div id="chart2" class="chart-bar"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" v-if="showStatistics">
        <div class="card-panel-title">
          <span>{{ this.title3.title }}</span>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="getCount(title3.title)">查询
          </el-button>
        </div>
        <div class="chart-col">
          <!--          <div class="chart-title">-->
          <!--            <span>{{ this.title3.childTitle }}</span>-->
          <!--            <el-divider direction="vertical"/>-->
          <!--            {{ this.title3.learnCount }}-->
          <!--            <span style="color: #8A9495">人参加学习</span>-->
          <!--          </div>-->
          <div id="chart3" class="chart-bar"/>
        </div>
      </el-col>
      <el-col :span="16" v-else="showStatistics">
        <Vocabulary-detail @send="childCancel" :eduLevel="eduLevel"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vocabulary from '@/api/LargeScreen/vocabulary.js'
import VocabularyDetail from './vocabulary-detail'

export default {
  name: 'LargeScreen-vocabulary',
  components: {
    VocabularyDetail
  },
  inject: ['reload'],
  data() {
    return {
      title1: {
        "title": "小学",
        "resContent": []
      },
      title2: {
        "title": "初中",
        "resContent": []
      },
      title3: {
        "title": "高中",
        "resContent": []
      },
      showStatistics: true,
      loading: false,
      eduLevel:null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Vocabulary.getDataWord().then(res => {
        if (res.content !== null) {
          if (res.content.xiaoxue !== undefined) {
            this.title1.resContent=res.content.xiaoxue
            Vocabulary.chart_1(this.title1.resContent)
          }
          if (res.content.chuzhong !== undefined) {
            this.title2.resContent=res.content.chuzhong
            Vocabulary.chart_2(this.title2.resContent)
          }
          if (res.content.gaozhong !== undefined) {
            this.title3.resContent=res.content.gaozhong
            Vocabulary.chart_3(this.title3.resContent)
          }
        }
      })
    },
    getCount(val) {
      if (val==='小学') {
        this.eduLevel=this.title1.title
        Vocabulary.chart_1(this.title1.resContent)
      }
      if (val==='初中') {
        this.eduLevel=this.title2.title
        this.title1.title=this.title2.title
        Vocabulary.chart_1(this.title2.resContent)
      }
      if (val==='高中') {
        this.eduLevel=this.title3.title
        this.title1.title=this.title3.title
        Vocabulary.chart_1(this.title3.resContent)
      }
      this.showStatistics = false
    },
    childCancel() {
      this.reload()
    }
  }
}
</script>

<style lang="scss" scoped>

.vocabulary-div {
  padding: 2vh;
  background-color: rgb(240, 242, 245);
  height: 91.2vh;

  .chart-row {
    .card-panel-title {
      height: 7vh;
      padding: 1.5vh 5vh;
      font-size: 28px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 600;
      background: #fff;
      margin-bottom: 10px;

      .el-button {
        margin-left: 55%;
        background: #B5DADF;
        border-radius: 40px;
        height: 40px;
        font-size: 20px;
        color: #000000;
        letter-spacing: 0;
        font-weight: 400;
      }
    }

    .chart-col {
      background: #fff;
      margin-top: 10px;
      padding-top: 15px;

      //.chart-title {
      //  height: 6vh;
      //  width: 400px;
      //  margin-left: 9%;
      //  margin-bottom: 5%;
      //  padding: 4% 7%;
      //  border: 2px solid #000000;
      //  border-radius: 8px;
      //}

      .chart-bar {
        height: 75.2vh;
        padding: 0 20px;
      }
    }
  }

}


</style>
