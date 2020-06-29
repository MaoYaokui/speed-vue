<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves type="primary" icon="el-icon-d-arrow-left" @click="handlePrev">
        返回
      </el-button>

      <el-button v-if="productId === 0" v-waves type="primary" style="float: right;" icon="el-icon-check"
                 @click="createData">
        确认
      </el-button>
      <el-button v-else v-waves type="primary" style="float: right;" icon="el-icon-check" @click="updateData">
        确认
      </el-button>
    </div>
    <el-form ref="dataForm" :rules="rules" :model="temp" v-loading="listLoading" label-width="120px"
             style="padding-top: 10px;">
      <el-form-item label="商品宣传图" prop="promoImage" style="width: 100px;">
        <el-upload
                class="avatar-uploader"
                :action="getSubmitPath(0)"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
          <img v-if="temp.promoImage" :src="getPath(temp.promoImage)" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品分类" prop="cateId">
        <el-select v-model="temp.cateId" placeholder="商品分类" style="width: 200px" class="filter-item">
          <el-option v-for="cate in cateList" :key="cate.id" :label="cate.name" :value="cate.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="temp.name" placeholder="商品名称" style="width: 615px;"/>
      </el-form-item>
      <el-form-item label="商品缩略图" prop="images">
        <el-upload
                v-if="productId === 0"
                :action="getSubmitPath(1)"
                list-type="picture-card"
                :on-success="handleSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-upload
                v-else
                :action="getSubmitPath(1)"
                :file-list="temp.images"
                list-type="picture-card"
                :on-success="handleSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleUpdateRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品售卖状态">
        <el-radio v-model="temp.isShow" label="0">未在售</el-radio>
        <el-radio v-model="temp.isShow" label="1">在售</el-radio>
      </el-form-item>
      <el-form-item label="首页推荐状态">
        <el-radio v-model="temp.recommended" label="0">不推荐</el-radio>
        <el-radio v-model="temp.recommended" label="1">推荐</el-radio>
      </el-form-item>
      <el-form-item label="首页轮播图">
        <el-radio v-model="temp.carousel" label="0">否</el-radio>
        <el-radio v-model="temp.carousel" label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="商品规格" prop="items">
        <template>
          <el-table
                  :data="temp.items"
                  border
                  style="width: 100%">
            <el-table-column
                    prop="name"
                    align="center"
                    label="规格名称">
              <template v-slot="{row}">
                <el-input size="small" v-model="row.name" placeholder="请输入规格名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                    prop="salePrice"
                    label="价格"
                    align="center"
                    width="400">
              <template v-slot="{row}">
                <el-input size="small" v-model="row.salePrice" placeholder="请输入价格"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                    prop="stock"
                    label="库存"
                    align="center"
                    width="400">
              <template v-slot="{row}">
                <el-input size="small" v-model="row.stock" placeholder="请输入库存"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                    width="105"
                    align="center">
              <template slot="header" slot-scope="scope">
                <el-button
                        size="mini"
                        type="primary"
                        @click="handleItemAdd()">新增
                </el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                        size="mini"
                        type="danger"
                        @click="handleItemDelete(scope.row,scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
      <el-form-item label="导师介绍" prop="tutorIntroduced">
        <Tinymce v-model="temp.tutorIntroduced" :height="400"/>
      </el-form-item>
      <el-form-item label="商品详情" prop="instruction">
        <Tinymce v-model="temp.instruction" :height="400"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {list as cateList} from '@/api/cate'
  import {get, create, update, deleteImage} from '@/api/product'
  import waves from '@/directive/waves' // waves directive
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'message',
    components: {
      Tinymce
    },
    directives: {waves},
    props: {
      productId: Number
    },
    data() {
      const validateImage = (rule, value, callback) => {
        const length = this.temp.images.length
        if (length === 0) {
          this.$message.error('请上传商品缩略图');
        } else if (length < 3) {
          this.$message.error('请至少上传三张商品缩略图');
        } else {
          callback()
        }
      }
      const validateItem = (rule, value, callback) => {
        const length = this.temp.items.length
        if (length === 0) {
          this.$message.error('请设置至少一个商品营期');
        } else {
          callback()
        }
      }
      return {
        // 加载状态
        listLoading: true,
        // 表单数据
        cateList: null,
        rules: {
          promoImage: [{required: true, message: '请上传商品宣传图', trigger: 'blur'}],
          cateId: [{required: true, message: '请选择活动区域', trigger: 'change'}],
          name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
          images: [{required: true, validator: validateImage, trigger: 'blur'}],
          items: [{required: true, validator: validateItem, trigger: 'blur'}],
          tutorIntroduced: [{required: true, message: '请输入导师介绍', trigger: 'blur'}],
          instruction: [{required: true, message: '请输入商品详情', trigger: 'blur'}]
        },
        temp: {
          id: undefined,
          promoImage: '', // 商品展示图
          cateId: '', // 商品分类
          name: '', // 商品名称
          isShow: '0', // 是否在售商品 默认未在售
          recommended: '0', // 是否推荐商品 默认不推荐
          carousel: '0',// 首页轮播 默认否
          tutorIntroduced: '', // 导师介绍
          instruction: '', // 商品详情
          images: [],
          items: []
        },
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    created() {
      this.getCateList()
      if (this.productId !== 0) {
        this.getProduct()
      }
    },
    methods: {
      getCateList() {
        cateList(this.listQuery).then(response => {
          this.cateList = response.page.list
          this.listLoading = false
        })
      },
      getProduct() {
        get({
          productId: this.productId
        }).then(response => {
          this.temp = response.product
          this.listLoading = false
        })
      },
      handlePrev() {
        this.$store.commit('productSaveVisible')
      },
      getPath(path) {
        if (path === '') {
          return path
        } else {
          return this.$store.state.filePath + path
        }
      },
      getSubmitPath(type) {
        if (type === 0) {
          return this.$store.state.baseURL + '/file/upload?type=original'
        }
        if (type === 1) {
          return this.$store.state.baseURL + '/file/upload?type=abbreviation'
        }
        return ''
      },
      // 商品宣传图
      handleAvatarSuccess(res) {
        this.temp.promoImage = res.filePath;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 商品缩略图
      handleSuccess(res) {
        this.temp.images.push(res.image)
      },
      handleRemove(file) {
        deleteImage({
          id: file.id
        }).then(() => {
          this.temp.images.splice(this.temp.images.findIndex(image => image.id === file.id), 1)
        })
      },
      handleUpdateRemove(file) {
        this.temp.images.splice(this.temp.images.findIndex(image => image.id === file.id), 1)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleItemAdd() {
        this.temp.items.push(
            {
              id: undefined,
              name: '',
              salePrice: '',
              stock: ''
            }
        )
      },
      handleItemDelete(row, index) {
        this.temp.items.splice(index, 1)
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //当前用户
            this.temp.createCode = this.$store.getters.name
            create(this.temp).then(response => {
              this.$emit('updateList', response.product);

              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })

              this.$store.commit('productSaveVisible')
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            // 修改用户 当前用户
            this.temp.updateCode = this.$store.getters.name
            const tempData = Object.assign({}, this.temp)
            update(tempData).then(response => {
              this.listLoading = false

              this.$emit('updateList', response.product);

              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })

              this.$store.commit('productSaveVisible')
            }).catch(error => {
              this.$message.error(error)
            })

          }
        })
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
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
    width: 1000px;
    height: 400px;
    line-height: 400px;
    text-align: center;
  }

  .avatar {
    /*margin-top: 15px;*/
    width: 1000px;
    height: 400px;
    display: block;
  }
</style>
