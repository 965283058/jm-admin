<style scope>
    .title{
        font-size: 22px;
        font-weight: bold;
    }
</style>
<template>
    <div>
        <div>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <h1 class="add">加入我们
                            <el-button icon="plus" type="success" @click="openDialog('add')">添加</el-button>
                        </h1>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="vo.data">
            <el-table-column type="expand">
                <template scope="item">
                    <el-tabs type="border-card">
                        <el-tab-pane label="中文信息">
                            <el-form>
                                <el-form-item>
                                    <span :class="{'title':item.row.cn.children&&item.row.cn.children.length}">{{item.row.cn.title}}</span>

                                </el-form-item>
                                <el-form-item v-for="(info,index) in item.row.cn.children">
                                    <span>{{info}}</span>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="English Info">
                            <el-form>
                                <el-form-item>
                                    <span  :class="{'title':item.row.en.children&&item.row.en.children.length}">{{item.row.en.title}}</span>
                                </el-form-item>
                                <el-form-item v-for="(info,index) in item.row.en.children"  >
                                    <span>{{info}}</span>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>

                </template>
            </el-table-column>

            <el-table-column prop="index" label="排序" width="180"></el-table-column>
            <el-table-column label="状态" width="180">
                <template scope="data">
                    {{data.row.status==1?"启用":"禁用"}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="data">
                    <el-button size="small" icon="edit" @click="openDialog('eidt',data.row)">编辑</el-button>
                    <el-button size="small" icon="delete" @click="deleteRow(data.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="vo.dialog.title" :visible.sync="vo.dialog.open">
            <el-form ref="joinForm" :model="po">

                <el-tabs type="border-card">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="排序" prop="index" :label-width="vo.labelWidth"
                                      :rules="{type: 'number', required: true, message: '请输入排序号', trigger: 'change'}">
                            <el-input-number v-model="po.index" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="是否启用" :label-width="vo.labelWidth">
                            <el-radio v-model="po.status" :label="1">启用</el-radio>
                            <el-radio v-model="po.status" :label="0">禁用</el-radio>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="中文信息">
                        <el-form-item label="标题" prop="cn.title" :label-width="vo.labelWidth"
                                      :rules="{ required: true, message: '请输入标题', trigger: 'blur'}">
                            <el-input v-model="po.cn.title" :maxlength="100" placeholder="请输入标题" icon="plus" t="cn"
                                      :on-icon-click="changeChild"></el-input>
                        </el-form-item>
                        <el-form-item v-for="(item,index) in po.cn.children" :label="'详情'+(index+1)"
                                      :prop="'cn.children['+index+']'"
                                      :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                      :label-width="vo.labelWidth">
                            <el-input placeholder="请输入内容" v-model="po.cn.children[index]"
                                      icon="delete" :index="index" t="cn"
                                      :on-icon-click="changeChild">
                            </el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="English Info">
                        <el-form-item label="Title" prop="en.title" :label-width="vo.labelWidth"
                                      :rules="{ required: true, message: '请输入标题', trigger: 'blur'}">
                            <el-input v-model="po.en.title" :maxlength="100" icon="plus" t="en"
                                      :on-icon-click="changeChild"
                                      placeholder="Please enter Title"></el-input>
                        </el-form-item>

                        <el-form-item v-for="(item,index) in po.en.children" :label="'Info '+(index+1)"
                                      :prop="'en.children['+index+']'"
                                      :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                      :label-width="vo.labelWidth">
                            <el-input placeholder="请输入内容" v-model="po.en.children[index]"
                                      icon="delete" :index="index" t="en"
                                      :on-icon-click="changeChild">
                            </el-input>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="vo.dialog.open = false">取 消</el-button>
                <el-button type="primary" @click="edit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {list, edit, del} from 'apis/join'
    export default {
        data() {
            return {
                po: {
                    id: '',
                    en: {
                        title: '',
                        children: [''],
                    },
                    cn: {
                        title: '',
                        children: [''],
                    },
                    index: "",
                    status: 1
                },
                vo: {
                    labelWidth: '120px',
                    dialog: {
                        title: '',
                        open: false,
                        mode: ''
                    },
                    data: []

                },


            }
        },
        methods: {
            openDialog(mode, row){
                if (mode == 'add') {
                    this.po = {
                        id: '',
                        en: {
                            title: '',
                            children: [''],
                        },
                        cn: {
                            title: '',
                            children: [''],
                        },
                        index: "",
                        status: 1
                    }
                    this.po.index = this.vo.data.length + 1
                    this.vo.dialog.title = '添加信息'
                } else {
                    let temp = JSON.parse(JSON.stringify(row))
                    temp.id = temp._id
                    this.po = temp
                    this.vo.dialog.title = '修改信息'
                }
                this.vo.dialog.mode = mode
                this.vo.dialog.open = true
            },
            edit(){
                this.$refs['joinForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }

                    edit(this.po).then(data=> {
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
            changeChild(e){
                let type = e.path[1].getAttribute("t")
                let index = Number.parseInt(e.path[1].getAttribute("index"))
                if (Number.isNaN(index)) {
                    this.po[type].children.push('')
                } else {
                    this.po[type].children.splice(index, 1)
                }
            },
            deleteRow(row){
                del({id: row._id}).then(()=> {
                    this.loadList()
                }).catch(err=> {
                    this.$message({
                        type: 'error',
                        message: err.message,
                        duration: 0,
                        showClose: true
                    })
                })
            },
            loadList(){
                list().then(data => {
                    this.vo.data = data
                })
            },
        },
        mounted () {
            this.loadList()
        }
    }
</script>