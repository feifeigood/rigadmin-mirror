<template>
  <el-dialog :title="title" :visible.sync="open" width="800px" @close="handleClose" append-to-body>
    <div v-loading="loading" class="detail-container">
      <span class="tag">-</span>
      <span class="itemWrap">
        <span class="label">alert:</span>
        <span class="content">{{detailData.name}}</span>
      </span>
      <span class="itemWrap">
        <span class="label">for:</span>
        <span class="content">{{detailData.duration}}</span>
      </span>
      <span class="itemWrap">
        <span class="label">expr:</span>
        <span class="content">{{`${detailData.clause} ${detailData.comparator} ${detailData.default_value}`}}</span>
      </span>
      <span class="itemWrap isObject">
        <span class="label">labels:</span>
        <span class="contentWrap">
          <span class="contentItem"
            v-for="item of labelList" :key="item[0]"
          >
            <span class="itemKey">{{`${item[0]}:`}}</span>
            <span class="itemValue">{{`${item[1]}`}}</span>
          </span>
        </span>
      </span>
      <span class="itemWrap isObject">
        <span class="label">annotations:</span>
        <span class="contentWrap">
          <span class="contentItem"
            v-for="item of annotationList" :key="item[0]"
          >
            <span class="itemKey">{{`${item[0]}:`}}</span>
            <span class="itemValue">{{`${item[1]}`}}</span>
          </span>
        </span>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { getRuleSample } from "@/api/monitor/rulesample";

export default {
  name:'RuleDetail',
  props: {
    selectedId: Number,
    operateNum: Number,
  },
  data(){
    return{
      // 遮罩层
      loading: true,
      title: undefined,
      open: false,
      detailData: {},
    }
  },
  computed:{
    labelList(){
      if (this.detailData?.labels) {
        return Object.entries(this.detailData?.labels)
      }else{
        return []
      }
    },
    annotationList(){
      if (this.detailData?.annotations) {
        return Object.entries(this.detailData?.annotations)
      }else{
        return []
      }
    }
  },
  watch:{
    operateNum(val){
      if (val == 3) {
        this.title = '规则详情';
        this.open = true;
        this.getDetail(this.selectedId);
      }
    }
  },
  methods:{
    getDetail(id) {
      this.loading = true;
      getRuleSample(id).then(response => {
          this.detailData = response;
          this.loading = false;
        }
      ).catch(e=>{
        this.loading = false;
      });
    },
    handleClose(){
      this.$emit('update:operateNum', 0);
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-container{
    position: relative;
    background-color: #fafafa;
    border: 1px solid hsl(0, 0%, 91%);
    border-radius: 4px 4px;
    margin-top: -20px;
    padding: 8px 16px 8px 32px;
    font-size: 16px;
    font-weight: 600;
    font-family: 'Chinese Quote', 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    .tag{
      position: absolute;
      left: 12px;
      padding: 2px;
    }
    .itemWrap{
      display: flex;
      padding: 2px 0;
      .label{
        margin-right: 8px;
        white-space: nowrap;
      }
      &.isObject{
        flex-direction: column;
        .contentWrap{
          padding-left: 16px;
          .contentItem{
            display: flex;
            .itemKey{
              margin-right: 8px;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

</style>