<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="用户名" min-width="100">
      <template v-slot="{row}">
        <span>{{ row.nickName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="商品" min-width="200">
      <template v-slot="{row}">
        <span>{{ row.productName + ' - ' + row.itemName}} </span>
      </template>
    </el-table-column>
    <el-table-column label="付款金额" width="100" align="center">
      <template v-slot="{row}">
        <span>¥ {{ row.payPrice}} </span>
      </template>
    </el-table-column>
<!--    <el-table-column label="订单状态" width="100" align="center">-->
<!--      <template slot-scope="{row}">-->
<!--        <el-tag>-->
<!--          {{ row.status | statusName}}-->
<!--        </el-tag>-->
<!--      </template>-->
<!--    </el-table-column>-->
  </el-table>
</template>

<script>
  import {listAll} from '@/api/orders'
  import {get} from "@/api/user";

  export default {
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
      }
    },
    props: {
      type: Number
    },
    data() {
      return {
        list: null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        await listAll({
          'type': this.type
        }).then(response => {
          this.list = response.list.map(orders => {
            orders.nickName = ''
            get(orders.userId)
                .then(response => {
                  orders.nickName = response.user.nickName
                })
            return orders
          })
        })
      }
    }
  }
</script>
