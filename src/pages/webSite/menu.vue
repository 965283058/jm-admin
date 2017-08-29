<template>
    <div>
        <el-table :data="vo.data" style="width: 100%" border :row-class-name="tableRowClassName">
            <el-table-column prop="menu" label="路径" width="180"></el-table-column>
            <el-table-column prop="cn" label="中文" width="180"></el-table-column>
            <el-table-column prop="en" label="英文" width="180"></el-table-column>
            <el-table-column prop="index" label="排序" width="180"></el-table-column>
            <el-table-column label="状态" width="180">
                <template scope="data">
                    {{data.row.status==1?"启用":"禁用"}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="data">
                    <el-button size="small" @click="openDialog(data.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改菜单" :visible.sync="vo.dialog.open">
            <el-form ref="menuForm"   :rules="rules" :model="po">
                <el-form-item label="路径" :label-width="vo.labelWidth">
                    <el-input v-model="po.menu"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="中文" prop="cn" :label-width="vo.labelWidth">
                    <el-input v-model="po.cn" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="英文" prop="en"  :label-width="vo.labelWidth">
                    <el-input v-model="po.en" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="index"  :label-width="vo.labelWidth">
                    <el-input-number v-model="po.index" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="vo.labelWidth">
                    <el-radio v-model="po.status" :label="1">启用</el-radio>
                    <el-radio v-model="po.status" :label="0">禁用</el-radio>
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
    import {list,edit} from 'apis/webMenu'
    export default {
        data() {
            return {
                po: {
                    id:'',
                    menu: "",
                    en: "",
                    cn: "",
                    index: "",
                    status: ''
                },
                vo: {
                    labelWidth: '120px',
                    dialog: {
                        open: false
                    },
                    data: []
                },
                rules: {
                    cn: [
                        { required: true, message: '请输入中文菜单名', trigger: 'blur' },
                        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
                    ],
                    en: [
                        { required: true, message: '请输入英文菜单名', trigger: 'blur' },
                        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
                    ],
                    index: [
                        { type: 'number', required: true, message: '请选择日期', trigger: 'change' }
                    ]
                }

            }
        },
        methods: {
            openDialog(row){
                this.po.id=row._id
                this.po.menu = row.menu
                this.po.en = row.en
                this.po.cn = row.cn
                this.po.index = row.index
                this.po.status = row.status
                this.vo.dialog.open = true
            },
            edit(){
                this.$refs['menuForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    edit(this.po).then(data=>{
                        this.loadList()
                        this.vo.dialog.open = false
                    }).catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message,
                            duration:0
                        })
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