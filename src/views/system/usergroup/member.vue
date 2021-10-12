<template>
  <div class="member-container">
    <div class="app-container-search">
      <el-input
        v-model="queryParams"
        placeholder="请输入用户名"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="width: 360px"
        @keyup.enter.native="handleQuery"
      />

      <el-button type="primary" icon="el-icon-search" size="small" @click="handleAddMember">添加成员</el-button>

    </div>
    <div class="app-container-content">
      <div class="app-container-content-table">
        <el-table 
          v-loading="loading" 
          :data="memberList" 
          border
          :height="'100%'"
        >
          <el-table-column
            label="用户名称"
            align="left"
            key="username"
            prop="username"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户全称"
            align="left"
            key="fullname"
            prop="fullname"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户邮箱"
            align="left"
            key="email"
            prop="email"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号码"
            align="left"
            key="phone"
            prop="phone"
            width="120"
          />
          <el-table-column label="状态" align="center" key="disabled" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.disabled"
                :active-value="false"
                :inactive-value="true"
                :disabled="true"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="created_at"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.created_at) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="70"
            class-name="operate"
          >
            <template slot-scope="scope">
              <el-link
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                :disabled="!$store.getters.isAdmin"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="paginationParams.pageNum"
        :limit.sync="paginationParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <user-list
      :visible.sync="visible"
      :ugName="ugName"
      :ugId="ugId"
      :memberList="memberList"
      @updateUserGroup="getList"
    />
  </div>
</template>

<script>
import {getUserGroup,delMember} from "@/api/system/usergroup";
import UserList from './userList.vue'
export default {
  props: {
    ugId: Number,
    ugName: String
  },
  components: { UserList },
  data() {
    return {
      //submitLoading
      submitLoading: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // memberList
      memberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      visible: false,
      // 查询参数
      queryParams: '',
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  watch:{
    ugId(val){
      this.getList();
    }
  },
  methods: {
    /** 查询user列表 */
    getList() {
      this.loading = true;
      getUserGroup(this.ugId)
        .then((response) => {
          const users = response?.users?.filter(item => item.username?.includes(this.queryParams)) || []
          const start =
            (this.paginationParams.pageNum - 1) *
            this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.memberList = users.slice(start, end);
          this.total = users.length;
          this.loading = false;
        })
        .catch((e) => {
          this.memberList = [];
          this.loading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.paginationParams.pageNum = 1;
      this.getList();
    },
    handleAddMember(){
      this.title = "添加成员";
      this.visible = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.uid;
      const names = row.username;
      console.log(row);
      this.$confirm('是否确认删除用户名称为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            delMember({
              ugId:this.ugId, 
              payload: [ids]
            })
              .then(() => {
                instance.confirmButtonLoading = false;
                done();
              })
              .catch((e) => {
                instance.confirmButtonLoading = false;
                this.msgError("删除失败");
              });
          } else {
            done();
          }
        },
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.member-container{
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.app-container-search{
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.app-container-content{
  padding: 0 0 16px 0 !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .app-container-content-table {
    flex: 1;
    overflow: auto;
  }
}
</style>