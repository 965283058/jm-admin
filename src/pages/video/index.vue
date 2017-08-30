<style scoped>
    .imgWarp {
        padding: 10px;
    }

    input[type=file] {
        line-height: 28px;
        border: 1px solid #c2c2c2;
        margin-bottom: 5px;
    }

    .propInfo {
        margin-left: 20px;
    }
</style>
<template>
    <div>
        <div>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <h1 class="add">视频管理
                            <el-button icon="plus" type="success" @click="openDialog('add')">添加</el-button>
                        </h1>
                    </div>
                </el-col>
            </el-row>
        </div>

        <datagrid :url="vo.url" ref="dg">
            <el-table-column type="expand">
                <template scope="data">
                    <div class="imgWarp">
                        <video width="320" height="240" controls>
                            <source :src="data.row.url" type="video/mp4">
                            您的浏览器不支持Video标签。
                        </video>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="视频说明" prop="text" width="200"></el-table-column>
            <el-table-column label="视频地址" prop="url">
                <template scope="data">
                    <a :href="vo.origin+'/video/'+data.row._id"
                       target="_blank">{{vo.origin+'/video/'+data.row._id}}</a>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template scope="data">
                    <el-button size="small" icon="edit" @click="openDialog('edit',data.row)">编辑</el-button>
                    <el-button size="small" icon="delete" @click="delVideo(data.row)">删除</el-button>
                </template>
            </el-table-column>
        </datagrid>

        <el-dialog :title="vo.dialog.title" :visible.sync="vo.dialog.open">
            <el-form ref="videoForm" :rules="rules" :model="po.video">
                <el-form-item label="视频说明" prop="text" :label-width="vo.labelWidth">
                    <el-input v-model="po.video.text"></el-input>
                </el-form-item>
                <el-form-item label="视频" prop="url" :label-width="vo.labelWidth">
                    <input type="file" @change="selectFile($event)" accept=".mp4" ref="videoFile" v-if="vo.dialog.reloadFile">
                </el-form-item>
                <el-form-item label="视频预览" v-if="po.video.url" :label-width="vo.labelWidth">
                    <el-row>
                        <el-col :span="24">
                            <div class="grid-content bg-purple-dark">
                                <video width="320" height="240" controls>
                                    <source :src="po.video.url" type="video/mp4">
                                    您的浏览器不支持Video标签。
                                </video>
                            </div>
                        </el-col>
                    </el-row>
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
    import {edit, del} from 'apis/video'
    import {VIDEO_LIST} from 'apis/utils/urls'
    import datagrid from 'components/datagrid'
    let origin=window.location.origin
    export default {
        data() {
            return {
                dialogVisible: false,
                po: {
                    video: {
                        id: '',
                        text: "",
                        url: ""
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
                    otherDialogOpen: false,
                    url: VIDEO_LIST,
                    origin: origin
                },
                rules: {
                    url: [
                        {required: true, message: '请选择视频', trigger: 'change'},
                    ],
                    text: [
                        {required: true, message: '请输入视频说明', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            openDialog(mode, row){
                this.clearFile()
                if (mode == 'add') {
                    this.po.video.id = ''
                    this.po.video.text = ''
                    this.po.video.url = ''
                    this.vo.dialog.title = '添加视频'
                } else {
                    this.po.video.id = row._id
                    this.po.video.text = row.text
                    this.po.video.url = row.url
                    this.vo.dialog.title = '编辑视频'
                }
                this.vo.dialog.mode = mode
                this.vo.dialog.open = true
            },
            edit(){
                this.$refs['videoForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let files = this.$refs.videoFile.files
                    let fd = new FormData()
                    if (this.vo.dialog.mode == 'edit') {
                        fd.append("id", this.po.video.id)
                    }
                    fd.append("text", this.po.video.text)

                    if (files.length) {
                        fd.append("video", files[0])
                    }

                    edit(fd).then(data=> {
                        this.loadList()
                        this.vo.dialog.open = false
                    }).catch(err=> {
                        this.$message({
                            type: 'error',
                            message: err.message,
                            duration: 0,
                            closed: true
                        })
                    })
                })
            },
            loadList(){
                this.$refs["dg"].reload()
            },
            selectFile(event){
                if (event.target.files && event.target.files.length) {
                    let file = event.target.files[0]
                    this.po.video.url=file.name
                }else{
                    this.po.video.url=""
                }
            },
            clearFile(){
                this.vo.dialog.reloadFile = false
                this.$nextTick(()=> {
                    this.vo.dialog.reloadFile = true
                })
            },
            delVideo(row){
                this.$confirm('确定删除吗？', '提示').then(()=> {
                    del({id: row._id}).then(data=> {
                        this.loadList()
                    })
                }).catch(err=> {
                    this.$alert(err.message, '错误', {
                        type: 'error'
                    });
                })
            }
        },
        mounted () {
//            this.vo.origin =
        },
        components: {
            datagrid
        }
    }
</script>