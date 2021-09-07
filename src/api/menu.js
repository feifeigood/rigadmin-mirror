import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return new Promise(resolve => {
    resolve(
      {
        "msg": "操作成功",
        "code": 200,
        "data": [
            {
                "name": "Monitor",
                "path": "/monitor",
                "hidden": false,
                "redirect": "noRedirect",
                "component": "Layout",
                "alwaysShow": true,
                "meta": {
                    "title": "监控管理",
                    "icon": "monitor",
                    "noCache": false,
                    "link": null
                },
                "children": [
                    {
                        "name": "Exporter",
                        "path": "exporter",
                        "hidden": false,
                        "component": "monitor/exporter/index",
                        "meta": {
                            "title": "客户端管理",
                            "icon": "client",
                            "noCache": true,
                            "link": null
                        }
                    },
                    {
                        "name": "Project",
                        "path": "project",
                        "hidden": false,
                        "component": "monitor/project/index",
                        "meta": {
                            "title": "项目管理",
                            "icon": "redis",
                            "noCache": true,
                            "link": null
                        }
                    },
                    {
                        "name": "Service",
                        "path": "service",
                        "hidden": false,
                        "component": "monitor/service/index",
                        "meta": {
                            "title": "服务管理",
                            "icon": "service",
                            "noCache": true,
                            "link": null
                        }
                    },

                    {
                        "name": "Node",
                        "path": "node",
                        "hidden": false,
                        "component": "monitor/node/index",
                        "meta": {
                            "title": "节点组管理",
                            "icon": "node",
                            "noCache": true,
                            "link": null
                        }
                    },
                ]
            },
            {
                "name": "System",
                "path": "/system",
                "hidden": false,
                "redirect": "noRedirect",
                "component": "Layout",
                "alwaysShow": true,
                "meta": {
                    "title": "系统管理",
                    "icon": "system",
                    "noCache": false,
                    "link": null
                },
                "children": [
                    {
                        "name": "User",
                        "path": "user",
                        "hidden": false,
                        "component": "system/user/index",
                        "meta": {
                            "title": "用户管理",
                            "icon": "user",
                            "noCache": false,
                            "link": null
                        }
                    },
                    // {
                    //     "name": "Role",
                    //     "path": "role",
                    //     "hidden": false,
                    //     "component": "system/role/index",
                    //     "meta": {
                    //         "title": "角色管理",
                    //         "icon": "peoples",
                    //         "noCache": false,
                    //         "link": null
                    //     }
                    // },
                ]
            },

        ]
    }
    )
  })
  return request({
    url: '/getRouters',
    method: 'get'
  })
}