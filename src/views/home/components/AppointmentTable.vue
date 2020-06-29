<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="用户名" min-width="200">
      <template v-slot="{row}">
        <span>{{ row.nickName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="课程名称" min-width="200">
      <template v-slot="{row}">
        <span>{{ row.product}} </span>
      </template>
    </el-table-column>
    <el-table-column label="上课时间" width="195" align="center">
      <template v-slot="{row}">
        <span> {{ row.time}} </span>
      </template>
    </el-table-column>
    <el-table-column label="预约手机号" width="195" align="center">
      <template v-slot="{row}">
        <span> {{ row.phone}} </span>
      </template>
    </el-table-column>
    <el-table-column label="备注" width="195" align="center">
      <template v-slot="{row}">
        <span> {{ row.remarks}} </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {listAll} from '@/api/appointment'
  import {get} from "@/api/user";

  export default {
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
        await listAll().then(response => {
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

<style scoped>

</style>
