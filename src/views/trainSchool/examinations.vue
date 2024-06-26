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
      <crudOperation :permission="permission"></crudOperation>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form class="dialog-form" ref="form" :model="form" size="small" label-position="left" label-width="100px">
        <el-form-item label="学生类型" prop="eduLevel">
          <el-select v-model="form.eduLevel" placeholder="请选择" class="form-put">
            <el-option
              v-for="item in eduLevelList"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷名称" prop="examinationName">
          <el-input v-model="form.examinationName" class="form-put"/>
        </el-form-item>
<!--        <el-form-item label="试卷类型" prop="examinationType">-->
<!--          <el-input v-model="form.examinationType"/>-->
<!--        </el-form-item>-->
        <el-form-item label="听力题数量" prop="listenCount">
          <el-input-number v-model.number="form.listenCount" controls-position="right" size="large" :min="0" :max="100"  class="form-put"/>
        </el-form-item>
        <el-form-item label="选择题题数量" prop="chooseCount">
          <el-input-number v-model.number="form.chooseCount" controls-position="right" size="large" :min="0" :max="100" class="form-put"/>
        </el-form-item>
        <el-form-item label="填空题数量" prop="completionCount">
          <el-input-number v-model.number="form.completionCount" controls-position="right" size="large" :min="0" :max="100" class="form-put"/>
        </el-form-item>
        <el-form-item label="判断题数量" prop="judgeCount">
          <el-input-number v-model.number="form.judgeCount" controls-position="right" size="large" :min="0" :max="100" class="form-put"/>
        </el-form-item>
        <el-form-item label="阅读理解数量" prop="comprehensionCount">
          <el-input-number v-model.number="form.comprehensionCount" controls-position="right" size="large" :min="0" :max="100" class="form-put"/>
        </el-form-item>
        <el-form-item label="作文数量" prop="compositionCount">
          <el-input-number v-model.number="form.compositionCount" controls-position="right" size="large" :min="0" :max="1" class="form-put"/>
        </el-form-item>
        <el-form-item label="等级" prop="difficultyLevel">
          <el-input-number v-model.number="form.difficultyLevel" controls-position="right" size="large" :min="1" :max="100" class="form-put"/>
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
      <el-table-column :show-overflow-tooltip="true" prop="eduLevel" label="学生等级"/>
      <el-table-column :show-overflow-tooltip="true" prop="examinationName" label="试卷名称"/>
<!--      <el-table-column :show-overflow-tooltip="true" prop="examinationType" label="试卷类型"/>-->
      <el-table-column :show-overflow-tooltip="true" prop="listenCount" label="听力题数量"/>
      <el-table-column :show-overflow-tooltip="true" prop="chooseCount" label="选择题题数量"/>
      <el-table-column :show-overflow-tooltip="true" prop="completionCount" label="填空题数量"/>
      <el-table-column :show-overflow-tooltip="true" prop="judgeCount" label="判断题数量"/>
      <el-table-column :show-overflow-tooltip="true" prop="comprehensionCount" label="阅读理解数量"/>
      <el-table-column :show-overflow-tooltip="true" prop="compositionCount" label="作文数量"/>
      <el-table-column :show-overflow-tooltip="true" prop="difficultyLevel" label="等级"/>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>
      <el-table-column
        v-if="checkPer(['admin','examination:update','examination:delete'])"
        label="操作"
        width="115"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="15">
              <udOperation :data="scope.row" :permission="permission"/>
            </el-col>
            <el-col :span="6">
              <el-button size="mini" type="primary" icon="el-icon-info" @click="openExaminationsDetail(scope.row.id)"></el-button>
<!--              <el-button size="mini" style="margin-right: 2px" type="text">-->
<!--                <router-link :to="'/learning/examinations/examinationsDetail/'+scope.row.id+'/null'">-->
<!--                  详情-->
<!--                </router-link>-->
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
import crudExaminations from '@/api/trainSchool/examinations'
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
  eduLevel: null,
  difficultyLevel: null,
  examinationName: null,
  examinationType: null,
  listenCount: null,
  chooseCount: null,
  completionCount: null,
  judgeCount: null,
  compositionCount: null,
  comprehensionCount: null,
}
export default {
  name: 'examinations',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({
      title: '试卷',
      url: '/api/examinations',
      // query: {phraseType: 'WORD'},
      crudMethod: {...crudExaminations}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'examination:add'],
        edit: ['admin', 'examination:update'],
        del: ['admin', 'examination:delete']
      },
      eduLevelList: [
        "小学",
        "初中",
        "高中"
      ],
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
  computed: {
    ...mapGetters([])
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
    openExaminationsDetail(id) {
      this.$router.push({
        name:'examinationsDetail',
        params: {
          id: id,
          stuId: null
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dialog-form {
  margin: 0 2vh;
  .form-put {
    width: 80%;
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
