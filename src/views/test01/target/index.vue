<template>
<!--    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->

  <div style="padding: 20px">
    <el-card class="box-card">
      <i class="el-icon-search"></i>
      <span>搜索筛选</span>
      <div class="formclass">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="编码：">
            <el-input v-model="listQuery.id"></el-input>
          </el-form-item>
          <el-form-item label="指标名称：">
            <el-input v-model="listQuery.zbname"></el-input>
          </el-form-item>
          <el-form-item label="分组（父节点）：">
            <el-select v-model="listQuery.parentId">
              <el-option v-for="item in parentIdval"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" style="float:right" @click="dialogFormVisible = true">添加</el-button>
    </el-card>
<!--    上传excel-->
<!--    action = "http://localhost:8201/mall-admin/test/target/upload"-->

    <el-upload
      class="upload-demo"
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :http-request="httpRequest"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>


    <div style="padding-top: 20px">
      <el-card class="box-card">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="listLoading" >

          <el-table-column
            label="id"
            prop="id">
          </el-table-column>
          <el-table-column
            label="指标名称"
            prop="zbname">
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
          </el-table-column>
          <el-table-column label="分组（父节点）" prop="parentId">
            <template slot-scope="scope">{{scope.row.parentId | formatStatus}}</template>
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
                @click="handleEdit(scope.$index, scope.row)">更改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    <!--    <el-pagination-->
    <!--      background-->
    <!--      layout="prev, pager, next"-->
    <!--      :total="1000">-->
    <!--    </el-pagination>-->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="total">
        </el-pagination>
      </el-card>
    </div>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="dialogAddForm">
        <el-form-item label="指标名称" :label-width="formLabelWidth">
          <el-input v-model="dialogAddForm.zbname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分组" :label-width="formLabelWidth">
          <el-select v-model="dialogAddForm.parentId" placeholder="请选择分组">
            <el-option label="分组一" value="1"></el-option>
            <el-option label="分组二" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTargetfun()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import {listTarget,addTarget,detailTarget,updateTarget,upload} from "../../../api/test_target";
  import {formatDate} from '@/utils/date';
  //分页参数
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,

    id: null,
    zbname: null,
    createTime: null,
    parentId: null,
  };
  //添加参数
  const defaultDialogAddForm = {
    zbname: null,
    parentId: null,
  };
  export default {
    data() {

      return {
        listLoading: true,
        tableData: null,
        listQuery: Object.assign({}, defaultListQuery),
        total: null,
        fileList: [],//上传组件
        parentIdval : [
          {
            label : "--全选--",
            value : ''
          },
          {
            label : "分组一",
            value : 1
          },
          {
            label : "分组二",
            value : 2
          }
        ],
        // 对话框：添加
        dialogFormVisible: false,
        dialogAddForm: Object.assign({}, defaultDialogAddForm),
        formLabelWidth: '120px',
        // 对话框：添加
        operateReasonId:null,
        cbflag:null, //编辑还是新增的状态
        search: ''
      }
    },
    // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。生命周期钩子函数，
    // mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    created() {
      this.getList();
    },
    filters:{
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(val){
        if(val == '1'){
          return "分组一"
        }else if(val == '2'){
          return "分组二"
        }
      }
    },
    methods: {
      onSubmit(){
        this.listQuery.pageNum = 1;
        this.getList();
      },
      //更改
      handleEdit(index, row) {
        this.dialogFormVisible = true
        this.operateReasonId = null;
        this.cbflag = row.id; //编辑还是新增的状态

        detailTarget(row.id).then(response=>{
          console.log(response.data);
          this.dialogAddForm=response.data;
        });
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      // pageSize(每页条数) 改变时会触发
      handleSizeChange(val){
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      // currentPage(当前页) 改变时会触发
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        console.log("val:"+val)
        this.getList();
      },
      // 列表查询函数
      getList(){
        this.listLoading=true;    //遮罩层

        console.log(this.listQuery.id);
        console.log(this.listQuery.parentId);

        listTarget(this.listQuery).then(response => {
          this.tableData = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;     //遮罩层

        });
      },
      addTargetfun(){
        console.log(this.cbflag);
        //新增
        if(this.cbflag == null){
          addTarget(this.dialogAddForm).then(response =>{
            this.dialogFormVisible=false;
            this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            });
            this.getList();   //刷新列表
          }).catch(function (error) {
              this.$notify.error({
                title: '错误',
                message: '添加失败，请联系管理员！'
              });
            });
        }else{
          //更改
          updateTarget(this.cbflag,this.dialogAddForm).then(response =>{
            this.dialogFormVisible=false;
            this.cbflag = null; //编辑还是新增的状态
            this.$notify({
              title: '成功',
              message: '更改成功！',
              type: 'success'
            })
            this.getList();   //刷新列表
          }).catch(function (error) {
            this.$notify.error({
              title: '错误',
              message: '添加失败，请联系管理员！'
            });
          });
        }
      },
      //上传下载excel
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      //覆盖默认的上传行为，可以自定义上传的实现
      httpRequest(param) {
        console.log("--进入httpRequest");
        console.log(param);
        let fd = new FormData(); // FormData 对象
        let fileObj = param.file; // 相当于input里取得的files
        fd.append("file", fileObj); // 文件对象

        upload(fd).then(response =>{

        }).catch(function (error) {

        });
      }
      //上传下载excel

    },
  }
</script>
<style>
  .formclass{
    margin-top: 20px;
  }
</style>

