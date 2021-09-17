<template>
  <el-row class="rank-container">
    <el-col :span="6" class="rank-item"
      v-for="item in rankList" :key="item.name"
      v-loading="item.loading"
    >
      <div class="title">{{item.alias}}</div>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <ul class="list">
          <li
            v-for="(v,idx) in item.data" :key="idx"
          >
            <span :class="{active: idx< 3}">{{idx + 1}}</span>
            <span>{{v.instance}}</span>
            <span>{{`${v.value}${item.isPer? '%':''}`}}</span>
          </li>
        </ul>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script>
import { listRank} from "@/api/dashboard";

export default {
  data(){
    return{
      rankList:[
        {
          alias:'CPU使用率排行榜',
          name: 'cpu_usage',
          data: [],
          isPer: true,
          loading: true
        },
        {
          alias:'内存使用率排行榜',
          name: 'mem_usage',
          data: [],
          isPer: true,
          loading: true
        },
        {
          alias:'活动会话数排行榜',
          name: 'mysql_active_session',
          data: [],
          isPer: false,
          loading: true
        },
        {
          alias:'IOPS排行榜',
          name: 'disk_iops',
          data: [],
          isPer: false,
          loading: true
        },
      ]
    }

  },
  created(){
    this.rankList.forEach( (item,idx) => {
      listRank(item.name).then(response => {
        let data = [];
        if (response?.data?.result?.length > 0) {
          const res = response?.data?.result;
          data = res.map(item => ({
            instance: item?.metric?.instance,
            value: item?.value[1]?.substring(0,4)
          }))
          this.rankList[idx].data = data;
          this.rankList[idx].loading = false;
        }
      })
    } )
  }
}
</script>

<style lang="scss" scoped>
  .rank-container{
    height: 400px;
    background-color: #fff;
    padding: 8px 0;
    box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
    .rank-item{
      height: 100%;
      border-right: 1px solid rgba(0,0,0,.15);
      ::v-deep .el-scrollbar{
        height: calc(100% - 36px);
        .scrollbar-wrapper{
          overflow-x: hidden !important;
        }
      }
      &:last-child{
        border-right: none;
      }
      .title{
        padding: 6px 12px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        font-weight: 600;
      }
      .list{
        li{
          padding: 8px 12px;
          &>span{
            color: rgba(0,0,0,.6);
            font-size: 14px;
            font-weight: 600;
          }
          &>span.active{
            background-color: #314659!important;
            color: #fff!important;
          }
          &>span:first-child{
            display: inline-block;
            background-color: #f0f2f5;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            height: 20px;
            line-height: 20px;
            width: 20px;
            text-align: center;
            margin-right: 26px;
          }
          &>span:last-child{
            float: right;
          }
        }
      }
    }
  }
</style>