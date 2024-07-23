<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <crudOperation :permission="permission"/>
    </div>
    <!--设备-->
    <el-dialog
      :visible.sync="dialogDevice"
      width="350px"
      :before-close="handleClose">
      <div class="title-div">{{ classroomName }}</div>
      <div class="device-div">
        <div style="margin-left: 230px">
          <el-button size="mini" type="primary" @click="stusLogoutDistribute()">一键下机</el-button>
        </div>
        <el-table ref="table" :data="deviceInfoList" style="width: 100%;">
          <el-table-column :show-overflow-tooltip="true" prop="classroomName" label="头像" width="70">
            <template slot-scope="scope">
              <el-avatar size="small" :src="scope.row.onlineStudentImage" v-if="scope.row.classroomStudentOnline===1"></el-avatar>
              <el-avatar size="small" icon="el-icon-user-solid" v-else></el-avatar>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="onlineStudentName" label="姓名" width="70"/>
          <el-table-column :show-overflow-tooltip="true" prop="classroomDeviceName" label="设备序号-类型" width="100">
            <template slot-scope="scope">
              <span style="color: #2fe90e;" v-if="scope.row.classroomDeviceStatus===1">{{scope.row.classroomDeviceName }}</span>
              <span style="color: #8A9495;" v-else>{{ scope.row.classroomDeviceName }}</span>
              <span>
                —{{scope.row.classroomDeviceTypeName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="65"
            align="center"
            fixed="right">
            <template slot-scope="scope">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-button size="mini" @click="stuLogoutDistribute(scope.row.classroomDeviceId)">下机</el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
<!--      <el-table-column type="selection" width="55"/>-->
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
      <el-table-column :show-overflow-tooltip="true" prop="classroomFaceId" label="扫脸设备ID"/>
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
<!--      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>-->
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import crudClassrooms from '@/api/trainSchool/classrooms'
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
  // classroomType: 'LISTEN',
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
      stuImg: StuImg,
      dialogDevice: false,
      deviceInfoList: [],
      classroomName: null,
      classroomId: null,
      stuHeadImg: noImg,
      studentName: '陌生人'
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
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
    deviceOpenPage(data) {
      this.classroomName = data.classroomName
      this.classroomId = data.id
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
    stuLogoutDistribute(classroomDeviceId) {
      const logoutData = {
        "classroomDeviceId": classroomDeviceId
      }
      crudClassrooms.stuLogoutDistribute(logoutData).then(res=>{
        if (res.code === '0000') {
          this.$notify({
            title: '下机成功',
            type: 'success',
            duration: 1500
          })
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
    stusLogoutDistribute(){
      this.$confirm(`确认下机当前教室的所有设备？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const logoutData = {
          "id": this.classroomId
        }
        crudClassrooms.stusLogoutDistribute(logoutData).then(res=>{
          if (res.code === '0000') {
            this.$notify({
              title: '下机成功',
              type: 'success',
              duration: 1500
            })
            this.getClassroomDevice();
          } else {
            this.$notify({
              title: '下机失败',
              type: 'warning',
              duration: 1500
            })
          }
        })
      }).catch(() => {
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

  .form-put {
    width: 400px;
  }

  .form-put input {
    text-align: left;
  }

  a {
    text-decoration: underline; /* 添加下划线 */
    font-size: 14px;
    color: #8A9495;
    letter-spacing: 0;
    font-weight: 400;
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
    margin: 0 0 20px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .col-div{
      display: inline;
      width: 80%;

    }

  }

}


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
