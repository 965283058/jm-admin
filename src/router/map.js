export default {
    '/': {
        meta: {
            title: '主页'
        },
        component: (resolve) => {
            require(['pages/index'], resolve)
        },
        children: [
            {
                path: 'wecome',
                meta: {
                    title: '欢迎'
                },
                components: {
                    wecome: (resolve) => {
                        require(['pages/wecome'], resolve)
                    }
                }
            },
            {
                path: '/menu',
                meta: {
                    title: '网站菜单配置'
                },
                components: {
                    menu: (resolve) => {
                        require(['pages/webSite/menu'], resolve)
                    }
                }
            },
            {
                path: '/home',
                meta: {
                    title: '网站首页配置'
                },
                components: {
                    home: (resolve) => {
                        require(['pages/webSite/home'], resolve)
                    }
                }
            },
            {
                path: '/teamminus',
                meta: {
                    title: '简盟管理'
                },
                components: {
                    teamminus: (resolve) => {
                        require(['pages/webSite/teamminus'], resolve)
                    }
                }
            },
            {
                path: '/people',
                meta: {
                    title: '人物介绍管理'
                },
                components: {
                    people: (resolve) => {
                        require(['pages/webSite/people'], resolve)
                    }
                }
            },
            {
                path: '/project',
                meta: {
                    title: '项目管理'
                },
                components: {
                    project: (resolve) => {
                        require(['pages/webSite/project'], resolve)
                    }
                }
            },
            {
                path: '/join',
                meta: {
                    title: '加入我们管理'
                },
                components: {
                    join: (resolve) => {
                        require(['pages/webSite/join'], resolve)
                    }
                }
            },
            {
                path: '/contact',
                meta: {
                    title: '联系方式管理'
                },
                components: {
                    contact: (resolve) => {
                        require(['pages/webSite/contact'], resolve)
                    }
                }
            },
            {
                path: '/adminUser',
                meta: {
                    title: '网站后台用户管理'
                },
                components: {
                    adminUser: (resolve) => {
                        require(['pages/setting/user'], resolve)
                    }
                }
            },
            {
                path: '/adminMenu',
                meta: {
                    title: '网站后台用户管理'
                },
                components: {
                    adminMenu: (resolve) => {
                        require(['pages/setting/menu'], resolve)
                    }
                }
            },
            {
                path: '/video',
                meta: {
                    title: '视频管理'
                },
                components: {
                    video: (resolve) => {
                        require(['pages/video'], resolve)
                    }
                }
            }
        ]
    },
    '/login': {//客户
        meta: {
            title: '登录'
        },
        component: (resolve) => {
            require(['pages/account/login'], resolve)
        }
    },
    '/updatePwd': {//客户
        meta: {
            title: '修改密码'
        },
        component: (resolve) => {
            require(['pages/account/updatePwd'], resolve)
        }
    }
}
