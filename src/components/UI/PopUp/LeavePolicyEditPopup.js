import { Button, Checkbox, Form, Input, Modal, Popover } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BtnEditSvg from "../Button/btnEditSvg";
import { useDispatch } from "react-redux";
import {
	loadAllLeavePolicy,
	loadSingleLeavePolicy,
	updateLeavePolicy,
} from "../../../redux/rtk/features/leavePolicy/leavePolicySlice";

const LeavePolicyEdit = ({ data }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { id } = useParams("id");

	const [loader, setLoader] = useState(false);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
    const [sandwichPolicy, setsandwichPolicy] =useState()
	const [leaveclubPolicy, setleaveclubPolicy] =useState()

	useEffect(()=>{
		setsandwichPolicy(data.sandwichPolicy)
		setleaveclubPolicy(data.leaveclubPolicy)
	},[data])

	const onFinish = async (values) => {
		const FormData = {
			...values,
			sickLeaves: parseInt(values.sickLeaves),
			causalLeaves: parseInt(values.causalLeaves),
			monthlyLatecomings:parseInt(values.monthlyLatecomings),
			monthlyHalfdays:parseInt(values.monthlyHalfdays),
			leaveclubPolicy:leaveclubPolicy,
			sandwichPolicy:sandwichPolicy
		};
		setLoader(true);
		const resp = await dispatch(updateLeavePolicy({ id, values: FormData }));

		if (resp.payload.message === "success") {
			setLoader(false);
			dispatch(loadSingleLeavePolicy(id));
			setIsModalOpen(false);
		} else {
			setLoader(false);
		}
	};

	const initialValues = {
		name: data?.name,
		sickLeaves: data?.sickLeaves,
		causalLeaves: data?.causalLeaves,
		monthlyLatecomings:data.monthlyLatecomings,
		monthlyHalfdays:data.monthlyHalfdays,
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding department");
		setLoader(false);
	};
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
		setLoader(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setLoader(false);
	};
	return (
		<>
			<button onClick={showModal}>
				<BtnEditSvg size={30} />
			</button>
			<Modal
				title='Leave Policy Edit'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={false}
				className='w-[650px]'>
				<Form
					style={{ marginBottom: "50px" }}
					eventKey='department-form'
					initialValues={{ ...initialValues }}
					name='basic'
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
							label='Name'
							name='name'
							labelCol={{ span: 10 }}  // Set the width of the label column
						wrapperCol={{ span: 8 }}
							rules={[
								{
									required: true,
									message: "Please input Leave Policy name!",
								},
							]}>
							<Input />
						</Form.Item>

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
								<div className="checkbox_form_item relative"> 
									<Form.Item
										style={{ marginBottom: "20px" }}
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
										<Checkbox className="margin-auto ml-[15px]" checked={sandwichPolicy} onChange={(e)=>{
											form.setFieldsValue({ sandwichPolicy: e.target.checked });
											setsandwichPolicy(e.target.checked)
										}}>
											
										</Checkbox>
									</Form.Item>
								</div>
								<div className="checkbox_form_item relative"> 
							
									<Form.Item
										style={{ marginBottom: "20px" }}
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
										<Checkbox className="margin-auto ml-[15px]" checked={leaveclubPolicy} onChange={(e)=>{
											form.setFieldsValue({ leaveclubPolicy: e.target.checked });
											setleaveclubPolicy(e.target.checked)
										}}>
									    	
										</Checkbox>
									</Form.Item>
								</div>
						<Form.Item
							style={{ marginBottom: "10px" }}
							wrapperCol={{
								offset: 7,
								span: 12,
							}}>
							<Button
								onClick={() => setLoader(true)}
								type='primary'
								size='small'
								htmlType='submit'
								block
								loading={loader}>
								Update Leave Policy
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default LeavePolicyEdit;
