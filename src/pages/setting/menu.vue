<style>
    .el-table .info-row {
        background:  #e2f0e4;
    }

    .el-table .positive-row {
        background:darkseagreen;
    }
</style>
<template>
    <div>
        <el-table :data="vo.data" border :row-class-name="tableRowClassName">
            <el-table-column label="菜单名" width="240">
                <template scope="data">
                    <span>{{data.row.parentId!=0?'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+data.row.text:data.row.text}}</span>
                </template>
            </el-table-column>
            <el-table-column label="代码" prop="code" width="150"></el-table-column>
            <el-table-column label="类型" width="120">
                <template scope="data">
                    {{data.row.parentId==0?"根节点":"子节点"}}
                </template>
            </el-table-column>
            <el-table-column label="排序" prop="index" width="80"></el-table-column>

            <el-table-column label="操作" >
                <template scope="data">
                    <el-button size="small" icon="edit" @click="openDialog('edit',data.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog title="修改菜单" custom-class="dialog--editor" :visible.sync="vo.dialog.open">
            <el-form ref="menuForm" :model="po">
                <el-form-item label="菜单名" :rules="{required: true, message: '请输入菜单名', trigger: 'blur'}"
                              labelWidth="80px" prop="text">
                    <el-input v-model="po.text"></el-input>
                </el-form-item>

                <el-form-item label="排序" labelWidth="80px">
                    <el-input-number v-model="po.index" :min="0" :max="100"></el-input-number>
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
    import {treeMenu, edit} from 'apis/menu'
    import * as url from 'apis/utils/urls'

    export default {
        data() {
            return {
                po: {
                    id: '',
                    text: '',
                    index: null
                },
                vo: {
                    labelWidth: '120px',
                    dialog: {
                        open: false
                    },
                    data: []
                }
            }
        },
        methods: {
            tableRowClassName(row, index) {
                if (row.parentId!=0) {
                    return 'info-row';
                } else{
                    return 'positive-row';
                }
            },
            openDialog(mode, row){
                this.po = {
                    id: row.id,
                    text: row.text,
                    index: row.index
                }
                this.vo.dialog.mode = mode
                this.vo.dialog.open = true
            },
            edit(){
                this.$refs['menuForm'].validate((valid) => {
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
            loadList(){
                treeMenu().then(data=> {
                    let menus = []
                    data.forEach(item=> {
                        menus.push(item)
                        if (item.children && item.children.length) {
                            item.children.forEach(child=> {
                                menus.push(child)
                            })
                        }
                    })
                    this.vo.data = menus
                })
            },

            selectImg(event){
                if (event.target.files && event.target.files.length) {
                    let file = event.target.files[0]
                    let reader = new FileReader()
                    let _self = this
                    reader.onload = function (e) {
                        _self.po.people.img = e.target.result;
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
            resetPwd(id){

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
            this.loadList()
        }
    }
</script>