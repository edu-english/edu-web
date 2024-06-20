<template>
  <div class="app-container">
    <div class="head-content">
      <h3>{{ content.examName }} </h3>
      <p v-if="content.studentScore!==null">得分：{{ content.studentScore }}</p>
    </div>
    <div class="question-div">
      <ol class="question-ol">
        <li v-for="examination in content.examination" :key="examination.examId">
          {{ examination.questionTitle }}
          <div class="child-question" v-for="(question,index) in examination.questions">
            <div>
              {{ index + 1 }}、{{ question.questionTitle }}
              <span v-if="question.questionType!=='COMPOSITION'">（分数:{{ question.score }}）（ {{
                  question.answer
                }} ）</span>
              <span class="stu-answer" v-show="showStuAnswer">学生答案（ {{ question.studentAnswer }} ）</span>
            </div>
            <!--题为文件时处理-->
            <div v-if="question.questionTitleFile!==null && question.questionTitleFile!==''" class="question-file-div">
              <div v-if="question.fileType==='VOICE'">
                <audio ref="audioPlayer" controls>
                  <source :src="question.questionTitleFile" type="audio/mp3">
                </audio>
              </div>
              <div v-else-if="question.fileType==='IMAGE'">
                <img :src="question.questionTitleFile" width="200" height="80">
              </div>
              <div v-else-if="question.fileType==='VIDEO'">
                <video
                  ref="veo"
                  :style="`object-fit: contain;`"
                  :src="question.questionTitleFile"
                  :width="750"
                  :height="60"
                  :autoplay="videoInfo.autoplay"
                  :controls="videoInfo.controls"
                  :loop="videoInfo.loop"
                  :muted="videoInfo.muted"
                  :preload="videoInfo.preload"
                  crossorigin="anonymous"
                  v-bind="$attrs">
                </video>
              </div>
            </div>
            <!--选择-->
            <div v-if="question.questionType==='CHOOSE'
                  ||question.questionType==='JUDGE'
                  ||question.questionType==='LISTEN'">
              <el-row :gutter="23" style="margin-top: 20px;">
                <el-col :xs="24" :sm="24" :lg="12"
                        v-show="question.optionA!=='' && question.optionA!==null">
                  A、{{ question.optionA }}
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12"
                        v-show="question.optionB!=='' && question.optionB!==null">
                  B、{{ question.optionB }}
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12"
                        v-show="question.optionC!=='' && question.optionC!==null">
                  C、{{ question.optionC }}
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12"
                        v-show="question.optionD!=='' && question.optionD!==null">
                  D、{{ question.optionD }}
                </el-col>
              </el-row>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import ExaminationsDetail from '@/api/trainSchool/examinationsDetail'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  name: 'examinationsDetail',
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      content: {
        examId: null,
        batchId: null,
        examName: null,
        studentScore: null,
        examination: [],
      },
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
      },
      showStuAnswer: false,
      examinationsId: null,
      stuId: null,
    }
  },
  mounted: function () {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  created() {
    if (this.$route.params.id !== null) {
      this.examinationsId = this.$route.params.id
      this.getExaminationsDetail(this.examinationsId);
    }
    if (this.$route.params.stuId !== null) {
      this.stuId = this.$route.params.stuId
      this.getExaminationsDetailByStuId(this.stuId);
      this.showStuAnswer = true
    }
  },
  watch: {
    '$route.params': {
      immediate: false,
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== '{}') {
          if (newVal.id !== null) {
            this.examinationsId = newVal.id
            this.getExaminationsDetail(this.examinationsId);
          }
          if (newVal.stuId == null) {
            this.stuId = newVal.stuId
            this.getExaminationsDetailByStuId(this.stuId);
            this.showStuAnswer = true
          }
        }
      }
    },
  },
  methods: {
    getExaminationsDetail(examinationId) {
      ExaminationsDetail.getExaminationDetail(examinationId).then(res => {
        if (res.content !== null) {
          this.content = res.content
        }
      })
    },
    getExaminationsDetailByStuId(stuId) {
      ExaminationsDetail.getExaminationsDetailByStuId(stuId).then(res => {
        if (res.content !== null) {
          this.content = res.content
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.head-content {
  text-align: center;

  p {
    margin-left: 60%;
  }
}

.question-div {
  ol.question-ol {
    list-style-type: cjk-ideographic;
  }

  padding-left: 20px;

  .child-question {
    padding: 25px 0;
    margin-left: 20px;
  }

  .question-file-div {
    margin-top: 10px;
    margin-left: 20px;
  }

  .el-col {
    padding-bottom: 10px;
  }
}


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
