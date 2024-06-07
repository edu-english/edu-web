<template>
  <div class="hearing-div">
    <el-row :gutter="23">
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
        <div class="card-col">
          <div class="card-title">
            <span>{{ this.title1.childTitle }}</span>
            <el-divider direction="vertical"/>
            {{ this.title1.learnCount }}
            <span style="color: #8A9495">人参加学习</span>
          </div>
          <div class="card-bar">
            <div class="center-div">
              <span>听力口语学习数据</span>
              <el-row>
                <el-col :span="12">
                  <div>累计听力总时长</div>
                  <span>{{ title1.totalTime }}分钟</span>
                </el-col>
                <el-col :span="12">
                  <div>口语达标人数</div>
                  <span>{{ title1.userNum }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="bottom-div">
              <span>听力能力</span>
              <el-row>
                <el-col :span="7">
                  {{ title1.max }}
                  <br/><span>最高分</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.avg }}
                  <br/><span>平均分</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.min }}
                  <br/><span>最低分</span>
                </el-col>
              </el-row>
            </div>
          </div>
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
        <div class="card-col">
          <div class="card-title">
            <span>{{ this.title1.childTitle }}</span>
            <el-divider direction="vertical"/>
            {{ this.title1.learnCount }}
            <span style="color: #8A9495">人参加学习</span>
          </div>
          <div class="card-bar">
            <div class="center-div">
              <span>听力口语学习数据</span>
              <el-row>
                <el-col :span="12">
                  <div>累计听力总时长</div>
                  <span>{{ title1.totalTime }}分钟</span>
                </el-col>
                <el-col :span="12">
                  <div>口语达标人数</div>
                  <span>{{ title1.userNum }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="bottom-div">
              <span>听力能力</span>
              <el-row>
                <el-col :span="7">
                  {{ title1.max }}
                  <br/><span>最高分</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.avg }}
                  <br/><span>平均分</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.min }}
                  <br/><span>最低分</span>
                </el-col>
              </el-row>
            </div>
          </div>
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
        <div class="card-col">
          <div class="card-title">
            <span>{{ this.title1.childTitle }}</span>
            <el-divider direction="vertical"/>
            {{ this.title1.learnCount }}
            <span style="color: #8A9495">人参加学习</span>
          </div>
          <div class="card-bar">
            <div class="center-div">
              <span>听力口语学习数据</span>
              <el-row>
                <el-col :span="12">
                  <div>累计听力总时长</div>
                  <span>{{ title1.totalTime }}分钟</span>
                </el-col>
                <el-col :span="12">
                  <div>口语达标人数</div>
                  <span>{{ title1.userNum }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="bottom-div">
              <span>听力能力</span>
              <el-row>
                <el-col :span="7">
                  {{ title1.max }}
                  <br/><span>最高分</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.avg }}
                  <br/><span>平均分</span>
                </el-col>
                <el-col :span="7">
                  {{ title1.min }}
                  <br/><span>最低分</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" v-else="showStatistics">
        <Hearing-detail @send="childCancel"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Hearing from '@/api/LargeScreen/hearing.js'
import HearingDetail from './hearing-detail'

export default {
  name: 'LargeScreen-hearing',
  components: {
    HearingDetail
  },
  inject: ['reload'],
  data() {
    return {
      title1: {
        "title": "小学",
        "childTitle": "杭州第一小学 · 三年级2班",
        "learnCount": 10,
        "totalTime": 5132,
        "userNum": 5,
        "max": 99,
        "avg": 80,
        "min": 75
      },
      title2: {
        "title": "初中",
        "childTitle": "杭州第一初中 · 三年级2班",
        "learnCount": 20,
        "totalTime": 5132,
        "userNum": 5,
        "max": 99,
        "avg": 80,
        "min": 75
      },
      title3: {
        "title": "高中",
        "childTitle": "杭州第一高中 · 三年级2班",
        "learnCount": 5,
        "totalTime": 5132,
        "userNum": 5,
        "max": 99,
        "avg": 80,
        "min": 75
      },
      showStatistics: true,
      loading: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
    getCount() {
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
    height: 65vh;

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
            padding: 10px 0 10px 30px;
            font-size: 50px;
            color: #000000;
            font-weight: 400;
            margin-right: 15px;

            span {
              font-size: 26px;
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
