import request from '@/utils/request'

// 查询exporter列表
export function listDefaultExporter(query) {
  return request({
    url: '/api/v1/defaultexporters',
    method: 'get',
    params: query
  })
}

// 新增exporter
export function addExporter(data) {
  return request({
    url: `/api/v1/services/${data.service_id}/exporters`,
    method: 'post',
    data: data
  })
}

// 修改exporter
export function updateExporter(data) {
  return request({
    url: `/api/v1/exporters/${data.id}`,
    method: 'put',
    data: data
  })
}

//删除exporter
export function delExporter(id){
  return request({
    url: `/api/v1/exporters/${id}`,
    method: 'delete',
  })
}