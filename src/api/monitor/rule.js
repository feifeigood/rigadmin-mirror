import request from '@/utils/request'

// 查询所属服务rule列表
export function listRule(serviceId) {
  return request({
    url: `/api/v1/services/${serviceId}/rules`,
    method: 'get',
  })
}

// 新增rule
export function addRule(data) {
  return request({
    url: `/api/v1/services/${data.serviceId}/rules`,
    method: 'post',
    data: data.data
  })
}
// 查询rule详情
export function getRule(id) {
  return request({
    url: `/api/v1/rules/${id}`,
    method: 'get',
  })
}

// 修改rule
export function updateRule(data) {
  return request({
    url: `/api/v1/rules/${data.id}`,
    method: 'put',
    data: data.data
  })
}

//删除rule
export function delRule(id){
  return request({
    url: `/api/v1/rules/${id}`,
    method: 'delete',
  })
}

// 状态修改
export function changeRuleStatus(id) {
  return request({
    url: `/api/v1/rules/${id}/toggle`,
    method: 'put'
  })
}