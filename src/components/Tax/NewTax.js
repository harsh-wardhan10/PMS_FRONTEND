import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Tag, Typography } from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
	loadAllShift,
} from "../../redux/rtk/features/shift/shiftSlice";
import getUserFromToken from "../../utils/getUserFromToken";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import { addDeductions } from "../../redux/rtk/features/deductions/deductionSlice";
import { uploadDeductionFile } from "../../redux/rtk/features/uploadDeductionFiles/uploadDeductionFiles";
import { addTax } from "../../redux/rtk/features/tax/taxSlice";

const NewTax = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	
	const users = useSelector((state) => state.users?.list);

	//get id from JWT token in localstorage and decode it
	const { TextArea } = Input;
	const id = getUserFromToken();
	const dispatch = useDispatch();
	const { Title } = Typography;
	const [form] = Form.useForm();


	const onFinish = async (values) => {

		setLoader(true);
		const resp = await dispatch(addTax(values));
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
			<UserPrivateComponent permission={"create-deductions"}>
				<Row className='mr-top' justify={drawer ? "center" : "center"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 16}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Application for Tax
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
									label='Tax Name'
									name='taxName'
									
									rules={[
										{
											required: true,
											message: "Please input tax name",
										},
									]}>
									<Input  placeholder="Tax Name" style={{ width: "100%" }} />
								</Form.Item>
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Comment'
									name='comment'
									rules={[
										{
											required: true,
											message: "Please input comment",
										},
									]}>
										    <TextArea
												placeholder="Tax Comments"
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
										Add Tax
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

export default NewTax;
