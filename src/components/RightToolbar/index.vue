<template>
  <div class="top-right-btn">
    <el-row>
      <!-- <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip> -->
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-popover
          placement="bottom-end"
          width="180"
          trigger="click"
        >
        
          <div class="cloumnWrap">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-divider></el-divider>
            <div class="cloumnList">
              <el-scrollbar style="height:100%">
                <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange">
                  <el-checkbox class="cloumnItem" v-for="item in columns" :label="item.key" :key="item.key">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>



          <el-button size="mini" circle icon="el-icon-menu" slot="reference"/>
        </el-popover>
      </el-tooltip>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {
      // 显隐数据
      checkedList: [],
      checkAll: false,
      isIndeterminate: true
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
    },
  },
  created() {
    // 显隐列初始默认隐藏列
    for (let item in this.columns) {
      if (this.columns[item].visible === true) {
        this.checkedList.push(this.columns[item].key);
      }
    }
    let checkedCount = this.checkedList?.length || 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < (this.columns?.length || 0);
    this.checkAll = checkedCount === (this.columns?.length || 0);
  },
  watch:{
    columns(val){
      this.checkAll = this.checkedList?.length === (val?.length || 0);
    }
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
    handleCheckAllChange(val) {
      this.checkedList = val ? this.columns.map(item=> item.key) : [];
      this.isIndeterminate = false;
      this.dataChange(this.checkedList);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columns.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length;
      this.dataChange(value);
    },

    dataChange(data) {
      for (var item in this.columns) {
        const key = this.columns[item].key;
        this.columns[item].visible = !!data.includes(key);
      }
    },

  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-divider--horizontal{
  margin: 8px 0;
}
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
::v-deep .is-circle{
  margin-left: 10px !important;
}
::v-deep .el-scrollbar__wrap{
  overflow-x: hidden;
  overflow-y: auto;
}
.cloumnWrap{
  width: 160px;
  margin-right: -20px;
  .cloumnList{
    height: 260px;
    .cloumnItem{
      display: block;
      margin: 8px 0;
    }
  }

}
</style>
