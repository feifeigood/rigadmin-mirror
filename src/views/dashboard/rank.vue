<template>
  <el-row :gutter="18" class="rank-container">
    <el-col
      :span="6"
      class="rank-item"
      v-for="item in rankList"
      :key="item.name"
      v-loading="item.loading"
    >
      <div class="rank-itemWrap">
        <div class="title">{{ item.alias }}</div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-empty description="暂无数据" :image-size="60" v-if="item.data.length == 0"></el-empty>
          <ul class="list" v-else>
            <li
              v-for="(v, idx) in item.data"
              :key="idx"
              :class="{ active: idx < 3 }"
            >
              <div class="serialNum">{{ idx + 1 }}</div>
              <div class="textWrap">
                <span>{{ v.instance }}</span>
                <span class="progressWrap">
                  <el-progress
                    :percentage="+v.value > 100 ? 100 : +v.value"
                    :format="progressFormat(+v.value, item.isPer)"
                  ></el-progress>
                </span>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {
  cpuUsageRank,
  memUsageRank,
  mysqlActiveSessionRank,
  diskIOPSRank,
} from "@/api/monitor/stats";

export default {
  data() {
    return {
      rankList: [
        {
          alias: "CPU使用率排行榜",
          name: "cpu_usage",
          data: [],
          isPer: true,
          loading: true,
          api: cpuUsageRank,
        },
        {
          alias: "内存使用率排行榜",
          name: "mem_usage",
          data: [],
          isPer: true,
          loading: true,
          api: memUsageRank,
        },
        {
          alias: "活动会话数排行榜",
          name: "mysql_active_session",
          data: [],
          isPer: false,
          loading: true,
          api: mysqlActiveSessionRank,
        },
        {
          alias: "IOPS排行榜",
          name: "disk_iops",
          data: [],
          isPer: false,
          loading: true,
          api: diskIOPSRank,
        },
      ],
    };
  },
  methods: {
    progressFormat(value, isPer) {
      return () => {
        if (isPer) {
          return value + "%";
        } else {
          return value.toString();
        }
      };
    },
  },
  created() {
    this.rankList.forEach((item, idx) => {
      item.api().then((response) => {
        let data = [];
        if (response?.data?.result?.length > 0) {
          const res = response?.data?.result;
          data = res.slice(0, 5).map((item) => ({
            instance: item?.metric?.instance,
            value: item?.value[1]?.substring(0, 4),
          }));
        }
        this.rankList[idx].data = data;
        this.rankList[idx].loading = false;
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.rank-container {
  height: 300px;
  // background-color: #fff;
  // padding: 8px 0;
  // box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
  .rank-item {
    height: 100%;
    overflow: hidden;
    .rank-itemWrap {
      height: 100%;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      border-radius: 16px;
    }
    ::v-deep .el-scrollbar {
      height: calc(100% - 36px);
      .scrollbar-wrapper {
        overflow-x: hidden !important;
      }
    }
    &:last-child {
      border-right: none;
    }
    .title {
      padding: 6px 12px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      font-weight: 600;
    }
    .list {
      li {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        & > .serialNum {
          flex: 0 0 20px;
          background-color: #f0f2f5;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          height: 20px;
          line-height: 20px;
          width: 20px;
          text-align: center;
          margin-right: 26px;
          color: rgba(0, 0, 0, 0.6);
        }
        & > .textWrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
          font-weight: 600;
        }
        &.active > .serialNum {
          background-color: var(--current-color, #0960bd) !important;
          color: #fff !important;
        }
      }
    }
  }
}
</style>