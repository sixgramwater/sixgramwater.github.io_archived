<template>
	<el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" :rules="rules" style="margin:20px;width:40%;min-width:600px;">
		<el-form-item label="姓名" prop="pname">
			<el-input v-model="form.pname" placeholder="请输入您的姓名"></el-input>
		</el-form-item>
		<el-form-item label="所在部门" prop='depart'>
			<el-select v-model="form.depart" placeholder="请选择您所在的部门">
				<el-option label="营业部" value="1"></el-option>
				<el-option label="广告部" value="2"></el-option>
				<el-option label="企划部" value="3"></el-option>
				<el-option label="财务部" value="4"></el-option>
				<el-option label="技术部" value="5"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="到货时间" prop='etime'>
			<el-col :span="11">
				<el-date-picker type="date" placeholder="选择日期" v-model="form.etime" style="width: 100%;"></el-date-picker>
			</el-col>
			<!-- <el-col class="line" :span="2">-</el-col>
			<el-col :span="11">
				<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
			</el-col> -->
		</el-form-item>
		<!-- 选择商品按钮 -->
		<el-form-item label="选择商品">
			<el-button @click="handleChoose">点击选择</el-button>
		</el-form-item>
		<!-- 选择商品页面 -->
		<el-dialog title="商品选择" v-model="chooseGoodsVisiable">
			<el-tabs >
				<el-tab-pane v-for="(items, index) in this.goodsList" :key="index" :label="items.cat">
					<!-- 卡片渲染 -->
					<el-row>
						<el-col :span="8" v-for="(goodsItem, index) in items.content" :key="goodsItem.goodsId" :offset="index > 0 ? 2 : 0">
							<el-card :body-style="{ padding: '0px' }">
								<img src="../../assets/apple2.jpeg" class="image" width="100%">
								<div style="padding: 14px;">
									<span>{{ goodsItem.goodsName }}</span>
									<div class="bottom clearfix">
										<time class="time"> 2018-11-11 </time>
										<el-button type="primary" class="button" @click="handleAddGoods(goodsItem)">添加</el-button>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-tab-pane>
  			</el-tabs>
			<!-- <el-button @click="this.chooseGoodsVisiable = false">关闭</el-button> -->
		</el-dialog>
		<!-- 已选商品列表 -->
		<el-form-item label="已选商品">
			<el-table :data="this.form.goods" highlight-current-row style="width: 100%;">
			    <el-table-column type="index" width="60">
			    </el-table-column>
                <el-table-column prop="goodsId" label="商品ID"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                <el-table-column prop="goodsNum" label="商品数量" width="150">
					<template slot-scope="scope">
						<el-input-number v-model="scope.row.goodsNum" size="small" :min="1" :max="100" label="描述文字"></el-input-number>
					</template>
					
				</el-table-column>

				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
            </el-table>
		</el-form-item>
		<!-- <el-form-item label="即时配送">
			<el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>
		</el-form-item>
		<el-form-item label="活动性质">
			<el-checkbox-group v-model="form.type">
				<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
				<el-checkbox label="地推活动" name="type"></el-checkbox>
				<el-checkbox label="线下主题活动" name="type"></el-checkbox>
				<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="特殊资源">
			<el-radio-group v-model="form.resource">
				<el-radio label="线上品牌商赞助"></el-radio>
				<el-radio label="线下场地免费"></el-radio>
			</el-radio-group>
		</el-form-item> -->
		<el-form-item label="备注信息" >
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit('form')" :loading="submitLoading">立即提交</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import util from '../../common/js/util'
	import { addNp } from '../../api/api';

	export default {
		data() {
			return {
				goodsList:[
					{
						cat: '食品',
						content: [
							{
								goodsId: 1,
								goodsName: '苹果',
							},
							{
								goodsId: 2,
								goodsName: '面包',
							}
						]
							
					},
					{
						cat: '文具',
						content: [
							{
								goodsId: 3,
								goodsName: '铅笔',
							},
							{
								goodsId: 4,
								goodsName: '钢笔',
							}
						]
							
					},
				],
				goods:[],

				chooseGoodsVisiable: false,
				submitLoading: false,
				form: {
					depart: '',
					pname: '',
					// pid: '',
					// name: '',
					
					// departId: '',
					// region: '',
					stime: '',
					etime: '',
					// date2: '',
					// type: [],
					// resource: '',
					goods: [],
					desc: '',
					

				},
				rules: {
					pname: [{required: true, message: "请输入您的姓名", trigger: "blur"}],
					depart: [{required: true, message: '请选择您的部门', trigger: 'change'}],
					etime: [{type: 'date', required: true, message: '请选择日期', trigger: 'change'}],
					
				},
			}
		},
		methods: {
			onSubmit(formname) {
				this.$refs[formname].validate((valid) => {
					if (valid) {
						this.form.stime = new Date()
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.submitLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.form);
							para.etime = (!para.etime || para.etime == '') ? '' : util.formatDate.format(new Date(para.etime), 'yyyy-MM-dd');
							para.stime = (!para.stime || para.stime == '') ? '' : util.formatDate.format(new Date(para.stime), 'yyyy-MM-dd');
							console.log(para);
							addNp(para).then((res) => {
								this.submitLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs[formname].resetFields();
								// this.addFormVisiƒble = false;
								// this.getUsers();
							});
						});

						// alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				console.log('submit!');
			},
			handleChoose(){
				// this.$set(this, "chooseGoodsVisiable", true);
				this.chooseGoodsVisiable = true;
			},
			handleAddGoods(goodsItem) {
				// 如果
				this.form.goods.forEach(elem => {
					if( elem.goodsId == goodsItem.goodsId ){
						// console.log(this.goods);
						// let num = elem.goodsNum+1;
						// this.$set(elem, "goodsNum", num);
						// console.log(elem.goodsNum);
						// console.log(this.goods);
						// return;
					}
					
				});
				// let item = Object.assign({}, goodsItem);
				this.$set(goodsItem, "goodsNum", 1);
				// goodsItem.goodsNum = 1;
				this.form.goods.push(goodsItem);
				this.$message({
					message: '成功添加物品！',
					type: 'success'
                });
			},
			handleDel(index, row){
				this.form.goods.splice(index, 1);
				this.$message({
					message: '已删除商品！',
					type: 'warning'
                });
			}
		}
	}

</script>