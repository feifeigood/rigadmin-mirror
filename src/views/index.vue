<template>
  <div class="app-container home" 
    :class="{isLoading: loading}" 
    v-loading='loading'
    element-loading-background="#fff"
  >
    <panel-group 
      :panelList="panelList"
      @handlePanelClick="handlePanelClick" 
    />
    <rank />
    <resource :panelList="panelList"/>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import Rank from './dashboard/rank'
import Resource from './dashboard/resource/index.vue'
import { listDefaultExporter, getExporterNumber} from "@/api/monitor/exporter";
export default {
  name: "index",
  components: {
    PanelGroup,
    Rank,
    Resource
  },
  data(){
    return{
      loading: true,
      panelList: [],
    }
  },
  methods:{
    handlePanelClick(val){
      console.log(val)
    }
  },
  created(){
    this.loading = true;
    listDefaultExporter().then(response => {
      if (response?.length > 0) {
        const res = response.filter(item=> item.visible == 1);
        Promise.all(res.map(item=> getExporterNumber(item.id))).then(resArr => {
          this.panelList = res.map((item, idx) => {
            return{
              ...item,
              num: resArr[idx]?.length || 0
            }
          })
          this.loading = false;
        })
      }
    })

  }
};
</script>

<style scoped lang="scss">
.home{
  &.isLoading{
    height: calc(100vh - 85px);
    overflow: hidden;
  }
}
</style>

