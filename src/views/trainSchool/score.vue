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
      <crudOperation :permission="permission"/>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
      <el-form ref="form" :model="form" size="small" label-width="100px" class="score-form">
        <el-form-item label="学生类型" prop="eduLevel">
          <el-select v-model="form.eduLevel" placeholder="请选择" class="form-put">
            <el-option
              v-for="item in eduLevelList"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="gradeClass">
          <el-input v-model="form.gradeClass" class="form-put"/>
        </el-form-item>
        <el-form-item label="是否参加培训" prop="joinTrain">
          <el-select v-model="form.joinTrain" placeholder="请选择" class="form-put">
            <el-option
              v-for="item in joinTrainList"
              :key="item.type"
              :label="item.desc"
              :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷名称" prop="testName">
          <el-select v-model="form.testName" filterable allow-create placeholder="请选择" class="form-put">
            <el-option
              v-for="item in testNameList"
              :key="item.testName"
              :label="item.testName"
              :value="item.testName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学生名称" prop="studentId">
          <el-select v-model="form.studentId" filterable allow-create placeholder="请选择" @input="studentChange" class="form-put">
            <el-option
              v-for="item in studentInfoList"
              :key="item.id"
              :label="item.studentName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学校类型" prop="school">
          <el-select v-model="form.school" placeholder="请选择" class="form-put">
            <el-option
              v-for="item in schoolList"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input-number v-model.number="form.score" controls-position="right" size="large" :min="1" :max="100" class="form-put"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55"/>
      <el-table-column :show-overflow-tooltip="true" prop="eduLevel" label="学生类型"/>
      <el-table-column :show-overflow-tooltip="true" prop="studentName" label="学生名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="gradeClass" label="班级"/>
      <el-table-column :show-overflow-tooltip="true" prop="joinTrain" label="是否参加培训">
        <template slot-scope="scope">
          <span v-if="scope.row.joinTrain===0">
            未参加
            </span>
          <span v-if="scope.row.joinTrain===1">
            参加
            </span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="testName" label="试卷名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="score" label="成绩"/>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>
      <el-table-column
        v-if="checkPer(['admin','recordScore:delete'])"
        label="操作"
        width="160"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission"/>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import crudScore from '@/api/trainSchool/score'
import CRUD, {presenter, header, crud, form} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const defaultForm = {
  id: null,
  eduLevel: null,
  gradeClass: null,
  joinTrain: null,
  testName: null,
  score: null,
  studentId: null,
  studentName: null,
  school: null
}

export default {
  name: 'score',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({
      title: '手动录入成绩',
      url: 'api/student/scoreList',
      crudMethod: {...crudScore}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  inject: ['reload'],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'recordScore:add'],
        edit: ['admin', 'recordScore:edit'],
        del: ['admin', 'recordScore:del'],
      },
      eduLevelList: [
        "小学",
        "初中",
        "高中"
      ],
      schoolList: [
        "校内",
        "校外",
      ],
      joinTrainList: [
        {type: 0, desc: '未参加'},
        {type: 1, desc: '参加'},
      ],
      testNameList: [],
      studentInfoList: [],
      selectedStuInfo: null
    }
  },
  created() {
    this.crud.optShow = {
      add: true,
      edit: false,
      del: true,
      download: false,
      reset:true
    }
  },
  mounted: function () {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.testNameList = []
      crudScore.getTestNameList().then(res => {
        this.testNameList = res.content
      })
      crudScore.getStudentInfoList('').then(res => {
        this.studentInfoList = res.content
      })
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.studentId = this.selectedStuInfo.id
      this.form.studentName = this.selectedStuInfo.studentName
    },
    studentChange(studentId) {
      this.selectedStuInfo={}
      for (let i = 0; i < this.studentInfoList.length; i++) {
        const stuInfo = this.studentInfoList[i]
        if (stuInfo.studentName === studentId || stuInfo.id===studentId) {
          this.selectedStuInfo = stuInfo
        }
      }
      if (JSON.stringify(this.selectedStuInfo)==='{}') {
        console.log("=====")
        this.selectedStuInfo = {
          id: 0,
          studentName: studentId
        }
      }
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.score-form {
  .form-put {
    width: 80%;
  }

  .form-put input {
    text-align: left;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
