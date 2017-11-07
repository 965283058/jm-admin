<template>
    <div>
        <el-form ref="teamminusForm" :model="po">
            <el-tabs type="border-card">
                <el-tab-pane label="中文信息">
                    <el-form-item label="图片" prop="cn_img"
                                  :rules="{ required: true, message: '请选择图片', trigger: 'change'}"
                                  :label-width="vo.labelWidth">
                        <input type="file" @change="selectImg($event,'cn')" ref="cn_imgFile" v-if="vo.reloadFile"/>
                    </el-form-item>
                    <el-form-item label="图片预览" v-if="po.cn_img" :label-width="vo.labelWidth">
                        <el-row>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-dark">
                                    <img :src="po.cn_img" alt="" class="imgPerview">
                                </div>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="内容" prop="cn_content" :label-width="vo.labelWidth"
                                  :rules="{ required: true, message: '请输入内容', trigger: 'blur'}">
                        <el-input type="textarea" :autosize="{ minRows: 5}" v-model="po.cn_content"
                                  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="English Info">
                    <el-form-item label="Image" prop="cn_img"
                                  :rules="{ required: true, message: '请选择图片', trigger: 'change'}"
                                  :label-width="vo.labelWidth">
                        <input type="file" @change="selectImg($event,'en')" ref="en_imgFile" v-if="vo.reloadFile"/>
                    </el-form-item>
                    <el-form-item label="图片预览" v-if="po.en_img" :label-width="vo.labelWidth">
                        <el-row>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-dark">
                                    <img :src="po.en_img" alt="" class="imgPerview">
                                </div>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="Content" prop="en_content" :label-width="vo.labelWidth"
                                  :rules="{ required: true, message: 'content is required', trigger: 'blur'}">
                        <el-input type="textarea" :autosize="{ minRows: 5}" v-model="po.en_content"
                                  placeholder="Please enter Content"></el-input>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
            <div class="form-footer">
                <el-button @click="reset()">重置</el-button>
                <el-button type="primary" @click="edit()">确 定</el-button>
            </div>

        </el-form>

    </div>
</template>

<script>
    import {getInfo, edit} from 'apis/teamminus'
    export default {
        data() {
            return {
                po: {
                    cn_img: null,
                    cn_content: '',
                    en_img: null,
                    en_content: ''
                },
                vo: {
                    labelWidth: '120px',
                    reloadFile: true
                }
            }
        },
        methods: {
            edit(){
                this.$refs['teamminusForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let fd=new FormData()
                    fd.append('cn_content',this.po.cn_content)
                    fd.append('en_content',this.po.en_content)
                    if(this.$refs.cn_imgFile.files.length){
                        fd.append('cn_img',this.$refs.cn_imgFile.files[0])
                    }
                    if(this.$refs.en_imgFile.files.length){
                        fd.append('en_img',this.$refs.en_imgFile.files[0])
                    }

                    edit(fd).then(data=> {
                        this.clearFile()
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
            selectImg(event, type){
                if (event.target.files && event.target.files.length) {
                    let file = event.target.files[0]
                    let reader = new FileReader()
                    let _self = this
                    reader.onload = function (e) {
                        _self.po[type + '_img'] = e.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            },
            clearFile(){
                this.vo.reloadFile = false
                this.$nextTick(()=> {
                    this.vo.reloadFile = true
                })
            },
            getDetails(){
                getInfo({key: this.po.key}).then(data => {
                    this.po.cn_img = data.cn.img
                    this.po.cn_content = data.cn.content
                    this.po.en_img = data.en.img
                    this.po.en_content = data.en.content
                }).catch(err=> {
                    this.$message({
                        type: 'error',
                        message: err.message,
                        duration: 0,
                        showClose: true
                    })
                })
            },
            reset(){
                this.clearFile()
                this.po.cn_img =''
                this.po.cn_content=''
                this.po.en_img=''
                this.po.en_content =''
            }
        },
        mounted () {
            this.getDetails()
        }
    }
</script>