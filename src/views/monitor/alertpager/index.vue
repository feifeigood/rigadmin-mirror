<template>
  <div class="app-container">
    <div class="app-container-content">
      <el-table
        v-loading="loading"
        :data="alertList"
        border
        style="width: 100%"
        :row-class-name="severityClassName"
        max-height="800"
      >
        <el-table-column
          fixed
          label="告警实例"
          align="center"
          prop="instance"
          width="180"
        />
        <el-table-column
          fixed
          label="告警级别"
          align="center"
          prop="severity"
          width="80"
          :formatter="convertSeverity"
        />
        <el-table-column
          fixed
          label="告警名称"
          align="left"
          prop="alertname"
          width="200"
        />
        <el-table-column
          fixed
          label="告警描述"
          align="left"
          prop="description"
        />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >详细</el-button
            >
            <el-button type="text" size="small">屏蔽</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style>
.el-table .warning-row {
  background: #ffff33;
}

.el-table .error-row {
  background: #ff3333;
}
</style>

<script>
import { listAlerts } from "@/api/monitor/alertpager";
export default {
  name: "Alertpager",
  data() {
    return {
      loading: true,
      alertList: [],
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getAlerts();
  },
  methods: {
    convertSeverity(row, column, cellValue, index) {
      if (row.severity === "warning") {
        return "一般告警";
      } else if (row.severity === "critical") {
        return "严重告警";
      }
      return "提示信息";
    },

    severityClassName({ row, rowIndex }) {
      if (row.severity === "warning") {
        return "warning-row";
      } else if (row.severity === "critical") {
        return "error-row";
      }
      return "";
    },

    getAlerts() {
      this.loading = true;

      listAlerts({
        filters: ["@receiver=pager", "@state=active"],
        gridLabel: "severity",
      })
        .then((response) => {
          var alerts = [];
          // 解析数据
          for (var i = 0; i < response.grids.length; i++) {
            var severity = response.grids[i].labelValue;
            for (var j = 0; j < response.grids[i].alertGroups.length; j++) {
              var alertname = response.grids[i].alertGroups[j].labels.alertname;
              for (
                var k = 0;
                k < response.grids[i].alertGroups[j].alerts.length;
                k++
              ) {
                var instance =
                  response.grids[i].alertGroups[j].alerts[k].labels.instance;

                if (instance == "" || instance == undefined) {
                  instance =
                    response.grids[i].alertGroups[j].alerts[k].labels.domain;
                } else if (instance != "") {
                  instance = instance.split(":")[0];
                }

                var description = "";
                for (
                  var l = 0;
                  l <
                  response.grids[i].alertGroups[j].alerts[k].annotations.length;
                  l++
                ) {
                  if (
                    (response.grids[i].alertGroups[j].alerts[k].annotations[
                      l
                    ].name = "description")
                  ) {
                    description =
                      response.grids[i].alertGroups[j].alerts[k].annotations[l]
                        .value;
                  }
                }
                alerts.push({
                  severity: severity,
                  instance: instance,
                  alertname: alertname,
                  description: description,
                });
                description = "";
              }
            }
          }

          this.alertList = alerts;
          this.loading = false;
        })
        .catch((e) => {
          this.alertList = [];
          this.loading = false;
        });
    },
  },
};
</script>
