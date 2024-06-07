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
        <date-range-picker v-model="query.createTime" class="date-item"/>
        <rrOperation/>
      </div>
      <crudOperation show="" :permission="permission"></crudOperation>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form class="dialog-form" ref="form" :model="form" size="small" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="学生类型" prop="eduLevel">
              <el-select v-model="form.eduLevel" placeholder="请选择">
                <el-option
                  v-for="item in eduLevelList"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划名称" prop="wordPhrase">
              <el-input v-model="form.trainName"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划等级" prop="trainLevel">
              <el-input v-model="form.trainLevel" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划序号" prop="trainSerialNumber">
              <el-input v-model="form.trainSerialNumber" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划描述" prop="trainDescription">
              <el-input v-model="form.trainDescription"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form v-for="(item, index) in this.trainContent" :key="index" class="plan-content-form">
              <el-form-item label="内容" :prop="'trainContent.'+index+'.wordPhrase'" label-width="90px">
                <el-input v-model.trim="item.wordPhrase"/>
              </el-form-item>
              <el-form-item label="视频资料" :prop="'trainContent.'+index+'.videoFile'" label-width="90px">
                <el-upload
                  class="upload-demo"
                  v-model.trim="item.videoFile"
                  action="#"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-remove="(file,fileList)=>{handleRemove(file,fileList,index,'videoFile')}"
                  :http-request="function (file){return ossUpload(file,index,'videoFile')}">
                  <a>请上传文件</a>
                </el-upload>
              </el-form-item>
              <el-form-item label="男音频资料" :prop="'trainContent.'+index+'.manVoiceFile'" label-width="90px">
                <el-upload
                  v-model.trim="item.manVoiceFile"
                  action="#"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :http-request="function (file){return ossUpload(file,index,'manVoiceFile')}">
                  <a>请上传文件</a>
                </el-upload>
              </el-form-item>
              <el-form-item label="女音频资料" :prop="'trainContent.'+index+'.womanVoiceFile'" label-width="90px">
                <el-upload
                  v-model.trim="item.womanVoiceFile"
                  action="#"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :http-request="function (file){return ossUpload(file,index,'womanVoiceFile')}">
                  <a>请上传文件</a>
                </el-upload>
              </el-form-item>
              <el-form-item label="童音频资料" :prop="'trainContent.'+index+'.childVoiceFile'" label-width="90px">
                <el-upload
                  v-model.trim="item.childVoiceFile"
                  action="#"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :http-request="function (file){return ossUpload(file,index,'childVoiceFile')}">
                  <a>请上传文件</a>
                </el-upload>
              </el-form-item>
              <el-form-item label="中文释义" :prop="'trainContent.'+index+'.chineseMean'" label-width="90px">
                <el-input v-model.trim="item.chineseMean" rows="5" type="textarea" class="input-textarea"/>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button @click.prevent="removeSetting()" v-show="delButtonTrainContent">删除选项</el-button>
              <el-button icon="el-icon-circle-plus-outline" @click="addSetting()">新增内容选项</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-table-column :show-overflow-tooltip="true" prop="trainName" label="计划名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="trainLevel" label="计划等级"/>
      <el-table-column :show-overflow-tooltip="true" prop="eduLevel" label="学生等级"/>
      <el-table-column :show-overflow-tooltip="true" prop="trainSerialNumber" label="序号"/>
      <el-table-column :show-overflow-tooltip="true" prop="trainDescription" label="计划描述"/>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>
      <el-table-column
        v-if="checkPer(['admin','user:edit','user:del'])"
        label="操作"
        width="115"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"/>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import crudPlan from '@/api/questions/plan'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {ossPut} from "@/utils/upload";

const defaultForm = {
  id: null,
  trainLevel: '',
  trainDescription: '',
  createTime: '',
  updateTime: '',
  eduLevel: '',
  trainSerialNumber: '',
  trainName: '',
  trainContent: [
    {
      wordPhrase: '',
      chineseMean: '',
      videoFile: '',
      manVoiceFile: '',
      womanVoiceFile: '',
      childVoiceFile: ''
    }
  ]
}
export default {
  name: 'plan',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({
      title: '词汇列表',
      url: '/api/training',
      crudMethod: {...crudPlan}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      delButtonTrainContent: true,
      eduLevelList: [
        "小学",
        "初中",
        "高中"
      ],
      trainContent: [],
    }
  },
  mounted: function () {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    // 新增前初始化信息
    [CRUD.HOOK.beforeToAdd](crud, form) {
      this.trainContent = [
        {
          wordPhrase: '',
          chineseMean: '',
          videoFile: '',
          manVoiceFile: '',
          womanVoiceFile: '',
          childVoiceFile: ''
        }
      ]
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      crudPlan.getTrainInfo(form.id).then(res=>{
        this.trainContent=res.content.trainContent
      })
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.trainContent=this.trainContent
    },
    ossUpload(file, index, key) {
      ossPut(file, "vocabulary").then(res => {
        if (res !== null) {
          // 使用Vue.set或者this.$set来确保响应式更新
          if (this.trainContent[index] === undefined) {
            this.trainContent[index] = {
              wordPhrase: '',
              chineseMean: '',
              videoFile: '',
              manVoiceFile: '',
              womanVoiceFile: '',
              childVoiceFile: ''
            }
          }
          this.$set(this.trainContent[index], key, res.val);
        }
      })
    },
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    removeSetting() {
      var index = this.trainContent.length - 1
      if (index !== -1) {
        this.trainContent.splice(index, 1)
        if (index === 0) {
          this.delButtonTrainContent = false
        }
      }
    },
    addSetting() {
      this.trainContent.push({
        wordPhrase: '',
        chineseMean: '',
        videoFile: '',
        manVoiceFile: '',
        womanVoiceFile: '',
        childVoiceFile: ''
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleRemove(file, fileList, index, key) {
      this.$confirm(`确认移除${file.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(this.trainContent[index], key, '');
      }).catch(() => {
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.dialog-form {
  margin: 0 2vh;

  .plan-content-form {
    border: #b7b1b1 1px solid;
    padding: 10px 20px 0 0;
    margin-bottom: 10px;
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

<style rel="stylesheet/scss" lang="scss">
.device-dialog {
  padding: 0 10px;
  width: 600px;

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
