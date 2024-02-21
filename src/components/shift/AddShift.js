import {
	Button,
	Card,
	Col,
	Form,
	Input,
	Popover,
	Row,
	Select,
	Table,
	TimePicker,
	Typography,
} from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ViewBtn from "../Buttons/ViewBtn";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { useDispatch, useSelector } from "react-redux";
import {
	addShift,
	loadAllShift,
} from "../../redux/rtk/features/shift/shiftSlice";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { Checkbox } from 'antd';
import moment from "moment";
function CustomTable({ list }) {
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
			title: "Start Time",
			dataIndex: "startTime",
			key: "startTime",
			render: (startTime) => dayjs(startTime).format("hh:mm A"),
		},

		{
			id: 4,
			title: "End Time",
			dataIndex: "endTime",
			key: "endTime",
			render: (endTime) => dayjs(endTime).format("hh:mm A"),
		},
		{
			id: 5,
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id) => <ViewBtn path={`/admin/shift/${id}/`} />,
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
					Shift List
				</h5>
				{list && (
					<div>
						<CsvLinkBtn>
							<CSVLink
								data={list}
								className='btn btn-dark btn-sm mb-1'
								filename='shift'>
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
				loading={!list}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</Card>
	);
}

const AddShift = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	const shift = useSelector((state) => state.shift.list);
	const dispatch = useDispatch();
	const { Option } = Select;
	const [graceTimeCheckbox , setgraceTimeCheckbox] =useState(false)
	const [breakTimeCheckbox , setbreakTimeCheckbox] =useState(false)
	const [breakType, setbreakType] =useState('')
	const [breakStartTime, setbreakStartTime ] =useState()
	const [breakEndTime, setbreakEndTime ] =useState()
	const [breakDurationTime , setbreakDurationTime] =useState()
	useEffect(() => {
		dispatch(loadAllShift());
	}, []);

	const { Title } = Typography;
	const [form] = Form.useForm();
	const { getFieldDecorator } = form;
	const contenttwo = (
		<div>
		 Break time is the designated period for employee breaks,<br/> which can be defined as a specific duration or flexible minutes.
		</div>
	  );
	  const content = (
		<div>
		 Grace period refers to the additional time beyond the official <br/>start time that is provided to employees,<br/> allowing them to arrive at the office without being marked as late.
		</div>
	  );
	const onFinish = async (values) => {
		// const shiftData = {
		// 	name: values.name,
		// 	startTime: values.startTime.format("HH:mm:s"),
		// 	endTime: values.endTime.format("HH:mm:s"),
		// };
		
		if(values.breakTime ==='duration'){
            values.breakTime = breakDurationTime
		}
		else if(values.breakTime==='time'){
			let startTime = moment(values.breakstartTime, 'HH:mm');
			let endTime = moment(values.breakendTime, 'HH:mm');
			let workMinutes = endTime.diff(startTime, 'minutes');
			//   workMinutes = Math.ceil(workMinutes);
			  values.breakTime = `${Math.ceil(workMinutes)}`
			//  console.log('breakStartTime',values.breakstartTime,'breakEndTime',values.breakendTime,'workMinutes', Math.ceil(workMinutes))
		}  
		setLoader(true);
		if(values.ingraceTime===undefined || values.ingraceTime===''){
			values.ingraceTime=`${0}`
		}
		if(values.outgraceTime===undefined || values.outgraceTime===''){
			values.outgraceTime=`${0}`
		}
		const shiftData={ ...values,  graceTimeCheckbox, breakTimeCheckbox}
		
		// console.log('shiftData',shiftData)

		const resp = await dispatch(addShift(shiftData));
		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
			dispatch(loadAllShift());
		} else {
			setLoader(false);
		}
	};
   const handlegraceCheckboxChange = (e) => {
    setgraceTimeCheckbox(e.target.checked)
  };
  const handlebreakCheckboxChange = (e) => {
    setbreakTimeCheckbox(e.target.checked)
  };
  const handleSelectbreakTime=(value)=>{
	setbreakType(value)
  }
	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding shift");
		setLoader(false);
	};
	return (
		<Fragment bordered={false}>
			<UserPrivateComponent permission={"create-shift"}>
				<Row className='mr-top' justify={drawer ? "center" : "space-between"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 16}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Add shift
						</Title>
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
									<TimePicker />
								</Form.Item>
	                     	<div className="relative"> 
								<div className="absolute left-[30px] top-[4px] z-[999]"> 
										   <Popover content={content}>
												<div ><i class="bi bi-info-circle text-black-500 text-[15px]" ></i></div>
											</Popover>
                                </div>
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
										{/* <TimePicker
										format="mm"
										showSecond={false}
										/> */}
								</Form.Item>
								<p className="ml-[10px] absolute top-[12px] right-[100px]"> Minutes</p>
								</div>
								<div className="checkbox_form_item"> 
									<Checkbox className="margin-auto" onChange={handlegraceCheckboxChange}>
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
									<TimePicker />
								</Form.Item>
								<div className="relative"> 
								<div className="absolute left-[17px] top-[4px] z-[999]"> 
										   <Popover content={content}>
												<div ><i class="bi bi-info-circle text-black-500 text-[15px]" ></i></div>
											</Popover>
                                </div>
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
							  	<p className="ml-[10px] absolute top-[12px] right-[100px]"> Minutes</p>
								</div>
								<div className="relative"> 
								<div className="absolute left-[40px] top-[4px] z-[999]"> 
										   <Popover content={contenttwo}>
												<div ><i class="bi bi-info-circle text-black-500 text-[15px]" ></i></div>
											</Popover>
                                </div>
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
								  {/* <p className="ml-[10px] absolute top-[12px] right-[100px]"> Minutes</p> */}
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
												   // onChange={(time, timeString) =>{
												   // 	setbreakStartTime(moment(time).format("HH:mm:s"))
												   // 	setbreakDurationTime(null)
												   // }} 
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
										{/* <TimePicker
										format="HH:mm"
										showSecond={false}
										onChange={(time, timeString) =>{
											setbreakDurationTime(moment(time).format("HH:mm:s"))
											setbreakStartTime(null)
											setbreakEndTime(null)
										}}
										/> */}
										</div>}
								</div>
								   <div className="checkbox_form_item"> 
								   <Checkbox className="margin-auto" onChange={handlebreakCheckboxChange}>
										      If the user exceed alloted break duration do you wish to mark that day as half day ?
										</Checkbox>
								   </div>
										
								
								<Form.Item
									style={{ marginBottom: "10px" }}
									wrapperCol={{
										offset: 6,
										span: 12,
									}}>
									<Button
										onClick={() => setLoader(true)}
										// disabled={
										// 	()=>{
										// 		if(breakStartTime===undefined && breakEndTime === undefined){
										// 			return false 
										// 		}
										// 		else if(breakDurationTime === undefined){
                                        //              return false                                                 
										// 		}
										// 		else if(breakStartTime && breakEndTime){
										// 			return true
										// 		}
										// 		else {}
										// 	}
										// }
										type='primary'
										size='large'
										htmlType='submit'
										block
										loading={loader}>
										Add New Shift
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
			<hr />
			<UserPrivateComponent permission={"readAll-shift"}>
				{drawer || <CustomTable list={shift} />}
			</UserPrivateComponent>
		</Fragment>
	);
};

export default AddShift;
