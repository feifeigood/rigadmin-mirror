<template>
  <el-dialog :title="title" :visible.sync="open" width="760px" @close="handleClose" append-to-body>
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="节点组">
              <el-select 
                :value="selectedFarmId" 
                placeholder="请选择所属节点组" 
                size="small"
                style="width: 100%"
                disabled
              >
                <el-option 
                  v-for="item in farmList"
                  :key="item.id" 
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item 
              class="el_select2Textarea" 
              label="节点名称"
              prop="name" 
              v-if="operateNum == 1"
              :rules="[
                { required: true, message: '节点名称不能为空', trigger: 'change' },
              ]"
            >
              <el-select
                ref="selectToInput"
                v-model="form.name" 
                multiple
                filterable
                allow-create
                default-first-option
                popper-class="selectToInputPopper"
                placeholder="请输入节点名称">
              </el-select>
            </el-form-item>

            <el-form-item 
              label="节点名称"
              prop="name" 
              v-if="operateNum == 2"
              :rules="[
                { required: true, message: '节点名称不能为空', trigger: 'change' },
              ]"
            >
              <el-input 
                v-model="form.name" 
                disabled
                placeholder="请输入节点名称" 
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="labelWrap rule-form-item">
              <div class="labelLabel rule-form-item_label">标签</div>
              <div class="rule-form-item_contentWrap">
                <div class="rule-form-item_contentItem" v-for="(item,index) in form.labels"
                :key="index">
                <el-form-item 
                    :prop="'labels.' + index + '.key'"
                    :rules="[{
                      validator: validateLabelKey(index), trigger: 'change' 
                    }]"
                  >
                    <el-input 
                      :style="{width: '120px'}"
                      v-model="item.key" 
                      placeholder="请输入key" 
                    />
                  </el-form-item>
                  <el-form-item 
                    :prop="'labels.' + index + '.value'"
                  >
                    <el-input 
                      :style="{width: '490px'}"
                      v-model="item.value" 
                      placeholder="请输入value" 
                    />
                  </el-form-item>
                  <i class="el-icon-close" 
                    v-if="form.labels.length > 1"
                    @click="handleDelLabel(index)"
                  ></i>
                </div>

                <a
                  class="addWrap"
                  @click="handleAddLabel"
                >
                  <i class="el-icon-plus"></i>
                  <span>增加标签</span>
                </a>
              </div>
            </div>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getHost, addHost, updateHost} from "@/api/monitor/host";

export default {
  props: {
    operateNum: Number,
    selectedId: Number,
    selectedFarmId: Number,
    farmList: Array
  },
  data(){
    return{
      loading: false,
      submitLoading: false,
      title: undefined,
      open: false,
      form:{},
      rules:{
        name: [
          { required: true, message: "节点名称不能为空", trigger: "change" }
        ],
      }
    }
  },
  watch:{
    operateNum(val){
      if (val == 1) {
        this.reset();
        this.title = '新增节点';
        this.open = true;
        this.$nextTick(() => {
          this.$refs.selectToInput.$refs.input.addEventListener('blur', this.handleSelectBlur)
        })
      }else if(val == 2){
        this.loading = true;
        this.open = true;
        this.reset();
        this.title = "修改节点";
        console.log(this.form)
        getHost(this.selectedId).then(response => {
          this.form = response;
          this.form.labels = this.tranObjToArr(response?.labels);
          this.loading = false;
        }).catch(e=>{
          this.open = false;
        })

      }
    }
  },

  methods:{
    tranObjToArr(obj){
      if (!obj) {
        return []
      }
      return Object.entries(obj).map(item => ({
        key: item[0],
        value: item[1]
      }))
    },
    tranArrToObj(arr){
      if (!arr || arr?.length == 0) {
        return {}
      }
      
      return arr.reduce( (pre, cur) => {
        pre[cur.key]= cur.value;
        return pre;
      }, {})
    },
      // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: '',
        labels:[{
          key: undefined,
          value: undefined
        }]
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const {action, params} = this.getActionAndParams();
          if (action) {
            action(params).then(response => {
              this.msgSuccess("操作成功");
              this.open = false;
              this.submitLoading = false;
              this.$emit('getList')
            }).catch(e=>{
              this.submitLoading = false;
            });
          }
        }
      });
    },
    getActionAndParams(){
      const res = {
        action:undefined,
        params: undefined
      }
      switch (this.operateNum) {
        case 1:
          res.action = addHost,
          res.params = {
            farmId: this.selectedFarmId,
            data: {
              targets: this.form.name,
              labels: this.tranArrToObj(this.form.labels),
            },
          }
          break;
        case 2:
          res.action = updateHost,
          res.params = {
            id: this.form.id,
            data: {
              name: this.form.name,
              labels: this.tranArrToObj(this.form.labels),
            },
          }
          break;
        default:
          break;
      }
      return res;
    },
    handleClose(){
      this.$emit('update:operateNum', 0);
    },
    handleAddLabel(){
      this.form.labels.push(
        {
          key: undefined,
          value: undefined,
        }
      )
    },
    handleDelLabel(index){
      this.form.labels.splice(index,1)
    },
    handleSelectBlur(e){
      if (!this.form.name.includes(e.target.value) && !!e.target.value) {
        this.form.name.push(e.target.value);
      }
    },
    
    validateLabelKey(index){
      const labelList = [...this.form.labels];
      labelList.splice(index,1);
      return (rule, value, callback)=>{
        if (labelList.some(item => item.key?.trim() == value?.trim())) {
          callback(new Error('key值不能重复'));
        }
        callback()
      }
    },
  },
  // beforeDestroy(){
  //   this.$refs.selectToInput.$refs.input.removeEventListener('blur', this.handleSelectBlur)
  // }

}
</script>

<style lang="scss" scoped>
.rule-form-item{
  display: flex;
    .rule-form-item_label{
      flex: 0 0 80px;
      display: flex;
      justify-content: flex-end;
      padding-right: 12px;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
    .rule-form-item_contentWrap{
      ::v-deep .el-form-item{
        .el-form-item__content{
          margin-left: 0 !important;
        }
      }
      .rule-form-item_contentItem{
        display: flex;
        align-items: center;
        .el-icon-close{
          font-size: 20px;
          margin-left: 10px;
          margin-top: -12px;
          cursor: pointer;
        }
        ::v-deep .el-form-item{
          margin-bottom: 16px;
        }
      }
      .addWrap{
        color: var(--current-color,#0960bd) !important;
        opacity: .8;
      }
    }
}
</style>