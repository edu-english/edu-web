<template>
  <div class="app-container">
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input
            v-model="query.blurry"
            clearable
            size="small"
            placeholder="输入名称或者邮箱搜索"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <date-range-picker v-model="query.createTime" class="date-item" />
          <el-select
            v-model="query.enabled"
            clearable
            size="small"
            placeholder="状态"
            class="filter-item"
            style="width: 90px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in enabledTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <rrOperation />
        </div>
        <crudOperation show="" :permission="permission">
          <el-button
            slot="right"
            v-permission="['admin','user:add']"
            :disabled="crud.selections.length === 0"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-refresh-left"
            @click="resetPwd(crud.selections)"
          >重置密码
          </el-button>
        </crudOperation>
      </div>
      <!--表单渲染-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
<!--          <el-form-item label="用户名" prop="username">-->
<!--            <el-input v-model="form.username" @keydown.native="keydown($event)" />-->
<!--          </el-form-item>-->
          <el-form-item label="电话" prop="phone">
            <el-input v-model.number="form.phone" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="form.nickName" @keydown.native="keydown($event)" />
          </el-form-item>
<!--          <el-form-item label="邮箱" prop="email">-->
<!--            <el-input v-model="form.email" />-->
<!--          </el-form-item>-->
          <el-form-item label="性别">
            <el-radio-group v-model="form.gender" style="width: 178px">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.enabled" :disabled="form.id === user.userId">
              <el-radio
                v-for="item in userStatus"
                :key="item.id"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
            <el-select
              v-model="roleDatas"
              style="width: 437px"
              multiple
              placeholder="请选择"
              @remove-tag="deleteTag"
              @change="changeRole"
            >
              <el-option
                v-for="item in roles"
                :key="item.name"
                :disabled="level !== 1 && item.level <= level"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column :selectable="checkboxT" type="selection" width="55" />
<!--        <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />-->
        <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column :show-overflow-tooltip="true" prop="phone" label="电话" />
<!--        <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" />-->
        <el-table-column :show-overflow-tooltip="true" label="角色">
          <template slot-scope="scope">
            <span v-for="(val,index) in scope.row.roles" :key="index">
              {{val.name+' '}}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" prop="enabled">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" />
        <el-table-column
          v-if="checkPer(['admin','user:edit','user:del'])"
          label="操作"
          width="115"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
  </div>
</template>

<script>
import crudUser from '@/api/system/user'
import { isvalidPhone } from '@/utils/validate'
import { getAll, getLevel } from '@/api/system/role'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
let userRoles = []
const defaultForm = { id: null, username: null, nickName: null, gender: '男', email: '11@11.com', enabled: 'true', roles: [], phone: null }
export default {
  name: 'User',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({ title: '用户', url: 'api/users', crudMethod: { ...crudUser }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
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
      level: 3,
      roles: [],
      roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      userStatus:[
        { id:1, value: 'true', label: '激活' },
        { id:2, value: 'false', label: '锁定' }
      ],
      userStatusLabel:{
        "true": "激活",
        "false": "禁用"
      },
      rules: {
        // username: [
        //   { required: true, message: '请输入用户名', trigger: 'blur' },
        //   { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        // ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        // email: [
        //   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        //   { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        // ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：123456'
  },
  mounted: function() {
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
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles()
      this.getRoleLevel()
      form.enabled = form.enabled.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.roleDatas = []
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.roleDatas = []
      userRoles = []
      const _this = this
      form.roles.forEach(function(role, index) {
        _this.roleDatas.push(role.id)
        const rol = { id: role.id }
        userRoles.push(rol)
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
        if (this.roleDatas.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.roles = userRoles
      crud.form.username = crud.form.phone
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.userStatusLabel[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.crud.notify(this.userStatusLabel[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll().then(res => {
        // console.log("roles==="+JSON.stringify(res))
        this.roles = res.content
      }).catch(error => {
        reject(error)
      })
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => { })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.userId
    },
    resetPwd(datas) {
      this.$confirm(`你选中了 ${datas.length} 位用户，确认重置用户的密码吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        datas.forEach(val => {
          ids.push(val.id)
        })
        console.log(ids)
        crudUser.resetPwd(ids).then(() => {
          this.crud.notify('重置成功, 用户新密码:123456', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {})
      }).catch(() => {
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
