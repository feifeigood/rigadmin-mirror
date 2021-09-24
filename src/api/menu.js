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
                        "path": "/alertpager",
                        "component": "Layout",
                        "redirect": 'alertpager',
                        "children": [
                            {
                                "name": "Alertpager",
                                "path": "",
                                "hidden": false,
                                "component": "monitor/alertpager/index",
                                "meta": {
                                    "title": "监控告警",
                                    "icon": "alert",
                                    "noCache": true,
                                    "link": null
                                },
                            },
                        ]
                    },
                    {
                        "path": "/server",
                        "component": "Layout",
                        "redirect": 'server',
                        "children": [
                            {
                                "name": "Server",
                                "path": "",
                                "hidden": false,
                                "component": "monitor/alertpager/index",
                                "meta": {
                                    "title": "主机管理",
                                    "icon": "server",
                                    "noCache": true,
                                    "link": null
                                },
                            },
                        ]
                    },
                    {
                        "name": "Database",
                        "path": "/database",
                        "hidden": false,
                        "redirect": "noRedirect",
                        "component": "Layout",
                        "alwaysShow": true,
                        "meta": {
                            "title": "数据库管理",
                            "icon": "database",
                            "noCache": false,
                            "link": null
                        },
                        "children": [
                            {
                                "name": "MySQL",
                                "path": "mysql",
                                "hidden": false,
                                "component": "monitor/exporter/index",
                                "meta": {
                                    "title": "MySQL",
                                    "icon": "mysql-m",
                                    "noCache": true,
                                    "link": null
                                }
                            },
                            {
                                "name": "Oracle",
                                "path": "oracle",
                                "hidden": false,
                                "component": "monitor/project/index",
                                "meta": {
                                    "title": "Oracle",
                                    "icon": "oracle-m",
                                    "noCache": true,
                                    "link": null
                                }
                            },
                        ]
                    },
                    {
                        "path": "/middleware",
                        "component": "Layout",
                        "redirect": 'middleware',
                        "children": [
                            {
                                "name": "Middleware",
                                "path": "",
                                "hidden": false,
                                "component": "monitor/alertpager/index",
                                "meta": {
                                    "title": "中间件管理",
                                    "icon": "middleware",
                                    "noCache": true,
                                    "link": null
                                },
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
                                    "noCache": true,
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
                            //         "noCache": true,
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