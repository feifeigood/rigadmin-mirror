<template>
  <div class="resource-container">
    <div class="title-container">
      <div class="title">监管资源</div>
      <div class="search">
        <el-input
          v-model="searchParams"
          placeholder="自定义名/主机/ip"
          clearable
          size="small"
          style="width: 280px"
          @keyup.enter.native="handleQuery"
        />
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :key="item.id"
        v-for="item in panelList"
        :label="item.alias"
        :name="item.logo"
      >
        <component :is="`${item.logo}-tab`"
          :queryParams="queryParams"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import MysqlTab from "./mysqlTab.vue";
import OracleTab from "./oracleTab.vue";
import LinuxTab from "./linuxTab.vue";

const tabCompList = {
  mysql: MysqlTab,
  oracle: OracleTab,
  linux: LinuxTab,
};

export default {
  components: { OracleTab, MysqlTab, LinuxTab },
  props: {
    panelList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      activeName: undefined,
      // 查询参数
      searchParams: undefined,
      queryParams: "",
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams = this.searchParams;
    },
  },
  watch: {
    panelList() {
      this.activeName = this.panelList[0]?.logo;
    },
  },
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