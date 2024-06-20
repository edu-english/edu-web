<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--      <div v-if="crud.props.searchToggle">-->
      <!--        &lt;!&ndash; 搜索 &ndash;&gt;-->
      <!--        <el-input-->
      <!--          v-model="query.blurry"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          placeholder="输入名称或者邮箱搜索"-->
      <!--          style="width: 200px;"-->
      <!--          class="filter-item"-->
      <!--          @keyup.enter.native="crud.toQuery"-->
      <!--        />-->
      <!--        <date-range-picker v-model="query.createTime" class="date-item"/>-->
      <!--        <rrOperation/>-->
      <!--      </div>-->
      <crudOperation :permission="permission">
        <el-button
          slot="right"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          :loading="crud.loading"
          :disabled="crud.selections.length !== 1"
          @click="getContentInfo(crud.selections[0])">查看计划内容
        </el-button>
      </crudOperation>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               v-loading.fullscreen.lock="loading" element-loading-text="文件上传中"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form class="dialog-form" ref="form" :model="form" size="small" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="计划类型" prop="eduLevel">
              <el-select v-model="form.trainType" placeholder="请选择">
                <el-option
                  v-for="item in trainTypeList"
                  :key="item.type"
                  :label="item.desc"
                  :value="item.type"/>
              </el-select>
            </el-form-item>
          </el-col>
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
                  ref="upload"
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
                  ref="upload"
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
                  ref="upload"
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
                  ref="upload"
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
      <el-table-column :show-overflow-tooltip="true" prop="trainType" label="计划类型">
        <template slot-scope="scope">
          <span v-if="scope.row.trainType==='WORD'">词汇记忆</span>
          <span v-if="scope.row.trainType==='SITIATIONAL'">情景对话</span>
          <span v-if="scope.row.trainType==='SHORT_TEXT'">短文阅读</span>
          <span v-if="scope.row.trainType==='AUDIO_VISUAL'">视听训练</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="trainDescription" label="计划描述"/>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>
      <el-table-column
        v-if="checkPer(['admin','training:update','training:delete'])"
        label="操作"
        width="115"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"></udOperation>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>

    <!--计划内容-->
    <el-dialog class="plan-content-dialog" :visible="this.contentDialog" @close="contentDialogClose" width="1200px">
      <el-table ref="table" v-loading="crud.loading" :data="this.trainContent" style="height: 50vh;">
        <el-table-column :show-overflow-tooltip="true" prop="wordPhrase" label="内容名称"/>
        <el-table-column :show-overflow-tooltip="true" prop="videoFile" label="视频资料">
          <template slot-scope="scope">
            <a @click="openVideo(scope.row.videoFile)">视频资料</a>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="manVoiceFile" label="男音频资料">
          <template slot-scope="scope">
            <a @click="openVideo(scope.row.manVoiceFile)">男音频资料</a>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="womanVoiceFile" label="女音频资料">
          <template slot-scope="scope">
            <a @click="openVideo(scope.row.womanVoiceFile)">女音频资料</a>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="childVoiceFile" label="童音频资料">
          <template slot-scope="scope">
            <a @click="openVideo(scope.row.childVoiceFile)">童音频资料</a>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="chineseMean" label="中文释义"/>
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>
      </el-table>
    </el-dialog>

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
        v-bind="$attrs">
      </video>
    </el-dialog>

  </div>
</template>

<script>
import crudPlan from '@/api/trainSchool/plan'
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
  eduLevel: '小学',
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
  ],
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
  inject: ['reload'],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'training:add'],
        edit: ['admin', 'training:update'],
        del: ['admin', 'training:delete']
      },
      delButtonTrainContent: true,
      contentDialog: false,
      eduLevelList: [
        "小学",
        "初中",
        "高中"
      ],
      trainTypeList: [
        {type: 'WORD', desc: '词汇记忆'},
        {type: 'SITIATIONAL', desc: '情景对话'},
        {type: 'SHORT_TEXT', desc: '短文阅读'},
        {type: 'AUDIO_VISUAL', desc: '视听训练'},
      ],
      trainContent: [],
      loading: false,
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
    this.crud.optShow = {
      add: true,
      edit: true,
      del: true,
      download: false
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
      crudPlan.getTrainInfo(form.id).then(res => {
        this.trainContent = res.content.trainContent
      })
    },
    [CRUD.HOOK.beforeSubmit]() {
      if (this.trainContent.length > 0) {
        this.form.trainContent = this.trainContent
      }
    },
    [CRUD.HOOK.afterSubmit]() {
      this.reload();
    },
    [CRUD.HOOK.afterAddCancel]() {
      this.reload();
    },
    [CRUD.HOOK.afterEditCancel]() {
      this.reload();
    },
    ossUpload(file, index, key) {
      this.loading = true
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
          this.loading = false
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
    getContentInfo(data) {
      const planId = data.id
      this.trainContent = []
      crudPlan.getTrainInfo(planId).then(res => {
        this.trainContent = res.content.trainContent
        this.contentDialog = true
      })
    },
    contentDialogClose() {
      this.contentDialog = false
      this.reload()
    },
    openVideo(videoUrl) {
      this.videoDialog = true
      this.videoInfo.videoUrl =videoUrl //'https://edu-study-2024.oss-cn-hangzhou.aliyuncs.com/vocabulary/d8d8c184dfce497abfde78257f57eb9e.mp4'
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

  .el-select {
    width: 80%;
  }

  .el-input {
    width: 80%
  }

  .plan-content-form {
    border: #b7b1b1 1px solid;
    padding: 10px 0px 0 0;
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
    width: 80%
  }
}

.plan-content-dialog {
  a {
    text-decoration: underline; /* 添加下划线 */
    font-size: 14px;
    color: #1884FF;
    letter-spacing: 0;
    font-weight: 400;
  }

}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
