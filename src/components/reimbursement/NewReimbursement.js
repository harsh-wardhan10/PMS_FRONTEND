import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Typography } from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
	loadAllShift,
	loadSingleShift,
} from "../../redux/rtk/features/shift/shiftSlice";
import getUserFromToken from "../../utils/getUserFromToken";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import { addReimbursement } from "../../redux/rtk/features/reimbursement/reimbursement";

const NewReimbursement = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	
	const users = useSelector((state) => state.users?.list);


	//get id from JWT token in localstorage and decode it
	const { TextArea } = Input;
	const id = getUserFromToken();
	const dispatch = useDispatch();

	const { Title } = Typography;
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		
		const reimbursementData = {
			...values,
            date:dayjs(values.date),
			userId: values.userId,
		};
    //   console.log('reimbursementData',reimbursementData,'values',values)
		setLoader(true);
		const resp = await dispatch(addReimbursement(reimbursementData));
		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
		} else {
			setLoader(false);
		}
	};
    useEffect(() => {
		dispatch(loadAllShift());
		dispatch(loadAllStaff({ status: true }));
	}, []);
	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding shift");
		setLoader(false);
	};
	return (
		<Fragment bordered={false}>
			<UserPrivateComponent permission={"create-reimbursement"}>
				<Row className='mr-top' justify={drawer ? "center" : "center"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 16}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Application for Reimbursement
						</Title>
						{/* {console.log('users',users,'leavePolicy',leavePolicy)} */}
						<Form
							form={form}
							style={{ marginBottom: "40px" }}
							eventKey='shift-form'
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
									label='Select User'
									name='userId'
									rules={[
										{
											required: true,
											message: "Please Select User!",
										},
									]}>
									<Select
										mode='single'
										placeholder='Select User'
										optionFilterProp='children'>
											{users.map((item)=>{
										    return <Select.Option value={item.id}>{item.firstName} {item.lastName} - {item.employeeId  }</Select.Option>
											})}
									</Select>
								</Form.Item>
                                <Form.Item
									style={{ marginBottom: "10px" }}
									label='Amount '
									name='amount'
									
									rules={[
										{
											required: true,
											message: "Please input amount",
										},
									]}>
									<InputNumber  placeholder="amount" style={{ width: "100%" }} />
								</Form.Item>
                                <Form.Item
									label='Date'
									name='date'
									style={{ marginBottom: "10px" }}
									rules={[
										{
											required: true,
											message: "Please input date!",
										},
									]}>
									<DatePicker  className='date-picker hr-staffs-date-picker' />
								</Form.Item>
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Comment'
									name='reason'
									rules={[
										{
											required: true,
											message: "Please input your shift!",
										},
									]}>
										    <TextArea
												placeholder="Reimbursement Reason"
												autoSize={{
												minRows: 3,
												maxRows: 5,
												}}
											/>
									</Form.Item>
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
										Send for Approval
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default NewReimbursement;
