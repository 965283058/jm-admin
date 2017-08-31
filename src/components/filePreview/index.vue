<style scoped></style>
<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark" ref="view" @click="show($event)">
                    <slot></slot>
                </div>
            </el-col>
        </el-row>
        <el-dialog v-model="dialogVisible" size="small" :modal-append-to-body="false">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                dialogVisible: false,
                dialogImageUrl: ''
            }
        },
        computed: {},
        methods: {
            show(e){
                let file = this.$refs['view'].querySelector("img")
                this.dialogImageUrl = file.getAttribute("src")
                this.dialogVisible = true
            }
        },
        mounted(){

        },
        components: {},
        filters: {}
    }
</script>