import request from '@/utils/request'

// 查询node列表
export function listNode(query) {
  return request({
    url: '/api/v1/farms',
    method: 'get',
    params: query
  })
}

// 新增node
export function addNode(data) {
  return request({
    url: `/api/v1/farms`,
    method: 'post',
    data: data
  })
}

// 修改node
export function updateNode(data) {
  return request({
    url: `/api/v1/farms/${data.id}`,
    method: 'put',
    data: data
  })
}
//删除node
export function delNode(id){
  return request({
    url: `/api/v1/farms/${id}`,
    method: 'delete',
  })
}