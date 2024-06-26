<template>
  <div class="hearing-div">
    <el-row :gutter="23">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="card-panel-title">
          <span>{{ this.title1.eduLevel }}</span>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            v-if="showStatistics"
            @click="getCount('小学')">查询
          </el-button>
        </div>
        <div class="card-col">
<!--          <div class="card-title">-->
<!--            <span>{{ item.childTitle }}</span>-->
<!--            <el-divider direction="vertical"/>-->
<!--            {{ item.learnCount }}-->
<!--            <span style="color: #8A9495">人参加学习</span>-->
<!--          </div>-->
          <div class="card-bar">
            <div class="center-div">
              <span>级别测试数据</span>
              <el-row>
                <el-col :span="8">
                  最高分
                  <br/>
                  <span>{{ title1.maxScore }}</span>
                </el-col>
                <el-col :span="8">
                  平均分
                  <br/>
                  <span>{{ title1.avgScore }}</span>
                </el-col>
                <el-col :span="8">
                  最低分
                  <br/>
                  <span>{{ title1.minScore }}</span>
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
            @click="getCount('初中')">查询
          </el-button>
        </div>
        <div class="card-col">
<!--          <div class="card-title">-->
<!--            <span>{{ item.childTitle }}</span>-->
<!--            <el-divider direction="vertical"/>-->
<!--            {{ item.learnCount }}-->
<!--            <span style="color: #8A9495">人参加学习</span>-->
<!--          </div>-->
          <div class="card-bar">
            <div class="center-div">
              <span>级别测试数据</span>
              <el-row>
                <el-col :span="8">
                  最高分
                  <br/>
                  <span>{{ title2.maxScore }}</span>
                </el-col>
                <el-col :span="8">
                  平均分
                  <br/>
                  <span>{{ title2.avgScore }}</span>
                </el-col>
                <el-col :span="8">
                  最低分
                  <br/>
                  <span>{{ title2.minScore }}</span>
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
            @click="getCount('高中')">查询
          </el-button>
        </div>
        <div class="card-col">
<!--          <div class="card-title">-->
<!--            <span>{{ item.childTitle }}</span>-->
<!--            <el-divider direction="vertical"/>-->
<!--            {{ item.learnCount }}-->
<!--            <span style="color: #8A9495">人参加学习</span>-->
<!--          </div>-->
          <div class="card-bar">
            <div class="center-div">
              <span>级别测试数据</span>
              <el-row>
                <el-col :span="8">
                  最高分
                  <br/>
                  <span>{{ title2.maxScore }}</span>
                </el-col>
                <el-col :span="8">
                  平均分
                  <br/>
                  <span>{{ title2.avgScore }}</span>
                </el-col>
                <el-col :span="8">
                  最低分
                  <br/>
                  <span>{{ title2.minScore }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" v-else="showStatistics">
        <Level-Test-Detail @send="childCancel" :eduLevel="eduLevel"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import LevelTest from '@/api/LargeScreen/level-test'
import LevelTestDetail from './level-test-detail'
import Vocabulary from "@/api/LargeScreen/vocabulary";

export default {
  name: 'LargeScreen-level-test',
  components: {
    LevelTestDetail
  },
  inject: ['reload'],
  data() {
    return {
      title1:  {
          "minScore": 0,
          "avgScore": 0,
          "eduLevel": "小学",
          "maxScore": 0
        },
      title2:  {
          "minScore": 0,
          "avgScore": 0,
          "eduLevel": "初中",
          "maxScore": 0
        },
      title3:  {
          "minScore": 0,
          "avgScore": 0,
          "eduLevel": "高中",
          "maxScore": 0
        },
      showStatistics: true,
      loading: false,
      eduLevel:null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      LevelTest.getDataTest().then(res => {
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
    margin-top: 20px;
    padding-top: 15px;
    padding-left: 3.5vh;
    height: 34vh;

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
        margin-top: 5vh;

        span {
          height: 15%;
          font-size: 20px;
          color: #000000;
          font-weight: 400;
        }

        .el-row {
          margin-top: 4vh;
          padding-left: 3vh;

          .el-col {
            font-size: 20px;
            color: #8A9495;
            letter-spacing: 0;
            line-height: 40px;
            font-weight: 600;

            div {
              margin-bottom: 20px;
            }

            span {
              font-size: 28px;
              color: #000000;
              letter-spacing: 0;
              font-weight: 400;
              padding-left: 1vh;
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
