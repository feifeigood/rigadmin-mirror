<template>
  <div class="exporter-container">
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
      :height="'calc(100vh - 140px)'"
    >
      <el-table-column label="ID" align="center" prop="id" width="60"/>
      <el-table-column label="名称" align="left" prop="default_exporter.alias" width="160" :show-overflow-tooltip="true" />
      <el-table-column label="端口" align="left" prop="port" width="80" :show-overflow-tooltip="true" />
      <el-table-column label="路径" align="left" prop="path" :show-overflow-tooltip="true" />
      <el-table-column label="协议" align="left" prop="scheme" width="90" :show-overflow-tooltip="true" />
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="Exporters" prop="exporter">
          <el-select 
            v-model="form.exporter" 
            filterable placeholder="请选择客户端" size="small"
            style="width: 100%"
            value-key="id"
            @change="handleExporterChange"
            :disabled="operateNum==2"
          >
            <el-option 
              v-for="item in defaultExporterList"
              :key="item.id" 
              :label="item.alias"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入采集端口" />
        </el-form-item>
        <el-form-item label="采集路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入采集路径" />
        </el-form-item>
        <el-form-item label="协议" prop="scheme">
          <el-input v-model="form.scheme" placeholder="请输入协议" />
        </el-form-item>
        <el-form-item label="所属服务" prop="serviceName">
          <el-input v-model="form.serviceName" disabled/>
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
import { getService } from "@/api/monitor/service";
import { listDefaultExporter, addExporter,updateExporter,delExporter } from "@/api/monitor/exporter";

export default {
  name: "Exporter",
  props:{
    serviceId: {
      required: true,
      type: Number
    },
  },
  data() {
    return {
      //operateNum 0: 无, 1: 新增，2: 修改
      operateNum: 0,
      //submitLoading
      submitLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // exporter数据
      exporterList: [],
      defaultExporterList: [],
      serviceName: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        port: [
          { required: true, message: "客户端端口不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "客户端路径不能为空", trigger: "blur" }
        ],
        scheme: [
          { required: true, message: "客户端协议不能为空", trigger: "blur" }
        ],
      },
      paginationParams:{
        pageNum:1,
        pageSize: 10,
      }
    };
  },
  created() {
    listDefaultExporter().then(response => {
      this.defaultExporterList = response;
    })
    
  },
  watch: {
    serviceId: {
      handler(val) {
        this.getList();
      },
      immediate: true,
    },
  },
  methods: {
    /** 查询exporter列表 */
    getList() {
      this.loading = true;
      getService(this.serviceId).then(response => {
          const start = (this.paginationParams.pageNum-1) * this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.exporterList = response?.exporters?.slice(start, end) || [];
          this.total = response?.exporters?.length || 0;
          this.serviceName = `${response?.name}----[${response?.project?.name}]`;
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
        exporter: this.defaultExporterList[0],
        job: this.defaultExporterList[0]?.job,
        port: this.defaultExporterList[0]?.port,
        path:this.defaultExporterList[0]?.path,
        scheme: this.defaultExporterList[0]?.scheme,
        serviceName: this.serviceName
      };
      this.resetForm("form");
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
      this.$set(this.form,'exporter',this.defaultExporterList.filter(item => item.id == data.default_exporter_id)[0]);
      this.form.serviceName= this.serviceName;
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
          res.action = addExporter,
          res.params = {
            service_id: this.serviceId,
            default_exporter_id:this.form.exporter.id,
            job: this.form.job,
            port: this.form.port,
            path: this.form.path,
            scheme: this.form.scheme
          }
          break;
        case 2:
          res.action = updateExporter,
          res.params = {
            id: this.form.exporter.id,
            job: this.form.job,
            port: this.form.port,
            path: this.form.path,
            scheme: this.form.scheme
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
      const names = row.default_exporter.alias;
      console.log(row)
      this.$confirm('是否确认删除客户端名称为"' + names + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              delExporter(ids).then(()=>{
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
    handleExporterChange(exporter){
      console.log(exporter)
      this.form.exporter = exporter;
      this.form.job = exporter.job;
      this.form.port = exporter.port;
      this.form.path = exporter.path;
      this.form.scheme = exporter.scheme;
    }


  }
};
</script>
<style lang="scss" scoped>
  .exporter-container{
    padding: 20px 12px;

    ::v-deep .operate{
        .cell{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }

  }
</style>