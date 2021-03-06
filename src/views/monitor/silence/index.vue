<template>
  <div class="app-container">
    <div class="app-container-search">
      <div>
        <el-input
          placeholder="请输入屏蔽策略关键字"
          v-model="queryParams.searchTerm"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </div>
    </div>
    <div class="app-container-content">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd()"
            >新建告警屏蔽</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getSilences"
        ></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="silences" border>
        <el-table-column
          label="规则ID"
          prop="silence.id"
          width="80"
          show-overflow-tooltip
        />

        <el-table-column
          label="规则匹配条件"
          prop="silence.matchers"
          show-overflow-tooltip
          :formatter="matchersFormatter"
        />
        <el-table-column
          label="到期时间"
          prop="silence.endsAt"
          width="160"
          show-overflow-tooltip
          :formatter="endsAtFormatter"
        />
        <el-table-column
          label="状态"
          prop="isExpired"
          align="center"
          :formatter="statusFormatter"
          width="120"
        />
        <el-table-column
          label="创建人"
          prop="silence.createdBy"
          width="80"
          show-overflow-tooltip
        />
        <el-table-column
          label="屏蔽原因"
          prop="silence.comment"
          width="160"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改</el-link
            >
            <el-link
              type="primary"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="paginationParams.pageNum"
        :limit.sync="paginationParams.pageSize"
        @pagination="getSilences"
      />
    </div>
  </div>
</template>

<script>
import { listUpstreams, deleteSilence, listSilence } from "@/api/monitor/am";
import dateFormat from "dateformat";

export default {
  name: "Silence",
  data() {
    return {
      // table params
      loading: true,
      silences: [],
      total: 0,
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // dialog params
      title: "",
      open: false,
      // search
      showSearch: true,
      queryParams: {},

      upstreams: {},
    };
  },
  created() {
    this.getUpstreams();
    this.getSilences();
  },
  methods: {
    getUpstreams() {
      listUpstreams().then((response) => {
        this.upstreams = response;
      });
    },
    getSilences() {
      this.loading = true;
      listSilence(this.queryParams)
        .then((response) => {
          const start =
            (this.paginationParams.pageNum - 1) *
            this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          this.silences = response.slice(start, end);
          this.total = response.length;
          this.loading = false;
        })
        .catch((e) => {
          this.silences = [];
          this.loading = false;
        });
    },
    statusFormatter(row, column, cellValue, index) {
      return cellValue ? (
        <el-tag type="danger" size="small">
          已失效
        </el-tag>
      ) : (
        <el-tag type="success" size="small">
          生效中 ( {row.alertCount} )
        </el-tag>
      );
    },
    matchersFormatter(row, column, cellValue, index) {
      var matchers = [];
      for (var i = 0; i < cellValue.length; i++) {
        matchers.push(
          <el-tag>
            {cellValue[i].name}
            {cellValue[i].isEqual ? "=" : "!"}
            {cellValue[i].isRegex ? "~" : ""}
            {cellValue[i].value}
          </el-tag>
        );
      }
      return matchers;
    },
    endsAtFormatter(row, column, cellValue, index) {
      const endsAt = Date.parse(row.silence.endsAt);
      return dateFormat(endsAt, "yyyy/mm/dd hh:MM:ss");
    },
    handleAdd() {
      this.msgSuccess("功能暂未实现!");
    },
    handleDelete(row) {
      this.$confirm("确认删除告警屏蔽策略?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            var name = "";
            this.upstreams.instances.every((v) => {
              if (v.cluster == row.cluster) {
                name = v.clusterMembers[0];
                return false;
              }

              return true;
            });

            if (name == "") {
              this.msgError("删除屏蔽策略失败, 没有找到匹配的实例名称");
              return;
            }

            deleteSilence(name, row.silence.id)
              .then(() => {
                instance.confirmButtonLoading = false;
                done();
              })
              .catch((e) => {
                this.msgError("删除屏蔽策略失败: " + e);
              });
          }
        },
      }).then(() => {
        this.getSilences();
        this.msgSuccess("删除成功!");
      });
    },
    handleEdit(row) {
      this.msgSuccess("功能暂未实现!");
    },
    handleQuery() {
      this.paginationParams.pageNum = 1;
      this.getSilences();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container-content {
  .cell .el-tag {
    margin-right: 10px;
    margin-top: 10px;
  }
}
</style>