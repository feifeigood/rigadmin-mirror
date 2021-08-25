import request from '@/utils/request'

// 查询project列表
export function listProject(query) {
  return request({
    url: '/api/v1/projects',
    method: 'get',
    params: query
  })
}