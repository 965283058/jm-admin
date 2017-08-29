<style scoped>


    .imgWarp {
        padding: 10px;
    }

    .imgPerview {
        max-height: 100px;
        max-width: 450px;
    }

</style>
<template>
    <div>
        <div>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <h1 class="add">人物介绍
                            <el-button icon="plus" type="success" @click="openDialog('add')">添加</el-button>
                        </h1>
                    </div>
                </el-col>
            </el-row>
        </div>

        <datagrid url="/manage/people/list" ref="dg">
            <el-table-column label="图片" width="350">
                <template scope="data">
                    <div class="imgWarp"><img :src="data.row.img" class="imgPerview">
                    </div>
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
                    <el-button size="small" icon="edit" @click="openDialog('edit',data.row)">编辑</el-button>
                    <el-button size="small" icon="delete" @click="delBanner(data.row)">删除</el-button>
                </template>
            </el-table-column>
        </datagrid>



        <el-dialog :title="vo.dialog.title" custom-class="dialog--editor" :visible.sync="vo.dialog.open">
            <el-form ref="peopleForm" :rules="rules" :model="po.people">

                <el-tabs type="border-card">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="图片" prop="img" :label-width="vo.labelWidth">
                            <input type="file" @change="selectImg($event)" ref="imgFile" v-if="vo.dialog.reloadFile">
                        </el-form-item>
                        <el-form-item label="图片预览" v-show="po.people.img" :label-width="vo.labelWidth">
                            <el-row>
                                <el-col :span="24">
                                    <div class="grid-content bg-purple-dark">
                                        <img :src="po.people.img" alt="" class="imgPerview">
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="排序" prop="index" :label-width="vo.labelWidth">
                            <el-input-number v-model="po.people.index" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="是否启用" :label-width="vo.labelWidth">
                            <el-radio v-model="po.people.status" :label="1">启用</el-radio>
                            <el-radio v-model="po.people.status" :label="0">禁用</el-radio>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="中文信息">
                        <el-form-item label="姓名" prop="cn.name" :label-width="vo.labelWidth">
                            <el-input v-model="po.people.cn.name" :maxlength="100" placeholder="悬浮时显示姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="完整姓名" prop="cn.longName" :label-width="vo.labelWidth">
                            <el-input v-model="po.people.cn.longName" :maxlength="100" placeholder="详情显示姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="cn.title" :label-width="vo.labelWidth">
                            <el-input v-model="po.people.cn.title" :maxlength="100" placeholder="请输入职位"></el-input>
                        </el-form-item>
                        <el-form-item label="人物介绍" :label-width="vo.labelWidth">
                            <editor v-model="po.people.cn.profile"></editor>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="English Info">
                        <el-form-item label="Name" prop="en.name" :label-width="vo.labelWidth">
                            <el-input v-model="po.people.en.name" :maxlength="100"
                                      placeholder="Please enter your name"></el-input>
                        </el-form-item>
                        <el-form-item label="FullName" prop="en.longName" :label-width="vo.labelWidth">
                            <el-input v-model="po.people.en.longName" :maxlength="300"
                                      placeholder="Please enter full name"></el-input>
                        </el-form-item>
                        <el-form-item label="title" prop="en.title" :label-width="vo.labelWidth">
                            <el-input v-model="po.people.en.title" :maxlength="100"
                                      placeholder="Please enter a position"></el-input>
                        </el-form-item>
                        <el-form-item label="Profile" :label-width="vo.labelWidth">
                            <editor v-model="po.people.en.profile"></editor>
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
    import {edit, del} from 'apis/people'
    import editor from 'components/editor'
    import datagrid from 'components/datagrid'

    export default {
        data() {
            return {

                po: {
                    people:{
                        id: '',
                        img:'',
                        index: "",
                        status:1,
                        cn: {
                            name: '',
                            longName: '',
                            title: '',
                            profile: ''
                        },
                        en: {
                            name: '',
                            longName: '',
                            title: '',
                            profile: ''
                        }
                    },
                    people_add:null
                },
                vo: {
                    labelWidth: '120px',
                    dialog: {
                        title: '',
                        open: false,
                        mode: '',
                        reloadFile: true
                    },
                    data: []
                },
                rules: {
                    img: [
                        {required: true, message: '请选择图片', trigger: 'change'},
                    ],
                    index: [
                        {type: 'number', required: true, message: '请输入排序号', trigger: 'change'}
                    ],
                    'cn.name': [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    'cn.longName': [
                        {required: true, message: '请输入完整姓名', trigger: 'change'},
                    ],
                    'cn.title': [
                        {required: true, message: '请输入职位', trigger: 'change'},
                    ],

                    'en.name': [
                        {required: true, message: '请输入姓名', trigger: 'change'},
                    ],
                    'en.longName': [
                        {required: true, message: '请输入完整姓名', trigger: 'change'},
                    ],
                    'en.title': [
                        {required: true, message: '请输入职位', trigger: 'change'},
                    ]
                }

            }
        },
        methods: {
            openDialog(mode, row){
                this.clearFile()
                if (mode == 'add') {
                    this.po.people=JSON.parse(JSON.stringify(this.po.people_add))
                    this.po.people.index = this.vo.data.length + 1
                    this.vo.dialog.title = '添加人员介绍'
                } else {
                    let temp=JSON.parse(JSON.stringify(row))
                    temp.id=temp._id
                    console.info(temp)
                    this.po.people = temp
                    this.vo.dialog.title = '修改人员介绍'
                }
                this.vo.dialog.mode = mode
                this.vo.dialog.open = true
            },
            edit(){
                this.$refs['peopleForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let files = this.$refs.imgFile.files
                    let fd = new FormData()
                    if (this.vo.dialog.mode == 'edit') {
                        fd.append("id", this.po.people.id)
                    }
                    fd.append("index", this.po.people.index)
                    fd.append("status", this.po.people.status)

                    fd.append("cn", JSON.stringify(this.po.people.cn))

                    fd.append("en", JSON.stringify(this.po.people.en))

                    if (files.length) {
                        fd.append("img", files[0])
                    }

                    edit(fd).then(data=> {
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
            delBanner(row){
                del({id: row._id}).then(data=> {
                    this.loadList()
                })
            }

        },
        mounted () {
            this.po.people_add=JSON.parse(JSON.stringify(this.po.people))
        },
        components: {
            editor,
            datagrid
        }
    }
</script>