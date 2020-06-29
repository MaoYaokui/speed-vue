<template>
  <div class="dashboard-editor-container">

    <panel-group/>

    <el-row :gutter="8" style="height: 700px;">
      <el-col :xs="{span: 16}" :sm="{span: 16}" :md="{span: 16}" :lg="{span: 8}" :xl="{span: 8}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table :type="0"/>
      </el-col>
      <el-col :xs="{span: 32}" :sm="{span: 32}" :md="{span: 32}" :lg="{span: 16}" :xl="{span: 16}" style="padding-right:8px;margin-bottom:30px;">
        <appointment-table :type="1"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import TransactionTable from './components/TransactionTable'
  import AppointmentTable from './components/AppointmentTable'

  export default {
    name: "Home",
    components: {
      PanelGroup,
      TransactionTable,
      AppointmentTable
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
