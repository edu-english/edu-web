<template>
  <div class="read-div">
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
            @click="getCount()">查询
          </el-button>
        </div>
        <div class="chart-col">
          <div class="chart-title">
            <span>{{ this.title1.childTitle }}</span>
            <el-divider direction="vertical"/>
            {{ this.title1.learnCount }}
            <span style="color: #8A9495">人参加学习</span>
          </div>
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
            @click="getCount()">查询
          </el-button>
        </div>
        <div class="chart-col">
          <div class="chart-title">
            <span>{{ this.title2.childTitle }}</span>
            <el-divider direction="vertical"/>
            {{ this.title2.learnCount }}
            <span style="color: #8A9495">人参加学习</span>
          </div>
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
            @click="getCount()">查询
          </el-button>
        </div>
        <div class="chart-col">
          <div class="chart-title">
            <span>{{ this.title3.childTitle }}</span>
            <el-divider direction="vertical"/>
            {{ this.title3.learnCount }}
            <span style="color: #8A9495">人参加学习</span>
          </div>
          <div id="chart3" class="chart-bar"/>
        </div>
      </el-col>
      <el-col :span="16" v-else="showStatistics">
        <Read-detail @send="childCancel"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Read from '@/api/LargeScreen/read.js'
import ReadDetail from './read-detail'

export default {
  name: 'LargeScreen-Read',
  components: {
    ReadDetail
  },
  inject: ['reload'],
  data() {
    return {
      title1: {
        "title": "小学",
        "childTitle": "杭州第一小学 · 三年级2班",
        "learnCount": 10,
        "resContent": [
          {
            "title": "x",
            "total": 793,
          },
          {
            "title": "z",
            "total": 600
          },
          {
            "title": "c",
            "total": 550
          },
          {
            "title": "v",
            "total": 520
          },
          {
            "title": "b",
            "total": 406
          },
          {
            "title": "a",
            "total": 350
          },
          {
            "title": "s",
            "total": 300
          },
          {
            "title": "d",
            "total": 260
          },
          {
            "title": "u",
            "total": 180
          },
          {
            "title": "h",
            "total": 450
          }
        ]
      },
      title2: {
        "title": "初中",
        "childTitle": "杭州第一初中 · 三年级2班",
        "learnCount": 20,
        "resContent": [
          {
            "title": "x",
            "total": 793,
          },
          {
            "title": "z",
            "total": 600
          },
          {
            "title": "c",
            "total": 550
          },
          {
            "title": "v",
            "total": 520
          },
          {
            "title": "b",
            "total": 406
          },
          {
            "title": "a",
            "total": 350
          },
          {
            "title": "s",
            "total": 300
          },
          {
            "title": "d",
            "total": 260
          },
          {
            "title": "u",
            "total": 180
          },
          {
            "title": "h",
            "total": 450
          }
        ]
      },
      title3: {
        "title": "高中",
        "childTitle": "杭州第一高中 · 三年级2班",
        "learnCount": 5,
        "resContent": [
          {
            "title": "x",
            "total": 793,
          },
          {
            "title": "z",
            "total": 600
          },
          {
            "title": "c",
            "total": 550
          },
          {
            "title": "v",
            "total": 520
          },
          {
            "title": "b",
            "total": 406
          },
          {
            "title": "a",
            "total": 350
          },
          {
            "title": "s",
            "total": 300
          },
          {
            "title": "d",
            "total": 260
          },
          {
            "title": "u",
            "total": 180
          },
          {
            "title": "h",
            "total": 450
          }
        ]
      },
      showStatistics: true,
      loading: false,
    }
  },
  mounted() {
    this.init()
    this.intervalId = setInterval(this.init, 5000 * 600); // 秒 刷新一次
  },
  methods: {
    init() {
      // initdata(params).then(res => {
      Read.chart_1(this.title1.resContent)
      Read.chart_2(this.title2.resContent)
      Read.chart_3(this.title3.resContent)
      // })
    },
    getCount() {
      this.showStatistics = false
    },
    childCancel(){
      this.reload()
    }
  }
}
</script>

<style lang="scss" scoped>

.read-div {
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

      .chart-title {
        height: 6vh;
        width: 400px;
        margin-left: 9%;
        margin-bottom: 5%;
        padding: 4% 7%;
        border: 2px solid #000000;
        border-radius: 8px;
      }

      .chart-bar {
        height: 69.2vh;
        padding: 0 20px;
      }
    }
  }
}


</style>
