<style scope>
    .title {
        font-size: 22px;
        font-weight: bold;
    }
</style>
<template>
    <div>
        <el-form ref="joinForm" :model="po">
            <el-tabs type="border-card">
                <el-tab-pane label="基本信息">
                    <el-form-item label="微博地址" prop="weiboURL" :label-width="vo.labelWidth"
                                  :rules="{ required: true, message: '请输入微博地址', trigger: 'blur'}">
                        <el-input v-model="po.weiboURL" placeholder="请输入微博地址   例如:https://weibo.com"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="中文信息">
                    <el-form-item v-for="(item,index) in po.cn.address" :label="'地址'+(index+1)"
                                  :prop="'cn.address['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.cn.address[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="cn" field="address"
                                  :on-icon-click="changeChild">
                        </el-input>
                    </el-form-item>

                    <el-form-item v-for="(item,index) in po.cn.tel" :label="'联系方式'+(index+1)"
                                  :prop="'cn.tel['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.cn.tel[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="cn" field="tel"
                                  :on-icon-click="changeChild">
                        </el-input>
                    </el-form-item>

                    <el-form-item v-for="(item,index) in po.cn.email" :label="'邮箱'+(index+1)"
                                  :prop="'cn.email['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.cn.email[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="cn" field="email"
                                  :on-icon-click="changeChild">
                        </el-input>
                    </el-form-item>

                    <el-form-item v-for="(item,index) in po.cn.weibo" :label="'微博'+(index+1)"
                                  :prop="'cn.weibo['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.cn.weibo[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="cn" field="weibo"
                                  :on-icon-click="changeChild">
                        </el-input>
                    </el-form-item>


                </el-tab-pane>
                <el-tab-pane label="English Info">
                    <el-form-item v-for="(item,index) in po.en.address" :label="'Address '+(index+1)"
                                  :prop="'en.address['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.en.address[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="en" field="address"
                                  :on-icon-click="changeChild">
                        </el-input>
                    </el-form-item>

                    <el-form-item v-for="(item,index) in po.en.tel" :label="'Tel '+(index+1)"
                                  :prop="'en.tel['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.en.tel[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="en" field="tel"
                                  :on-icon-click="changeChild">
                        </el-input>
                    </el-form-item>

                    <el-form-item v-for="(item,index) in po.en.email" :label="'Email '+(index+1)"
                                  :prop="'en.email['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.en.email[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="en" field="email"
                                  :on-icon-click="changeChild">
                        </el-input>
                    </el-form-item>

                    <el-form-item v-for="(item,index) in po.en.weibo" :label="'Weibo'+(index+1)"
                                  :prop="'en.weibo['+index+']'"
                                  :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}"
                                  :label-width="vo.labelWidth">
                        <el-input placeholder="请输入内容" v-model="po.en.weibo[index]"
                                  :icon="index==0?'plus':'delete'" :index="index" t="en" field="weibo"
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
    </div>
</template>

<script>
    import {getInfo, edit} from 'apis/webSetting'
    export default {
        data() {
            return {
                po: {
                    key: 'contact',
                    weiboURL: '',
                    en: {
                        address: [''],
                        tel: [''],
                        email: [''],
                        weibo: [''],
                    },
                    cn: {
                        address: [''],
                        tel: [''],
                        email: [''],
                        weibo: [''],
                    }
                },
                vo: {
                    labelWidth: '120px',
                }
            }
        },
        methods: {

            edit(){
                this.$refs['joinForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }

                    edit({
                        key: this.po.key,
                        value: {
                            weiboURL: this.po.weiboURL,
                            cn: this.po.cn,
                            en: this.po.en
                        }
                    }).then(data=> {
                        this.getDetails()
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
                let field = e.path[1].getAttribute("field")
                let index = Number.parseInt(e.path[1].getAttribute("index"))
                if (index == 0) {
                    this.po[type][field].push('')
                } else {
                    this.po[type][field].splice(index, 1)
                }
            },
            getDetails(){
                getInfo({key: this.po.key}).then(data => {
                    if (data.key) {
                        this.po.weiboURL = data.value.weiboURL
                        this.po.cn = data.value.cn
                        this.po.en = data.value.en
                    }
                }).catch(err=>{
                    this.$message({
                        type: 'error',
                        message: err.message,
                        duration: 0,
                        showClose: true
                    })
                })
            },
        },
        mounted () {
            this.getDetails()
        }
    }
</script>