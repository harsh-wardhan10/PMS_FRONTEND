import { Button, Checkbox, Form, Input, Modal, Popover, Select, TimePicker } from "antd";

import {  useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BtnEditSvg from "../Button/btnEditSvg";
import { updateShift } from "../../../redux/rtk/features/shift/shiftSlice";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
import { loadAllTaxes, updateTax } from "../../../redux/rtk/features/tax/taxSlice";

const TaxEditPopup = ({ data }) => {

	const [isModalOpen, setIsModalOpen] = useState(false);
	const { id } = useParams("id");
	const dispatch = useDispatch();
	const [form] = Form.useForm();

	const { loading } = useSelector((state) => state.shift);

	const navigate = useNavigate();

	const onFinish = (values) => {

		const taxData=values
		// console.log('shiftData',shiftData)
		dispatch(updateTax({ id: data.id, values: taxData }));
		setIsModalOpen(false);
		// navigate(-1);
        dispatch(loadAllTaxes());
	};

	const { Option } = Select;
	const [initialValues, setInitialValues] = useState({
		taxName: data?.taxName || "",
		comment:data?.comment
	});
    

	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding department");
	};
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<button onClick={showModal}>
				<BtnEditSvg size={30} />
			</button>
		  {console.log('datadata',data)}
			<Modal
				title='Edit Tax'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={false}>
				<Form
					form={form}
					style={{ marginBottom: "40px" }}
					eventKey='tax-form'
					name='basic'
					initialValues={initialValues}
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
									message: "Please input your shift!",
								},
							]}>
							<Input />
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
								type='primary'
								size='small'
								htmlType='submit'
								block
								loading={loading}>
								Update Tax
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default TaxEditPopup;
