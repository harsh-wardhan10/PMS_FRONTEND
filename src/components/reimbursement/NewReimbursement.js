import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Tag, Typography } from "antd";

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
import { uploadReimbursementFile } from "../../redux/rtk/features/uploadReimbusementFiles/uploadReimbusementFiles";

const NewReimbursement = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	
	const users = useSelector((state) => state.users?.list);


	//get id from JWT token in localstorage and decode it
	const { TextArea } = Input;
	const id = getUserFromToken();
	const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
	const fileInputRef = useRef();
    const [showExceedsMsg, setshowExceedsMsg] =useState(false)

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
	const { Title } = Typography;
	const [form] = Form.useForm();

	const onFinish = async (values) => {
			values.attachment=files.map(item => item.name)
		const reimbursementData = {
			...values,
            applyDate:dayjs(values.date),
			userId: values.userId,
		};
      	// console.log('reimbursementData',reimbursementData,'values',values)

            files.forEach((item)=>{
				// console.log('item',item)
                const formData = new FormData();
                formData.append("files", item); 
                // Assuming 'file' is the file you want to upload
                dispatch(uploadReimbursementFile(formData));
            })
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
											{users?.map((item)=>{
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
									<p className="text-red-500">Sum of files size exceed 5 MB</p> :<Tag color="rgb(229, 246, 253)" style={{padding:'5px'}}><p className="text-[13px] text-[#014361]"> <i class="bi bi-info-circle text-[#0288d1] text-[15px] mr-[3px]" ></i> The sum of all files size should not exceed 5 MB </p></Tag>	
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
										Send for Approval
									</Button>
								</Form.Item>
                                <Form.Item
									style={{ marginBottom: "10px" , marginLeft:'60px'}}
								  >
                                            <Tag color="rgb(229, 246, 253)" style={{padding:'5px'}} ><p className="text-[13px] text-[#014361]"><i class="bi bi-info-circle text-[#0288d1] text-[15px] mr-[3px]" ></i> The reimbursement will be credit in the salary for the month in  which <br/>the reimbursement is accepted.</p></Tag>
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
