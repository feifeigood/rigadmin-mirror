<template>
  <div class="app-container">
    <div class="app-container-search"></div>
    <div class="app-container-content"></div>
  </div>
</template>

<script>
import { listAlerts } from "@/api/monitor/am";

export default {
  name: "Alerts",
  data() {
    return {
      loading: true,
      alerts: [],
      total: 0,
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
      },
      title: "",
      open: false,
      // search
      showSearch: true,
      queryParams: {},
    };
  },
  created() {
    this.getAlerts();
  },
  methods: {
    getAlerts() {
      this.loading = true;
      listAlerts(this.queryParams)
        .then((response) => {
          const start =
            (this.paginationParams.pageNum - 1) *
            this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;

          this.alerts = response.alertGroups.slice(start, end);
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
  },
};
</script>

<style lang="scss" scoped>
</style>