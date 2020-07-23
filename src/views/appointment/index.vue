<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.product" placeholder="课程名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" placeholder="课程名称" style="width: 200px;" class="filter-item"
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

      <el-table-column label="约课用户" prop="userId" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" prop="product" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上课时间" prop="time" align="center" width="150">
        <template v-slot="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约手机号" prop="phone" align="center" width="150">
        <template v-slot="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约课状态" prop="state" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.state | stateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余次数" prop="availableTimes" align="center" width="100">
        <template v-slot="{row}">
          <span>{{ row.availableTimes}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" prop="createAt" align="center" width="200">
        <template v-slot="{row}">
          <span>{{ row.createAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约课备注" prop="remarks" align="center">
        <template v-slot="{row}">
          <span>{{ row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.state === 0" type="primary" size="mini" @click="handleThrough(row)">
            通过
          </el-button>
          <el-button v-if="row.state === 0" type="primary" size="mini" @click="overrule(row)">
            驳回
          </el-button>
          <el-button v-if="row.state === 1" type="primary" size="mini" @click="writeOff(row)">
            核销
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog title="核销" :visible.sync="dialogFormVisible" width="450px">
      <div slot="footer" class="dialog-footer">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
                 style="width: 400px;">
          <el-form-item label="可核销次数" prop="times">
            <el-input v-model="temp.times"/>
          </el-form-item>
        </el-form>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="through()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {list, through, overrule, writeOff} from '@/api/appointment'
  import {get} from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination'

  export default {
    name: "appointment",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          product: null,
          phone: null,
          page: 1,
          limit: 30
        },
        //----- 弹窗 -----
        dialogFormVisible: false,
        rules: {
          times: [{required: true, message: '请输入可核销次数', trigger: 'blur'}]
        },
        temp: {
          id: undefined,
          times: ''
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
      },
      handleThrough(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      through() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // 修改用户 当前用户
            this.temp.updateCode = this.$store.getters.name
            const tempData = Object.assign({}, this.temp)
            through(tempData).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '审核通过',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      overrule(row) {
        // 修改用户 当前用户
        row.updateCode = this.$store.getters.name
        const tempData = Object.assign({}, row)
        overrule(tempData).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '审核驳回',
            type: 'success',
            duration: 2000
          })
        })
      },
      writeOff(row) {
        // 修改用户 当前用户
        row.updateCode = this.$store.getters.name
        const tempData = Object.assign({}, row)
        writeOff(tempData).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '审核驳回',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    filters: {
      stateName(state) {
        let name
        switch (state) {
          case 0 :
            name = '待审核'
            break
          case 1 :
            name = '进行中'
            break
          case 2 :
            name = '已完成'
            break
          case -1 :
            name = '已取消'
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
