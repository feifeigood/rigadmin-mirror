<template>
  <el-dialog :title="title" :visible.sync="open" width="760px" @close="handleClose" append-to-body>
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row v-if="operateNum == 1">
          <el-col :span="24">
            <el-form-item label="规则类型">
              <el-radio-group v-model="ruleType" @change="handleRuleTypeChange">
                <el-radio :label="1">模版</el-radio>
                <el-radio :label="2">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="operateNum == 1 && ruleType == 1">
          <el-col :span="24">
            <el-form-item label="客户端">
              <el-select 
                :value="selectedExporterId" 
                placeholder="请选择所属客户端" 
                size="small"
                style="width: 100%"
                @change="handleExporterChange"
              >
                <el-option 
                  v-for="item in exporterList"
                  :key="item.default_exporter_id" 
                  :label="item.default_exporter.alias"
                  :value="item.default_exporter_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="operateNum == 1 && ruleType == 1">
          <el-col :span="24">
            <el-form-item label="模版规则" prop="sample_id">
              <el-select 
                v-model="form.sample_id" 
                placeholder="请选择模版规" 
                size="small"
                style="width: 100%"
                @change="handleRulesampleChange"
              >
                <el-option 
                  v-for="item in rulesampleList"
                  :key="item.id" 
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规则名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入规则名称" :disabled="ruleType == 1"/>
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
                :disabled="ruleType == 1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleType == 1">
          <el-col :span="12">
            <el-form-item label="对比符" prop="comparator">
              <el-select 
                v-model="form.comparator" 
                placeholder="请选择对比符" size="small"
                style="width: 100%"
                disabled
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
            <el-form-item label="默认值" prop="def_val">
              <el-input v-model="form.def_val" placeholder="默认值" />
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
                :disabled="ruleType == 1"
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
                      :disabled="ruleType == 1 || item.key =='severity'"
                    />
                  </el-form-item>
                  <el-form-item 
                    :prop="'labels.' + index + '.value'"
                    :rules="[{
                      required: true, message: 'value不能为空', trigger: 'change'
                    }]"
                  >
                    <el-input 
                      :style="{width: ruleType == 1? '520px' : '480px'}"
                      v-model="item.value" 
                      placeholder="请输入value" 
                      :disabled="item.key != 'severity' && ruleType == 1"
                    />
                  </el-form-item>
                  <i class="el-icon-close" 
                    v-if="form.labels.length > 1 && ruleType != 1 && item.key !=='severity'"
                    @click="handleDelLabel(index)"
                  ></i>
                </div>

                <a
                  class="addWrap"
                  @click="handleAddLabel"
                  v-if="ruleType != 1"
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
                      :disabled="ruleType == 1"
                    />
                  </el-form-item>
                  <el-form-item 
                    :prop="'annotations.' + index + '.value'"
                    :rules="[{
                      required: true, message: 'value不能为空', trigger: 'change'
                    }]"
                  >
                    <el-input 
                      :style="{width: ruleType == 1? '520px' : '480px'}"
                      v-model="item.value" 
                      placeholder="请输入value"
                      :disabled="ruleType == 1"
                    />
                  </el-form-item>
                  <i class="el-icon-close" 
                    v-if="form.annotations.length > 1 && ruleType != 1"
                    @click="handleDelAnnotation(index)"
                  ></i>
                </div>

                <a
                  class="addWrap"
                  @click="handleAddAnnotation"
                  v-if="ruleType != 1"
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
import { getRule, addRule, updateRule} from "@/api/monitor/rule";
import { getService } from "@/api/monitor/service";
import { listRuleSample, getRuleSample} from "@/api/monitor/rulesample";
import * as v from '@/utils/validate'

export default {
  props: {
    operateNum: Number,
    selectedId: Number,
    selectedServiceId: Number,
    serviceList: Array
  },
  data(){
    return{
      rulesampleList:[],
      exporterList: [],
      selectedExporterId: undefined,
      comparatorList:['==', '!=', '<=', '<', '>=', '>'],
      loading: false,
      submitLoading: false,
      title: undefined,
      open: false,
      ruleType: 1,
      form:{},
      rules:{
        sample_id:[
          { required: true, message: "模版规则不能为空", trigger: "change" }
        ],
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
        def_val: [
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
        this.loading = true;
        this.reset();
        this.title = '新增规则';
        this.open = true;
        getService(this.selectedServiceId).then(response => {
            this.exporterList = response?.exporters || [];
            this.selectedExporterId = response?.exporters[0]?.default_exporter_id;
            this.getRulesampleList(response?.exporters[0]?.default_exporter_id);
            this.loading = false;
          }
        ).catch(e=>{
          this.open = false;
        });
      }else if(val == 2){
        this.loading = true;
        this.open = true;
        this.reset();
        this.title = "修改规则";
        getRule(this.selectedId).then(response => {
          this.form = this.transRuleResponse(response);
          this.form.labels = this.tranObjToArr(this.form?.labels);
          this.form.annotations = this.tranObjToArr(this.form?.annotations);
          this.loading = false;
        }).catch(e=>{
          this.open = false;
        })

      }
    }
  },

  methods:{
    /** 查询rulesample列表 */
    getRulesampleList(exporterId) {
      listRuleSample(exporterId).then(response => {
          this.rulesampleList = response;
        }
      ).catch(e=>{
      });
    },
    transRuleResponse(response){
      if (!!response.sample_id) {
        this.ruleType = 1;
        return {
          ...response,
          clause: response.sample.clause,
          description: response.description || response.sample.description,
          comparator: response.comparator || response.sample.comparator,
          def_val: response.sample_def_val || response.sample.default_value,
          labels: response.labels || response.sample.labels,
          annotations: response.annotations || response.sample.annotations,
        }
      }else{
        this.ruleType = 2;
        return{
          ...response,
        }
      }

    },
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
        sample_id: undefined,
        name: undefined,
        clause: undefined,
        duration: undefined,
        description: undefined,
        comparator: undefined,
        def_val:undefined,
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
          res.action = addRule,
          res.params = {
            serviceId: this.selectedServiceId,
            data: {
              ...this.form,
              labels: this.tranArrToObj(this.form.labels),
              annotations: this.tranArrToObj(this.form.annotations),
            },
          }
          break;
        case 2:
          res.action = updateRule,
          res.params = {
            id: this.form.id,
            data: {
              name: this.form.name,
              clause: this.form.clause,
              duration: this.form.duration,
              def_val: this.form.def_val,
              labels: this.tranArrToObj(this.form.labels),
            }
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
    handleExporterChange(v){
      this.selectedExporterId = v;
      this.rulesampleList = [];
      this.getRulesampleList(v);
    },
    handleRulesampleChange(v){
      getRuleSample(v).then(response => {
        console.log(v)
        this.form.name = response.name;
        this.form.clause = response.clause;
        this.form.duration = response.duration;
        this.form.description = response.description;
        this.form.comparator = response.comparator;
        this.form.def_val = response.default_value;
        this.form.labels = this.tranObjToArr(response.labels);
        this.form.annotations = this.tranObjToArr(response.annotations);
      })
    },
    handleRuleTypeChange(){
      this.reset();
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
    validateAnnotationKey(index){
      const list = [...this.form.annotations];
      list.splice(index,1);
      return (rule, value, callback)=>{
        if (list.some(item => item.key?.trim() == value?.trim())) {
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