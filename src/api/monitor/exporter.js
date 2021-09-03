import request from '@/utils/request'

// 查询Defaultexporter列表
export function listDefaultExporter(query) {
  return request({
    url: '/api/v1/defaultexporters',
    method: 'get',
    params: query
  })
}
// 新增Defaultexporter
export function addDefaultExporter(data) {
  return request({
    url: `/api/v1/defaultexporters`,
    method: 'post',
    data: data
  })
}

// 修改Defaultexporter
export function updateDefaultExporter(data) {
  return request({
    url: `/api/v1/defaultexporters/${data.id}`,
    method: 'put',
    data: data
  })
}
//删除Defaultexporter
export function delDefaultExporter(id){
  return request({
    url: `/api/v1/defaultexporters/${id}`,
    method: 'delete',
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