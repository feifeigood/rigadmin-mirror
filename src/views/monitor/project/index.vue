<template>
  <div class="app-container">
    <div class="app-container-search">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" @submit.native.prevent>
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入项目名称"
            clearable
            size="small"
            style="width: 380px"
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
            v-hasPermi="['monitor:project:add']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="projectList" 
        border
      >
        <el-table-column label="项目编号" align="center" prop="id" width="80"/>
        <el-table-column label="项目名称" align="left" prop="name" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <router-link :to="{ name: 'Service', params: { projectId: scope.row.id }}" class="link-type">
              <span>{{ scope.row.name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="项目描述" align="left" prop="description" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" key="enabled" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>  
        <el-table-column label="操作" align="center" width="140" class-name="operate">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['monitor:project:edit']"
            >修改</el-link>
            <!-- <el-link
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['monitor:project:delete']"
            >删除</el-link> -->
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
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input 
            v-model="form.description" 
            placeholder="请输入项目描述" 
            type="textarea"
            :autosize="{ minRows: 3}"
          />
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
import { listProject, delProject, addProject, updateProject,changeProjectStatus} from "@/api/monitor/project";

export default {
  name: "Project",
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
      // project数据
      projectList: [],
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
        name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "项目描述不能为空", trigger: "blur" }
        ]
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
    /** 查询project列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listProject(this.queryParams).then(response => {
          const start = (this.paginationParams.pageNum-1) * this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.projectList = response.slice(start, end);
          this.total = response.length;
          this.loading = false;
        }
      ).catch(e=>{
        this.projectList=[];
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
        name: undefined,
        description: undefined,
      };
      this.resetForm("form");
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
      this.title = "添加项目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.operateNum = 2;
      this.reset();
      const data = {...row};
      this.form = data;
      this.open = true;
      this.title = "修改项目";
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
          res.action = addProject,
          res.params = {
            name: this.form.name,
            description: this.form.description
          }
          break;
        case 2:
          res.action = updateProject,
          res.params = {
            id: this.form.id,
            name: this.form.name,
            description: this.form.description
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
      const names = row.name;
      console.log(row)
      this.$confirm('是否确认删除项目名称为"' + names + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              delProject(ids).then(()=>{
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
      this.$confirm('确认要"' + text + '""' + row.name + '"项目吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              changeProjectStatus(row.id).then(()=>{
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