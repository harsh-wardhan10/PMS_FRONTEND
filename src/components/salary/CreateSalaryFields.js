import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, Tag, Typography } from "antd";

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
import { addBulkSalaryFields, loadAllBulkSalaryFields } from "../../redux/rtk/features/salary/salaryFieldSlice";

const CreateSalaryFields = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	
	const users = useSelector((state) => state.users?.list);
    const salaryFieldList =useSelector(state=> state.salaryField.list)
	//get id from JWT token in localstorage and decode it
	const { TextArea } = Input;
	const id = getUserFromToken();
	const dispatch = useDispatch();
    const [loading, setloading] =useState(false)
	const { Option } = Select;
    const [fieldsArray, setFieldsArray] =useState([{
        id:1,
        fieldName:"",
        isActive:false,
		isNew:true
    }])

	useEffect(()=>{


		if (salaryFieldList?.data?.length > 0) {
			const filteredSalaryField = salaryFieldList?.data?.filter(item => item.isNew === true)?.map(({ updatedAt, createdAt, userId, ...rest }) => rest);
		
			// Check if the item with the same id already exists in fieldsArray
			const uniqueFilteredSalaryField = filteredSalaryField.filter(filteredItem =>
				!fieldsArray.some(fieldItem => fieldItem.id === filteredItem.id)
			);
		
			setFieldsArray([...uniqueFilteredSalaryField, ...fieldsArray]);
		}


	},[salaryFieldList])
	const { Title } = Typography;
	const [form] = Form.useForm();

	const onFinish = async (values) => {
	   
         const fieldsArrayWithoutId = fieldsArray.map(({ id, ...rest }) => rest);
          //  console.log('fieldsArrayWithoutId',fieldsArrayWithoutId)
		
			const resp = await dispatch(addBulkSalaryFields(fieldsArrayWithoutId));
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
        dispatch(loadAllBulkSalaryFields())
	}, []);
	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding shift");
		setLoader(false);
	};
    const handleFieldDelete=(id)=>{
        setFieldsArray(fieldsArray.filter(item=>item.id !==id))
    }
	return (
		<Fragment bordered={false}>
			{/* {console.log('salaryFieldList',salaryFieldList,'fieldsArray',fieldsArray)} */}
			<UserPrivateComponent permission={"create-deductions"}>
				<Row className='mr-top' justify={drawer ? "center" : "center"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 20}
						xl={drawer ? 22 : 20}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Create Salary Fields 
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
								<div className="mt-[30px] border-t-2"> 
										<h2 className="text-[17px] ml-[80px] mt-[15px]"> Mandatory Fields</h2>
										<div className="grid grid-cols-2 gap-4 mt-[10px]"> 
											{salaryFieldList?.data?.map((item)=>{
												if(!item.isNew){
													return <div className="flex items-center m-[10px] justify-center" key={item.id}>
													<label className="text-nowrap m-[5px]"> Field Name</label>
													<Input disabled={true} value={item.fieldName} className="w-[53%] m-[5px] bg-[#efefef] text-[grey]" />
												</div>
												}
											})}
										</div>
								</div>
								
							<div className="mt-[30px] border-t-2"> 
								<h2 className="text-[17px] ml-[80px] mt-[15px]"> Non Mandatory Fields</h2>
								<div className="grid grid-cols-2 gap-4 mt-[10px]">
									{fieldsArray.map((item , index)=>{
									return (
										<div className="flex items-center m-[10px] justify-center relative" key={item.id}> 
											<label className="text-nowrap m-[5px]"> Field Name</label>
											<Input defaultValue={item.fieldName} placeholder="Field Name" className="w-[30%] m-[5px]" onChange={(e)=>{
											return item.fieldName = e.target.value
										}}/>
											<Checkbox className="margin-auto m-[5px]" defaultChecked={item.isActive} onChange={(e)=>{
											return item.isActive = e.target.checked
										}}>
											isActive
											</Checkbox>
											<button className="m-[5px]" onClick={()=>handleFieldDelete(item.id)}> <i class="bi bi-trash"></i></button>
										{index=== fieldsArray.length-1 && 
											<Button 
											onClick={()=>{
												setFieldsArray([...fieldsArray, {id:item?.id + 1 , fieldName:"" , isActive:false , isNew:true}])
											}} className="w-[50px] ant-btn ant-btn-primary ant-btn-md ant-btn-block absolute right-[0px]"> + </Button>}
									</div>
									) 
									})}
									</div>
								</div>	
						 
								<Form.Item
									style={{ marginBottom: "10px" }}
									wrapperCol={{
										offset: 6,
										span: 12,
									}}>
									<Button
										// onClick={() => setLoader(true)}
										type='primary'
										size='large'
										htmlType='submit'
										block
										loading={loader}>
										Save
									</Button>
								</Form.Item>
							
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default CreateSalaryFields;
