import { Button, Col, DatePicker, Form, Input, Row, Select, Tag, Typography } from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
	loadAllShift,
	loadSingleShift,
} from "../../redux/rtk/features/shift/shiftSlice";
import { addLeaveApplication, loadAllLeaveApplication } from "../../redux/rtk/features/leave/leaveSlice";
import getUserFromToken from "../../utils/getUserFromToken";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import UploadMany from "../Card/UploadMany";
import { uploadAttachmentFile } from "../../redux/rtk/features/uploadFiles/uploadFiles";
import { loadAllbulkAttendance, updateBulkAttendance } from "../../redux/rtk/features/attendance/attendanceSlice";

const AddLeave = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	const users = useSelector((state) => state.users?.list);
	const leavePolicy = useSelector((state) => state.leavePolicy);
	const [file, setFile] = useState();
	const [isRemoveBtn, setisRemoveBtn] = useState(false)
	//get id from JWT token in localstorage and decode it
	const { TextArea } = Input;
	const id = getUserFromToken();
	const fileInputRef = useRef();
	const dispatch = useDispatch();
	const [files, setFiles] = useState([]);
	const { list, loading } = useSelector((state) => state.attendance);
    const [showExceedsMsg, setshowExceedsMsg] =useState(false)
	const [leaveFor, setLeaveFor] = useState(null);
	const handleLeaveForChange = (value) => {
		setLeaveFor(value);
	};
	const handleOnChange = (event) => {
		let currentFilesArr=[]
		const selectedFiles = event.target.files;
		const selectedFilesArray = Array.from(selectedFiles);
		currentFilesArr.push(selectedFilesArray[0])
		files.forEach((item)=>{
			currentFilesArr.push(item)
		})
		
		const totalSize = Array.from(currentFilesArr).reduce(
		  (accumulator, file) => accumulator + file.size,
		  0
		);
		const totalSizeInMB = totalSize/(1024*1024)
	    // console.log('currentFilesArr',currentFilesArr,'files',files,'totalSize',totalSize,'totalSizeInMB',totalSizeInMB)
		// Check if total size exceeds 5 MB
		if (totalSizeInMB.toFixed(2) > 5) {

		  alert("Total file size exceeds 5 MB");
		 
		  fileInputRef.current.value = null;
		  return;
		}
	  else {
		setFiles([...files, ...selectedFilesArray]);
	  }
		// Handle files as usual
		
		
	  };

	const handleRemoveFile = (fileIndex) => {
	  // Remove the file at the specified index
	  setFiles((prevFiles) => prevFiles.filter((file, index) => index !== fileIndex));
	};
	// const handleRemoveFile = () => {
	// 	// Clear the input field
	// 	if (fileInputRef.current) {
	// 	  fileInputRef.current.value = null;
	// 	}
	//   };
	useEffect(() => {
		dispatch(loadAllStaff({ status: true }));
		dispatch(loadAllbulkAttendance())
	}, []);

	const { Title } = Typography;
	const [form] = Form.useForm();
	const validateDateRange = (rule, value, callback) => {
		const leaveFrom = value;
		const leaveTo = form.getFieldValue('leaveTo');
	
		if (leaveFrom && leaveTo && leaveFrom.isAfter(leaveTo)) {
		  callback('Start Date must be lesser than End Date');
		} else {
		  callback();
		}
	  };
	const onFinish = async (values) => {

		values.attachment=files.map(item => item.name)
		// console.log('values', values)
		const leaveData = {
			...values,
			userId: values.userId,
			leaveFrom: dayjs(values.leaveFrom).format(),
			leaveTo: values.leaveTo ? dayjs(values.leaveTo).format():"",
		};
		
		// // console.log('files',files)   
		files.forEach((item)=>{
			const formData = new FormData();
			formData.append("files", item); 
			 // Assuming 'file' is the file you want to upload
			dispatch(uploadAttachmentFile(formData));
		})
   
		// setLoader(true);
		// console.log('leaveData',leaveData)
		const resp = await dispatch(addLeaveApplication(leaveData));
		if (resp.payload.message === "success") {
			dispatch(loadAllLeaveApplication())
			setLoader(false);
			form.resetFields();

				const leavesTo = values.leaveTo;
				const leavesFrom = values.leaveFrom;
				const selectedUser =users.find(item => item.id  === values.userId)
				const filteredLeaves = list.filter(item => {
					const itemDate = new Date(item.date);
					const fromDate = new Date(leavesFrom);
					fromDate.setDate(fromDate.getDate() - 1);
					const toDate = new Date(leavesTo);
					return (
						itemDate >= fromDate &&
						itemDate <= toDate &&
						(item.status === 'Uninformed' || item.status==='UnApproved leave') &&
						item.log === '' &&
						item.emailId === selectedUser.email
					);
				});
				const modifiedLeaves = filteredLeaves.map(item => {
					return {
						...item,
						status: `UnApproved leave` // Assuming values.paidOrUnpaid contains the desired status
					};
				});
				// console.log('Modified Leaves:', modifiedLeaves);
				dispatch(updateBulkAttendance(modifiedLeaves))
				dispatch(loadAllbulkAttendance())
			

		} else {
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding shift");
		setLoader(false);
	};
	return (
		<Fragment bordered={false}>
			<UserPrivateComponent permission={"create-leaveApplication"}>
				<Row className='mr-top' justify={drawer ? "center" : "center"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 16}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Application for Leave
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
										    return <Select.Option value={item.id}>{item.firstName} {item.lastName} - {item.employeeId}</Select.Option>
											})}
									</Select>
								</Form.Item>
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Leave Type'
									name='leaveType'
									rules={[
										{
											required: true,
											message: "Please input your shift!",
										},
									]}>
									<Select
										mode='single'
										placeholder='Select leave type'
										optionFilterProp='children'>
										<Select.Option value='sickLeave'>Sick Leave</Select.Option>
										<Select.Option value='causalLeave'>Causal Leave</Select.Option>
									</Select>
								</Form.Item>

								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Leave For'
									name='leaveFor'
									rules={[
										{
											required: true,
											message: "Please input your shift!",
										},
									]}>
									<Select
										mode='single'
										placeholder='Select leave for'
										optionFilterProp='children'
										onChange={handleLeaveForChange}>
										<Select.Option value='fullDay'>Full Day</Select.Option>
										<Select.Option value='halfDay'>Half Day</Select.Option>
									</Select>
								</Form.Item>
                                 {/* {console.log('form',form.getFieldValue('leaveFor'))} */}
							
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Start Date'
									name='leaveFrom'
									rules={[
										{
											required: true,
											message: "Please input your start date!",
										},
										 {
											validator: validateDateRange,
										  },
									]}>
									<DatePicker />
								</Form.Item>
								{leaveFor !== 'halfDay' && (
										<Form.Item
										style={{ marginBottom: "20px" }}
										label='End Date'
										name='leaveTo'
										rules={[
											{
											required: true,
											message: "Please input your end date!",
											},
											{
											validator: validateDateRange,
											},
										]}
										>
										<DatePicker />
										</Form.Item>
									)}
							
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Reason'
									name='leaveReason'
									rules={[
										{
											required: true,
											message: "Please input your shift!",
										},
									]}>
										    <TextArea
												placeholder="Leave Reason"
												autoSize={{
												minRows: 3,
												maxRows: 5,
												}}
											/>
									</Form.Item>
									<Form.Item
										style={{ marginBottom: "20px" }}
										label='Attachments'
										name='attachment'
										rules={[
										{
											required: false,
											message: "Please input your shift!",
										},
									]} className="form_item_leave_page">
									<input
										// required={true}
										className='text-sm text-slate-500
														file:mr-4 file:py-2 file:px-4
														file:rounded-full file:border-0
														file:text-sm file:font-semibold
														file:bg-blue-50 file:text-blue-700
														hover:file:bg-blue-100
														mt-4 file:mt-0 file:ml-4
														mb-4 file:mb-0 file:ml-4'
										type='file'
										id='csvFileInput'
										accept='image/jpeg,application/pdf,image/png,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
										multiple 
										ref={fileInputRef}
										onChange={handleOnChange}
									/>
									{files.map((file, index) => (
									 <div key={index} className="my-[10px]">
										{file.name}
										<button type="danger" className="mt-[0px] ml-[15px]" onClick={() => handleRemoveFile(index)}>
										<i class="bi bi-x-circle"></i>
										</button>
									</div>
									))}
									{showExceedsMsg ? 
									<p className="text-red-500">Sum of files size exceed 5 MB</p> :<Tag color="rgba(0,0,0,0.1)"><p className="text-[13px] text-black"> Note: The sum of all files size should not exceed 5 MB </p></Tag>	
								    } 
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
										Submit Leave
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

export default AddLeave;
