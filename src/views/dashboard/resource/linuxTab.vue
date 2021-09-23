<template>
<<<<<<< HEAD:src/views/dashboard/resource/hostTab.vue
  <el-table style="width: 100%" v-loading="loading" :data="tableData">
    <el-table-column
      prop="hostname"
      label="主机名"
      sortable
      show-overflow-tooltip
    >
    </el-table-column>
    <el-table-column prop="instance" label="IP" sortable> </el-table-column>
    <el-table-column prop="kernalVersion" label="内核版本" sortable>
    </el-table-column>
    <el-table-column prop="uptime" label="启动时间" sortable> </el-table-column>
    <el-table-column prop="cpuNum" label="CPU核数" sortable> </el-table-column>
    <el-table-column prop="mem" label="内存(MB)" sortable> </el-table-column>
    <el-table-column prop="swap" label="交换空间(MB)" sortable>
    </el-table-column>
    <el-table-column prop="pids" label="进程数" sortable> </el-table-column>
    <el-table-column prop="cpuUsage" label="CPU使用率(%)" sortable>
    </el-table-column>
    <el-table-column prop="memUsage" label="内存使用率(%)" sortable>
    </el-table-column>
  </el-table>
=======
  <div>linux-tab</div>
>>>>>>> 6d2ddc1e02361f762cbb7d029a02f49ab90f2fb5:src/views/dashboard/resource/linuxTab.vue
</template>

<script>
import { listDefaultExporter } from "@/api/monitor/exporter";
import { getHostsByAppledExporter } from "@/api/monitor/host";
import {
  nodeBootTime,
  nodeUname,
  nodeCPUNum,
  nodeMem,
  nodeSwap,
  nodePids,
  nodeCPUUsage,
  nodeMemUsage,
} from "@/api/monitor/stats";

export default {
<<<<<<< HEAD:src/views/dashboard/resource/hostTab.vue
  name: "HostTab",
  data() {
    return {
      tableData: [],
      loading: true,
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },

  created() {
    this.getHosts();
  },

  methods: {
    getHosts() {
      this.loading = true;

      listDefaultExporter({ job: "node" }).then((results) => {
        if (results?.length > 0) {
          const start =
            (this.paginationParams.pageNum - 1) *
            this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          let port = results[0].port;
          getHostsByAppledExporter(results[0].id).then((results) => {
            if (results?.length > 0) {
              let instances = [];
              results.map((item) => {
                instances.push(item.name + ":" + port);
              });

              let qInstance = instances.slice(start, end).join("|");
              let hosts = {};
              instances.slice(start, end).map((instance) => {
                hosts[instance] = {};
              });
              Promise.all([
                nodeUname(qInstance),
                nodeBootTime(qInstance),
                nodeMem(qInstance),
                nodeCPUNum(qInstance),
                nodeSwap(qInstance),
                nodePids(qInstance),
                nodeCPUUsage(qInstance),
                nodeMemUsage(qInstance),
              ]).then((results) => {
                console.log(results);
                results[0]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["hostname"] = item?.metric?.nodename;
                  data["instance"] = item?.metric?.instance.split(":")[0];
                  data["kernalVersion"] = item?.metric?.release;
                  hosts[item?.metric?.instance] = data;
                });

                results[1]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["uptime"] = parseInt(item?.value[1]);
                  hosts[item?.metric?.instance] = data;
                });
=======
  name:'LinuxTab'
}
</script>
>>>>>>> 6d2ddc1e02361f762cbb7d029a02f49ab90f2fb5:src/views/dashboard/resource/linuxTab.vue

                results[2]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["mem"] = (
                    parseInt(item?.value[1]) /
                    1024 /
                    1024
                  ).toFixed(2);
                  hosts[item?.metric?.instance] = data;
                });

                results[3]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["cpuNum"] = parseInt(item?.value[1]);
                  hosts[item?.metric?.instance] = data;
                });

                results[4]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["swap"] = (
                    parseInt(item?.value[1]) /
                    1024 /
                    1024
                  ).toFixed(2);
                  hosts[item?.metric?.instance] = data;
                });

                results[5]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["pids"] = parseInt(item?.value[1]);
                  hosts[item?.metric?.instance] = data;
                });

                results[6]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["cpuUsage"] = parseFloat(item?.value[1]).toFixed(2);
                  hosts[item?.metric?.instance] = data;
                });

                results[7]?.data?.result.map((item) => {
                  let data = hosts[item?.metric?.instance];
                  data["memUsage"] = parseFloat(item?.value[1]).toFixed(2);
                  hosts[item?.metric?.instance] = data;
                });

                this.tableData = Object.values(hosts);
                this.loading = false;
              });
            }
          });
        }
      });
    },
  },
};
</script>
