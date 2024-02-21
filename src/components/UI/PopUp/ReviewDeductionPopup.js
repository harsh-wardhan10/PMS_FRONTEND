import { Button, DatePicker, Drawer, Form, Input, InputNumber, Radio, Select } from "antd";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
	loadSingelLeaveApplication,
	reviewLeaveApplication,
} from "../../../redux/rtk/features/leave/leaveSlice";
import getUserFromToken from "../../../utils/getUserFromToken";
import moment from "moment";
import { loadSingelDeductionsApplication, reviewDeductionsApplication } from "../../../redux/rtk/features/deductions/deductionSlice";

const ReviewDeductionPopup = () => {
	const { id } = useParams("id");
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [loader, setLoader] = useState(false);
	const data = useSelector((state) => state.deductions.deduction);
	const userId = getUserFromToken();
	const [status, setStatus] = useState(null);
	const { TextArea } = Input;
	const [initialValues, setInitialValues] = useState({});
	const { Option } = Select;
	useEffect(() => {
		setInitialValues({
			...data,
			userId: userId,
			status: status,
			date: data?.date ? moment(data?.date) : null,
		});
        // console.log('data',data)
	}, [data]);

	const onFinish = async (values) => {
		const FormData = {
			...values,
            date:values.date
		};
		// console.log('FormData',FormData)
		const resp = await dispatch(
			reviewDeductionsApplication({ id: id, values: FormData })
		);

		if (resp.payload.message === "success") {
			setOpen(false);
			dispatch(loadSingelDeductionsApplication(id));
			setLoader(false);
			setStatus(null);
		} else {
			setLoader(false);
		}
	};
	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding department");
		setLoader(false);
	};
	const [open, setOpen] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
		setStatus(null);
	};

	return (
		<>
			<Button onClick={showDrawer} className='mt-4' type='primary'>
				Review Deduction
			</Button>
			{data && (
				<Drawer
					width={720}
					title='Deduction Review'
					placement='right'
					onClose={onClose}
					open={open}>
					<h2 className='text-2xl font-semibold mb-4 text-center mt-5'>
						Approve Deduction
					</h2>
					<Form
						className='list-inside list-none border-2 border-inherit rounded px-5 py-5 m-5 mt-10'
						form={form}
						style={{ marginBottom: "40px" }}
						name='basic'
						initialValues={initialValues}
						labelCol={{
							span: 7,
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
						label='Apply Date'
                        name='date'
						valuePropName='date'
						>
						<p>{data?.date ?dayjs(data?.date).format("DD-MM-YYYY"):'' }</p>
					</Form.Item>
                        <Form.Item
						style={{ marginBottom: "10px" }}
						label='Select Accept Date'
						name='date'
						valuePropName='date'>
						<DatePicker
							className='date-picker hr-staffs-date-picker'
                            defaultValue={initialValues.date}
						/>
					</Form.Item>
                             
                            <Form.Item
								style={{ marginBottom: "10px" }}
								label='Reason'>
                                  {data?.reason}
							</Form.Item>
                            <Form.Item
								style={{ marginBottom: "10px" }}
								label='Amount'>
                                 {data?.amount}
							</Form.Item>


                            {/* <Form.Item
								style={{ marginBottom: "10px" }}
								label='Approval Name'
								name='approveName'>
								       <Input placeholder="Approval Name"/>
							</Form.Item> */}
							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Comment'
								name='approveComment'>
								       <TextArea
												placeholder="Approve Comment"
												autoSize={{
												minRows: 3,
												maxRows: 5,
												}}
									/>
							</Form.Item>
                            <Form.Item
									style={{ marginBottom: "10px" }}
									label='Approve Amount '
									name='approveAmount'
									
									rules={[
										{
											required: true,
											message: "Please input amount",
										},
									]}>
									<InputNumber  placeholder="amount" style={{ width: "100%" }} />
								</Form.Item>

							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Select Status'
								name='status'
								rules={[
									{
										required: true,
										message: "Please input Status!",
									},
								]}>
								<Radio.Group
									buttonStyle='solid'
									onChange={(e) => setStatus(e.target.value)}>
									<Radio.Button value='ACCEPTED'>Approved</Radio.Button>
									<Radio.Button value='REJECTED'>Not Approved</Radio.Button>
								</Radio.Group>
							</Form.Item>
							<Form.Item
								style={{ marginBottom: "10px" }}
								wrapperCol={{
									offset: 7,
									span: 12,
								}}>
								<Button
									onClick={() => setLoader(true)}
									type='primary'
									size='middle'
									htmlType='submit'
									block
									disabled={status === null}
									loading={loader}>
									Review Deduction
								</Button>
							</Form.Item>
						</div>
					</Form>
				</Drawer>
			)}
		</>
	);
};
export default ReviewDeductionPopup;
