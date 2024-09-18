<template>
  <div class="app-container">
    <div class="page-header-container">
      <el-page-header @back="backPage" content="试卷详情"/>
      <el-button type="primary" icon="el-icon-printer" size="mini" @click="printerExamInfo()">打印</el-button>
    </div>
    <hr>
    <div class="head-content" id="head-content">
      <h3>{{ content.examName }} </h3>
      <div class="student-score-style" v-show="showStuAnswer">
        <p v-if="content.studentScore!==null">得分：{{ content.studentScore }}</p>
        <el-form ref="form" size="small" label-width="55px" :inline="true">
          <el-form-item label="升级：">
            <el-radio v-model="hasPass" label="1">通过</el-radio>
            <el-radio v-model="hasPass" label="0">不通过</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="score(null,content.batchId)">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <ol class="question-ol">
        <li v-for="(examination,exIndex) in content.examination" :key="examination.examId">
          <div style="margin-top: 20px">{{ examination.questionTitle }}</div>
          <div class="child-question" v-for="(question,index) in examination.questions">
            <div>
              <span>
                {{ index + 1 }}、{{ question.questionTitle }}（{{ question.score }}分）
                 <span v-if="question.questionType!=='COMPOSITION' && question.questionType!=='COMPREHENSION'">正确答案（ {{
                     question.answer
                   }} ）</span>
              </span>
              <span class="stu-answer"
                    v-show="showStuAnswer && question.questionType!=='COMPOSITION' && question.questionType!=='COMPREHENSION'">学生答案（ {{
                  question.studentAnswer
                }} ）</span>
            </div>
            <!--题为文件时处理-->
            <div v-if="question.questionTitleFile!==null && question.questionTitleFile!==''" class="question-file-div">
              <div v-if="question.fileType==='VOICE'">
                <audio ref="audioPlayer" controls>
                  <source :src="question.questionTitleFile" type="audio/mpeg">
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
                  :height="450"
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
              <el-row :gutter="23" style="margin-top: 20px; margin-left: 20px">
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
              <br/>
            </div>
            <!--作文内容-->
            <div v-show="showStuAnswer && question.questionType==='COMPOSITION'">
              <p style="border: #8A9495 1px solid; width: 100%; white-space: pre-wrap;">
                {{ question.studentAnswer }}
              </p>
              <div class="operate-button">
                <el-form ref="form" size="small" label-width="90px" :inline="true">
                  <el-form-item label="作文分数：">
                    <el-input-number v-model.number="stuScore" controls-position="right" size="large" :min="0" :max="10"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="score(question.id,content.batchId)">提交</el-button>
                  </el-form-item>
                </el-form>

              </div>
            </div>
            <!--阅读理解下小题-->
            <div class="child-question" v-show="question.questionType==='COMPREHENSION'"
                 v-for="(subQuestion,subIndex) in question.subQuestions">
              <div>
                <span>
                   {{ subIndex + 1 }}、{{ subQuestion.questionTitle }}（{{ subQuestion.score }}分）
                 <span v-if="question.questionType!=='COMPOSITION'">正确答案（ {{ subQuestion.answer }} ）</span>
              </span>
                <span class="stu-answer"
                      v-show="showStuAnswer && subQuestion.questionType!=='COMPOSITION'">学生答案（ {{
                    subQuestion.studentAnswer
                  }} ）</span>
              </div>
              <!--题为文件时处理-->
              <div v-if="subQuestion.questionTitleFile!==null && subQuestion.questionTitleFile!==''"
                   class="question-file-div">
                <div v-if="subQuestion.fileType==='VOICE'">
                  <audio ref="audioPlayer" controls>
                    <source :src="subQuestion.questionTitleFile" type="audio/mpeg">
                  </audio>
                </div>
                <div v-else-if="subQuestion.fileType==='IMAGE'">
                  <img :src="subQuestion.questionTitleFile" width="200" height="80">
                </div>
                <div v-else-if="subQuestion.fileType==='VIDEO'">
                  <video
                    ref="veo"
                    :style="`object-fit: contain;`"
                    :src="subQuestion.questionTitleFile"
                    :width="700"
                    :height="450"
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
              <div v-if="subQuestion.questionType==='CHOOSE'
                  ||subQuestion.questionType==='JUDGE'
                  ||subQuestion.questionType==='LISTEN'">
                <el-row :gutter="23" style="margin-top: 20px;">
                  <el-col :xs="24" :sm="24" :lg="12"
                          v-show="subQuestion.optionA!=='' && subQuestion.optionA!==null">
                    A、{{ subQuestion.optionA }}
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="12"
                          v-show="subQuestion.optionB!=='' && subQuestion.optionB!==null">
                    B、{{ subQuestion.optionB }}
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="12"
                          v-show="subQuestion.optionC!=='' && subQuestion.optionC!==null">
                    C、{{ subQuestion.optionC }}
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="12"
                          v-show="subQuestion.optionD!=='' && subQuestion.optionD!==null">
                    D、{{ subQuestion.optionD }}
                  </el-col>
                  <br/>
                </el-row>
              </div>
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
import printJS from 'print-js'

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
        examination: [
          {
            order: 0,
            questionTitle: "",
            questions: []
          }
        ],
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
      stuScore: 0,
      hasPass: '1',
      loading: false,
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
  methods: {
    backPage() {
      this.$router.go(-1)
    },
    printerExamInfo() {
      printJS({
        type: 'html',
        printable: 'head-content',
        targetStyles: ['*'],
        maxWidth: '800px'
      })
    },
    getExaminationsDetail(examinationId) {
      ExaminationsDetail.getExaminationDetail(examinationId).then(res => {
        if (res.code === '0000' && res.content !== null) {
          this.content = res.content
        } else {
          this.$notify({
            title: res.message,
            type: 'warning',
            duration: 1500
          })
          this.$router.go(-1)
        }
      }).catch(() => {
        this.$router.go(-1)
      })
    },
    getExaminationsDetailByStuId(stuId) {
      ExaminationsDetail.getExaminationsDetailByStuId(stuId).then(res => {
        if (res.code === '0000' && res.content !== null) {
          this.content = res.content
        } else {
          this.$notify({
            title: res.message,
            type: 'error',
            duration: 1500
          })
          this.$router.go(-1)
        }
      }).catch(() => {
        this.$router.go(-1)
      })
    },
    score(questionId, batchId) {
      let data = null;
      if (questionId === null) {
        data = {
          "id": batchId,
          "hasPass": this.hasPass,
          "scoreList": []
        }
      } else {
        data = {
          "id": batchId,
          "hasPass": '0',
          "scoreList": [
            {
              "questionId": questionId,
              "score": this.stuScore
            }
          ]
        }
      }
      ExaminationsDetail.markExamination(data).then(res => {
        if (res.code === '0000') {
          this.$notify({
            title: '阅卷成功',
            type: 'success',
            duration: 1500
          })
          if (this.examinationsId !== null) {
            this.getExaminationsDetail(this.examinationsId);
          }
          if (this.stuId !== null) {
            this.getExaminationsDetailByStuId(this.stuId);
            this.showStuAnswer = true
          }
        } else {
          this.$notify({
            title: '阅卷失败',
            type: 'warning',
            duration: 1500
          })
        }
      })
    },
    hasProperty(key, obj) {
      return key in obj;
    },
    isEmptyValue(key, obj) {
      return obj[key] === null || obj[key] !== undefined || obj[key] !== '';
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.page-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 25px;
}

.head-content {

  h3 {
    text-align: center;
  }

  .student-score-style {
    margin-left: 70%;
  }

  ol.question-ol {
    list-style-type: cjk-ideographic;
  }

  .child-question {
    padding-top: 25px;
    margin-left: 20px;
  }

  .question-file-div {
    margin-top: 10px;
    margin-left: 20px;
  }

  .el-col {
    padding-bottom: 10px;
  }

  .operate-button {
    margin-top: 20px;
    margin-left: 70%;
  }
}


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
