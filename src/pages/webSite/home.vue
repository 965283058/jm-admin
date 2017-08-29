<style scoped>
    .imgWarp {
        padding: 10px;
    }



    input[type=file] {
        line-height: 28px;
        border: 1px solid #c2c2c2;
        margin-bottom: 5px;
    }
    .propInfo{
        margin-left: 20px;
    }
</style>
<template>
    <div>
        <div>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <h1 class="add">首页滚动轮播图
                            <el-button icon="plus" type="success" @click="openDialog('add')">添加</el-button>
                            <el-button icon="setting" type="primary" @click="openSettingDialog()">其他设置</el-button>
                        </h1>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-table :data="vo.data" border :row-class-name="tableRowClassName">
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
        </el-table>

        <el-dialog :title="vo.dialog.title" :visible.sync="vo.dialog.open">
            <el-form ref="homeBannerForm" :rules="rules" :model="po.banner">
                <el-form-item label="图片" prop="img" :label-width="vo.labelWidth">
                    <input type="file" @change="selectImg($event)" ref="imgFile" v-if="vo.dialog.reloadFile">

                </el-form-item>
                <el-form-item label="图片预览" v-if="po.banner.img" :label-width="vo.labelWidth">
                    <el-row>
                        <el-col :span="24">
                            <div class="grid-content bg-purple-dark">
                                <img :src="po.banner.img" alt="" class="imgPerview">
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="排序" prop="index" :label-width="vo.labelWidth">
                    <el-input-number v-model="po.banner.index" :min="1" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="vo.labelWidth">
                    <el-radio v-model="po.banner.status" :label="1">启用</el-radio>
                    <el-radio v-model="po.banner.status" :label="0">禁用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="vo.dialog.open = false">取 消</el-button>
                <el-button type="primary" @click="edit()">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog :title="vo.dialog.title" :visible.sync="vo.otherDialogOpen">
            <el-form ref="homeBannerForm" :rules="rules" :model="po.setting">
                <el-form-item label="滚动方向" label-width="350px">
                    <el-radio v-model="po.setting.mode" label="horizontal">水平</el-radio>
                    <el-radio v-model="po.setting.mode" label="vertical">垂直</el-radio>
                </el-form-item>

                <el-form-item label="滑动开始到结束的时间(单位:毫秒)" label-width="350px">
                    <el-input-number v-model="po.setting.speed" :min="0" :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item label="自动切换Banner图的时间(设置为0取消自动切换)" label-width="350px">
                    <el-input-number v-model="po.setting.autoplay" :min="0" :max="100000"></el-input-number>
                    <span class="propInfo"></span>
                </el-form-item>
                <el-form-item label="用户进行滚动操作后是否停止自动滚动" label-width="350px">
                    <el-radio v-model="po.setting.autoplayDisableOnInteraction" label="true">停止</el-radio>
                    <el-radio v-model="po.setting.autoplayDisableOnInteraction" label="false">滚动</el-radio>
                </el-form-item>
                <el-form-item label="Banner图循环滚动" label-width="350px">
                    <el-radio v-model="po.setting.loop" label="true">循环滚动</el-radio>
                    <el-radio v-model="po.setting.loop" label="false">关闭循环</el-radio>
                </el-form-item>
                <el-form-item label="键盘方向键控制滚动" label-width="350px">
                    <el-radio v-model="po.setting.keyboardControl" label="true">启动</el-radio>
                    <el-radio v-model="po.setting.keyboardControl" label="false">关闭</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="vo.otherDialogOpen = false">取 消</el-button>
                <el-button type="primary" @click="saveSetting()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {list, edit, del} from 'apis/homeBanner'

    import * as webSetting from 'apis/webSetting'

    export default {
        data() {
            return {
                dialogVisible: false,
                po: {
                    banner: {
                        id: '',
                        img: "",
                        index: "",
                        status: 1
                    },
                    setting: {
                        key:'homeBanner',
                        mode:'horizontal',
                        speed:0,
                        autoplay:0,
                        autoplayDisableOnInteraction:false,
                        loop:true,
                        keyboardControl:true
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
                    otherDialogOpen:false,
                    data: []
                },
                rules: {
                    img: [
                        {required: true, message: '请选择图片', trigger: 'change'},
                    ],
                    index: [
                        {type: 'number', required: true, message: '请选择日期', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            openDialog(mode, row){
                this.clearFile()
                if (mode == 'add') {
                    this.po.banner.id = ''
                    this.po.banner.img = ''
                    this.po.banner.index = this.vo.data.length + 1
                    this.po.banner.status = 1
                    this.vo.dialog.title = '添加首页Banner图'
                } else {
                    this.po.banner.id = row._id
                    this.po.banner.img = row.img
                    this.po.banner.index = row.index
                    this.po.banner.status = row.status
                    this.vo.dialog.title = '修改首页Banner图'
                }
                this.vo.dialog.mode = mode
                this.vo.dialog.open = true
            },
            edit(){
                this.$refs['homeBannerForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let files = this.$refs.imgFile.files
                    let fd = new FormData()
                    if (this.vo.dialog.mode == 'edit') {
                        fd.append("id", this.po.banner.id)
                    }
                    fd.append("index", this.po.banner.index)
                    fd.append("status", this.po.banner.status)

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
                            closed: true
                        })
                    })
                })
            },
            loadList(){
                list().then(data => {
                    this.vo.data = data
                })
            },

            selectImg(event){
                if (event.target.files && event.target.files.length) {
                    let file = event.target.files[0]
                    let reader = new FileReader()
                    let _self = this
                    reader.onload = function (e) {
                        _self.po.banner.img = e.target.result;
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
            },

            openSettingDialog(){
                webSetting.getInfo({key: 'homeBanner'}).then(data=> {
                    if (data.key) {
                        this.po.setting=data.value
                        this.po.setting.key=data.key
                        this.vo.otherDialogOpen=true
                    }
                })
            },
            saveSetting(){
                let value=JSON.parse(JSON.stringify(this.po.setting))
                delete value.key
                webSetting.edit({
                    key:this.po.setting.key,
                    value:value
                }).then(data=>{
                    this.vo.otherDialogOpen=false
                    this.$message({
                        type: 'success',
                        message: '保存成功',
                        duration: 1500
                    })
                }).catch(err=> {
                    this.$message({
                        type: 'error',
                        message: err.message,
                        duration: 0,
                        closed: true
                    })
                })
            }

        },
        mounted () {
            this.loadList()
        }
    }
</script>