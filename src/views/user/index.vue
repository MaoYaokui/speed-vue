<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickName" placeholder="用户昵称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.type" placeholder="身份" clearable style="width: 100px" class="filter-item">
        <el-option v-for="type in typeOptions" :key="type" :label="type | typeName" :value="type"/>
      </el-select>
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
      <el-table-column label="用户头像" prop="userAvatar" align="center" width="200">
        <template v-slot="{row}">
          <el-avatar :size="size" :src="row.userAvatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" prop="nickName" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" align="center" width="100">
        <template v-slot="{row}">
          <span>{{ row.sex | sexName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" prop="region" align="center">
        <template v-slot="{row}">
          <span>{{ row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" prop="logInTime" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.logInTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createAt" align="center" width="200">
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
  import {list} from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'user',
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 30,
          identity: 1,
          nickName: undefined,
          type: undefined
        },
        typeOptions: [1, 2]
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
          console.log(this.list)
        })
        this.listLoading = false
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    },
    filters: {
      typeName(id) {
        let name
        switch (id) {
          case 0 :
            name = '管理员'
            break
          case 1 :
            name = '会员'
            break
          case 2 :
            name = '散客'
            break
          default:
            name = ''
            break
        }
        return name
      },
      sexName(id) {
        let name
        switch (id) {
          case '0' :
            name = '未知'
            break
          case '1' :
            name = '男'
            break
          case '2' :
            name = '女'
            break
          default:
            name = ''
            break
        }
        return name
      }
    }
  }
</script>

<style scoped>

</style>
