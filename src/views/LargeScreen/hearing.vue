<template>
  <div class="hearing-div">
    <el-row :gutter="23">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="card-panel-title">
          <span>{{ title1.eduLevel }}</span>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            v-if="showStatistics"
            @click="getCount(title1.eduLevel)">查询
          </el-button>
        </div>
        <div class="card-col">
<!--          <div class="card-title">-->
<!--            <span>{{ this.title1.childTitle }}</span>-->
<!--            <el-divider direction="vertical"/>-->
<!--            {{ this.title1.learnCount }}-->
<!--            <span style="color: #8A9495">人参加学习</span>-->
<!--          </div>-->
          <div class="card-bar">
            <div class="center-div">
              <span>听力口语学习数据</span>
              <el-row>
                <el-col :span="12">
                  <div>听题的人数</div>
                  <span>{{ title1.listenStudentCount }}</span>
                </el-col>
                <el-col :span="12">
                  <div>听力题的总数</div>
                  <span>{{ title1.totalListenCount }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="bottom-div">
              <span>听力能力</span>
              <el-row>
                <el-col :span="7">
                  {{ title1.maxListenCount }}
                  <br/><span>最高听题数</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.avgListenCount }}
                  <br/><span>平均听题数</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.minListenCount }}
                  <br/><span>最小听题数</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" v-if="showStatistics">
        <div class="card-panel-title">
          <span>{{ this.title2.eduLevel }}</span>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="getCount(title2.eduLevel)">查询
          </el-button>
        </div>
        <div class="card-col">
<!--          <div class="card-title">-->
<!--            <span>{{ this.title1.childTitle }}</span>-->
<!--            <el-divider direction="vertical"/>-->
<!--            {{ this.title1.learnCount }}-->
<!--            <span style="color: #8A9495">人参加学习</span>-->
<!--          </div>-->
          <div class="card-bar">
            <div class="center-div">
              <span>听力口语学习数据</span>
              <el-row>
                <el-col :span="12">
                  <div>听题的人数</div>
                  <span>{{ title2.listenStudentCount }}</span>
                </el-col>
                <el-col :span="12">
                  <div>听力题的总数</div>
                  <span>{{ title2.totalListenCount }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="bottom-div">
              <span>听力能力</span>
              <el-row>
                <el-col :span="7">
                  {{ title2.maxListenCount }}
                  <br/><span>最高听题数</span>
                </el-col>
                <el-col :span="7">
                  {{ title2.avgListenCount }}
                  <br/><span>平均听题数</span>
                </el-col>
                <el-col :span="7">
                  {{ title2.minListenCount }}
                  <br/><span>最小听题数</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" v-if="showStatistics">
        <div class="card-panel-title">
          <span>{{ this.title3.eduLevel }}</span>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="getCount(title3.eduLevel)">查询
          </el-button>
        </div>
        <div class="card-col">
<!--          <div class="card-title">-->
<!--            <span>{{ this.title1.childTitle }}</span>-->
<!--            <el-divider direction="vertical"/>-->
<!--            {{ this.title1.learnCount }}-->
<!--            <span style="color: #8A9495">人参加学习</span>-->
<!--          </div>-->
          <div class="card-bar">
            <div class="center-div">
              <span>听力口语学习数据</span>
              <el-row>
                <el-col :span="12">
                  <div>听题的人数</div>
                  <span>{{ title3.listenStudentCount }}</span>
                </el-col>
                <el-col :span="12">
                  <div>听力题的总数</div>
                  <span>{{ title3.totalListenCount }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="bottom-div">
              <span>听力能力</span>
              <el-row>
                <el-col :span="7">
                  {{ title3.maxListenCount }}
                  <br/><span>最高听题数</span>
                </el-col>
                <el-col :span="7">
                  {{ title3.avgListenCount }}
                  <br/><span>平均听题数</span>
                </el-col>
                <el-col :span="7">
                  {{ title3.minListenCount }}
                  <br/>
                  <span>最小听题数</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" v-else="showStatistics">
        <Hearing-detail @send="childCancel" :eduLevel="eduLevel"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Hearing from '@/api/LargeScreen/hearing.js'
import HearingDetail from './hearing-detail'
import Read from "@/api/LargeScreen/read";

export default {
  name: 'LargeScreen-hearing',
  components: {
    HearingDetail
  },
  inject: ['reload'],
  data() {
    return {
      title1: {
        "eduLevel": "小学",
        "listenStudentCount": 0,
        "totalListenCount": 0,
        "avgListenCount": 0,
        "maxListenCount": 0,
        "minListenCount": 0
      },
      title2: {
        "eduLevel": "初中",
        "listenStudentCount": 0,
        "totalListenCount": 0,
        "avgListenCount": 0,
        "maxListenCount": 0,
        "minListenCount": 0
      },
      title3: {
        "eduLevel": "高中",
        "listenStudentCount": 0,
        "totalListenCount": 0,
        "avgListenCount": 0,
        "maxListenCount": 0,
        "minListenCount": 0
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
      Hearing.getDataListen().then(res=>{
        if (res.content !== null) {
          if (res.content.xiaoxue !== undefined) {
            this.title1=res.content.xiaoxue
          }
          if (res.content.chuzhong !== undefined) {
            this.title2=res.content.chuzhong
          }
          if (res.content.gaozhong !== undefined) {
            this.title3=res.content.gaozhong
          }
        }
      })
    },
    getCount(val) {
      if (val==='初中') {
        this.title1=this.title2
      }
      if (val==='高中') {
        this.title1=this.title3
      }
      this.eduLevel=this.title1.eduLevel
      this.showStatistics = false
    },
    childCancel() {
      this.reload()
    }
  }
}
</script>

<style lang="scss" scoped>

.hearing-div {
  padding: 3% 2.1% 8.2% 2.1%;
  background-color: rgb(240, 242, 245);
  height: 91.1vh;

  .card-panel-title {
    height: 9vh;
    padding: 4% 10%;
    font-size: 28px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 600;
    background: #fff;

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

  .card-col {
    background: #fff;
    margin-top: 18px;
    padding-top: 15px;
    padding-left: 5.5%;
    height: 55vh;

    .card-title {
      height: 7vh;
      width: 420px;
      margin-bottom: 2.5vh;
      margin-top: 1.1vh;
      padding: 5% 8%;
      border: 2px solid #000000;
      border-radius: 8px;
    }

    .card-bar {
      height: 50vh;

      .center-div {
        margin-top: 4vh;
        span {
          height: 15%;
          font-size: 25px;
          color: #000000;
          font-weight: 500;
        }

        .el-row {
          margin-top: 5vh;
          .el-col {
            font-size: 20px;
            color: #8A9495;
            letter-spacing: 0;
            font-weight: 500;

            div {
              margin-bottom: 20px;
            }

            span {
              font-size: 26px;
              color: #000000;
              letter-spacing: 0;
              line-height: 40px;
              font-weight: 400;
            }
          }
        }
      }

      .bottom-div {
        margin-top: 12vh;
        span {
          font-size: 20px;
          color: #8A9495;
          letter-spacing: 0;
          font-weight: 500;
        }

        .el-row {
          margin-top: 20px;

          .el-col {
            background: #DCE6EE;
            padding: 10px 0 10px 15px;
            font-size: 50px;
            color: #000000;
            font-weight: 400;
            margin-right: 15px;

            span {

              font-size: 20px;
              color: #000000;
              font-weight: 400;
              letter-spacing: 0;
            }
          }
        }
      }
    }
  }


}


</style>
