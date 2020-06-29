<template>
  <div v-if="$store.state.status.productStatus">
    <Message @updateList="updateList" :productId="productId"></Message>
  </div>

  <div v-else class="app-container">
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
      <el-table-column label="商品名称" prop="name" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column class-name="status-col" label="商品售卖状态" width="110" align="center">-->
      <!--        <template v-slot="{row}">-->
      <!--          <el-tag :type="row.isShow | statusFilter">{{ row.isShow | isShowName }}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column class-name="status-col" label="商品推荐状态" width="110" align="center">
        <template v-slot="{row}">
          <el-tag :type="row.recommended | statusFilter">{{ row.recommended | recommendedName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="首页轮播" width="110" align="center">
        <template v-slot="{row}">
          <el-tag :type="row.carousel | statusFilter">{{ row.carousel | carouselName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <!--        <template slot-scope="{row}">-->
        <template slot-scope="scope">

          <el-button v-if="scope.row.sortNum === 0" type="success" size="mini" @click="topUpdate(scope.row,0)">
            置顶
          </el-button>
          <el-button v-else type="success" size="mini" @click="topUpdate(scope.row,1)">
            取消置顶
          </el-button>

          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleItemDelete(scope.row,scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {list, deleteRole, topUpdate} from '@/api/product'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Message from '@/views/product/message'

  export default {
    name: 'product',
    components: {
      Pagination,
      Message
    },
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
        // 修改的商品Id
        productId: 0
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
      this.$store.commit('productList')
    },
    methods: {
      getList() {
        this.listLoading = true
        list(this.listQuery).then(response => {
          this.list = response.page.list
          this.total = response.page.totalCount
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleCreate() {
        this.productId = 0
        this.$store.commit('productSaveVisible')
      },
      handleUpdate(row) {
        this.productId = row.id
        this.$store.commit('productSaveVisible')
      },
      updateList(product) {
        this.getList()
      },
      handleItemDelete(row, index) {
        this.$confirm('请确认是否删除该商品，删除后将无法恢复?', '删除商品', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          console.log('row', row)
          deleteRole({
            id: row.id
          }).then(response => {
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '商品删除成功!'
            })
          })
        }).catch(err => {
          console.error(err)
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
    },
    filters: {
      carouselName(status) {
        let name
        switch (status) {
          case '0' :
            name = '否'
            break
          case '1' :
            name = '是'
            break
          default:
            name = ''
            break
        }
        return name
      },
      recommendedName(status) {
        let name
        switch (status) {
          case '0' :
            name = '未推荐'
            break
          case '1' :
            name = '已推荐'
            break
          default:
            name = ''
            break
        }
        return name
      },
      isShowName(status) {
        let name
        switch (status) {
          case '0' :
            name = '在售'
            break
          case '1' :
            name = '下架'
            break
          default:
            name = ''
            break
        }
        return name
      },
      statusFilter(status) {
        const statusMap = {
          '0': 'danger',
          '1': 'success'
        }
        return statusMap[status]
      }
    }
  }
</script>

<style>

</style>
