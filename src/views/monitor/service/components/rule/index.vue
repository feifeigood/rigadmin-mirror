<template>
  <div class="rule-container">
    <div class="app-container-search">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px" @submit.native.prevent>
        <i class="el-icon-back" @click="handleBack()"></i>
        <el-form-item label="所属服务" prop="serviceId">
          <el-select 
            v-model="queryParams.serviceId" 
            filterable placeholder="请选择所属服务" size="small"
            style="width: 240px"
            @change="handleQuery"
          >
            <el-option 
              v-for="item in serviceList"
              :key="item.id" 
              :label="`${item.name}-${item.project.name}`"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container-content">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasRole="['Operator']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="ruleList" 
        border
      >
        <el-table-column label="规则编号" align="center" prop="id" width="80" v-if="columns[0].visible"/>
        <el-table-column label="规则名称" align="left" prop="name" :show-overflow-tooltip="true" v-if="columns[1].visible"/>
        <el-table-column label="持续时间" align="left" prop="duration" width="80" v-if="columns[2].visible"/>
        <el-table-column label="表达式" align="left" prop="clause" :show-overflow-tooltip="true" v-if="columns[3].visible"/>
        <el-table-column label="操作符" align="left" prop="comparator" width="60" v-if="columns[4].visible"/>
        <el-table-column label="默认值" align="left" prop="default_value" width="60" v-if="columns[5].visible"/>
        <el-table-column label="状态" align="center" key="enabled" width="80" v-if="columns[6].visible">
          <template slot-scope="scope">
            <div @click.stop>
              <el-switch
                v-model="scope.row.enabled"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </div>

          </template>
        </el-table-column>  
        <el-table-column label="级别" align="left" prop="severity" width="100" v-if="columns[7].visible"/>
        <el-table-column label="操作" align="center" width="180" class-name="operate">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click.stop="handleUpdate(scope.row)"
              v-hasRole="['Operator']"
            >修改</el-link>
            <el-link
              type="success"
              style="color:#348e37"
              icon="el-icon-document"
              @click.stop="handleShowDetail(scope.row)"
              v-hasRole="['Operator']"
            >详情</el-link>
            <el-link
              type="danger"
              icon="el-icon-delete"
              @click.stop="handleDelete(scope.row)"
              v-hasRole="['Operator']"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="paginationParams.pageNum"
        :limit.sync="paginationParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <add-form 
      :operateNum.sync="operateNum"
      :selectedId="selectedId"
      :selectedServiceId="queryParams.serviceId"
      :serviceList="serviceList"
      @getList="getList"
    />

    <rule-detail 
      :selectedId="selectedId"
      :operateNum.sync="operateNum"
    />
  </div>
</template>

<script>
import { listRule, delRule,changeRuleStatus} from "@/api/monitor/rule";
import RuleDetail from './ruledetail.vue';
import AddForm from './addForm.vue';


export default {
  name:'Rule',
  components: { RuleDetail, AddForm },
  props: {
    showRule: Boolean,
    selectedServiceId: Number,
    serviceList: Array
  },
  data() {
    return {
      //operateNum 0: 无, 1: 新增，2: 修改
      operateNum: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      items: [],
      selectedId: undefined,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // rule数据
      ruleList: [],
      // 查询参数
      queryParams: {
        serviceId: this.selectedServiceId,
      },
      // 列信息
      columns: [
        { key: 0, label: `规则编号`, visible: true },
        { key: 1, label: `规则名称`, visible: true },
        { key: 2, label: `持续时间`, visible: true },
        { key: 3, label: `表达式`, visible: true },
        { key: 4, label: `操作符`, visible: true },
        { key: 5, label: `默认值`, visible: true },
        { key: 6, label: `状态`, visible: true },
        { key: 7, label: `级别`, visible: true },
      ],

      paginationParams:{
        pageNum:1,
        pageSize: 10,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询rule列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listRule(this.queryParams.serviceId).then(res => {
          const response = this.transResponse(res);
          const start = (this.paginationParams.pageNum-1) * this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.ruleList = response.slice(start, end);
          this.total = response.length;
          this.loading = false;
        }
      ).catch(e=>{
        this.ruleList=[];
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.paginationParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.operateNum = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.operateNum = 2;
      this.selectedId = row.id;
    },
    handleShowDetail(row){
      this.operateNum = 3;
      this.selectedId = row.id;
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      const names = row.name;
      console.log(row)
      this.$confirm('是否确认删除规则名称为"' + names + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              delRule(ids).then(()=>{
                instance.confirmButtonLoading = false;
                done();
              }).catch(e=>{
                instance.confirmButtonLoading = false;
                this.msgError("删除失败");
              })
            } else {
              done();
            }
          }
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },

      //状态修改
    handleStatusChange(row) {
      let text = row.enabled === 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"规则吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              changeRuleStatus(row.id).then(()=>{
                instance.confirmButtonLoading = false;
                this.msgSuccess(text + "成功");
                done();
              }).catch(e=>{
                instance.confirmButtonLoading = false;
                this.msgError("删除失败");
              })
            } else {
              done();
            }
          }
        }).catch(function() {
          row.enabled = Math.abs(row.enabled-1 ) ;
        });
    },

    handleBack(){
      this.$emit('update:showRule', false);
    },
    transResponse(response){
      return response?.map(item => {
        if (!!item.sample_id) {
          return {
            ...item,
            description: item.description || item.sample.description,
            comparator: item.comparator || item.sample.comparator,
            default_value: item.sample_def_val || item.sample.default_value,
            severity: item.labels.severity || item.sample.labels.severity,
          }
        }else{
          return {
            ...item,
            severity: item.labels?.severity
          };
          
        }

      }) || []
    }

  }
};
</script>
<style lang="scss" scoped>
  .app-container .app-container-search {
    ::v-deep .el-form{
      align-items: center;
      justify-content: flex-start;
      .el-icon-back{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: -10px;
        margin-right: 30px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #eef0f3;
        cursor: pointer;
        &:hover{
          background-color: #c5c8cc;
        }
      }
    }
  }
  
  .app-container-content{
    ::v-deep .operate{
        .cell{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
    ::v-deep .el-descriptions-item__container{
      display: flex;
      align-items: center;
      .el-descriptions-item__label{
        flex: 0 0 60px;
      }
    }
  }
</style>