<template>
  <div class="app-container">
    <div class="app-container-search">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px" @submit.native.prevent>
        <el-form-item label="所属节点组" prop="farm_id">
          <el-select 
            v-model="queryParams.farm_id" 
            filterable placeholder="请选择节点组" size="small"
            style="width: 240px"
            @change="handleQuery"
          >
            <el-option 
              v-for="item in farmList"
              :key="item.id" 
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入节点名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container-content">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            :disabled="!$store.getters.isOperator"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="hostList" 
        border
      >
        <el-table-column label="节点编号" align="center" prop="id" width="80"/>
        <el-table-column label="节点名称" align="left" width="120" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="标签" align="left" prop="labels">
          <template slot-scope="scope">
            <el-tag 
              class="labelTag"
              v-for="(value,key,index) in (scope.row.labels)"
              :key="index"
            >{{`${key}=${value}`}}</el-tag>

          </template>
        </el-table-column>
        <el-table-column label="所属节点组" align="left" width="120" prop="farm_id" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ transNodeName(scope.row.farm_id) }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          v-for="item in activeColumns"
          :key="item.key"
          :label= "item.label" 
          align="left" 
          :prop="item.prop" 
          width="90" 
        />
        <el-table-column label="操作" align="center" width="180" class-name="operate">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              :disabled="!$store.getters.isOperator || source !== 'rigserver'"
            >修改</el-link>
            <el-link
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              :disabled="!$store.getters.isOperator || source !== 'rigserver'"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="paginationParams.pageNum"
        :limit.sync="paginationParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <add-form 
      :operateNum.sync="operateNum"
      :selectedId="selectedId"
      :selectedFarmId="queryParams.farm_id"
      :farmList="farmList"
      @getList="getList"
    />
  </div>
</template>

<script>
import { listHost, delHost, addHost, updateHost} from "@/api/monitor/host";
import { listNode} from "@/api/monitor/node";
import AddForm from './components/addForm.vue';

export default {
  name: "Host",
  components: { AddForm },
  data() {
    return {
      //operateNum 0: 无, 1: 新增，2: 修改
      operateNum: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      items: [],
      selectedId: undefined,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // host数据
      hostList: [],
      farmList:[],
      // 查询参数
      queryParams: {
        farm_id: undefined,
        name: undefined,
      },

      paginationParams:{
        pageNum:1,
        pageSize: 10,
      },
      // 列信息
      columns: [],
    };
  },
  computed: {
    activeColumns() {
      return this.columns?.filter(item => item.visible) || [];
    },
    source(){
      return this.farmList.filter(item=> item.id == this.queryParams.farm_id)[0]?.source
    }
  },
  created() {
    this.loading = true;

    Promise.all([listNode()]).then(([response_farm]) => {
      this.farmList = response_farm;
      if (this.$route.params.farm_id) {
        this.queryParams.farm_id = this.$route.params.farm_id;
      }else{
        this.queryParams.farm_id = response_farm[0].id;
      }
      this.getList();
    }).catch(e =>{
      this.farmList = [];
    })
    
  },
  methods: {
    tranObjToArr(obj){
      if (!obj) {
        return []
      }
      return Object.entries(obj).map(item => ({
        key: item[0],
        value: item[1]
      }))
    },
    /** 查询host列表 */
    getList() {
      this.loading = true;
      listHost(this.queryParams).then(response => {
          const start = (this.paginationParams.pageNum-1) * this.paginationParams.pageSize;
          const end = start + this.paginationParams.pageSize;
          const res = response.slice(start, end);
          this.hostList = res.map(item => ({
            id: item.id,
            name: item.name,
            farm_id: item.farm_id,
            labels: item.labels,
            ...item.labels
          }));
          console.log(res)
          this.columns = this.getColums(res);
          console.log(res)
          this.total = response.length;
          this.loading = false;
        }
      ).catch(e=>{
        this.hostList=[];
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.paginationParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams={
        farm_id: undefined,
        name: undefined,
      },
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.operateNum = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.operateNum = 2;
      this.selectedId = row.id;
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      const names = row.name;
      console.log(row)
      this.$confirm('是否确认删除节点名称为"' + names + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              delHost(ids).then(()=>{
                instance.confirmButtonLoading = false;
                done();
              }).catch(e=>{
                instance.confirmButtonLoading = false;
                this.msgError("删除失败");
              })
            } else {
              done();
            }
          }
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    transNodeName(id){
      return this.farmList.filter(item=> item.id == id)[0]?.name || '-';
    },
    getColums(arr){
      if (arr.length == 0) {
        return undefined;
      }
      const res_temp = arr.reduce((pre, cur)=>{
        if (cur.labels) {
          Object.keys(cur.labels).forEach(v => pre.add(v))
        }
        return pre;
      },new Set());
      const res = [...res_temp].map((v, idx)=>({ 
        key: idx, 
        label: v, 
        visible: false,
        prop:v
      }))
      return res
    }

  }
};
</script>
<style lang="scss" scoped>
  .app-container-content{
    ::v-deep .operate{
        .cell{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
    .labelTag{
      margin-right: 6px;
      margin-top: 4px;
    }
  }
</style>