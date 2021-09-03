<template>
  <div class="app-container">
    <div class="app-container-search">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" @submit.native.prevent>
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名称"
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
            v-hasPermi="['system:user:add']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="userList" 
        border
      >
        <el-table-column label="用户编号" align="center" key="uid" prop="uid" width="160"/>
        <el-table-column label="用户名称" align="left" key="username" prop="username" :show-overflow-tooltip="true" />
        <el-table-column label="用户全称" align="left" key="fullname" prop="fullname" :show-overflow-tooltip="true" />
        <el-table-column label="用户邮箱" align="left" key="email" prop="email"  :show-overflow-tooltip="true"/>
        <el-table-column label="手机号码" align="left" key="phone" prop="phone"  width="120" />
        <el-table-column label="状态" align="center" key="disabled" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.disabled"
              :active-value="false"
              :inactive-value="true"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="created_at"  width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140" class-name="operate">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:user:edit']"
            >修改</el-link>
            <el-link
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:user:delete']"
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
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户全称" prop="fullname">
          <el-input v-model="form.fullname" placeholder="请输入用户全称" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号码" />
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
import {  listUser, delUser, addUser, updateUser , changeUserStatus} from "@/api/system/user";

export default {
  username: "User",
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
      // user数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        username: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        fullname: [
          { required: true, message: "用户全称不能为空", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
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
    /** 查询user列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listUser(this.queryParams).then(response => {
          const start = (this.paginationParams.pageNum-1) * this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.userList = response.slice(start, end);
          this.total = response.length;
          this.loading = false;
        }
      ).catch(e=>{
        this.userList=[];
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
        username: undefined,
        fullname: undefined,
        email: undefined,
        phone: undefined,
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
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.operateNum = 2;
      this.reset();
      const data = {...row};
      console.log(data)
      this.form = data;
      this.open = true;
      this.title = "修改用户";
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
          res.action = addUser,
          res.params = {
            username: this.form.username,
            fullname: this.form.fullname,
            email: this.form.email,
            phone: this.form.phone,
          }
          break;
        case 2:
          res.action = updateUser,
          res.params = {
            uid : this.form.uid,
            username: this.form.username,
            fullname: this.form.fullname,
            phone: this.form.phone,
            email: this.form.email,
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
      const names = row.username;
      console.log(row)
      this.$confirm('是否确认删除用户名称为"' + names + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              delUser(ids).then(()=>{
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
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.disabled === false ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              changeUserStatus(row.uid).then(()=>{
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
          row.disabled = !row.disabled ;
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