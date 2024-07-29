<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.account"
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
        <el-button
          slot="right"
          v-permission="['admin','student:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="toAddFaceStudent">新增学生
        </el-button>
      </crudOperation>
    </div>
    <!--新增学生表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="addStudentDialog"
               title="学生信息" width="600px" @close="closeForm">
      <el-form ref="form" class="dialog-form" :model="initStudent" :rules="rules" size="small" label-position="left"
               label-width="100px">
        <el-form-item label="学生头像" v-show="stuImg">
          <img :src="initStudent.headImg" width="100" height="100" alt="学生头像">
        </el-form-item>
        <el-form-item label="学生账号" prop="account">
          <el-input v-model="initStudent.account" class="form-put"/>
        </el-form-item>
        <el-form-item label="姓名" prop="studentName">
          <el-input v-model="initStudent.studentName" class="form-put"/>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="initStudent.grade" placeholder="请选择" class="form-put">
            <el-option
              v-for="item in eduLevelList"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="gradeClass">
          <el-input v-model="initStudent.gradeClass" class="form-put"/>
        </el-form-item>
        <el-form-item label="父母姓名" prop="parentName">
          <el-input v-model="initStudent.parentName" class="form-put"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="initStudent.phone" class="form-put"/>
        </el-form-item>
        <el-form-item label="英语等级" prop="englishLevel">
          <el-input-number v-model="initStudent.englishLevel" controls-position="right" size="large" :min="1"
                           :max="10" class="form-put"/>
        </el-form-item>
        <el-form-item label="剩余学习次数" prop="studyCount">
          <el-input-number v-model="initStudent.studyCount" controls-position="right" size="large" :min="0"
                           class="form-put"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeForm">取消</el-button>
        <el-button type="primary" @click="operateStudent" :disabled="initStudent.headImg===null">确认</el-button>
      </div>
    </el-dialog>

    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55"/>
      <el-table-column :show-overflow-tooltip="true" prop="studentName" label="姓名"/>
      <el-table-column :show-overflow-tooltip="true" prop="account" label="学生账号"/>
      <el-table-column :show-overflow-tooltip="true" prop="grade" label="年级"/>
      <el-table-column :show-overflow-tooltip="true" prop="gradeClass" label="班级"/>
      <el-table-column :show-overflow-tooltip="true" prop="parentName" label="父母姓名"/>
      <el-table-column :show-overflow-tooltip="true" prop="phone" label="手机号"/>
      <el-table-column :show-overflow-tooltip="true" prop="englishLevel" label="英语等级"/>
      <el-table-column :show-overflow-tooltip="true" prop="studyCount" label="剩余学习次数"/>
      <el-table-column :show-overflow-tooltip="true" prop="signTime" label="报名时间"/>
      <el-table-column :show-overflow-tooltip="true" prop="studySchedule" label="学习进度">
        <template slot-scope="scope">
          <router-link :to="'/learning/student/studySchedule/' + scope.row.id">
            <span style="color: #1884FF; font-size: 14px">{{ scope.row.studySchedule }}</span>
          </router-link>
        </template>
      </el-table-column>
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
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>
      <el-table-column
        v-if="checkPer(['admin','student:update','student:delete'])"
        label="操作"
        width="115"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="15">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="toEdit(scope.row)"/>
            </el-col>
            <el-col :span="8">
              <udOperation :data="scope.row" :permission="permission"/>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import crudStudent from '@/api/trainSchool/student'
import CRUD, {presenter, header, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {isvalidPhone} from "@/utils/validate";


export default {
  name: 'student',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({
      title: '学生',
      url: 'api/student',
      crudMethod: {...crudStudent}
    })
  },
  mixins: [presenter(), header(), crud()],
  inject: ['reload'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'student:add'],
        edit: ['admin', 'student:update'],
        del: ['admin', 'student:delete']
      },
      rules: {
        phone: [
          {required: true, trigger: 'blur', validator: validPhone}
        ],
        account:[
          {required: true, trigger: 'blur', message: '账号不能为空'}
        ],
        studentName:[
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        grade:[
          { required: true, message: '请输入学生年级', trigger: 'blur' }
        ]
      },
      eduLevelList: [
        "小学",
        "初中",
        "高中"
      ],
      initStudent: {
        id: null,
        customerId: null,
        account: null,
        headImg: null,
        studentName: null,
        joinTrain: null,
        grade: null,
        gradeClass: null,
        parentName: null,
        phone: null,
        englishLevel: null,
        signTime: null,
        studySchedule: null,
        studyCount: 0
      },
      intervalId: null,
      addStudentDialog: false,
      studyScheduleDialog: false,
      initStudySchedule: {},
      operate: '',
      stuImg: false,
      studyScheduleShow: false
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: true,
      download: false,
      reset: true
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
    toAddFaceStudent() {
      this.addStudentDialog = true
      this.operate = 'add'
      this.stuImg = true
      this.intervalId = setInterval(this.fetchData, 1000);
    },
    async fetchData() {
      try {
        // 假设 fetchUserData 是获取用户数据的异步函数
        const userData = await crudStudent.getFaceInfo().then(res => {
          const resData = res.content
          if (resData !== null) {
            this.initStudent.customerId = resData.customId
            this.initStudent.headImg = resData.info.picURI
            return this.initStudent
          }
        });
        this.initStudent = {
          ...this.formData,
          ...userData
        };
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
    toEdit(data) {
      this.initStudent = data
      this.addStudentDialog = true
      this.operate = 'edit'
      this.stuImg = false
    },
    operateStudent() {
      this.initStudent.headImg = null
      if (this.operate === 'add') {
        crudStudent.add(this.initStudent).then(res => {
          if (res.code === '0000') {
            this.$notify({
              title: '新增学生信息成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$notify({
              title: res.message,
              type: 'error',
              duration: 1500
            })
          }
          this.reload()
          clearInterval(this.intervalId); // 清除定时器
        })
      } else if (this.operate === 'edit') {
        crudStudent.edit(this.initStudent).then(res => {
          if (res.code === '0000') {
            this.$notify({
              title: '编辑学生信息成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$notify({
              title: res.message,
              type: 'error',
              duration: 1500
            })
          }
          this.reload()
          clearInterval(this.intervalId); // 清除定时器
        })
      }
    },
    closeForm() {
      clearInterval(this.intervalId); // 清除定时器
      this.addStudentDialog = false
      if (this.operate === 'add') {
        this.$refs.form.resetFields()
      } else {
        this.initStudent = {
          id: null,
          customerId: null,
          account: null,
          headImg: null,
          studentName: null,
          joinTrain: null,
          grade: null,
          gradeClass: null,
          parentName: null,
          phone: null,
          englishLevel: null,
          signTime: null,
          studySchedule: null,
        }
      }
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dialog-form {
  .form-put input {
    text-align: left;
  }

  .form-put {
    width: 400px;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
