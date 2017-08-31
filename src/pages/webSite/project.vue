<style scope>
    .dialog--project {
        width: 80%;
        max-width: 1024px;
    }
</style>
<template>
    <div>
        <el-form :inline="true" style="padding-top: 20px;padding-left: 30px">
            <el-form-item label="中文名称:">
                <el-input v-model="po.params.name_cn"></el-input>
            </el-form-item>
            <el-form-item label="英文名称:">
                <el-input v-model="po.params.name_en"></el-input>
            </el-form-item>
            <el-form-item label="项目类型:">
                <el-checkbox-group v-model="po.params.type">
                    <el-checkbox :label="1" name="status">小型</el-checkbox>
                    <el-checkbox :label="2" name="status">中型</el-checkbox>
                    <el-checkbox :label="3" name="status">大型</el-checkbox>
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
                    <el-carousel :interval="5000" type="card" height="200px" arrow="always">
                        <el-carousel-item v-for="file in data.row.files" style="text-align: center">
                            <div v-if="isVideo(file)">
                                <video style="height:200px" controls>
                                    <source :src="file" type="video/mp4">
                                    您的浏览器不支持Video标签。
                                </video>
                            </div>
                            <div v-else>
                                <img :src="file" style="height: 200px">
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </template>
            </el-table-column>
            <el-table-column prop="cn.name" label="项目中文名" width="180"></el-table-column>
            <el-table-column prop="en.name" label="项目英文名" width="180"></el-table-column>

            <el-table-column prop="time" label="日期" width="120">
                <template scope="data">
                    {{converToCNDate(data.row.time)}}
                </template>
            </el-table-column>

            <el-table-column label="类型" width="120">
                <template scope="data">
                    {{data.row.type==1?"小型":data.row.type==2?"中型":"大型"}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="data">
                    <el-button size="small" icon="edit" @click="openDialog('edit',data.row)">编辑</el-button>
                    <el-button size="small" icon="delete" @click="delProject(data.row)">删除</el-button>
                </template>
            </el-table-column>
        </datagrid>

        <el-dialog :title="vo.dialog.title" custom-class="dialog--project" :visible.sync="vo.dialog.open">
            <el-form ref="projectForm" :model="po.project">
                <el-tabs type="border-card" v-model="vo.activeTab" @tab-remove="removeFile" style="min-height: 350px">
                    <el-tab-pane label="基本信息" name="base">
                        <el-form-item label="名称(中文)" prop="name_cn"
                                      :rules="{ required: true, message: '请输入中文名称', trigger: 'blur'}"
                                      :label-width="vo.labelWidth">
                            <el-input v-model="po.project.name_cn" placeholder="请输入项目名称"></el-input>
                        </el-form-item>
                        <el-form-item label="名称(English)" prop="name_en"
                                      :rules="{ required: true, message: '请输入英文名称', trigger: 'blur'}"
                                      :label-width="vo.labelWidth">
                            <el-input v-model="po.project.name_en" placeholder="请输入项目名称"></el-input>
                        </el-form-item>
                        <el-form-item label="日期" prop="time"
                                      :rules="{ type: 'date', required: true, message: '请选择项目日期', trigger: 'change' }"
                                      :label-width="vo.labelWidth">
                            <el-date-picker v-model="po.project.time" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="类型" :label-width="vo.labelWidth">
                            <el-radio v-model="po.project.type" :label="1">小型</el-radio>
                            <el-radio v-model="po.project.type" :label="2">中型</el-radio>
                            <el-radio v-model="po.project.type" :label="3">大型</el-radio>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="项目说明">
                        <el-form-item label="说明(中文)" prop="content_cn"
                                      :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                      :label-width="vo.labelWidth">
                            <el-input type="textarea" :autosize="{minRows:5}" v-model="po.project.content_cn"
                                      placeholder="请输入项目说明"></el-input>
                        </el-form-item>
                        <el-form-item label="说明(English)" prop="content_en"
                                      :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                      :label-width="vo.labelWidth">
                            <el-input type="textarea" :autosize="{minRows:5}" v-model="po.project.content_en"
                                      placeholder="请输入项目说明"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane :label="'文件'+(index+1)" :name="'tab'+index" closable
                                 v-for="(item,index) in po.project.files">
                        <el-form-item label="图片或视频" :prop="'files.'+index"
                                      :rules="{ required: true, message: '请选择项目文件', trigger: 'change'}"
                                      :label-width="vo.labelWidth">
                            <input v-if="vo.dialog.reloadFile" type="file" @change="selectImg($event,index)">
                        </el-form-item>
                        <el-form-item label="文件预览" v-if="item&&item!='video'" :label-width="vo.labelWidth">
                            <file-view>
                                <img :src="item" alt="" class="imgPerview" v-if="!isVideo(item)">
                                <video controls width="300" v-if="isVideo(item)">
                                    <source :src="item" type="video/mp4">
                                    您的浏览器不支持Video标签。
                                </video>
                            </file-view>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFile">添加文件</el-button>
                <el-button @click="vo.dialog.open = false">取 消</el-button>
                <el-button type="primary" @click="editProject()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {edit, del} from 'apis/project'
    import {PROJECT_LIST} from 'apis/utils/urls'

    import datagrid from 'components/datagrid'
    import fileView from 'components/filePreview'

    export default {
        data() {
            return {
                po: {
                    project: {
                        id: '',
                        name_cn: '',
                        name_en: '',
                        content_cn: '',
                        content_en: '',
                        time: null,
                        type: 1,
                        files: []
                    },
                    params: {
                        name_cn: '',
                        name_en: '',
                        type: [1, 2, 3]
                    }
                },
                vo: {
                    labelWidth: '120px',
                    dialog: {
                        title: '',
                        open: false,
                        mode: '',
                        reloadFile: true
                    },
                    activeTab: 'base',
                    url: PROJECT_LIST
                }
            }
        },
        methods: {
            openDialog(mode, row){
                this.clearFile()
                this.vo.dialog.open = true
                this.$nextTick(()=>{
                this.$refs['projectForm'].resetFields()
                this.vo.activeTab = 'base'
                if (mode == 'add') {
                    this.po.project = {
                        id: '',
                        name_cn: '',
                        name_en: '',
                        content_cn: '',
                        content_en: '',
                        time: null,
                        type: 1,
                        files: ['']
                    }
                    this.vo.dialog.title = '添加项目'
                } else {
                    let temp = JSON.parse(JSON.stringify(row))
                    this.po.project = {
                        id: temp._id,
                        name_cn: temp.cn.name,
                        name_en: temp.en.name,
                        content_cn: temp.cn.content,
                        content_en: temp.en.content,
                        time: new Date(temp.time),
                        type: temp.type,
                        files: temp.files
                    }
                    this.vo.dialog.title = '修改项目'
                }
                this.vo.dialog.mode = mode
            })

            },
            editProject(){
                this.$refs['projectForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let fd = new FormData()
                    if (this.vo.dialog.mode == 'edit') {
                        fd.append("id", this.po.project.id)
                    }

                    fd.append("name_cn", this.po.project.name_cn)
                    fd.append("name_en", this.po.project.name_en)
                    fd.append("content_cn", this.po.project.content_cn)
                    fd.append("content_en", this.po.project.content_en)
                    fd.append("time", this.po.project.time)
                    fd.append("type", this.po.project.type)

                    let urls = []
                    let index = 0
                    let files = this.$refs['projectForm'].$el.querySelectorAll('input[type=file]')
                    for (let item of this.po.project.files) {
                        if (files[index].files.length) {
                            fd.append("file" + index, files[index].files[0])
                            urls.push('')
                        } else {
                            urls.push(this.po.project.files[index])
                        }
                        index++
                    }
                    fd.append("urls", JSON.stringify(urls))

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
            addFile(){
                this.po.project.files.push('')
                this.vo.activeTab = 'tab' + (this.po.project.files.length - 1)
            },
            removeFile(name){
                let index = Number.parseInt(name.replace('tab', ''))
                this.po.project.files.splice(index, 1)
                if (name == this.vo.activeTab) {
                    if (index != 0) {
                        this.vo.activeTab = 'tab' + (index - 1)
                    } else {
                        this.vo.activeTab = 'base'
                    }
                } else {
                    let activeIndex = Number.parseInt(this.vo.activeTab.replace('tab', ''))
                    if (activeIndex > index) {
                        this.vo.activeTab = 'tab' + (activeIndex - 1)
                    }
                }
            },
            selectImg(event, index){
                let files = event.target.files
                if (files && files.length) {
                    let file = files[0]
                    if (!this.isVideo(file.name)) {
                        let reader = new FileReader()
                        let _self = this
                        reader.onload = function (e) {
                            _self.$set(_self.po.project.files, index, e.target.result)
                        }
                        reader.readAsDataURL(file);
                    } else {
                        this.$set(this.po.project.files, index, 'video')
                        console.info(this.po.project)
                    }
                }
            },
            isVideo(path){
                return path.split('.').pop().toLowerCase() == 'mp4'
            },
            clearFile(){
                this.vo.dialog.reloadFile = false
                this.$nextTick(()=> {
                    this.vo.dialog.reloadFile = true
                })
            },
            loadList(){
                this.$refs.dg.reload()
            },
            delProject(row){
                del({id: row._id}).then(data=> {
                    this.loadList()
                })
            },
            converToCNDate (ms){
                let date = new Date(ms);
                let year = date.getFullYear(),
                        month = date.getMonth() + 1,
                        day = date.getDate()


                return `${year}-${padLeft(month)}-${padLeft(day)}`

                function padLeft(number) {
                    if (parseInt(number) < 10) {
                        return '0' + number;
                    }
                    return number;
                }
            }
        },
        mounted(){

        },
        components: {
            datagrid,
            fileView
        }
    }
</script>