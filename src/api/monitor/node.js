import request from '@/utils/request'

// 查询node列表
export function listNode(query) {
  return request({
    url: '/api/v1/farms',
    method: 'get',
    params: query
  })
}