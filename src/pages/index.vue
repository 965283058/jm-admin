<style scoped>
    .jf-tabs {
        margin: 0;
        padding: 0;
    }

    .jf-tabs-warp {
        height: calc(100% - 50px);
    }

    .jf-user-menu {
        cursor: pointer;
        float: right;
        margin-right: 50px;
        color: #FFF;
        font: 16px bold;
        line-height: 60px;
        background: transparent;
    }

    .router {
        color: #333333;
        display: block;
    }
</style>
<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="jf-header jf-header-block">
                    <!--简盟后台管理系统-->
                    简盟后台管理系统
                    <el-dropdown class="jf-user-menu">
                      <span>用户{{user.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link class="router" to="/updatePwd">修改密码</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item><span @click="logout()">退出登录</span></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
        <el-row class="jf-layout">
            <el-col :span="3" class="jf-layout">
                <el-menu theme="dark" default-active="2" class="el-menu-vertical-demo jf-layout">
                    <template v-for="(menu,index) in menuData">
                        <el-submenu :index="index+''" v-if="menu.children&&menu.children.length">
                            <template slot="title"><i :class="menu.icon"></i>{{menu.text}}</template>
                            <el-menu-item v-if="menu.children" v-for="(child,inx) in menu.children"
                                          :index="index+''+inx">
                                <div @click="addMenu(child)">{{child.text}}</div>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="!(menu.children&&menu.children.length)" :index="index+''+inx">
                            <div @click="addMenu(menu)"><i :class="menu.icon"></i>{{menu.text}}</div>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-col>
            <el-col :span="21" class="jf-tabs-warp">
                <el-tabs class="jf-tabs" :active-name="activeMenu" @tab-click="tabClick" @tab-remove="removeMenu">
                    <el-tab-pane class="12" :label="menu.label" :router="menu.code" :key="menu.code"
                                 :closable="menu.closable" v-for="menu in menus" :name="menu.code">
                        <keep-alive>
                            <router-view :name="menu.code" style="min-height: 100%;border: 0;background-color:#f1f2f7;">
                            </router-view>
                        </keep-alive>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {logout} from 'apis/account'
    import {treeMenu} from 'apis/menu'

    export default {
        data: function () {
            return {
                user: {},
                activeMenu: "wecome",
                menuData:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                menus: [{
                    code: "wecome",
                    router: '/wecome',
                    label: "欢迎"
                }]
            }
        },
        components: {},
        methods: {
            addMenu(data){
                if (this.menus.some(menu=>menu.label == data.text)) {
                    this.activeMenu = data.code
                    this.$router.replace(data.code)
                    return
                }
                if (!(data.children&&data.children.length)) {
                    this.menus.push({
                        code: data.code,
                        router: data.code,
                        label: data.text,
                        closable: true
                    })
                    this.activeMenu = data.code
                    this.$router.replace(data.code)
                }
            },
            removeMenu(name){
                let selectIndex = 0
                for (let i = 0; i < this.menus.length; i++) {
                    if (this.menus[i].code == name) {
                        this.menus.splice(i, 1)
                        selectIndex = i - 1
                        break
                    }
                }
                if (name == this.activeMenu) {
                    if (this.menus[selectIndex]) {
                        this.$router.replace(this.menus[selectIndex].code)
                        this.$nextTick(()=> {
                            this.activeMenu = this.menus[selectIndex].code
                        })
                    }
                }
            },
            tabClick(tab){
                this.activeMenu = tab.name
                this.$router.replace(tab.$el.getAttribute("router"))
            },
            logout(){
                this.$confirm("您确定退出登录吗？", "提示").then(()=> {
                    logout().then(()=> {
                        window.localStorage.removeItem("user")
                        this.$router.replace("/login")
                    })
                }).catch(() => {
                 //  console.info("cancel logout")
                });
            },
            getMenu(){
                treeMenu().then(data=>{
                   this.menuData=data
                }).catch(err=>{

                })
            }
        },
        mounted: function () {
            let userStr = window.localStorage.getItem("user")
            if (!userStr) {
                return this.$router.replace("/login")
            }
            this.user = JSON.parse(userStr)
            if(this.user.pwdStatus==0){
                return this.$router.replace("/updatePwd?init=1")
            }
            this.getMenu()
        },
        filters: {}
    }
</script>