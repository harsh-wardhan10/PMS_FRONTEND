import {
	Button,
	Card,
	Checkbox,
	Col,
	Form,
	Input,
	InputNumber,
	Popover,
	Row,
	Table,
	Tag,
	Typography,
} from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import ViewBtn from "../Buttons/ViewBtn";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { useDispatch, useSelector } from "react-redux";
import {
	addSingleLeavePolicy,
	loadAllLeavePolicy,
} from "../../redux/rtk/features/leavePolicy/leavePolicySlice";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

function CustomTable({ list, loading }) {
	const [columnsToShow, setColumnsToShow] = useState([]);

	const columns = [
		{
			id: 1,
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			id: 2,
			title: "Name",
			dataIndex: "name",
			key: "name",
		},

		{
			id: 3,
			title: "Total Causal Leave",
			dataIndex: "causalLeaves",
			key: "causalLeaves",
		},

		{
			id: 3,
			title: "Total Sick Leave",
			dataIndex: "sickLeaves",
			key: "sickLeaves",
		},
		{
			id: 4,
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id) => (
				<UserPrivateComponent permission={"readSingle-leavePolicy"}>
					<ViewBtn path={`/admin/leave-policy/${id}/`} />
				</UserPrivateComponent>
			),
		},
	];

	useEffect(() => {
		setColumnsToShow(columns);
	}, []);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<Card>
			<div className='text-center my-2 flex justify-between'>
				<h5 className='department-list-title text-color-2 text-xl mb-2'>
					Leave Policy List
				</h5>
				{list && (
					<div>
						<CsvLinkBtn>
							<CSVLink
								data={list}
								className='btn btn-dark btn-sm mb-1'
								filename='leave-policy'>
								Download CSV
							</CSVLink>
						</CsvLinkBtn>
					</div>
				)}
			</div>

			{list && (
				<div style={{ marginBottom: "30px" }}>
					<ColVisibilityDropdown
						options={columns}
						columns={columns}
						columnsToShowHandler={columnsToShowHandler}
					/>
				</div>
			)}

			<Table
				scroll={{ x: true }}
				loading={!list || loading}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</Card>
	);
}

const AddLeavePolicy = ({ drawer }) => {
	const { list, loading } = useSelector((state) => state.leavePolicy);
	const [loader, setLoader] = useState(false);
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAllLeavePolicy());
	}, []);

	const { Title } = Typography;
     const initialValues={
		sandwichPolicy:false,
		leaveclubPolicy:false
	 }
	 const content = (
		<div>
		Leaves taken on both Friday and Monday, creating a weekend sandwich,<br/> will result in all four days being marked as absentees
		</div>
	  );
	  const contenttwo = (
		<div>
		Any leave combined with a weekend or holiday will result in marking<br/> all days as absentee."
		</div>
	  );
	const onFinish = async (values) => {
		const FormData = {
			...values,
			sickLeaves: parseInt(values.sickLeaves),
			causalLeaves: parseInt(values.causalLeaves),
			monthlyHalfdays:parseInt(values.monthlyHalfdays),
			monthlyLatecomings:parseInt(values.monthlyLatecomings)
		};
	
		// setLoader(true);
		// console.log('FormData',FormData)
		const resp = await dispatch(addSingleLeavePolicy(FormData));

		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
			dispatch(loadAllLeavePolicy());
		} else {
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding department");
		setLoader(false);
	};
	return (
		<Fragment bordered={false}>
			<UserPrivateComponent permission={"create-leavePolicy"}>
				<Row className='mr-top' justify={drawer ? "center" : "space-between"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 12}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Add Leave Policy
						</Title>
						<Form
							style={{ marginBottom: "40px" }}
							form={form}
							eventKey='department-form'
							initialValues={initialValues}
							name='basic'
							labelCol={{
								span: 6,
							}}
							wrapperCol={{
								span: 12,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete='off'>
							<div>
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Name'
									name='name'
									labelCol={{ span: 10 }}  // Set the width of the label column
									wrapperCol={{ span: 8 }} 
									rules={[
										{
											required: true,
											message: "Please input your leave-policy name!",
										},
									]}>
									<Input placeholder='Policy 10-12' />
								</Form.Item>
								<div className="relative"> 
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Sick Leaves '
									name='sickLeaves'
									labelCol={{ span: 10 }}  // Set the width of the label column
									wrapperCol={{ span: 8 }} 
									rules={[
										{
											required: true,
											message: "Please input your paid leave!",
										},
									]}>
										<Input type="text" placeholder="days"  onChange={(e) => {
											// Remove non-numeric characters
											const numericValue = e.target.value.replace(/\D/, '');
											form.setFieldsValue({ sickLeaves: numericValue });
										}}
										/>
								</Form.Item>
								<p className="absolute top-[10px] right-[117px]"> Days</p>
                                 </div>
								 <div className="relative"> 
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Causal Leaves '
									name='causalLeaves'
									labelCol={{ span: 10 }}  // Set the width of the label column
									wrapperCol={{ span: 8 }} 
									rules={[
										{
											required: true,
											message: "Please input your unpaid Leave !",
										},
									]}>
							      	<Input type="text" placeholder="days"  onChange={(e) => {
											// Remove non-numeric characters
											const numericValue = e.target.value.replace(/\D/, '');
											form.setFieldsValue({ causalLeaves: numericValue });
										}}
										/>
								</Form.Item>
								<p className="absolute top-[10px] right-[117px]"> Days</p>
								</div>
								<div className="relative"> 
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Allowed Monthly Halfdays'
									name='monthlyHalfdays'
									labelCol={{ span: 10 }}  // Set the width of the label column
									wrapperCol={{ span: 8 }} 
									rules={[
										{
											required: true,
											message: "Please input Monthly Halfdays!",
										},
									]} 
									>
										<Input type="text" placeholder="days"  onChange={(e) => {
											// Remove non-numeric characters
											const numericValue = e.target.value.replace(/\D/, '');
											form.setFieldsValue({ monthlyHalfdays: numericValue });
										}}
										/>
								</Form.Item>
								<p className="absolute top-[10px] right-[117px]"> Days</p>
								</div>
								<div className="relative"> 
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Allowed Monthly Late Comings:'
									name='monthlyLatecomings'
									labelCol={{ span: 10 }}  // Set the width of the label column
									wrapperCol={{ span: 8 }} 
									rules={[
										{
											required: true,
											message: "Please input Monthly LateComings!",
										},
									]} 
									>
										<Input type="text" placeholder="days"  onChange={(e) => {
											// Remove non-numeric characters
											const numericValue = e.target.value.replace(/\D/, '');
											form.setFieldsValue({ monthlyLatecomings: numericValue });
										}}
										/>
								</Form.Item>
								<p className="absolute top-[10px] right-[117px]"> Days</p>
								</div>
								<div className="checkbox_form_item relative"> 
										<div className="absolute left-[70px] z-[999]"> 
												    <Popover content={content}>
														<div ><i class="bi bi-info-circle text-black-500 text-[20px]" ></i></div>
													</Popover>
										</div>
									<Form.Item
										style={{ marginBottom: "20px" ,marginLeft:'45px'}}
										label=''
										name='sandwichPolicy'
										labelCol={{ span: 0 }}  // Set the width of the label column
										wrapperCol={{ span: 12 }} 
										rules={[
											{
												required: false,
												message: "Please check Sandwich Policy",
											},
										]} 
										>
											Sandwich Leave Policy
										 <Checkbox className="margin-auto ml-[15px]" onChange={(e)=>{
											form.setFieldsValue({ sandwichPolicy: e.target.checked });
										}}>
											
										</Checkbox>
									</Form.Item>
								</div>
								<div className="checkbox_form_item relative"> 
								   <div className="absolute left-[70px] z-[999]"> 
												<Popover content={contenttwo}>
														<div ><i class="bi bi-info-circle text-black-500 text-[20px]" ></i></div>
													</Popover>
										</div>
									<Form.Item
										style={{ marginBottom: "20px", marginLeft:'45px' }}
										label=''
										name='leaveclubPolicy'
										labelCol={{ span: 0 }}  // Set the width of the label column
										wrapperCol={{ span: 12 }} 
										rules={[
											{
												required: false,
												message: "Please check Club Policy",
											},
										]} 
										>
											Leave Clubbing Policy
										<Checkbox className="margin-auto ml-[15px]" onChange={(e)=>{
											form.setFieldsValue({ leaveclubPolicy: e.target.checked });
										}}>
									    	
										</Checkbox>
									</Form.Item>
								</div>
								<div> 
								<Form.Item
										style={{ marginBottom: "20px", marginLeft:'45px' }}
										labelCol={{ span: 0 }}  // Set the width of the label column
										wrapperCol={{ span: 12 }} 
										>
								  <Tag color="rgba(0,0,0,0.1)"><p className="text-[13px] text-black"> Note: The User leave Policy is from 1 January to 31 December for each year. </p></Tag>
								  </Form.Item>
								</div>
								<Form.Item
									style={{ marginBottom: "10px" }}
									wrapperCol={{
										offset: 6,
										span: 12,
									}}>
									<Button
										onClick={() => setLoader(true)}
										type='primary'
										size='large'
										htmlType='submit'
										block
										loading={loader}>
										Add New Policy
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
			<hr />
			<UserPrivateComponent permission={"readAll-leavePolicy"}>
				{drawer || <CustomTable list={list} loading={loading} />}
			</UserPrivateComponent>
		</Fragment>
	);
};

export default AddLeavePolicy;
