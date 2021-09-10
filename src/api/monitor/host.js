import request from '@/utils/request'

// 查询host列表
export function listHost(query) {
  return request({
    url: '/api/v1/hosts',
    method: 'get',
    params: query
  })
}
// ByFarm查询host列表
export function listHostByFarm(query) {
  return request({
    url: `/api/v1/farms/${query.farmId}`,
    method: 'get',
    params: query.data
  })
}

// 查询host详情
export function getHost(id) {
  return request({
    url: `/api/v1/hosts/${id}`,
    method: 'get',
  })
}

// 新增host
export function addHost(data) {
  return request({
    url: `/api/v1/farms/${data.farmId}/hosts`,
    method: 'post',
    data: data.data
  })
}

// 修改host
export function updateHost(data) {
  return request({
    url: `/api/v1/hosts/${data.id}`,
    method: 'put',
    data: data.data
  })
}
//删除host
export function delHost(id){
  return request({
    url: `/api/v1/hosts/${id}`,
    method: 'delete',
  })
}