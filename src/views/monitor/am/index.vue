<template>
  <div class="app-container">
    <div class="app-container-search"></div>
    <div class="app-container-content">
      <el-table v-loading="loading" :data="alertgroups" border>
        <el-table-column
          label="告警名称"
          prop="allLabels.active.alertname[0]"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="告警实例"
          width="400"
          prop="allLabels.active.instance"
          :formatter="instanceFormatter"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="告警级别"
          prop="allLabels.active.severity[0]"
          width="100"
          align="center"
          :formatter="severityFormatter"
        />
        <el-table-column
          label="告警开始时间"
          width="160"
          :formatter="startsAtFormatter"
        />
        <el-table-column
          label="告警提示信息"
          :formatter="annotationsFormatter"
        />
        <el-table-column label="操作" align="left" width="100">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-search"
              @click="handleDetail(scope.row)"
              >详细</el-link
            >
            <el-link
              type="primary"
              icon="el-icon-close-notification"
              @click="handleAck(scope.row)"
              >暂时屏蔽</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="paginationParams.pageNum"
        :limit.sync="paginationParams.pageSize"
        @pagination="getAlerts"
      />
    </div>
  </div>
</template>

<script>
import { listAlerts, ackAlert, listUpstreams } from "@/api/monitor/am";
import dateFormat from "dateformat";

export default {
  name: "Alerts",
  data() {
    return {
      loading: true,
      alertgroups: [],
      total: 0,
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
      },
      title: "",
      open: false,
      // search
      showSearch: true,
      queryParams: { filters: ["@receiver=pager", "@state=active"] },

      upstreams: {},
    };
  },
  created() {
    this.getUpstreams();
    this.getAlerts();
  },
  methods: {
    getUpstreams() {
      listUpstreams().then((response) => {
        this.upstreams = response;
      });
    },
    getAlerts() {
      this.loading = true;
      listAlerts(this.queryParams)
        .then((response) => {
          const start =
            (this.paginationParams.pageNum - 1) *
            this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;

          this.alertgroups = response.alertGroups.slice(start, end);
          this.total = response.alertGroups.length;
          this.loading = false;
        })
        .catch((e) => {
          this.silences = [];
          this.loading = false;
        });
    },
    handleQuery() {
      this.paginationParams.pageNum = 1;
      this.getAlerts();
    },
    handleDetail(row) {
      this.msgSuccess("功能暂未实现!");
    },
    handleAck(row) {
      var now = new Date();
      var alertname = row.allLabels.active.alertname[0];
      var alertmanager = "";
      var startsAt = dateFormat(now, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
      var endsAt = dateFormat(
        new Date(now.getTime() + 30 * 60000),
        "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
      );
      this.upstreams.instances.every((v) => {
        if (v.cluster == row.alerts[0].alertmanager[0].cluster) {
          alertmanager = v.clusterMembers[0];
          return false;
        }

        return true;
      });

      ackAlert(alertmanager, {
        matchers: [
          {
            name: "alertname",
            value: alertname,
            isRegex: false,
            isEqual: true,
          },
        ],
        startsAt: startsAt,
        endsAt: endsAt,
        createdBy: "mgmt_front",
        comment: "Alert ACK!",
      })
        .then(() => {
          this.getAlerts();
        })
        .catch((e) => {
          this.msgError("暂时屏蔽失败: " + e);
        });
    },
    startsAtFormatter(row, column, cellValue, index) {
      const startsAt = Date.parse(row.alerts[0].startsAt);
      return dateFormat(startsAt, "yyyy/mm/dd hh:MM:ss");
    },
    annotationsFormatter(row, column, cellValue, index) {
      var summaries = [];
      row.alerts.forEach((v) => {
        if (v.annotations) {
          v.annotations.forEach((item) => {
            if (item.name == "summary") {
              summaries.push(item.value);
            }
          });
        }
      });
      return summaries.join("; ");
    },
    instanceFormatter(row, column, cellValue, index) {
      var instances = [];
      row.alerts.forEach((v) => {
        if (v.labels.instance) {
          instances.push(v.labels.instance.split(":")[0]);
        }
      });
      return instances.join(" | ");
    },
    severityFormatter(row, column, cellValue, index) {
      if (cellValue == "info") {
        return (
          <el-tag type="info" size="small">
            一般告警
          </el-tag>
        );
      } else if (cellValue == "warning") {
        return (
          <el-tag type="warning" size="small">
            严重告警
          </el-tag>
        );
      } else if (cellValue == "critical") {
        return (
          <el-tag type="danger" size="small">
            致命告警
          </el-tag>
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>