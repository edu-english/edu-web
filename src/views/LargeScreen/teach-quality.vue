<template>
  <div class="teach-div">
    <div class="teach-content">

      <el-row :gutter="23">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="card-panel-title" >
            <span>小学</span>
          </div>
          <div class="child-teach-col-div"  v-for="childItem in dataList1">
            <span>{{ childItem.school }}</span>
            <div class="center-div">
              <el-row :gutter="25">
                <el-col :lg="10">
                  <div class="center-div-col-div">
                    {{ childItem.maxScore }}
                    <br/>
                    <span>最高分</span>
                  </div>
                </el-col>
                <el-col :lg="10">
                  <div class="center-div-col-div">
                    {{ childItem.minScore }}
                    <br/>
                    <span>最低分</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="card-panel-title" >
            <span>初中</span>
          </div>
          <div class="child-teach-col-div"  v-for="childItem in dataList2">
            <span>{{ childItem.school }}</span>
            <div class="center-div">
              <el-row :gutter="25">
                <el-col :lg="10">
                  <div class="center-div-col-div">
                    {{ childItem.maxScore }}
                    <br/>
                    <span>最高分</span>
                  </div>
                </el-col>
                <el-col :lg="10">
                  <div class="center-div-col-div">
                    {{ childItem.minScore }}
                    <br/>
                    <span>最低分</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="card-panel-title" >
            <span>高中</span>
          </div>
          <div class="child-teach-col-div"  v-for="childItem in dataList3">
            <span>{{ childItem.school }}</span>
            <div class="center-div">
              <el-row :gutter="25">
                <el-col :lg="10">
                  <div class="center-div-col-div">
                    {{ childItem.maxScore }}
                    <br/>
                    <span>最高分</span>
                  </div>
                </el-col>
                <el-col :lg="10">
                  <div class="center-div-col-div">
                    {{ childItem.minScore }}
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
</template>

<script>

import TeachQuality from '@/api/LargeScreen/teach-quality'

export default {
  name: 'LargeScreen-teach-quality',
  inject: ['reload'],
  data() {
    return {
      dataInfo: {},
      dataList1: [],
      dataList2: [],
      dataList3: [],
      showStatistics: true,
      loading: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      TeachQuality.getDataTeachQuality().then(res => {
        if (res.content !== null) {
          if (res.content.xiaoxue !== undefined) {
            this.dataList1=res.content.xiaoxue
          }
          if (res.content.chuzhong !== undefined) {
            this.dataList2=res.content.chuzhong
          }
          if (res.content.gaozhong !== undefined) {
            this.dataList3=res.content.gaozhong
          }
        }
      })
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

  .teach-content {

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

    .el-row{
      padding-top: 10px;
      padding-bottom: 40px;
    }

    .child-teach-col-div {
      height: 32vh;
      background: #fff;
      padding: 2.5vh 2vh 0 2vh;
      margin-bottom: 40px;

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

          .el-col{
           margin-left: 2vh;
          }
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
