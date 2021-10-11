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
          <div class="app-container-left-search">
            <el-row>
              <el-col :span="24" style="padding: 10px">
                {{ ugDetail.name }}
              </el-col>
            </el-row>
          </div>
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
        <el-button type="primary" @click="submitUGForm">确 定</el-button>
        <el-button
          @click="
            ugOpen = false;
            reset();
          "
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUserGroup, createUserGroup } from "@/api/system/usergroup";

export default {
  name: "UserGroup",
  data() {
    return {
      loading: true,
      defaultProps: {
        label: "name",
      },
      filterText: "",
      usergroups: [],
      total: 0,

      currentNodekey: "",

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
      this.title = "创建团队";
      this.ugOpen = true;
    },
    handleUGEdit(id) {
      this.title = "编辑团队信息";
      this.ugOpen = true;
    },
    handleUGClick(data) {
      this.ugDetail = data;
    },
    submitUGForm: function () {
      this.$refs["ugForm"].validate((valid) => {
        if (valid) {
          createUserGroup(this.ugForm).then((response) => {
            this.msgSuccess("创建成功");
            this.ugOpen = false;
            this.getUserGroups();
          });
        }
      });
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
</style>