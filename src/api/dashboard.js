import request from '@/utils/request'

// 查询Defaultexporter列表
export function listRank(name) {
  return request({
    url: `/api/v1/stats/rankings?name=${name}`,
    method: 'get',
  })
}