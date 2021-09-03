import request from '@/utils/request'

// 查询project列表
export function listProject(query) {
  return request({
    url: '/api/v1/projects',
    method: 'get',
    params: query
  })
}

// 新增project
export function addProject(data) {
  return request({
    url: '/api/v1/projects',
    method: 'post',
    data: data
  })
}


// 修改project
export function updateProject(data) {
  return request({
    url: `/api/v1/projects/${data.id}`,
    method: 'put',
    data: data
  })
}

//删除project
export function delProject(id){
  return new Promise((solve, reject) => {
    setTimeout(() => {
      reject()
      solve()
    }, 2000);
  })
}

// 状态修改
export function changeProjectStatus(id) {
  return request({
    url: `/api/v1/projects/${id}/toggle`,
    method: 'put'
  })
}