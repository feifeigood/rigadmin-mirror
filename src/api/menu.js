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
                        "path": "/extviews",
                        "component": "Layout",
                        "hidden": false,
                        "redirect": "noRedirect",
                        "alwaysShow": true,
                        "meta": {
                            "title": "监控看图",
                            "icon": "linechart",
                            "noCache": false,
                            "link": null
                        },
                        "children": [
                            {
                                "name": "Node",
                                "path": "node",
                                "hidden": false,
                                "component": "ext/node/index",
                                "meta": {
                                    "title": "主机指标",
                                    "noCache": true,
                                    "link": null
                                }
                            },
                            {
                                "name": "Switch",
                                "path": "switch",
                                "hidden": false,
                                "component": "ext/switch/index",
                                "meta": {
                                    "title": "交换机指标",
                                    "noCache": true,
                                    "link": null
                                }
                            },
                            {
                                "name": "MySQL",
                                "path": "mysql",
                                "hidden": false,
                                "component": "ext/mysql/index",
                                "meta": {
                                    "title": "MySQL指标",
                                    "noCache": true,
                                    "link": null
                                }
                            },
                        ]
                    },
                    {
                        "name": "Architecture",
                        "path": "/architecture",
                        "hidden": false,
                        "redirect": "noRedirect",
                        "component": "Layout",
                        "alwaysShow": true,
                        "meta": {
                            "title": "基础数据",
                            "icon": "architecture",
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
                                "redirect": "noRedirect",
                                "component": "ParentView",
                                "alwaysShow": true,
                                "meta": {
                                    "title": "节点组管理",
                                    "icon": "node",
                                    "noCache": false,
                                    "link": null
                                },
                                "children": [
                                    {
                                        "name": "Farm",
                                        "path": "farm",
                                        "hidden": false,
                                        "component": "monitor/node/index",
                                        "meta": {
                                            "title": "节点组管理",
                                            //"icon": "blank",
                                            "noCache": true,
                                            "link": null
                                        }
                                    },
                                    {
                                        "name": "Host",
                                        "path": "host",
                                        "hidden": false,
                                        "component": "monitor/node/host",
                                        "meta": {
                                            "title": "节点管理",
                                            //"icon": "blank",
                                            "noCache": true,
                                            "link": null
                                        }
                                    },
                                ]
                            },
                        ]
                    },
                    // {
                    //     "name": "System",
                    //     "path": "/system",
                    //     "hidden": false,
                    //     "redirect": "noRedirect",
                    //     "component": "Layout",
                    //     "alwaysShow": true,
                    //     "meta": {
                    //         "title": "系统管理",
                    //         "icon": "system",
                    //         "noCache": false,
                    //         "link": null
                    //     },
                    //     "children": [
                    //         {
                    //             "name": "User",
                    //             "path": "user",
                    //             "hidden": false,
                    //             "component": "system/user/index",
                    //             "meta": {
                    //                 "title": "用户管理",
                    //                 "icon": "user",
                    //                 "noCache": true,
                    //                 "link": null
                    //             }
                    //         },
                    //         // {
                    //         //     "name": "Role",
                    //         //     "path": "role",
                    //         //     "hidden": false,
                    //         //     "component": "system/role/index",
                    //         //     "meta": {
                    //         //         "title": "角色管理",
                    //         //         "icon": "peoples",
                    //         //         "noCache": true,
                    //         //         "link": null
                    //         //     }
                    //         // },
                    //     ]
                    // },

                ]
            }
        )
    })
    return request({
        url: '/getRouters',
        method: 'get'
    })
}