<template>
  <el-dialog :title="title" :visible.sync="open" width="760px" @close="handleClose" append-to-body>
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户端">
              <el-select 
                :value="selectedExporterId" 
                placeholder="请选择所属客户端" 
                size="small"
                style="width: 100%"
                disabled
              >
                <el-option 
                  v-for="item in exporterList"
                  :key="item.id" 
                  :label="item.alias"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规则名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入规则名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="持续时间" prop="duration">
              <el-input v-model="form.duration" placeholder="ex:1m or 1h or 1d" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="表达式" prop="clause">
              <el-input 
                type="textarea"
                :autosize="{ minRows: 2}"
                v-model="form.clause" 
                placeholder="请输入表达式" 
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="对比符" prop="comparator">
              <el-select 
                v-model="form.comparator" 
                placeholder="请选择对比符" size="small"
                style="width: 100%"
              >
                <el-option 
                  v-for="val in comparatorList"
                  :key="val" 
                  :label="val"
                  :value="val">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认值" prop="default_value">
              <el-input v-model="form.default_value" placeholder="默认值" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规则描述" prop="description">
              <el-input 
                v-model="form.description" 
                placeholder="请输入规则描述" 
                type="textarea"
                :autosize="{ minRows: 3}"
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
                      required: true, message: 'key不能为空', trigger: 'change'
                    },{
                      validator: validateLabelKey(index), trigger: 'change' 
                    }]"
                  >
                    <el-input 
                      :style="{width: '120px'}"
                      v-model="item.key" 
                      placeholder="请输入key" 
                      :disabled="item.key == 'severity'"
                    />
                  </el-form-item>
                  <el-form-item 
                    :prop="'labels.' + index + '.value'"
                    :rules="[{
                      required: true, message: 'value不能为空', trigger: 'change'
                    }]"
                  >
                    <el-input 
                      :style="{width: '490px'}"
                      v-model="item.value" 
                      placeholder="请输入value" 
                    />
                  </el-form-item>
                  <i class="el-icon-close" 
                    v-if="form.labels.length > 1 && item.key !== 'severity'"
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
        <el-row>
          <el-col :span="24">
            <div class="annotationWrap rule-form-item">
              <div class="annotationLabel rule-form-item_label">注解</div>
              <div class="rule-form-item_contentWrap">
                <div class="rule-form-item_contentItem" v-for="(item,index) in form.annotations"
                :key="index">
                <el-form-item 
                    :prop="'annotations.' + index + '.key'"
                    :rules="[{
                      required: true, message: 'key不能为空', trigger: 'change'
                    },{
                      validator: validateAnnotationKey(index), trigger: 'change' 
                    }]"
                  >
                    <el-input 
                      :style="{width: '120px'}"
                      v-model="item.key" 
                      placeholder="请输入key" 
                    />
                  </el-form-item>
                  <el-form-item 
                    :prop="'annotations.' + index + '.value'"
                    :rules="[{
                      required: true, message: 'value不能为空', trigger: 'change'
                    }]"
                  >
                    <el-input 
                      :style="{width: '490px'}"
                      v-model="item.value" 
                      placeholder="请输入value" 
                    />
                  </el-form-item>
                  <i class="el-icon-close" 
                    v-if="form.annotations.length > 1"
                    @click="handleDelAnnotation(index)"
                  ></i>
                </div>

                <a
                  class="addWrap"
                  @click="handleAddAnnotation"
                >
                  <i class="el-icon-plus"></i>
                  <span>增加注解</span>
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
import { getRuleSample, delRuleSample, addRuleSample, updateRuleSample,changeRuleSampleStatus} from "@/api/monitor/rulesample";
import * as v from '@/utils/validate'
export default {
  props: {
    operateNum: Number,
    selectedId: Number,
    selectedExporterId: Number,
    exporterList: Array
  },
  data(){
    return{
      comparatorList:['==', '!=', '<=', '<', '>=', '>'],
      loading: false,
      submitLoading: false,
      title: undefined,
      open: false,
      form:{},
      rules:{
        name: [
          { required: true, message: "规则名称不能为空", trigger: "change" }
        ],
        clause: [
          { required: true, message: "表达式不能为空", trigger: "change" }
        ],
        duration: [
          { required: true, message: "持续时间不能为空", trigger: "change" }
        ],
        comparator: [
          { required: true, message: "对比符不能为空", trigger: "change" }
        ],
        default_value: [
          { required: true, message: "默认值不能为空", trigger: "change" },
          { validator: this.validateNumber(), trigger: "change" }
        ],
        description: [
          { required: true, message: "规则描述不能为空", trigger: "change" }
        ]
      }
    }
  },
  watch:{
    operateNum(val){
      if (val == 1) {
        this.reset();
        this.title = '新增规则';
        this.open = true;
      }else if(val == 2){
        this.loading = true;
        this.open = true;
        this.reset();
        this.title = "修改规则";
        getRuleSample(this.selectedId).then(response => {
          this.form = response;
          this.form.default_value = response.default_value;
          this.form.labels = this.tranObjToArr(response?.labels);
          this.form.annotations = this.tranObjToArr(response?.annotations);
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
        name: undefined,
        clause: undefined,
        duration: undefined,
        description: undefined,
        comparator: undefined,
        default_value:undefined,
        labels:[{
          key: 'severity',
          value: undefined
        }],
        annotations:[{
          key: undefined,
          value: undefined
        }],
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          console.log(this.getActionAndParams())
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
          res.action = addRuleSample,
          res.params = {
            exporterId: this.selectedExporterId,
            data: {
              ...this.form,
              default_value: this.form?.default_value,
              labels: this.tranArrToObj(this.form.labels),
              annotations: this.tranArrToObj(this.form.annotations),
            },
          }
          break;
        case 2:
          res.action = updateRuleSample,
          res.params = {
            ...this.form,
            default_value: this.form?.default_value,
            labels: this.tranArrToObj(this.form.labels),
            annotations: this.tranArrToObj(this.form.annotations),
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
    
    handleAddAnnotation(){
      this.form.annotations.push(
        {
          key: undefined,
          value: undefined,
        }
      )
    },
    handleDelAnnotation(index){
      this.form.annotations.splice(index,1)
    },
    validateLabelKey(index){
      const labelList = [...this.form.labels];
      labelList.splice(index,1);
      return (rule, value, callback)=>{
        if (labelList.some(item => item.key.trim() == value.trim())) {
          callback(new Error('key值不能重复'));
        }
        callback()
      }
    },
    validateAnnotationKey(index){
      const list = [...this.form.annotations];
      list.splice(index,1);
      return (rule, value, callback)=>{
        if (list.some(item => item.key.trim() == value.trim())) {
          callback(new Error('key值不能重复'));
        }
        callback()
      }
    },
    validateNumber(){
      return (rule, value, callback) => {
        if (!v.isNumber(value) && !!value) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }
    },
  }

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