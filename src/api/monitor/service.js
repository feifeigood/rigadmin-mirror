import request from '@/utils/request'

// 查询server列表
export function listService(query) {
  return request({
    url: '/api/v1/services',
    method: 'get',
    params: query
  })
}

// 新增server
export function addService(data) {
  return request({
    url: `/api/v1/projects/${data.project_id}/services`,
    method: 'post',
    data: data
  })
}

// 修改server
export function updateService(data) {
  return request({
    url: '/api/v1/services',
    method: 'put',
    data: data
  })
}

//删除server
export function delService(id){
  return new Promise((solve, reject) => {
    setTimeout(() => {
      reject()
      solve()
    }, 2000);
  })
}