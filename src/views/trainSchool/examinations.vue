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
    <el-dialog class="device-dialog" append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title">
      <el-form ref="form" :model="form" size="small" label-position="left" label-width="90px">
        <el-form-item label="单词短语" prop="wordPhrase">
          <el-input v-model="form.wordPhrase"/>
        </el-form-item>
        <el-form-item label="视频资料" prop="VideoVocabularyResource">
          <el-upload
            class="upload-demo"
            :url="videoUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed">
            <a>请上传文件</a>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="男音频资料" prop="manVocabularyResource">
          <el-upload
            class="upload-demo"
            :url="manUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed">
            <a>请上传文件</a>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="女音频资料" prop="womanVocabularyResource">
          <el-upload
            class="upload-demo"
            :url="womanUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed">
            <a>请上传文件</a>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="童音频资料" prop="childVocabularyResource">
          <el-upload
            class="upload-demo"
            :url="childUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed">
            <a>请上传文件</a>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="中文释义" prop="chineseMean">
          <el-input v-model="form.description" rows="5" type="textarea" class="input-textarea"/>
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
      <el-table-column :show-overflow-tooltip="true" prop="wordPhrase" label="单词短语"/>
      <el-table-column :show-overflow-tooltip="true" prop="chineseMean" label="中文释义"/>
      <el-table-column :show-overflow-tooltip="true" prop="videoResource.vocabularyResource" label="视频资料"/>
      <el-table-column :show-overflow-tooltip="true" prop="manVoiceResource.vocabularyResource" label="男音频资料"/>
      <el-table-column :show-overflow-tooltip="true" prop="womanVoiceResource.vocabularyResource" label="女音频资料"/>
      <el-table-column :show-overflow-tooltip="true" prop="childResource.vocabularyResource" label="童音频资料"/>
      <el-table-column :show-overflow-tooltip="true" prop="difficultyLevel" label="难度"/>
      <el-table-column :show-overflow-tooltip="true" prop="phraseDescription " label="描述"/>
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
import crudVocabulary from '@/api/questions/vocabulary'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import {mapGetters} from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const defaultForm = {
  id: null,
  wordPhrase: null,
  chineseMean: null,
  phraseType: null,
  difficultyLevel: 0,
  phraseDescription: null,
  videoResource: {},
  manVoiceResource: {},
  womanVoiceResource: {},
  childResource: {},
}
export default {
  name: 'examinations',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({
      title: '词汇列表',
      url: 'api/questions/vocabulary',
      query: {phraseType: 'WORD'},
      crudMethod: {...crudVocabulary}
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
      videoUrl:'',
      manUrl:'',
      womanUrl:'',
      childUrl:'',
    }
  },
  computed: {
    ...mapGetters([

    ])
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
}
</script>

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
  .input-textarea{
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
