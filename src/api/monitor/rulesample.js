import request from '@/utils/request'

// 查询所属客户端rulesample列表
export function listRuleSample(exporterId) {
  return request({
    url: `/api/v1/defaultexporters/${exporterId}/rulesamples`,
    method: 'get',
  })
}

// 新增rulesample
export function addRuleSample(data) {
  return request({
    url: `/api/v1/defaultexporters/${data.exporterId}/rulesamples`,
    method: 'post',
    data: data.data
  })
}
// 查询rulesample详情
export function getRuleSample(id) {
  return request({
    url: `/api/v1/rulesamples/${id}`,
    method: 'get',
  })
}

// 修改rulesample
export function updateRuleSample(data) {
  return request({
    url: `/api/v1/rulesamples/${data.id}`,
    method: 'put',
    data: data
  })
}

//删除rulesample
export function delRuleSample(id){
  return request({
    url: `/api/v1/rulesamples/${id}`,
    method: 'delete',
  })
}

// 状态修改
export function changeRuleSampleStatus(id) {
  return request({
    url: `/api/v1/rulesamples/${id}/toggle`,
    method: 'put'
  })
}