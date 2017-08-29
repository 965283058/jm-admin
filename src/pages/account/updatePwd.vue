<style scoped>
    .box {
        height: 100%;
        width: 100%;
        background: #1f2d3d;
        min-height: 400px;
        position: relative;
    }

    .warp {
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        background-color: #F9FAFC;
        border: 2px solid #8492A6;
        width: 370px;
        height: 400px;
        padding: 35px 35px 15px 35px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -200px;
        margin-left: -150px;
        box-sizing: border-box;

    }

    .warp .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .warp input[type=password] {
        width: 100%;
        border: 1px solid #c2c2c2;
        padding: 0px 3px;
        border-radius: 5px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1)
    }

    .warp input[type=password]:focus {
        border-color: #00aeff;

    }
</style>
<template>
    <div class="box">
        <el-form ref="pwdForm" :model="po" :rules="vo.rules" label-position="right" class="warp">
            <h3 class="title" v-if="vo.mode==0">修改密码</h3>
            <h3 class="title" v-if="vo.mode==1">修改系统初始默认密码</h3>
            <el-form-item prop="oldPwd" label="原密码" label-width="80px">
                <input type="password" v-model="po.oldPwd" autocomplete="off" placeholder="请输入原密码"/>
            </el-form-item>
            <el-form-item prop="pwd" label="新密码" label-width="80px">
                <input type="password" v-model="po.pwd" autocomplete="off" placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item prop="pwdConfirm" label="确认密码" label-width="80px">
                <input type="password" v-model="po.pwdConfirm" autocomplete="off" placeholder="请再次输入新密码"/>
            </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="update()">修改
                </el-button>
            </el-form-item>
        </el-form>
    </div>

</template>
<script>
    import {changePwd} from 'apis/account'
    export default {
        data: function () {
            let checkPwdEquals = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入确认密码！'));
                }
                if (value != this.po.pwd) {
                    return callback(new Error('两次密码输入不相同'));
                }
                callback()
            };
            return {
                po: {
                    oldPwd: '',
                    pwd: '',
                    pwdConfirm: ''
                },
                vo: {
                    mode: 0,
                    rules: {
                        oldPwd: [{required: true, message: '请输入原密码', trigger: 'blur'}],
                        pwd: [
                            {required: true, message: '请输入新密码', trigger: 'blur'},
                            {min: 6, max: 20, message: '长度在6到20个非空字符', trigger: 'blur'}],
                        pwdConfirm: [
                            {required: true, validator: checkPwdEquals, trigger: 'blur'}
                        ]
                    }
                }
            }
        },
        methods: {
            update(){
                this.$refs['pwdForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    changePwd(this.po).then(data=> {
                        if (data) {
                            let user = window.localStorage.getItem("user")
                            if(user){
                                user=JSON.parse(user)
                                user.pwdStatus=1
                                window.localStorage.setItem("user",JSON.stringify(user))
                                this.$router.replace("/")
                            }else{
                                this.$router.replace("/login")
                            }
                        }
                    }).catch(err=> {
                        this.$msgbox({
                            title: '错误',
                            message: err.message
                        })
                    })
                });

            }
        },
        mounted: function () {
            let mode = this.$route.query.init;
            if (mode == 1) {
                this.vo.mode = 1
            }
        },
        filters: {}
    }
</script>