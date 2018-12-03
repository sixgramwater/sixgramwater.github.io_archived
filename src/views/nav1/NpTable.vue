<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getNps">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="nps" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>

			<el-table-column prop="name" label="提交人" width="120" sortable>
			</el-table-column>
			<el-table-column prop="depart" label="部门" width="120" :formatter="formatDepart" sortable>
			</el-table-column>
			<el-table-column prop="stime" label="提交时间" width="120" sortable>
			</el-table-column>
            <el-table-column prop="etime" label="到货时间" width="120" sortable>
			</el-table-column>
            <el-table-column prop="status" label="状态" width="120" sortable>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 1" type="warning">未处理</el-tag>
                    <el-tag v-else>状态{{ scope.row.status }}</el-tag>
                </template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
                    <el-button v-if="scope.row.status == 1" size="small" type="primary" @click="handleGoods(scope.$index, scope.row)">处理</el-button>
                    <el-button v-if="scope.row.status != 1" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- 批量删除 -->
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			 <!-- 分页 -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

        <!-- 缺货处理页面 -->
        <el-dialog title="缺货处理" v-model="handleGoodsFormVisiable">
            <el-table :data="this.unenoughGoods" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
			    </el-table-column>
                <el-table-column prop="goodsId" label="商品ID"></el-table-column>
                <el-table-column prop="goodsId" label="商品名称" :formatter="formatGoodsName"></el-table-column>
                <el-table-column prop="goodsNum" label="缺少数量"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.planned" type="success">已计划</el-tag>
                        <el-tag v-show="!scope.row.planned"> 未计划</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        
                        <el-button :disabled="scope.row.planned" size="small" type="primary" @click="handlePlan(scope.$index, scope.row)">添加计划</el-button>
                    </template>
                </el-table-column>
            </el-table> 

            
            <div slot="footer" class="dialog-footer">
				<el-button @click.native="handleGoodsFormVisiable = false">取消</el-button>
				<el-button type="primary" @click="handleGoodsSubmit" :loading="handleGoodsLoading">提交</el-button>
			</div>
        </el-dialog>
        
        <!-- 详情页面 -->
        <el-dialog title="详情" v-model="detailFormVisiable">
            <el-table :data="this.detail" highlight-current-row v-loading="listLoading" style="width: 100%;">
			    <el-table-column type="index" width="60">
			    </el-table-column>
                <el-table-column prop="goodsId" label="商品ID"></el-table-column>
                <el-table-column prop="goodsId" label="商品名称" :formatter="formatGoodsName"></el-table-column>
                <el-table-column prop="goodsNum" label="商品数量"></el-table-column>
            </el-table>
        </el-dialog>


		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getNpListPage, getUnenoughGoods, removeNp, batchRemoveNp } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
                nps: [],
                unenoughGoods: [],
                detail: {

                },
				total: 0,
				page: 1,
				listLoading: false,
                sels: [],//列表选中列
                handleGoodsFormVisiable: false,
                handleGoodsLoading: false,
                detailFormVisiable: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
            // 商品名称转换
            formatGoodsName: function(row, column) {
              let goodsNames = ['苹果','香蕉','钢笔','电脑','自行车','飞机','大炮','火箭','飞船',''];
              return goodsNames[row.goodsId];
            },

            //性别显示转换
            formatDepart: function(row, column) {
                let departNames = ['其他部门','营业部', '人事部','财务部' ,'销售部', '广告部','企划部' ,'研发部'];
                return departNames[row.depart];
            },
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getNps();
			},
			//获取用户列表
			getNps() {
				let para = {
					page: this.page,
					// name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getNpListPage(para).then((res) => {
					this.total = res.data.total;
					this.nps = res.data.nps;
					this.listLoading = false;
					//NProgress.done();
				});
            },
            handleGoods: function(index, row) {
                this.handleGoodsFormVisiable = true;
                let para = row.detail;
                
                // console.log(para);
                // getUnenoughGoods(para).then((res) => {
                //     this.unenoughGoods = res.data.unenoughGoods;
                // })
                this.unenoughGoods = row.detail;

                this.unenoughGoods.forEach(element => {
                    // 向对象中添加一个属性planned
                    // 添加方式应该是响应式的
                    this.$set(this.unenoughGoods, "planned", false);
                    //element.planned = false;
                    //console.log(element);
                });
                // console.log(this.unenoughGoods);
            },
            // 提交
            handleGoodsSubmit: function() {
                if(this.unenoughGoods.some(elem => {
                    // console.log(elem);
                    return ( !elem.hasOwnProperty('planned') || !elem.planned );
                })){
                    this.$message({
                        message: '无法提交！尚有未计划的物品',
                        type: 'warning'
                    });
                    // this.$message("尚有未计划的物品！");
                }
                else{
                    this.$confirm('确认提交, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    // 关闭视图
                    this.handleGoodsFormVisiable = false;
                    // 处理完成，改变状态
                    // 1. 改变status


                    this.$message({
                        type: 'success',
                        message: '提交成功!'
                    });
                    
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                    });
                }
            },
            handlePlan: function(index, row){
                // 响应式
                this.$set(row, "planned", true);
                this.$message({
                    message: '添加至计划成功',
                    type: 'success'
                });
                // this.$message('添加至计划成功');
                //this.$forceUpdate();
            },
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeNp(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getNps();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
            },

            // 显示详情页面
            handleDetail: function (index, row) {
                console.log(row.detail)
                this.detailFormVisiable = true;
                this.detail = row.detail;
            },
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
                    let para = { ids: ids };
                    console.log(para);
					batchRemoveNp(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getNps();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getNps();
		}
	}

</script>

<style scoped>

</style>