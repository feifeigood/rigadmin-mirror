<template>
  <el-dialog title="添加成员" :visible.sync="open" width="800px" @close="handleClose" append-to-body>
    <div class="dialog-body">
      <div class="title">团队名称：{{ugName}}</div>
      <div class="selectedData" v-if="!!items.length">
        <div>已选择{{items.length}}项：</div>
        <div class="dataItem"
          v-for="(v,index) in items"
          :key="index"
        >
          <span>{{v.username}}</span>
          <i class="el-icon-close" 
            @click="handleDelData(index)"
          ></i>
        </div>
      </div>
      <div class="search">
        <el-input
          v-model="queryParams"
          placeholder="请输入用户名"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="width: 100%"
          @keyup.enter.native="handleQuery"
        />
      </div>
      <div>
        <el-table ref="multipleTable" v-loading="loading" :data="userList" row-key="uid" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" reserve-selection/>
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
            label="用户角色"
            align="left"
            key="roles"
            prop="roles[0].name"
            width="100"
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
                @change="handleStatusChange(scope.row)"
                :disabled="true"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="paginationParams.pageNum"
          :limit.sync="paginationParams.pageSize"
          :pageSizes="[5,10,20,50]"
          @pagination="getList"
        />
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAddMember" :loading="submitLoading"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {listUser} from "@/api/system/user";
import {addMembers} from "@/api/system/usergroup";

export default {
  props: {
    visible: Boolean,
    ugName: String,
    ugId: Number,
    memberList: Array
  },
  data(){
    return{
      // 遮罩层
      loading: false,
      submitLoading: false,
      open:false,
      // 总条数
      total: 0,
      // user数据
      userList: [],
      // 选中数组
      items: [],
      // 查询参数
      queryParams: undefined,
      paginationParams: {
        pageNum: 1,
        pageSize: 5,
      },
    }
  },
  watch:{
    async visible(val){
      this.open = val;
      if (val) {
        await this.getList();
        this.$nextTick(()=>{
          this.$refs.multipleTable.clearSelection();
          const userIds = this.memberList.map(item=>item.uid);
          this.items = this.userList.filter(item => userIds.includes(item.uid));
          this.items.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,true);
          });
        })
      }
    }
  },
  methods:{
    /** 查询user列表 */
    async getList() {
      this.loading = true;
      await listUser({username:this.queryParams})
        .then((response) => {
          console.log(22)
          const start =
            (this.paginationParams.pageNum - 1) *
            this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.userList = response.slice(start, end);
          this.total = response.length;
          this.loading = false;
        })
        .catch((e) => {
          this.userList = [];
          this.loading = false;
        });
    },
    cancel(){
      this.$emit('update:visible', false);
    },
    submitAddMember(){
      this.submitLoading = true;
      const param = {
        ugId: this.ugId,
        payload: this.items.map(item=>item.uid)
      }
      addMembers(param)
        .then((response) => {
          this.msgSuccess("操作成功");
          this.$emit('update:visible', false);
          this.submitLoading = false;
          this.$emit('updateUserGroup');
        })
        .catch((e) => {
          this.submitLoading = false;
        });
    },
    handleClose(){
      this.$emit('update:visible', false);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.paginationParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.items = selection
    },
    handleDelData(index){
      this.$refs.multipleTable.toggleRowSelection(this.items[index],false);
      this.items.splice(index,1)
 
    },
  }
}
</script>

<style lang="scss" scoped>
.dialog-body{
  .title{
    font-size: 12px;
    color: #333;
  }
  .selectedData{
    display: flex;
    align-items: center;
    flex-flow: wrap;
    margin-top: 8px;
    .dataItem{
      background: #fafafa;
      border: 1px solid #d9d9d9;
      padding: 2px 6px;
      margin: 4px;
      border-radius: 4px;
      i{
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
  .search{
    margin-top: 8px;
    margin-bottom: 12px;
  }
}
::v-deep .el-dialog__body{
  border-bottom: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>