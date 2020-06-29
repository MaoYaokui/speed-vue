<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button type="primary" icon="el-icon-edit" style="float: right;" @click="handleCreate">
        Add
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;"
              border fit highlight-current-row>
      <el-table-column label="序号" type="index" align="center" width="80">
        <template slot-scope="{$index}">
          <span>{{(listQuery.page - 1) * listQuery.limit + $index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类图标" prop="iconImg" align="center" width="100">
        <template v-slot="{row}">
          <el-avatar shape="square" :size="50" :src="getIconImg(row.iconImg)"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="name" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="{row}">

          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>

          <el-button v-if="row.sortNum === 0" type="success" size="mini" @click="topUpdate(row,0)">
            置顶
          </el-button>
          <el-button v-else type="success" size="mini" @click="topUpdate(row,1)">
            取消置顶
          </el-button>


        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <div slot="footer" class="dialog-footer">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
                 style="width: 400px;">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="temp.name"/>
          </el-form-item>
          <el-form-item label="分类图标" prop="iconImg">
            <el-upload
                    class="avatar-uploader"
                    :action="getSubmitPath()"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
              <img v-if="temp.iconImg" :src="getIconImg(temp.iconImg)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {list, create, update, topUpdate} from '@/api/cate'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'cate',
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        // 表单唯一标识
        tableKey: 0,
        // 表单数据
        list: null,
        // 记录总条数
        total: 0,
        // 加载状态
        listLoading: true,
        // 查询数据
        listQuery: {
          page: 1,
          limit: 30,
          name: undefined
        },
        //----- 弹窗 -----
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          name: [{required: true, message: 'name is required', trigger: 'blur'}],
          iconImg: [{required: true, message: 'iconImg is required', trigger: 'blur'}]
        },
        temp: {
          id: undefined,
          name: '',
          iconImg: ''
        }
        //----- 弹窗 -----
      }
    },
    computed: {
      totalPages() {
        if (this.listQuery.page > 1) {
          return (this.total + this.listQuery.limit - 1) / this.listQuery.limit
        }
        return this.listQuery.page
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        list(this.listQuery).then(response => {
          this.list = response.page.list
          this.total = response.page.totalCount
        })
        this.listLoading = false
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          iconImg: ''
        }
      },
      getSubmitPath() {
        return this.$store.state.baseURL + '/file/upload?type=icon'
      },
      getIconImg(iconImg) {
        if (iconImg === '') {
          return iconImg
        } else {
          return this.$store.state.filePath + iconImg
        }
      },
      handleAvatarSuccess(res) {
        this.temp.iconImg = res.filePath
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //当前用户
            this.temp.createCode = this.$store.getters.name
            create(this.temp).then(response => {
              const {productCate} = response
              this.listQuery.page = this.totalPages
              this.list.push(productCate)

              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // 修改用户 当前用户
            this.temp.updateCode = this.$store.getters.name
            const tempData = Object.assign({}, this.temp)
            update(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      topUpdate(row, type) {
        topUpdate({
          id: row.id,
          type: type
        }).then(() => {
          this.getList()
        })
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    float: left;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
