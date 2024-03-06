import { Button, DatePicker, Drawer, Form, Input, InputNumber, Radio, Select, Tag } from "antd";

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
import { loadSingelReimbursementApplication, reviewReimbursementApplication } from "../../../redux/rtk/features/reimbursement/reimbursement";

const ReviewReimbursementPopup = () => {
	const { id } = useParams("id");
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [loader, setLoader] = useState(false);
	const data = useSelector((state) => state.reimbursement.reimbursement);
	const userId = getUserFromToken();
	const [status, setStatus] = useState(null);
	const { TextArea } = Input;
	const [initialValues, setInitialValues] = useState({});
	const { Option } = Select;
    const currentDate = new Date();
    const [AcceptAmountRead,setAcceptAmountRead]=useState(false)
	useEffect(() => {
		setInitialValues({
			...data,
			userId: userId,
			status: status,
            approveAmount:data?.amount,
			acceptDate: moment(currentDate)
		});
        // console.log('data',data)
	}, [data]);

	const onFinish = async (values) => {
		const FormData = {
            ...values,        
        };
		console.log('FormData' , FormData )
		const resp = await dispatch(
			reviewReimbursementApplication({ id: id, values: FormData })
		);

		if (resp.payload.message === "success") {
			setOpen(false);
			dispatch(loadSingelReimbursementApplication(id));
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
				Review Reimbursement
			</Button>
			{data && (
				<Drawer
					width={720}
					title='Reimbursement Review'
					placement='right'
					onClose={onClose}
					open={open}>
					<h2 className='text-2xl font-semibold mb-4 text-center mt-5'>
						Approve Reimbursement
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
						>
						<p>{data?.applyDate ?dayjs(data?.applyDate).format("DD-MM-YYYY"):'' }</p>
					</Form.Item>
                        <Form.Item
						style={{ marginBottom: "10px" }}
						label='Select Accept Date'
						name='acceptDate'
						valuePropName='acceptDate'>
						<DatePicker
							className='date-picker hr-staffs-date-picker'
                            defaultValue={moment(currentDate)}
                            format="DD-MM-YYYY"
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
									]}
                                    className="INputNUmber_class">
									<InputNumber readOnly={AcceptAmountRead}  placeholder="amount" style={{ width: "100%" , backgroundColor: `${AcceptAmountRead ? 'lightgrey':''}`}}/>
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
									onChange={(e) => {
                                        setStatus(e.target.value)
                                        if(e.target.value==='REJECTED'){
                                            form.setFieldsValue({ approveAmount: 0 });
                                            setAcceptAmountRead(true)
                                        }
                                        else{
                                            form.setFieldsValue({ approveAmount: data.amount }); 
                                            setAcceptAmountRead(false)
                                        }
                                        }}>
									<Radio.Button value='ACCEPTED'>Approved</Radio.Button>
									<Radio.Button value='REJECTED'>Not Approved</Radio.Button>
								</Radio.Group>
							</Form.Item>
                            {/* <Form.Item
									style={{ marginBottom: "10px",marginLeft:'70px' }}
									>
                                            <Tag color="rgba(0,0,0,0.1)"><p className="text-[13px] text-black "> Note: The reimbursement will be credit in the salary for the month in <br/> which the reimbursement is accepted.</p></Tag>
                                     </Form.Item> */}
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
									Review Reimbursement
								</Button>
							</Form.Item>
						</div>
					</Form>
				</Drawer>
			)}
		</>
	);
};
export default ReviewReimbursementPopup;
