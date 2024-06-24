<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.query"
          clearable
          size="small"
          placeholder=""
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation/>
      </div>
      <crudOperation :permission="permission">
      </crudOperation>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0"
               v-loading="loading" element-loading-text="文件上传中"
               :title="crud.status.title" width="520px">
      <el-form class="dialog-form" ref="form" :model="form" size="small" label-position="left" label-width="90px">
        <el-form-item label="题类型" prop="questionType">
          <el-select v-model="form.questionType" placeholder="请选择" @change="questionsChange(form.questionType)">
            <el-option
              v-for="item in questionsTypeList"
              :key="item.type"
              :label="item.desc"
              :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学生类型" prop="eduLevel">
          <el-select v-model="form.eduLevel" placeholder="请选择">
            <el-option
              v-for="item in eduLevelList"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="gradeClass">
          <el-input v-model="form.gradeClass"/>
        </el-form-item>
        <el-form-item label="题内容" prop="questionTitle">
          <el-input v-model="form.questionTitle"/>
        </el-form-item>
        <el-form-item label="题内容文件" prop="questionTitleFile">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :limit="1"
            :on-exceed="handleExceed"
            :http-request="ossUpload">
            <a>请上传文件</a>
          </el-upload>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input-number v-model="form.score" controls-position="right" size="large" :min="1" :max="100"
                           style="width: 36vh"/>
        </el-form-item>
        <el-form-item label="选项A" prop="optionA" v-show="optionShow">
          <el-input v-model="form.optionA"/>
        </el-form-item>
        <el-form-item label="选项B" prop="optionB" v-show="optionShow">
          <el-input v-model="form.optionB"/>
        </el-form-item>
        <el-form-item label="选项C" prop="optionC" v-show="optionShow">
          <el-input v-model="form.optionC"/>
        </el-form-item>
        <el-form-item label="选项D" prop="optionD" v-show="optionShow">
          <el-input v-model="form.optionD"/>
        </el-form-item>
        <el-form-item label="答案" prop="answer" v-show="form.questionType!=='COMPREHENSION'">
          <el-input v-model="form.answer" placeholder="多选题时答案以,拼接。示例：a,c"/>
        </el-form-item>
        <el-form-item label="等级" prop="difficultyLevel">
          <el-input-number v-model="form.difficultyLevel" controls-position="right" size="large" :min="1" :max="100"
                           style="width: 36vh"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading"
              :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55"/>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline label-width="120px" class="demo-table-expand">>
            <el-form-item label="分值：">
              <span>{{ props.row.score }}</span>
            </el-form-item>
            <el-form-item label="选项A：">
              <span>{{ props.row.optionA }}</span>
            </el-form-item>
            <el-form-item label="选项B：">
              <span>{{ props.row.optionB }}</span>
            </el-form-item>
            <el-form-item label="选项C：">
              <span>{{ props.row.optionC }}</span>
            </el-form-item>
            <el-form-item label="选项D：">
              <span>{{ props.row.optionD }}</span>
            </el-form-item>
            <el-form-item label="答案/答案选项：">
              <span>{{ props.row.answer }}</span>
            </el-form-item>
            <el-form-item label="创建日期：">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="eduLevel" label="学生类型"/>
      <el-table-column :show-overflow-tooltip="true" prop="gradeClass" label="班级"/>
      <el-table-column :show-overflow-tooltip="true" prop="questionTitle" label="题内容"/>
      <!--      <el-table-column :show-overflow-tooltip="true" prop="questionTitleFile" label="题文件"/>-->
      <el-table-column :show-overflow-tooltip="true" prop="questionType" label="题类型">
        <template slot-scope="scope">
          <span v-if="scope.row.questionType==='LISTEN'"
                @click="openVideo(scope.row.questionTitleFile)"
                style="text-decoration: underline;font-size: 14px;color: #1884FF">
            听力题
          </span>
          <span v-if="scope.row.questionType==='CHOOSE'"
                @click="openImg(scope.row.questionTitleFile)"
                style="text-decoration: underline;font-size: 14px;color: #1884FF">
            选择题
          </span>
          <span v-if="scope.row.questionType==='COMPLETION'"
                @click="openImg(scope.row.questionTitleFile)"
                style="text-decoration: underline;font-size: 14px;color: #1884FF">
            填空题
          </span>
          <span v-if="scope.row.questionType==='JUDGE'"
                @click="openImg(scope.row.questionTitleFile)"
                style="text-decoration: underline;font-size: 14px;color: #1884FF">
            判断题
          </span>
          <span v-if="scope.row.questionType==='COMPOSITION'"
                @click="openImg(scope.row.questionTitleFile)"
                style="text-decoration: underline;font-size: 14px;color: #1884FF">
            作文
          </span>
          <span v-if="scope.row.questionType==='COMPREHENSION'">阅读理解</span>
        </template>
      </el-table-column>
      <!--      <el-table-column :show-overflow-tooltip="true" prop="score" label="分值"/>-->
      <!--      <el-table-column :show-overflow-tooltip="true" prop="optionA" label="选项A"/>-->
      <!--      <el-table-column :show-overflow-tooltip="true" prop="optionB" label="选项B"/>-->
      <!--      <el-table-column :show-overflow-tooltip="true" prop="optionC" label="选项C"/>-->
      <!--      <el-table-column :show-overflow-tooltip="true" prop="optionD" label="选项D"/>-->
      <!--      <el-table-column :show-overflow-tooltip="true" prop="answer" label="答案/答案选项"/>-->
      <el-table-column :show-overflow-tooltip="true" prop="difficultyLevel" label="等级"/>
      <!--      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>-->
      <el-table-column
        v-if="checkPer(['admin','question:update','question:delete'])"
        label="操作"
        width="150"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="18">
              <udOperation :data="scope.row" :permission="permission"/>
            </el-col>
            <el-col :span="5">
              <el-button size="mini" type="primary" icon="el-icon-more" @click="getChildQuestionList(scope.row.id)" v-show="scope.row.questionType==='COMPREHENSION'"/>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>

    <!--视频图片展示-->
    <el-dialog :visible.sync="videoDialog" width="800px" :before-close="videoClose">
      <video
        ref="veo"
        :style="`object-fit: ${videoInfo.zoom};`"
        :src="videoInfo.videoUrl"
        :width="750"
        :height="450"
        :autoplay="videoInfo.autoplay"
        :controls="videoInfo.controls"
        :loop="videoInfo.loop"
        :muted="videoInfo.muted"
        :preload="videoInfo.preload"
        crossorigin="anonymous"
        @click.prevent.once="onPlay"
        v-bind="$attrs" v-show="showVideo">
      </video>
      <img :src="headImg" width="750" height="500" alt="" v-show="showImg">
    </el-dialog>

    <el-dialog append-to-body :visible.sync="childDialog" v-loading="loading" element-loading-text="文件上传中"
               :title="childTitle"
               width="520px">
      <el-form class="dialog-form" ref="form" :model="childForm" size="small" label-position="left" label-width="90px">
        <el-form-item label="题类型" prop="questionType">
          <el-select v-model="childForm.questionType" placeholder="请选择" @change="questionsChange(childForm.questionType)">
            <el-option
              v-for="item in childQuestionsTypeList"
              :key="item.type"
              :label="item.desc"
              :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学生类型" prop="eduLevel">
          <el-select v-model="childForm.eduLevel" placeholder="请选择">
            <el-option
              v-for="item in eduLevelList"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="gradeClass">
          <el-input v-model="childForm.gradeClass"/>
        </el-form-item>
        <el-form-item label="题内容" prop="questionTitle">
          <el-input v-model="childForm.questionTitle"/>
        </el-form-item>
        <el-form-item label="题内容文件" prop="questionTitleFile">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :limit="1"
            :on-exceed="handleExceed"
            :http-request="ossUpload">
            <a>请上传文件</a>
          </el-upload>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input-number v-model="childForm.score" controls-position="right" size="large" :min="1" :max="100"
                           style="width: 36vh"/>
        </el-form-item>
        <el-form-item label="选项A" prop="optionA" v-show="optionShow">
          <el-input v-model="childForm.optionA"/>
        </el-form-item>
        <el-form-item label="选项B" prop="optionB" v-show="optionShow">
          <el-input v-model="childForm.optionB"/>
        </el-form-item>
        <el-form-item label="选项C" prop="optionC" v-show="optionShow">
          <el-input v-model="childForm.optionC"/>
        </el-form-item>
        <el-form-item label="选项D" prop="optionD" v-show="optionShow">
          <el-input v-model="childForm.optionD"/>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="childForm.answer" placeholder="多选题时答案以,拼接。示例：a,c"/>
        </el-form-item>
        <el-form-item label="等级" prop="difficultyLevel">
          <el-input-number v-model="childForm.difficultyLevel" controls-position="right" size="large" :min="1"
                           :max="100" style="width: 36vh"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="outerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitChild">确认</el-button>
      </div>
    </el-dialog>

    <!--子题库列表-->
    <el-dialog append-to-body :visible.sync="childDialogTable" v-loading="childTableLoading" title="子题库列表"
               width="1000px">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="addChildQuestion()">新增子题库
      </el-button>
      <el-table ref="table" :data="childQuestionList" style="width: 100%; height: 450px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline label-width="120px" class="demo-table-expand">>
              <el-form-item label="分值：">
                <span>{{ props.row.score }}</span>
              </el-form-item>
              <el-form-item label="选项A：">
                <span>{{ props.row.optionA }}</span>
              </el-form-item>
              <el-form-item label="选项B：">
                <span>{{ props.row.optionB }}</span>
              </el-form-item>
              <el-form-item label="选项C：">
                <span>{{ props.row.optionC }}</span>
              </el-form-item>
              <el-form-item label="选项D：">
                <span>{{ props.row.optionD }}</span>
              </el-form-item>
              <el-form-item label="答案/答案选项：">
                <span>{{ props.row.answer }}</span>
              </el-form-item>
              <el-form-item label="创建日期：">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="eduLevel" label="学生类型"/>
        <el-table-column :show-overflow-tooltip="true" prop="gradeClass" label="班级"/>
        <el-table-column :show-overflow-tooltip="true" prop="questionTitle" label="题内容"/>
        <el-table-column :show-overflow-tooltip="true" prop="questionTitleFile" label="题文件"/>
        <el-table-column :show-overflow-tooltip="true" prop="questionType" label="题类型">
          <template slot-scope="scope">
            <span v-if="scope.row.questionType==='CHOOSE'"
                  @click="openImg(scope.row.questionTitleFile)"
                  style="text-decoration: underline;font-size: 14px;color: #1884FF">
            选择题
          </span>
            <span v-if="scope.row.questionType==='COMPLETION'"
                  @click="openImg(scope.row.questionTitleFile)"
                  style="text-decoration: underline;font-size: 14px;color: #1884FF">
            填空题
          </span>
            <span v-if="scope.row.questionType==='JUDGE'"
                  @click="openImg(scope.row.questionTitleFile)"
                  style="text-decoration: underline;font-size: 14px;color: #1884FF">
            判断题
          </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="difficultyLevel" label="等级"/>
        <el-table-column
          v-if="checkPer(['admin','question:update','question:delete'])"
          label="操作"
          width="125"
          align="center"
          fixed="right">
          <template slot-scope="scope">
            <el-button v-permission="permission.edit" type="primary" icon="el-icon-edit"
                       @click="editChildQuestion(scope.row)"/>
            <el-button v-permission="permission.del" type="danger" icon="el-icon-delete"
                       @click="toDeleteChild(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


  </div>
</template>

<script>
import crudQuestions from '@/api/trainSchool/questions'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import {mapGetters} from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {ossPut} from "@/utils/upload"

const defaultForm = {
  id: null,
  pid: 0,
  eduLevel: '小学',
  gradeClass: null,
  questionType: 'LISTEN',
  questionTitle: null,
  questionTitleFile: '',
  score: null,
  difficultyLevel: null,
  optionA: null,
  optionB: null,
  optionC: null,
  optionD: null,
  answer: null
}
export default {
  name: 'questions',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({
      title: '题库',
      url: '/api/questions/bank',
      // query: {phraseType: 'WORD'},
      crudMethod: {...crudQuestions}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  inject: ['reload'],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'question:add'],
        edit: ['admin', 'question:update'],
        del: ['admin', 'question:delete']
      },
      eduLevelList: [
        "小学",
        "初中",
        "高中"
      ],
      optionShowList: [
        "CHOOSE",
        "JUDGE",
        "LISTEN"
      ],
      questionsTypeList: [
        {
          type: 'LISTEN',
          desc: '听力题'
        },
        {
          type: 'CHOOSE',
          desc: '选择题'
        },
        {
          type: 'COMPLETION',
          desc: '填空题'
        },
        {
          type: 'JUDGE',
          desc: '判断题'
        }, {
          type: 'COMPOSITION',
          desc: '作文'
        },
        {
          type: 'COMPREHENSION',
          desc: '阅读理解'
        },
      ],
      childQuestionsTypeList: [
        {
          type: 'CHOOSE',
          desc: '选择题'
        },
        {
          type: 'COMPLETION',
          desc: '填空题'
        },
        {
          type: 'JUDGE',
          desc: '判断题'
        }
      ],
      optionShow: true,
      questionTitleFileVal: null,
      loading: false,
      childDialog: false,
      childDialogTable: false,
      childTableLoading: false,
      childQuestionList: [],
      pid: 0,
      operate: '',
      childTitle: '',
      childForm: {
        id: null,
        pid: 0,
        eduLevel: '小学',
        gradeClass: null,
        questionType: 'CHOOSE',
        questionTitle: null,
        questionTitleFile: '',
        score: null,
        difficultyLevel: null,
        optionA: null,
        optionB: null,
        optionC: null,
        optionD: null,
        answer: null
      },
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
      },
      showImg: false,
      showVideo: false,
      headImg: ''
    }
  },
  mounted: function () {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  created() {
    this.crud.optShow = {
      add: true,
      edit: true,
      del: true,
      download: false
    }
  },
  methods: {
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    questionsChange(val) {
      if (this.optionShowList.includes(val)) {
        this.optionShow = true
      } else {
        this.optionShow = false
      }
    },
    [CRUD.HOOK.beforeSubmit]() {
      if (this.questionTitleFileVal !== null) {
        this.form.questionTitleFile = this.questionTitleFileVal
      }
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      if (this.optionShowList.includes(form.questionType)) {
        this.optionShow = true
      } else {
        this.optionShow = false
      }
    },
    [CRUD.HOOK.afterAddCancel]() {
      this.reload();
    },
    [CRUD.HOOK.afterEditCancel]() {
      this.reload();
    },
    ossUpload(file) {
      this.loading = true
      ossPut(file, "question").then(res => {
        if (res !== null) {
          this.loading = false
          this.questionTitleFileVal = res.val
        }
      })
    },
    getChildQuestionList(pid) {
      this.childDialogTable = true
      this.childTableLoading = true
      this.pid = pid
      crudQuestions.getSubQuestion(this.pid).then(res => {
        this.childQuestionList = res.content
        this.childTableLoading = false
      })
    },
    addChildQuestion() {
      this.childForm = {
        id: null,
        pid: 0,
        eduLevel: '小学',
        gradeClass: null,
        questionType: 'CHOOSE',
        questionTitle: null,
        questionTitleFile: '',
        score: null,
        difficultyLevel: null,
        optionA: null,
        optionB: null,
        optionC: null,
        optionD: null,
        answer: null
      }
      this.questionTitleFileVal = null
      this.childDialog = true
      this.operate = 'add'
      this.childTitle = '新增子题库'
    },
    editChildQuestion(data) {
      this.childForm = {
        id: null,
        pid: 0,
        eduLevel: '小学',
        gradeClass: null,
        questionType: 'CHOOSE',
        questionTitle: null,
        questionTitleFile: '',
        score: null,
        difficultyLevel: null,
        optionA: null,
        optionB: null,
        optionC: null,
        optionD: null,
        answer: null
      }
      this.questionTitleFileVal = null
      this.childDialog = true
      this.childForm = data
      this.operate = 'edit'
      this.childTitle = '编辑子题库'
    },
    submitChild() {
      if (this.questionTitleFileVal !== null) {
        this.childForm.questionTitleFile = this.questionTitleFileVal
      }
      this.childForm.pid = this.pid
      if (this.operate === 'add') {
        crudQuestions.add(this.childForm).then(res => {
          if (res.code === '0000') {
            this.$notify({
              title: '新增子题库成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$notify({
              title: '新增子题库失败',
              type: 'error',
              duration: 1500
            })
          }
          this.childDialog = false
          this.getChildQuestionList(this.pid)
          this.operate = ''
          this.$refs.upload.clearFiles(); // 清除文件列表的显示
        })
      } else if (this.operate === 'edit') {
        crudQuestions.edit(this.childForm).then(res => {
          if (res.code === '0000') {
            this.$notify({
              title: '编辑子题库成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$notify({
              title: '编辑子题库失败',
              type: 'error',
              duration: 1500
            })
          }
          this.childDialog = false
          this.getChildQuestionList(this.pid)
          this.operate = ''
          this.$refs.upload.clearFiles(); // 清除文件列表的显示
        })
      }

    },
    toDeleteChild(row) {
      this.$confirm(`确认移除${row.questionTitle}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        ids.push(row.id)
        crudQuestions.del(ids).then(res => {
          if (res.code === '0000') {
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$notify({
              title: '删除失败',
              type: 'error',
              duration: 1500
            })
          }
          this.getChildQuestionList(this.pid)
        })
      }).catch(() => {
      })
    },
    openImg(imgUrl) {
      this.videoDialog = true
      this.showImg = true
      this.showVideo = false
      this.headImg = imgUrl
    },
    openVideo(videoUrl) {
      this.videoDialog = true
      this.showVideo = true
      this.videoInfo.videoUrl = videoUrl
    },
    onPlay() {
      if (this.videoInfo.autoplay) {
        this.$refs.veo.pause()
      } else {
        this.$refs.veo.play()
      }
    },
    videoClose() {
      if (this.showVideo) {
        this.$refs.veo.currentTime = 0
        this.$refs.veo.pause()
      }
      this.showImg = false
      this.showVideo = false
      this.videoDialog = false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-input-number .el-input__inner {
  text-align: left;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #909399;
  font-size: 12px;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  padding-left: 15vh;
  width: 50%;
}

.dialog-form {
  margin: 0 2vh;

  .el-input-number {
    width: 36vh
  }

  .el-input {
    width: 36vh
  }

  .el-select {
    width: 36vh
  }

  a {
    text-decoration: underline; /* 添加下划线 */
    font-size: 14px;
    color: #8A9495;
    letter-spacing: 0;
    font-weight: 400;
  }

  .input-textarea {
    background: #F2F2F2;
    border-radius: 4px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
