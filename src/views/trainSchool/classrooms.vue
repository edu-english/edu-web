<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <crudOperation :permission="permission"/>
    </div>
    <!--设备-->
    <el-dialog
      :visible.sync="dialogDevice"
      width="70%"
      :before-close="handleClose">
      <div class="title-div">{{ classroomName }}</div>
      <div>
        <el-form :inline="true" :model="initStudent">
          <el-row :gutter="23" type="flex" justify="center" class="student-div">
            <el-col :xs="24" :sm="24" :lg="3">
              <!--              <el-form-item>-->
              <img :src="stuHeadImg" height="80" alt="">
              <!--              </el-form-item>-->
            </el-col>
            <el-col :xs="24" :sm="24" :lg="3">
              <!--              <el-form-item class="stu-form-item">-->
              <span>{{ studentName }}</span>
              <!--              </el-form-item>-->
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6">
              <!--              <el-form-item label="模式" class="stu-form-item">-->
              <span style="font-size: 14px;">模式：</span>
              <el-radio v-model="initStudent.studyType" label="TRAINING">学习培训</el-radio>
              <el-radio v-model="initStudent.studyType" label="EXAMINATION" v-show="showExamination">考试</el-radio>
              <!--              </el-form-item>-->
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6">
              <!--              <el-form-item label="座位号" style="width: 266px" class="stu-form-item">-->
              <span style="font-size: 14px;">座位号：</span>
              <el-select v-model="initStudent.classroomDeviceId" placeholder="请选择">
                <el-option
                  v-for="item in deviceInfoList"
                  :key="item.classroomDeviceId"
                  :label="item.classroomDeviceName"
                  :value="item.classroomDeviceId"/>
              </el-select>
              <!--              </el-form-item>-->
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6">
              <!--              <el-form-item class="stu-form-item">-->
              <el-button type="primary" @click="stuDistribute">上机</el-button>
              <el-button type="primary" @click="getFaceInfo">获取未上机学生</el-button>
              <!--              </el-form-item>-->
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="device-div">
        <div class="title-div">iPad设备</div>
        <el-row :gutter="23">
          <el-col :xs="8" :sm="8" :lg="5" v-for="deviceInfo in deviceInfoList" class="device-list-col">
            <div style="display: inline; width: 45%;">
              <span>
              <el-avatar size="small" :src="stuImg" v-if="deviceInfo.classroomStudentOnline===1"></el-avatar>
              <el-avatar size="small" icon="el-icon-user-solid" v-else></el-avatar>
            </span>
              <span style="color: #2fe90e;" v-if="deviceInfo.classroomDeviceStatus===1">{{
                  deviceInfo.classroomDeviceName
                }}
            </span>
              <span style="color: #8A9495;" v-else>{{ deviceInfo.classroomDeviceName }}</span>
            </div>
            <el-button size="mini" @click="delClassroomDevice(deviceInfo.id)">删除</el-button>
            <el-button size="mini" @click="stuLogoutDistribute(deviceInfo.classroomDeviceId)">下机</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form class="dialog-form" ref="form" :model="form" size="small" label-position="left" label-width="90px">
        <el-form-item label="教室名称" prop="classroomName">
          <el-input v-model="form.classroomName"/>
        </el-form-item>
        <el-form-item label="教室类型" prop="classroomType">
          <el-select v-model="form.classroomType" placeholder="请选择">
            <el-option
              v-for="item in classroomTypeList"
              :key="item.type"
              :label="item.desc"
              :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="扫脸设备ID" prop="classroomFaceId">
          <el-input v-model="form.classroomFaceId"/>
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
      <el-table-column :show-overflow-tooltip="true" prop="classroomName" label="教室名称">
        <template slot-scope="scope">
          <a style="color: #1884FF; font-size: 14px"
             @click="deviceOpenPage(scope.row)">
            {{
              scope.row.classroomName
            }}
          </a>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="classroomType" label="教室类型"/>
      <el-table-column :show-overflow-tooltip="true" prop="classroomFaceId" label="教室扫脸设备ID"/>
      <el-table-column :show-overflow-tooltip="true" prop="classroomStatus" label="教室状态">
        <template slot-scope="scope">
          <span v-if="scope.row.classroomStatus===0">
            <i class="dotClass" style="background-color: #737c77;"/>
            下线
            </span>
          <span v-if="scope.row.classroomStatus===1">
            <i class="dotClass" style="background-color: #0aef15;"></i>
            上线
            </span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>
      <el-table-column
        v-if="checkPer(['admin','classroom:delete'])"
        label="操作"
        width="160"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <el-row :gutter="23">
            <el-col :span="8">
              <udOperation :data="scope.row" :permission="permission"/>
            </el-col>
            <el-col :span="8">
              <el-button size="mini" type="primary" @click="classroomSyncStu(scope.row.id)">同步学生信息</el-button>
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
import crudClassrooms, {getClassRoomStu} from '@/api/trainSchool/classrooms'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import StuImg from '@/assets/images/stuImg.jpeg'
import noImg from '@/assets/images/noData.webp'

const defaultForm = {
  id: null,
  classroomName: null,
  classroomType: 'LISTEN',
  classroomFaceId: null,
  classroomStatus: 0
}
export default {
  name: 'classrooms',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({
      title: '教室',
      url: '/api/classrooms',
      // query: {phraseType: 'WORD'},
      crudMethod: {...crudClassrooms}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  inject: ['reload'],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'classroom:add'],
        del: ['admin', 'classroom:delete']
      },
      classroomTypeList: [
        {type: 'LISTEN', desc: '听力教室'},
        {type: 'LISTEN_SPEAK', desc: '听说教室'}
      ],
      stuImg: StuImg,
      dialogDevice: false,
      deviceInfoList: [],
      initStudent: {
        studyType: "TRAINING",
        classroomFaceId: null,
        classroomDeviceId: null,
        studentId: null,
      },
      classroomName: null,
      classroomId: null,
      stuHeadImg: noImg,
      studentName: '陌生人',
      showExamination: false,
    }
  },
  created() {
    this.crud.optShow = {
      add: true,
      edit: false,
      del: true,
      download: false
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
    deviceOpenPage(data) {
      if (data.classroomType === 'LISTEN_SPEAK') {
        this.showExamination = true
      }
      this.classroomName = data.classroomName
      this.classroomId = data.id
      this.initStudent.classroomFaceId = data.classroomFaceId
      this.getFaceInfo();
      this.getClassroomDevice()
      this.dialogDevice = true
    },
    getClassroomDevice() {
      crudClassrooms.getClassroomDevice(this.classroomId).then(res => {
        if (res.content !== null) {
          this.deviceInfoList = res.content
        } else {
          this.$notify({
            title: '获取设备信息失败',
            type: 'error',
            duration: 1500
          })
        }
      })
    },
    delClassroomDevice(deviceId) {
      const id = []
      id.push(deviceId)
      crudClassrooms.delClassroomDevice(id).then(res => {
        if (res.code === '0000') {
          this.$notify({
            title: '删除设备成功',
            type: 'success',
            duration: 1500
          })
          this.getClassroomDevice()
        } else {
          this.$notify({
            title: '删除设备失败',
            type: 'error',
            duration: 1500
          })
        }
      })
    },
    getFaceInfo() {
      crudClassrooms.getClassRoomStu(this.classroomId).then(res => {
        if (res.content !== null && res.content.length !== 0) {
          const stuInfo = res.content[0]
          this.studentName = stuInfo.studentName
          this.stuHeadImg = stuInfo.studentImage
          this.initStudent.studentId = stuInfo.studentId
        } else {
          this.$notify({
            title: '没有获取未上机学生，请稍后再试',
            type: 'warning',
            duration: 1500
          })
        }
      })
    },
    stuDistribute() {
      crudClassrooms.stuDistribute(this.initStudent).then(res => {
        if (res.code === '0000') {
          this.getClassroomDevice();
        } else {
          this.$notify({
            title: '分配设备失败',
            type: 'warning',
            duration: 1500
          })
        }
      })
    },
    stuLogoutDistribute(classroomDeviceId) {
      const logoutData = {
        "classroomDeviceId": classroomDeviceId
      }
      crudClassrooms.stuLogoutDistribute(logoutData).then(res=>{
        if (res.code === '0000') {
          this.getClassroomDevice();
        } else {
          this.$notify({
            title: '下机失败',
            type: 'warning',
            duration: 1500
          })
        }
      })
    },
    classroomSyncStu(id) {
      crud.loading = true
      const ids = []
      ids.push(id)
      crudClassrooms.classroomSyncStu(ids).then(res => {
        if (res.code === '0000') {
          this.$notify({
            title: '同步成功',
            type: 'success',
            duration: 1500
          })
        } else {
          this.$notify({
            title: '同步失败',
            type: 'error',
            duration: 1500
          })
        }
        crud.loading = false
      })
    },
    handleClose() {
      this.dialogDevice = false
      this.reload()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dotClass {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 10px; //这个用于圆点居中
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


.student-div {
  background: #ECECEC;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0;
  font-weight: 400;

  .el-col {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    padding: 5px 0;
  }
}

.title-div {
  font-size: 18px;
  color: #000000;
  letter-spacing: 0;
  font-weight: 600;
  margin-bottom: 30px;
}

.device-div {
  margin-top: 30px;

  .device-list-col {
    height: 80px;
    background: #ECECEC;
    font-size: 16px;
    letter-spacing: 0;
    font-weight: 400;
    margin: 0 20px 20px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
