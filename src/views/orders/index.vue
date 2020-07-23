<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="购买用户" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.productName" placeholder="商品名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.itemName" placeholder="商品规格" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;"
              border fit highlight-current-row>
      <el-table-column label="序号" type="index" align="center" width="80">
        <template slot-scope="{$index}">
          <span>{{(listQuery.page - 1) * listQuery.limit + $index + 1}}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买用户" prop="userId" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="productName" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品规格" prop="itemName" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买数量" prop="count" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" prop="payPrice" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.payPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.status | statusName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单备注" prop="remark" align="center">
        <template v-slot="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单生成时间" prop="createAt" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.createAt }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {list} from '@/api/orders'
  import {get} from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: "orders",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          userName: null,
          productName: null,
          itemName: null,
          page: 1,
          limit: 30
        }
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
      async getList() {
        this.listLoading = true
        await list(this.listQuery).then(response => {
          this.total = response.page.totalCount
          this.list = response.page.list.map(orders => {
            orders.nickName = ''
            get(orders.userId)
              .then(response => {
                orders.nickName = response.user.nickName
              })
            return orders
          })
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    },
    filters: {
      statusName(status) {
        let name
        switch (status) {
          case 0 :
            name = '待付款'
            break
          case 1 :
            name = '报名成功'
            break
          case 2 :
            name = '进行中'
            break
          case 3 :
            name = '已完成'
            break
          case -1 :
            name = '交易取消'
            break
          default:
            name = ''
            break
        }
        return name
      },
    }
  }
</script>

<style scoped>

</style>
