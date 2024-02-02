import { Button, Checkbox, Form, Input, Modal, Popover, Select, TimePicker } from "antd";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BtnEditSvg from "../Button/btnEditSvg";
import { updateShift } from "../../../redux/rtk/features/shift/shiftSlice";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";

const ShiftEditPopup = ({ data }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { id } = useParams("id");
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const { loading } = useSelector((state) => state.shift);
	const navigate = useNavigate();
	const [graceTimeCheckbox , setgraceTimeCheckbox] =useState(data.graceTimeCheckbox)
	const [breakTimeCheckbox , setbreakTimeCheckbox] =useState(data.breakTimeCheckbox)
	const handlegraceCheckboxChange = (e) => {
		setgraceTimeCheckbox(e.target.checked)
	  };
	  const handlebreakCheckboxChange = (e) => {
		setbreakTimeCheckbox(e.target.checked)
	  };
	const onFinish = (values) => {
		const shiftData={ ...values,  graceTimeCheckbox, breakTimeCheckbox}
		// console.log('shiftData',shiftData)
		dispatch(updateShift({ id: id, values: shiftData }));
		setIsModalOpen(false);
		navigate(-1);
	};
	useEffect(()=>{

		setbreakTimeCheckbox(data.breakTimeCheckbox)
		setgraceTimeCheckbox(data.graceTimeCheckbox)
	},[data])
	const { Option } = Select;
	const [initialValues, setInitialValues] = useState({
		name: data?.name || "",
		startTime: dayjs(data?.startTime),
		endTime: dayjs(data?.endTime),
        ingraceTime:data?.ingraceTime,
		outgraceTime:data?.outgraceTime,
		breakTime:data?.breakTime
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
	const content = (
		<div>
		  <p>Content</p>
		  <p>Content</p>
		</div>
	  );
	return (
		<>
			<button onClick={showModal}>
				<BtnEditSvg size={30} />
			</button>
		
			<Modal
				title='Edit Shift'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={false}>
				<Form
					form={form}
					style={{ marginBottom: "40px" }}
					eventKey='shift-form'
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
							label='Name'
							name='name'
							rules={[
								{
									required: true,
									message: "Please input your shift!",
								},
							]}>
							<Input />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "10px" }}
							label='Start Time'
							name='startTime'
							rules={[
								{
									required: true,
									message: "Please input your shift!",
								},
							]}>
							<TimePicker name='startTime' />
						</Form.Item>
						<div className="relative"> 
								{/* <div className="absolute left-[28px] z-[999]"> 
										   <Popover content={content} title="Title">
												<div ><i class="bi bi-info-circle text-red-500 text-[20px]" ></i></div>
											</Popover>
                                </div> */}

								<Form.Item
									style={{ marginBottom: "20px" }}
									label='In Grace Time'
									name='ingraceTime'
									rules={[
										{
											required: false,
											message: "Please input grace time!",
										},
									]} 
									>
										<Input type="text" placeholder="minutes"  onChange={(e) => {
											// Remove non-numeric characters
											const numericValue = e.target.value.replace(/\D/, '');
											form.setFieldsValue({ ingraceTime: numericValue });
										}}
									/>
									</Form.Item>
								<p className="ml-[10px] absolute top-[12px] right-[56px]"> Minutes</p>
								</div>
								<div className="checkbox_form_item"> 
									<Checkbox className="margin-auto" checked={graceTimeCheckbox} onChange={handlegraceCheckboxChange}>
										If the user exceeds the Grace Period for Start Time, do you wish to mark that day as a half day?
									</Checkbox>
								</div>
						<Form.Item
							style={{ marginBottom: "20px" }}
							label='End Time'
							name='endTime'
							rules={[
								{
									required: true,
									message: "Please input your shift!",
								},
							]}>
							<TimePicker name='endTime' />
						</Form.Item>
						<div className="relative"> 
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Out Grace Time'
									name='outgraceTime'
									rules={[
										{
											required: false,
											message: "Please input grace time!",
										},
									]} 
									>
										<Input type="text" placeholder="minutes"  onChange={(e) => {
											// Remove non-numeric characters
											const numericValue = e.target.value.replace(/\D/, '');
											form.setFieldsValue({ outgraceTime: numericValue });
										}}
										/>
								</Form.Item>
							  	<p className="ml-[10px] absolute top-[12px] right-[57px]"> Minutes</p>
					  </div>
					  
					  <div className="relative"> 
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Break Time'
									name='breakTime'
									rules={[
										{
											required: false,
											message: "Please input grace time!",
										},
									]} 
									>
										<Input type="text" placeholder="minutes"  onChange={(e) => {
											// Remove non-numeric characters
											const numericValue = e.target.value.replace(/\D/, '');
											form.setFieldsValue({ outgraceTime: numericValue });
										}}
										/>
								</Form.Item>
							  	<p className="ml-[10px] absolute top-[12px] right-[57px]"> Minutes</p>
					  </div>
					       <div className="checkbox_form_item"> 
								         <Checkbox className="margin-auto" checked={breakTimeCheckbox} onChange={handlebreakCheckboxChange}>
										      If the user exceed alloted break duration do you wish to mark that day as half day ?
										</Checkbox>
								   </div>
					  {/* <div className="relative"> 
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Break Time'
									name='breakTime'
									rules={[
										{
											required: true,
											message: "Please input break time!",
										},
									]}>
										<Select
										loading=''
										placeholder='Select Break Type'
										allowClear
										size={"middle"}
										onChange={handleSelectbreakTime}
										>
												<Option value={'time'}> Time  </Option>											
												<Option value={'duration'}> Duration </Option>
									 </Select>
								
								
								</Form.Item>
							
								  {breakType==='time' && 
								           <><Form.Item
										   style={{ marginBottom: "20px" }}
										   label=' Start Time'
										   name='breakstartTime'
										   rules={[
											   {
												   required: true,
												   message: "Please input break start time!",
											   },
										   ]}>
											   <TimePicker 
										
												   />
										   </Form.Item>
										   <Form.Item
										   style={{ marginBottom: "20px" }}
										   label=' End Time'
										   name='breakendTime'
										   rules={[
											   {
												   required: true,
												   message: "Please input break end time!",
											   },
										   ]}>
											   <TimePicker 
										       onChange={(time) => {
												form.setFieldsValue({ breakendTime: time }); // Update the form value
											 }}
										   /> </Form.Item>
										   </>
											
									 } 
									{breakType==='duration'&& 
									<div className="w-[50%] m-auto mb-[20px]"> 
									    Duration :
										<Input type="text" placeholder="minutes" onChange={(e,)=>{
										   const numericValue = e.target.value.replace(/\D/, '');
										   setbreakDurationTime(numericValue)
										   setbreakStartTime(null)
										   setbreakEndTime(null)
										}}/> 
										</div>}
								</div> */}
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
								Update Shift
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default ShiftEditPopup;
