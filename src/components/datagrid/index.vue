<style scoped>
    .dg__warp {
        background-color: #FFFFFF;
        padding-bottom: 8px;
    }

    .jf-pagintion {
        background: #FFFFFF;
        margin-top: 3px;
    }
</style>
<template>
    <div class="dg__warp"  v-loading.fullscreen.lock="vo.loading">
        <el-table :data="vo.data" border  :height="vo.height" element-loading-text="拼命加载中">
            <slot>

            </slot>
        </el-table>
        <el-pagination class="jf-pagintion"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="vo.currentPage"
                       :page-sizes="[5,10, 20, 30,50,100,200]"
                       :page-size="vo.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="vo.total">
        </el-pagination>
    </div>
</template>
<script>
    import {get} from "apis/utils/index"
    let dgList=[]
    /*window.addEventListener("resize",function () {
        for(let dg of dgList){
            dg.resize()
        }
    })*/
    export default {
        data: function () {
            return {
                vo: {
                    loading: false,
                    currentPage: 1,
                    pageSize: 20,
                    total: 0,
                    data: [],
                    timer:null
                }
            }
        },
        props: {
            params: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            url: String
        },
        computed: {},
        methods: {
            handleSizeChange(val) {
                this.vo.pageSize = val
                this.loadData()
            },
            handleCurrentChange(val) {
                this.vo.currentPage = val
                this.loadData()
            },
            loadData(){
                let params = Object.assign({}, JSON.parse(JSON.stringify(this.params)), {
                    "page": this.vo.currentPage,
                    "rows": this.vo.pageSize
                })
                this.vo.loading = true;

                window.clearTimeout(this.vo.timer)
                this.vo.timer=setTimeout(()=>{
                    if(this.vo.loading){
                        this.vo.loading = false
                        this.$message({
                            type: 'error',
                            message:'服务器响应超时',
                            duration: 2000,
                            showClose: true
                        })
                    }
                },10000)

                get(this.url, params).then(data=> {
                    this.vo.loading = false
                    this.vo.data = data.rows
                    this.vo.total = data.total
                }).catch(err=>{
                    this.vo.loading = false
                    this.$message({
                        type: 'error',
                        message: err.message,
                        duration: 0,
                        showClose: true
                    })
                })
            },
            reload(){
                this.loadData()
            },
            resize(){
                let top = document.documentElement.scrollTop
                let h = this.$el.getBoundingClientRect().top
                this.vo.height = window.document.documentElement.clientHeight - h - 50
            }
        },
        mounted: function () {
            dgList.push(this)
            this.$nextTick(()=>{
                this.resize()
            })
            this.loadData()
        },
        filters: {}
    }

</script>