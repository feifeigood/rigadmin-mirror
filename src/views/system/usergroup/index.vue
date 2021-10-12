<template>
  <div class="app-container">
    <el-row :gutter="20" style="height: 100%">
      <el-col :span="4" :xs="24" style="height: 100%">
        <div class="app-container-left">
          <div class="app-container-left-search">
            <div style="margin-bottom: 20px">
              <span>团队列表</span>
              <div style="float: right">
                <el-link type="primary" @click="handleUGAdd">新建团队</el-link>
              </div>
            </div>
            <el-input
              placeholder="搜索团队名称"
              clearable
              size="small"
              v-model="filterText"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="app-container-left-content">
            <el-tree
              ref="tree"
              :data="usergroups"
              :props="defaultProps"
              :filter-node-method="filterNode"
              node-key="id"
              default-expand-all
              check-on-click-node
              highlight-current
              @node-click="handleUGClick"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="20" :xs="24" style="height: 100%">
        <div class="app-container-right">
          <div class="ug-detail-container">
            <div class="title-container">
              <div class="title">{{ ugDetail.name }}</div>
              <el-link 
                class="operate-icon" 
                type="primary" 
                icon="el-icon-edit"
                @click="handleUGEdit()"
              ></el-link>
              <el-link 
                class="operate-icon" 
                type="danger" 
                icon="el-icon-delete"
                @click="handleUGDelete()"
              ></el-link>
            </div>
            <div class="remark">
              备注：{{ ugDetail.description }}
            </div>
          </div>
          <member 
            :ugId="ugDetail.id"
            :ugName="ugDetail.name"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改团队对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="ugOpen"
      width="800px"
      append-to-body
    >
      <el-form
        ref="ugForm"
        :model="ugForm"
        :rules="ugRules"
        label-width="100px"
      >
        <el-form-item label="团队名称:" prop="name">
          <el-input v-model="ugForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="description">
          <el-input v-model="ugForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUGForm" :loading="submitLoading">确 定</el-button>
        <el-button
          @click="()=>{
            ugOpen = false;
            reset();
          }"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUserGroup, createUserGroup,updateUserGroup,delUserGroup } from "@/api/system/usergroup";
import Member from './member.vue';

export default {
  name: "UserGroup",
  components: { Member },
  data() {
    return {
      newUGId: -1,
      submitLoading:false,
      operateNum:0,
      loading: true,
      defaultProps: {
        label: "name",
      },
      filterText: "",
      usergroups: [],
      total: 0,

      title: "",
      ugOpen: false,
      ugForm: {},
      ugRules: {
        name: [{ required: true, message: "团队名不能为空", trigger: "blur" }],
      },
      ugDetail: {},
    };
  },
  created() {
    this.getUserGroups();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    usergroups(val){
      console.log(1)
      this.$nextTick(()=>{
        const id = this.newUGId == -1 ? val[0]?.id : this.newUGId;
        const detail = this.newUGId == -1 ? 
          (val[0] || {}) : 
          this.usergroups.filter(item => item.id == this.newUGId)[0]
         this.$refs.tree.setCurrentKey(id)
         this.ugDetail = detail
      })
    }
  },
  methods: {
    getUserGroups() {
      listUserGroup().then((response) => {
        this.usergroups = response;
      });
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.name.indexOf(value) !== -1;
    },
    handleUGAdd() {
      this.operateNum = 1;
      this.reset();
      this.title = "创建团队";
      this.ugOpen = true;
    },
    handleUGEdit(id) {
      this.operateNum = 2;
      this.reset();
      this.ugForm = {...this.ugDetail};
      this.title = "编辑团队信息";
      this.ugOpen = true;
    },
    handleUGClick(data) {
      this.ugDetail = data;
    },
    handleUGDelete(){
      const ids = this.ugDetail.id;
      const names = this.ugDetail.name;
      this.$confirm('是否确认删除团队名称为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            delUserGroup(ids)
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
        this.newUGId = -1;
        this.getUserGroups();
        this.msgSuccess("删除成功");
      });
    },
    submitUGForm: function () {
      this.$refs["ugForm"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const { action, params } = this.getActionAndParams();
          if (action) {
            action(params)
              .then((response) => {
                this.newUGId = response.id;
                this.msgSuccess("操作成功");
                this.ugOpen = false;
                this.submitLoading = false;
                this.getUserGroups();
              })
              .catch((e) => {
                this.submitLoading = false;
              });
          }
        }
      });
    },
    getActionAndParams() {
      const res = {
        action: undefined,
        params: undefined,
      };
      switch (this.operateNum) {
        case 1:
          res.action = createUserGroup
          res.params = {...this.ugForm}
          break;
        case 2:
          res.action = updateUserGroup
          res.params = {...this.ugForm}
          break;
        default:
          break;
      }
      return res;
    },
    reset() {
      this.ugForm = {
        name: undefined,
        description: undefined,
      };
      this.resetForm("ugForm");
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  height: 1px;
  min-height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #eef0f3;
  &.app-container-noFixedHeight {
    display: block;
    overflow: auto;
  }
  .app-container-left {
    height: 100%;
    background-color: #fff;
    padding: 10px;
  }
  .app-container-right {
    display: flex;
    background-color: #fff;
    flex-direction: column;
    height: 100%;
    padding: 12px 10px 6px 10px;
  }
  .app-container-search {
    padding: 12px 10px 6px 10px;
    margin-bottom: 16px;
    background-color: #fff;
    border-radius: 2px;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin-bottom: 8px;
      }
    }
  }
  .app-container-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 12px;
    background-color: #fff;
    border-radius: 2px;
    .app-container-content-table {
      flex: 1;
      overflow: auto;
      .operate {
        .cell {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
      }
    }
  }
}
.app-container-left-content{
  ::v-deep .el-tree{
    .el-tree-node{
      .el-tree-node__content{
        padding: 8px 16px;
        height: 36px;
      }
      &.is-current .el-tree-node__content{
        background-color: #d4ecf9;
      }
    }
  }
}
.app-container-right{
  .ug-detail-container{
    border: 1px solid #e0dee2;
    padding: 10px;
    margin-bottom: 20px;
    background: #f3f6f9;
    .title-container{
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .title{
        color: rgb(0, 0, 0);
        font-weight: 700;
        font-size: 14px;
        margin-right: 4px;
      }
      .operate-icon{
        margin: 0 4px;
        font-weight: 700;
        font-size: 14px;
      }
    }
    .remark{
      color: rgb(102, 102, 102);
      font-size: 12px;
    }
  }
}
</style>