<template>
  <div class="resource-container">
    <div class="title-container">
      <div class="title">监管资源</div>
      <div class="search">
        <el-form :model="queryParams" ref="queryForm" @submit.native.prevent>
          <el-form-item prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="自定义名/主机/ip"
              clearable
              size="small"
              style="width: 280px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
<<<<<<< HEAD
      <el-tab-pane label="主机" name="first">
        <host-tab />
=======
      <!-- <el-tab-pane label="Oracle" name="first">
        <oracle-tab />
>>>>>>> 6d2ddc1e02361f762cbb7d029a02f49ab90f2fb5
      </el-tab-pane>
      <el-tab-pane label="MySQL" name="second">
        <mysql-tab />
      </el-tab-pane>
<<<<<<< HEAD
      <el-tab-pane label="Oracle" name="third">
        <oracle-tab />
=======
      <el-tab-pane label="主机" name="third">
        <host-tab />
      </el-tab-pane> -->
      <el-tab-pane 
        :key="item.id"
        v-for="item in panelList"
        :label="item.alias"
        :name="item.logo"
      >
      <component :is="`${item.logo}-tab`"></component>
>>>>>>> 6d2ddc1e02361f762cbb7d029a02f49ab90f2fb5
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
<<<<<<< HEAD
import HostTab from "./hostTab.vue";
import MysqlTab from "./mysqlTab.vue";
import oracleTab from "./oracleTab.vue";
export default {
  components: { oracleTab, MysqlTab, HostTab },
  data() {
    return {
      activeName: "first",
=======
import MysqlTab from './mysqlTab.vue';
import OracleTab from './oracleTab.vue';
import LinuxTab from './linuxTab.vue';

const tabCompList = {
  mysql: MysqlTab,
  oracle: OracleTab,
  linux: LinuxTab,
}

export default {
  components: { OracleTab, MysqlTab, LinuxTab },
  props:{
    panelList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      activeName: undefined,
>>>>>>> 6d2ddc1e02361f762cbb7d029a02f49ab90f2fb5
      // 查询参数
      queryParams: {
        name: undefined,
      },
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /** 搜索按钮操作 */
<<<<<<< HEAD
    handleQuery() {},
  },
=======
    handleQuery() {
    },

  },
  watch:{
    panelList(){
      this.activeName = this.panelList[0]?.logo
    }
  }
>>>>>>> 6d2ddc1e02361f762cbb7d029a02f49ab90f2fb5
};
</script>
<style lang="scss" scoped>
.resource-container {
  margin-top: 32px;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  .title-container {
    display: flex;
    justify-content: space-between;
    .search {
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>