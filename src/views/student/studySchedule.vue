<template>
  <div id="app">
    <div class="app-container">
      <el-dialog :visible="this.detailDialog" @close="detailDialogClose" width="1000px">
        <el-tabs v-model="detailType" @tab-click="getStudentStudyScheduleDetail" type="border-card">
          <el-tab-pane label="音频资料" name="listen">
            <!--表格渲染-->
            <el-table ref="table" :data="detailData" style="width: 100%;" class="tab-table">
              <el-table-column :show-overflow-tooltip="true" prop="detailType" label="详情类型"/>
              <el-table-column :show-overflow-tooltip="true" prop="content" label="内容">
                <template slot-scope="scope">
                  <a @click="openVideo(scope.row.content)"
                     style="text-decoration: underline;font-size: 14px;color: #1884FF">音频资料</a>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="updateTime" label="更新时间"/>
            </el-table>
            <!--分页组件-->
            <el-pagination
              :page-size.sync="studyPage.size"
              :total="studyPage.total"
              :current-page.sync="studyPage.currentPage"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="detailSizeChangeHandler($event)"
              @current-change="detailPageChangeHandler"
            />
          </el-tab-pane>
          <el-tab-pane label="默写内容" name="write">
            <!--表格渲染-->
            <el-table ref="table" :data="detailData" style="width: 100%;" class="tab-table">
              <el-table-column :show-overflow-tooltip="true" prop="detailType" label="详情类型"/>
              <el-table-column :show-overflow-tooltip="true" prop="content" label="内容">
                <!--                <template slot-scope="scope">-->
                <!--                  <a @click="handleStudySchedule(scope.row)" style="color: #1884FF; font-size: 14px">查看</a>-->
                <!--                </template>-->
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="updateTime" label="更新时间"/>
            </el-table>
            <!--分页组件-->
            <el-pagination
              :page-size.sync="studyPage.size"
              :total="studyPage.total"
              :current-page.sync="studyPage.currentPage"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="detailSizeChangeHandler($event)"
              @current-change="detailPageChangeHandler"
            />
          </el-tab-pane>
          <el-tab-pane label="测试" name="test">
            <!--表格渲染-->
            <el-table ref="table" :data="detailData" style="width: 100%;" class="tab-table">
              <el-table-column :show-overflow-tooltip="true" prop="detailType" label="详情类型"/>
              <el-table-column :show-overflow-tooltip="true" prop="content" label="试卷信息">
                <template slot-scope="scope">
                  <span style="color: #1884FF; font-size: 14px"
                        @click="openStudyExaminationsDetail(scope.row.id)">查看</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="updateTime" label="更新时间"/>
            </el-table>
            <!--分页组件-->
            <el-pagination
              :page-size.sync="studyPage.size"
              :total="studyPage.total"
              :current-page.sync="studyPage.currentPage"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="detailSizeChangeHandler($event)"
              @current-change="detailPageChangeHandler"
            />
          </el-tab-pane>
        </el-tabs>
      </el-dialog>

      <el-dialog :visible.sync="videoDialog" width="800px" >
<!--        <video-->
<!--          ref="veo"-->
<!--          :style="`object-fit: ${videoInfo.zoom};`"-->
<!--          :src="videoInfo.videoUrl"-->
<!--          :width="750"-->
<!--          :height="60"-->
<!--          :autoplay="videoInfo.autoplay"-->
<!--          :controls="videoInfo.controls"-->
<!--          :loop="videoInfo.loop"-->
<!--          :muted="videoInfo.muted"-->
<!--          :preload="videoInfo.preload"-->
<!--          crossorigin="anonymous"-->
<!--          @click.prevent.once="onPlay"-->
<!--          v-bind="$attrs">-->
<!--        </video>-->
        <audio ref="audioPlayer" controls style=" width:750px">
          <source :src="videoInfo.videoUrl" type="audio/mpeg">
        </audio>
      </el-dialog>

      <div style="width: 100%; height: 25px; margin-bottom: 10px">
        <el-page-header @back="backPage" content="学生进度列表"/>
        <hr/>
      </div>
      <div style="display: flex;">
        <div style="width: 50%;">
          <h3>进度详情</h3>
          <!--学习进度表格渲染-->
          <el-table ref="table" border :data="data">
            <el-table-column :show-overflow-tooltip="true" prop="eduLevel" label="学生等级"/>
            <el-table-column :show-overflow-tooltip="true" prop="lesson" label="课程"/>
            <el-table-column :show-overflow-tooltip="true" label="内容">
              <template slot-scope="scope">
                <span style="color: #1884FF; font-size: 14px" @click="detailOpen(scope.row.id)">查看</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始时间"/>
            <el-table-column :show-overflow-tooltip="true" prop="updateTime" label="更新时间"/>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :page-size.sync="studyPage.size"
            :total="studyPage.total"
            :current-page.sync="studyPage.currentPage"
            style="margin-top: 20px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChangeHandler($event)"
            @current-change="pageChangeHandler"
          />
        </div>
        <div style="margin-left: 5%; width: 40%;">
          <h3>试卷列表</h3>
          <!--试卷表格渲染-->
          <el-table ref="table" border :data="examData">
            <el-table-column :show-overflow-tooltip="true" prop="examinationName" label="试卷名称"/>
            <el-table-column :show-overflow-tooltip="true" label="内容">
              <template slot-scope="scope">
                <span style="color: #1884FF; font-size: 14px"
                      @click="openStudyExaminationsDetail(scope.row.id)">查看</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="updateTime" label="更新时间"/>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :page-size.sync="examPage.size"
            :total="examPage.total"
            :current-page.sync="examPage.currentPage"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="examSizeChangeHandler($event)"
            @current-change="examPageChangeHandler"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crudStudent from '@/api/trainSchool/student'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'studySchedule',
  inject: ['reload'],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      data: [],
      examData: [],
      detailData: [],
      studyPage: {
        // 页码
        page: 0,
        // 每页数据条数
        size: 10,
        // 总数据条数
        total: 0,
        currentPage: 1
      },
      examPage: {
        // 页码
        page: 0,
        // 每页数据条数
        size: 10,
        // 总数据条数
        total: 0,
        currentPage: 1
      },
      detailType: 'listen',
      studentId: null,
      trainId: null,
      detailDialog: false,
      videoDialog: false,
      videoInfo: {
        poster: '', //视频封面uri
        videoUrl: '',
        autoplay: false, //视频就绪后是否马上播放
        controls: true, //控件 进度条、全屏等
        loop: false,//播放完成后，是否循环播放
        muted: false,//是否静音
        showPlay: false,//播放暂停是否显示暂停图标
        playWidth: 96,// 中间播放暂停按钮的边长
        // none:(默认)保存原有内容，不进行缩放;
        // fill:不保持原有比例，内容拉伸填充整个内容容器;
        // contain:保存原有比例，内容以包含方式缩放;
        // cover:保存原有比例，内容以覆盖方式缩放
        zoom: 'contain',
      }
    }
  },
  mounted: function () {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  created() {
    this.detailDialog = false
    this.studentId = this.$route.params.studentId
    this.getStudyScheduleList();
    this.getStuAllExamList();
  },
  methods: {
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    backPage(){
      this.$router.go(-1)
    },
    getStudyScheduleList() {
      crudStudent.getStudentStudySchedule(this.studentId, this.studyPage.size, this.studyPage.page).then(res => {
        if (res.content !== null) {
          this.data = res.content.data
          this.studyPage.total = res.content.total
        }
      }).catch(() => {
        this.$router.go(-1)
      })
    },
    getStuAllExamList() {
      crudStudent.getStuAllExamList(this.studentId, this.examPage.size, this.examPage.page).then(res => {
        if (res.content !== null) {
          this.examData = res.content.data
          this.examPage.total = res.content.total
        }
      }).catch(() => {
        this.$router.go(-1)
      })
    },
    getStudentDetailList() {
      crudStudent.getStudentStudyScheduleDetail(this.studentId, this.trainId, this.detailType.toUpperCase(), this.studyPage.size, this.studyPage.page).then(res => {
        if (res.content !== null) {
          this.detailData = res.content.data
          this.studyPage.total = res.content.total
        }
      }).catch(() => {
        this.$notify({
          title: '获取学习进度详情失败',
          type: 'error',
          duration: 1500
        })
        this.detailDialog = false
        this.trainId = null
      })
    },
    detailOpen(trainId) {
      this.detailType = 'listen'
      this.detailDialog = true
      this.trainId = trainId
      this.getStudentDetailList()
    },
    getStudentStudyScheduleDetail(tab, event) {
      this.studyPage = {
        // 页码
        page: 0,
        // 每页数据条数
        size: 10,
        // 总数据条数
        total: 0,
        currentPage: 1
      }
      this.getStudentDetailList()
    },
    detailDialogClose() {
      this.detailDialog = false
      this.reload()
    },
    openVideo(videoUrl) {
      this.videoDialog = true
      this.videoInfo.videoUrl = videoUrl
      console.log("video url==="+this.videoInfo.videoUrl)
    },
    onPlay() {
      if (this.videoInfo.autoplay) {
        this.$refs.veo.pause()
      } else {
        this.$refs.veo.play()
      }
    },
    videoClose() {
      this.$refs.veo.currentTime = 0
      this.$refs.veo.pause()
      this.videoDialog = false
    },
    openStudyExaminationsDetail(id) {
      this.detailDialog = false
      this.$router.push({
        name: 'examinationsDetail',
        params: {
          id: null,
          stuId: id
        }
      })
    },
    // 进度每页条数改变
    sizeChangeHandler(e) {
      this.studyPage.size = e
      this.studyPage.page = 0
      this.studyPage.currentPage = 1
      //重新请求列表
      this.getStudyScheduleList()
    },
    // 当前页改变
    pageChangeHandler(e) {
      this.studyPage.page = e - 1
      this.studyPage.currentPage = e
      //重新请求列表
      this.getStudyScheduleList()
    },
    //试卷
    examSizeChangeHandler(e) {
      this.examPage.size = e
      this.examPage.page = 0
      this.examPage.currentPage = 1
      //重新请求列表
      this.getStuAllExamList()
    },
    // 当前页改变
    examPageChangeHandler(e) {
      this.examPage.page = e - 1
      this.examPage.currentPage = e
      //重新请求列表
      this.getStuAllExamList()
    },
    // 每页条数改变
    detailSizeChangeHandler(e) {
      this.studyPage.size = e
      this.studyPage.page = 0
      this.studyPage.currentPage = 1
      //重新请求列表
      this.getStudentDetailList()
    },
    // 当前页改变
    detailPageChangeHandler(e) {
      this.studyPage.page = e - 1
      this.studyPage.currentPage = e
      //重新请求列表
      this.getStudentDetailList()
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-form {
  .el-input-number .el-input__inner {
    text-align: left;
  }
}

.tab-table {
  height: 410px;
}


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
