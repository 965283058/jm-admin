<template>
    <div>
        <el-form :inline="true" style="padding-top: 20px;padding-left: 30px">
            <el-form-item label="姓名:">
                <el-input v-model="po.params.name"></el-input>
            </el-form-item>
            <el-form-item label="用户状态:">
                <el-checkbox-group v-model="po.params.status">
                    <el-checkbox :label="0" name="status">禁用</el-checkbox>
                    <el-checkbox :label="1" name="status">正常</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button icon="search" type="primary" @click="loadList">查询</el-button>
                <el-button icon="plus" type="success" @click="openDialog('add')">添加</el-button>
            </el-form-item>
        </el-form>

        <datagrid :url="vo.url" :params="po.params" ref="dg">
            <el-table-column type="expand">
                <template scope="data">
                    <h2 style="float: left;">菜单权限:&nbsp;&nbsp;&nbsp;&nbsp;</h2>
                    <el-tree style="float: left;width: 400px" :data="getMenu(data.row)"></el-tree>
                </template>
            </el-table-column>
            <el-table-column label="姓名" prop="name" width="150"></el-table-column>
            <el-table-column label="登录邮箱" prop="email" width="340"></el-table-column>
            <el-table-column label="类型" prop="superAdmin" width="120">
                <template scope="data">
                    {{data.row.superAdmin==1?"超级管理员":"普通管理员"}}
                </template>
            </el-table-column>

            <el-table-column label="状态" width="90">
                <template scope="data">
                    {{data.row.status==1?"正常":data.row.status==0?"禁用":"已删除"}}
                </template>
            </el-table-column>
            <el-table-column label="登录错误次数" prop="errCount" width="130"></el-table-column>
            <el-table-column label="最后登录时间" width="170">
                <template scope="data">
                    {{converToCNDate(data.row.lastLoginTime)}}
                </template>
            </el-table-column>
            <!--<el-table-column label="创建人" prop="createor" width="150">-->
                <!--<template scope="data">-->
                    <!--{{data.row.creator?data.row.creator.name:''}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="创建时间" width="170">
                <template scope="data">
                    {{converToCNDate(data.row.createTime)}}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="280" fixed="right">
                <template scope="data">
                    <div v-if="data.row.superAdmin==0">
                        <el-button size="small" icon="edit" @click="openDialog('edit',data.row)">编辑</el-button>
                        <el-button size="small" icon="setting" @click="resetPwd(data.row)">重置密码</el-button>
                        <el-button size="small" icon="delete" @click="delAdmin(data.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </datagrid>


        <el-dialog :title="vo.dialog.title" custom-class="dialog--editor" :visible.sync="vo.dialog.open">
            <el-form ref="adminForm" :rules="rules" :model="po.user">
                <el-form-item label="姓名" labelWidth="80px" prop="name">
                    <el-input v-model="po.user.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" labelWidth="80px" prop="email">
                    <el-input v-model="po.user.email"></el-input>
                </el-form-item>

                <el-form-item label="状态" labelWidth="80px">
                    <el-radio-group v-model="po.user.status">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">启用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="菜单权限" labelWidth="80px">
                    <el-tree v-if="vo.reloadTree" ref="powerMenu" :data="vo.menuData" show-checkbox node-key="id"
                             :props="{label:'text',children:'children'}"
                             ></el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="vo.dialog.open = false">取 消</el-button>
                <el-button type="primary" @click="edit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {edit, del, resetPwd} from 'apis/admin'
    import {treeMenu} from 'apis/menu'
    import * as url from 'apis/utils/urls'
    import datagrid from 'components/datagrid'

    export default {
        data() {
            return {
                po: {
                    user: {
                        id: '',
                        name: '',
                        email: "",
                        status: '1',
                        power: []
                    },
                    user_add: null,
                    params: {
                        name: '',
                        status: [0, 1, -10]
                    }
                },
                vo: {
                    labelWidth: '120px',
                    dialog: {
                        title: '',
                        open: false,
                        mode: ''
                    },
                    url: url.ADMIN_LIST,
                    reloadTree: true,
                    menuData: []
                },
                rules: {
                    'name': [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    'email': [
                        {required: true, message: '请输入登录邮箱', trigger: 'blur'},
                        {type: 'email', message: '登录邮箱格式错误', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            openDialog(mode, row){
              //  this.vo.reloadTree = false


                if (mode == 'add') {
                    this.po.user = JSON.parse(JSON.stringify(this.po.user_add))
                    console.info(this.po.user)
                    this.vo.dialog.title = '添加管理员'
                } else {
                    this.po.user = {
                        id: row._id,
                        name: row.name,
                        email: row.email,
                        status: row.status,
                        power: row.power
                    }
                    this.vo.dialog.title = '修改管理员'
                }
                this.vo.dialog.mode = mode
                this.vo.dialog.open = true

                this.$nextTick(()=> {
                    //  this.vo.reloadTree = true
                    console.info(this.$refs['powerMenu'])
                    if(row){
                        for(let key of row.power){
                            this.$refs['powerMenu'].setChecked(key,true,false)
                        }
                    }
                })
            },
            edit(){
                this.$refs['adminForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let power = new Set()
                    let nodes = this.$refs['powerMenu'].getCheckedNodes(false)
                    nodes.forEach(item=> {
                        if (item.parentId != 0) {
                            power.add(item.parentId)
                        }
                        power.add(item.id)
                    })
                    this.po.user.power = Array.from(power)

                    edit(this.po.user).then(data=> {
                        this.loadList()
                        this.vo.dialog.open = false
                    }).catch(err=> {
                        this.$message({
                            type: 'error',
                            message: err.message,
                            duration: 0,
                            showClose: true
                        })
                    })
                })
            },
            loadList(){
                this.$refs.dg.reload()
            },

            selectImg(event){
                if (event.target.files && event.target.files.length) {
                    let file = event.target.files[0]
                    let reader = new FileReader()
                    let _self = this
                    reader.onload = function (e) {
                        _self.po.people.img = e.target.result;
                        console.info(e.target.result)
                    }
                    reader.readAsDataURL(file);
                }
            },
            clearFile(){
                this.vo.dialog.reloadFile = false
                this.$nextTick(()=> {
                    this.vo.dialog.reloadFile = true
                })
            },
            delAdmin(row){
                this.$confirm(`确定删除用户${row.name}吗?`, '提示').then(()=> {
                    del({id: row._id}).then(data=> {
                        this.loadList()
                    }).catch(err=> {
                        this.$message({
                            type: 'error',
                            message: err.message,
                            duration: 0,
                            showClose: true
                        })
                    })
                })
            },
            resetPwd(row){
                this.$confirm(`确定重置${row.name}的密码?`, '提示').then(()=> {
                    resetPwd({id: row._id}).then(()=> {
                        this.$message({
                            type: 'success',
                            message: '已重置，新密码为登录邮箱！',
                            duration: 2000
                        })
                    }).catch(err=> {
                        this.$message({
                            type: 'error',
                            message: err.message,
                            duration: 0,
                            showClose: true
                        })
                    })
                })
            },
            getMenu(row){
                let data = []
                let powerStr = row.power.join(',')
                this.vo.menuData.forEach(menu=> {
                    if (menu.parentId == 0 && menu.children.length) {
                        let child = []
                        menu.children.forEach(item=> {
                            if (powerStr.indexOf(item.id) != -1) {
                                child.push({
                                    label: item.text
                                })
                            }
                        })
                        if (child.length) {
                            data.push({
                                label: menu.text,
                                children: child
                            })
                        }
                    } else if (powerStr.indexOf(menu.id) != -1) {
                        data.push({
                            label: menu.text
                        })
                    }
                })
                return data
            },
            converToCNDate(ms){
                if (!ms) {
                    return ''
                }
                var date = new Date(ms);
                var year = date.getFullYear(),
                        month = date.getMonth() + 1,
                        day = date.getDate(),
                        hh = date.getHours(),
                        mm = date.getMinutes(),
                        ss = date.getSeconds();

                return year + "-" + padLeft(month) + "-" + padLeft(day) + " " + padLeft(hh) + ":" + padLeft(mm) + ":" + padLeft(ss);


                function padLeft(number) {
                    if (parseInt(number) < 10) {
                        return '0' + number;
                    }
                    return number;
                }
            }
        },
        mounted () {
            this.po.user_add = JSON.parse(JSON.stringify(this.po.user))
            treeMenu().then(data=> {
                this.vo.menuData = data
            })
        },
        components: {
            datagrid
        }
    }
</script>