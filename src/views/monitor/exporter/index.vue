<template>
  <div class="app-container">
    <div class="app-container-search">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px" @submit.native.prevent>
        <el-form-item label="客户端名称" prop="job">
          <el-input
            v-model="queryParams.job"
            placeholder="请输入客户端名称"
            clearable
            size="small"
            style="width: 280px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
            v-hasPermi="['monitor:exporter:add']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="exporterList" 
        border
      >
        <el-table-column label="客户端编号" align="center" prop="id" width="120"/>
        <el-table-column label="客户端名称" align="left" prop="job" :show-overflow-tooltip="true" />
        <el-table-column label="端口" align="left" prop="port" width="120"/>
        <el-table-column label="路径" align="left" prop="path" :show-overflow-tooltip="true" />
        <el-table-column label="协议" align="left" prop="scheme" width="120"/>
        <el-table-column label="别名" align="left" prop="alias" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="140" class-name="operate">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['monitor:exporter:edit']"
            >修改</el-link>
            <el-link
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['monitor:exporter:delete']"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="job">
          <el-input v-model="form.job" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model.number="form.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="协议" prop="scheme">
          <el-input v-model="form.scheme" placeholder="请输入协议" />
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="form.alias" placeholder="请输入别名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDefaultExporter, delDefaultExporter, addDefaultExporter, updateDefaultExporter} from "@/api/monitor/exporter";

export default {
  name: "DefaultExporter",
  data() {
    return {
      //operateNum 0: 无, 1: 新增，2: 修改
      operateNum: 0,
      //submitLoading
      submitLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      items: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // exporter数据
      exporterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        job: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        alias: [
          { required: true, message: "别名不能为空", trigger: "blur" }
        ],
        port: [
          { required: true, message: "端口不能为空", trigger: "blur" },
          { type: 'number', message: '端口不能为非数字值', trigger: "blur"}
        ],
        path: [
          { required: true, message: "路径不能为空", trigger: "blur" }
        ],
        scheme: [
          { required: true, message: "协议不能为空", trigger: "blur" }
        ],
      },
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
    /** 查询exporter列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listDefaultExporter(this.queryParams).then(response => {
          const start = (this.paginationParams.pageNum-1) * this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.exporterList = response.slice(start, end);
          this.total = response.length;
          this.loading = false;
        }
      ).catch(e=>{
        this.exporterList=[];
        this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        job: undefined,
        port: undefined,
        path: undefined,
        scheme: undefined,
        alias: undefined
    };
      //this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.paginationParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.operateNum = 1;
      this.reset();
      this.open = true;
      this.title = "添加客户端";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.operateNum = 2;
      this.reset();
      const data = {...row};
      this.form = data;
      this.open = true;
      this.title = "修改客户端";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          console.log(this.getActionAndParams())
          const {action, params} = this.getActionAndParams();
          if (action) {
            action(params).then(response => {
              this.msgSuccess("操作成功");
              this.open = false;
              this.submitLoading = false;
              this.getList();
            }).catch(e=>{
              this.submitLoading = false;
            });
          }
        }
      });
    },
    getActionAndParams(){
      const res = {
        action:undefined,
        params: undefined
      }
      switch (this.operateNum) {
        case 1:
          res.action = addDefaultExporter,
          res.params = {
            job: this.form.job,
            port: +this.form.port,
            path: this.form.path,
            scheme: this.form.scheme,
            alias: this.form.alias
          }
          break;
        case 2:
          res.action = updateDefaultExporter,
          res.params = {
            id: this.form.id,
            job: this.form.job,
            port: +this.form.port,
            path: this.form.path,
            scheme: this.form.scheme,
            alias: this.form.alias
          }
          break;
        default:
          break;
      }
      return res;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      const names = row.job;
      console.log(row)
      this.$confirm('是否确认删除客户端名称为"' + names + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              delDefaultExporter(ids).then(()=>{
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


  }
};
</script>
<style lang="scss" scoped>
  .app-container-content{
    ::v-deep .operate{
        .cell{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }

  }
</style>