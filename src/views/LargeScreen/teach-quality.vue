<template>
  <div class="teach-div">
    <div v-for="item in contentList" class="teach-content">
      <div class="card-panel-title">
        <span>{{ item.className }}</span>
      </div>
      <div>
        <el-row :gutter="23">
          <el-col :xs="24" :sm="24" :lg="8" v-for="childItem in item.dataList">
            <div class="child-teach-col-div">
              <span>{{ childItem.title }}</span>
              <div class="center-div">
                <span>{{ childItem.childTitle }}</span>
                <el-row :gutter="23">
                  <el-col :lg="8">
                    <div class="center-div-col-div">
                      {{ childItem.max }}
                      <br/>
                      <span>最高分</span>
                    </div>
                  </el-col>
                  <el-col :lg="8">
                    <div class="center-div-col-div">
                      {{ childItem.avg }}
                      <br/>
                      <span>平均分</span>
                    </div>
                  </el-col>
                  <el-col :lg="8">
                    <div class="center-div-col-div">
                      {{ childItem.min }}
                      <br/>
                      <span>最低分</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

import TeachQuality from '@/api/LargeScreen/teach-quality'

export default {
  name: 'LargeScreen-teach-quality',
  inject: ['reload'],
  data() {
    return {
      contentList: [
        {
          "className": "杭州第一小学 · 三年级1班",
          "dataList": [
            {
              "title": "参加校外学习",
              "childTitle": "校内考试",
              "max": 99,
              "avg": 80,
              "min": 75
            },
            {
              "title": "参加校外学习",
              "childTitle": "级别测试",
              "max": 99,
              "avg": 80,
              "min": 75
            }
            ,
            {
              "title": "未参加校外学习",
              "childTitle": "校内考试",
              "max": 99,
              "avg": 80,
              "min": 75
            }
          ]
        },
        {
          "className": "杭州第二小学 · 三年级1班",
          "dataList": [
            {
              "title": "参加校外学习",
              "childTitle": "校内考试",
              "max": 99,
              "avg": 80,
              "min": 75
            },
            {
              "title": "参加校外学习",
              "childTitle": "级别测试",
              "max": 99,
              "avg": 80,
              "min": 75
            }
            ,
            {
              "title": "未参加校外学习",
              "childTitle": "校内考试",
              "max": 99,
              "avg": 80,
              "min": 75
            }
          ]
        }
      ],
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

.teach-div {
  padding: 2vh 2vh 5vh 2vh;
  background-color: rgb(240, 242, 245);
  height: 91vh;
  .teach-content{
    height: 45vh;
    .card-panel-title {
      margin-bottom: 2vh;
      height: 6vh;
      padding: 2vh 2vh;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 400;
      background: #fff;
    }

    .child-teach-col-div {
      height: 32vh;
      background: #fff;
      padding: 2.5vh 2vh 0 2vh;

      span {
        font-size: 26px;
        color: #000000;
        font-weight: 600;
        letter-spacing: 0;
      }

      .center-div {
        margin-top: 6vh;

        span {
          font-size: 20px;
          color: #8A9495;
          font-weight: 600;
          letter-spacing: 0;
        }

        .el-row {
          margin-top: 3vh;

          .center-div-col-div {
            font-size: 50px;
            color: #000000;
            letter-spacing: 0;
            line-height: 40px;
            font-weight: 400;
            text-align: center;
            background: #DCE6EE;
            padding: 2vh;

            span {
              font-size: 28px;
              color: #8A9495;
              letter-spacing: 0;
              font-weight: 600;
            }
          }
        }
      }

    }
  }



}


</style>
