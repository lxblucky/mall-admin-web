<template>
<!--    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
  <el-table
    :data="tableData"
    style="width: 100%"
    v-loading="listLoading" >

    <el-table-column
      label="id"
      prop="id">
    </el-table-column>
    <el-table-column
      label="zbname"
      prop="zbname">
    </el-table-column>
    <el-table-column
      label="createTime"
      prop="createTime">
    </el-table-column>
    <el-table-column
      label="parentId"
      prop="parentId">
    </el-table-column>


    <el-table-column align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {listtarget} from "../../../api/test_target";

  export default {
    data() {
      return {
        tableData: null,
        //   [{
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-04',
        //   name: '王小虎2',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }, {
        //   date: '2016-05-01',
        //   name: '王小虎3',
        //   address: '上海市普陀区金沙江路 1519 弄'
        // }, {
        //   date: '2016-05-03',
        //   name: '王小虎4',
        //   address: '上海市普陀区金沙江路 1516 弄'
        // }],
        search: ''
      }
    },
    // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。生命周期钩子函数，
    // mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    created() {
      this.getList();
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      // 列表查询函数
      getList(){
        this.listLoading=true;    //遮罩层
        listtarget().then(response => {
          this.listLoading = false;     //遮罩层
          this.tableData = response.data.list;
          console.log(response.data.list);
        });

      }
    },
  }
</script>
