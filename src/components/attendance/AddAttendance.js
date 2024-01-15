import { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
	Button,
	Col,
	Input,
	Row,
	Typography,
	Form,
	Select,
	DatePicker,
	TimePicker,
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import {
	addBulkAttendance,
	addManualAttendance,
	loadAllAttendance,
	loadBulkAttendancePaginated,
} from "../../redux/rtk/features/attendance/attendanceSlice";
import GetAllAttendance from "./GetAllAttendance";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import moment from "moment";

const Attendance = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	const users = useSelector((state) => state.users?.list);
	const dispatch = useDispatch();
	const { Title } = Typography;
	const [load, setload] = useState(false)
	const [form] = Form.useForm();
    const [manualAttendanceData, setManualAttendanceData] = useState([])
	const [startTimeDate, setStartTimeDate] = useState({
		time: null,
		date: new Date().toDateString(),
	});
	const [endTimeDate, setEndTimeDate] = useState({
		time: null,
		date: new Date().toDateString(),
	});
   const [inoutButton, setinoutButton] = useState(false)
   const [outinArray, setoutinArray] =useState([])
   const [selectedUser , setselectedUser] =useState()
   const [ addButton , setAddButton ] =useState(false)
   const [userLocation , setuserLocation] = useState()
	// const outTimeDateNew = new Date(outTimeDate.date + " " + outTimeDate.time);
 
	useEffect(() => {
		dispatch(loadAllStaff({ status: true }));
	}, []);
  useEffect(()=>{

    if(startTimeDate.time==="Invalid date" || startTimeDate.date==="Invalid date"){
	    setinoutButton(false)
   }
  },[startTimeDate, inoutButton])
	const onFinish = async (values) => {
			// make a new date variable from inTimeDate state which will contain date and time
			console.log('values',values)
	     const inTimeDateNew = startTimeDate.date + " " + startTimeDate.time
		 const outTimeDateNew = endTimeDate.date + " " + endTimeDate.time;
		 const newArray = outinArray.map(({ id, ...rest }) => rest);
		 const FormData = {
			...values,
			inTime: inTimeDateNew == "Invalid Date" ? null : inTimeDateNew,
			outTime: outTimeDateNew == "Invalid Date" ? null : outTimeDateNew,
			attendanceData:newArray
		};
		setLoader(true);
		manualAttendanceData?.push(
		  { status: 'Start' ,date:startTimeDate.date , log:startTimeDate.time , emailId:selectedUser , comment:values.comment , ipAddress:values.ip, location: userLocation} ,
		)
		
	    const subArray = newArray.map((item)=>{
				return  [{ status :"Out" , date:item.outDate , log:item.outTime , emailId :selectedUser,  comment:values.comment , ipAddress:values.ip, location: userLocation},{status :"In" , date:item.inDate , log:item.inTime , emailId :selectedUser,  comment:values.comment , ipAddress:values.ip, location: userLocation}]
			 }).flat(1) 
			 subArray.map((item)=>{
				manualAttendanceData?.push(item)
			 })
			 manualAttendanceData?.push(
				{ status: 'End' ,date:endTimeDate.date , log:endTimeDate.time , emailId:selectedUser,  comment:values.comment , ipAddress:values.ip, location: userLocation},
		   )
		
		const resp =  await dispatch(addBulkAttendance(manualAttendanceData))
		// const resp = await dispatch(addManualAttendance(FormData));
		   form.resetFields();
			dispatch(loadBulkAttendancePaginated());
			setload(!load)
		if (resp.payload.success) {
			setLoader(false);
		} else {
			setLoader(false);
		}
	};
	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding shift");
		setLoader(false);
	};
	function generateUniqueId(length) {
		const characters = '0123456789';
		let result = '';
	  
		for (let i = 0; i < length; i++) {
		  const randomIndex = Math.floor(Math.random() * characters.length);
		  result += characters.charAt(randomIndex);
		}
	  
		return result;
	  }
	const handleinOutButton =()=>{
		setoutinArray([...outinArray, {id:generateUniqueId(8),outTime:"" , inTime:"", outDate:new Date().toDateString() , inDate: new Date().toDateString()}])
	    setAddButton(true)
	}
	  const handledeleteInout =(Itemid)=>{
		const filteredItems=outinArray.filter(item => item.id !== Itemid )
	    setoutinArray(filteredItems)
	  }
	
	  useEffect(()=>{
		users.map((item)=>{
           if(item.email === selectedUser){
			return setuserLocation(`${item.country} , ${item.state} , ${item.city} , ${item.street}`)
		   }
		})
	  }, [selectedUser])
	return (
		<Fragment>
			<UserPrivateComponent permission={"create-attendance"}>
				<Row className='mr-top' justify={drawer ? "center" : "space-between"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 12}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Add Manual Attendance
						</Title>
					
						{startTimeDate.time === null ||
						startTimeDate.date === null ||
						endTimeDate.time === null ||
						endTimeDate.date === null ? (
							<p className='text-center text-rose-500 text-sm font-medium mb-4'>
								{" "}
								* Please fill Date and Time
							</p>
						) : (
							""
						)}
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
							{/* {console.log('outinArray', outinArray)} */}
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='User'
									name='userId'
									rules={[
										{
											required: true,
											message: "Please input your user!",
										},     
									]}>
									<Select placeholder='Select User'  onChange={(value)=>{ 
										setselectedUser(value)
									
									}}>
										{users?.map((user) => (
											<Select.Option key={user.id} value={user.email}>
												{user.firstName}{" "}{user.lastName}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
                               <Form.Item
									style={{ marginBottom: "10px" }}
									label='Start Time'
									rules={[
										{
											required: true,
											message: "Please input your start time!",
										},
									]}>
										
												<div className='flex justify-between relative'>
												<DatePicker
													format={"YYYY-MM-DD"}
													defaultValue={moment()}
													onChange={(date, dateString) =>{
														// console.log('date', date, dateString)
														// HH:mm:ss [GMT]
													    setinoutButton(true)
														setStartTimeDate({ ...startTimeDate, date:moment(date).format("ddd, DD MMM YYYY ") 
															})
													 }
													}
												/>
												<TimePicker
													className='ml-4'
													format={"HH:mm:s"}
													onChange={(time, timeString) =>
													   {
                                                        setinoutButton(true)
														setStartTimeDate({ ...startTimeDate, time:moment(time).format("HH:mm:s")  })
													   }		
													}
												/>
												{inoutButton && 
												<div> 
											     <Button disabled={addButton} onClick={handleinOutButton} className="absolute w-[50px] right-[-60px] ant-btn ant-btn-primary ant-btn-md ant-btn-block"> + </Button>
											   </div>
											   }
											
											</div>
											
								</Form.Item>

								{outinArray?.map((item, key)=>{
									return (
									<div key={item.id}>
									<Form.Item
									style={{ marginBottom: "10px" }}
									label='Out Time'
									rules={[
										{
											required: true,
											message: "Please input your start time!",
										},
									]}>
										
												<div className='flex justify-between relative'>
												<DatePicker
															format={"YYYY-MM-DD"}
															defaultValue={moment()}
															onChange={(date, dateString) =>{
															    item.outDate=moment(date).format("ddd, DD MMM YYYY ")
															}}
											             	/>  										
														   <TimePicker
															className='ml-4'
															format={"HH:mm:s"}
															onChange={(time, timeString) =>
															{	
																item.outTime = moment(time).format("HH:mm:s")}		
															}
														  /> 
											
											</div>
											
								</Form.Item>
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='In Time'
									rules={[
										{
											required: true,
											message: "Please input your start time!",
										},
									]}>
										
												<div className='flex justify-between relative'>
												<DatePicker
															format={"YYYY-MM-DD"}
															defaultValue={moment()}
															onChange={(date, dateString) =>{
															    item.inDate=moment(date).format("ddd, DD MMM YYYY ")
															}}
											             	/>  
														   <TimePicker
															className='ml-4'
															format={"HH:mm:s"}
															onChange={(time, timeString) =>
															{	
																item.inTime = moment(time).format("HH:mm:s")
																setAddButton(false)
															}}
														  /> 
											<a className="absolute right-[-23px] top-[-10px] pointer mt-[25px] ml-[5px]" onClick={()=>handledeleteInout(item.id , key)}> <i class="bi bi-trash"></i></a>
											</div>
											
								</Form.Item>
									</div>)
								})}
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='End Time'
									rules={[
										{
											required: true,
											message: "Please input your start time!",
										},
									]}>
									<div className='flex justify-between'>
										<DatePicker
											format={"YYYY-MM-DD"}
											defaultValue={moment()}
											onChange={(date, dateString) =>
												
												// format("ddd, DD MMM YYYY HH:mm:ss [GMT]")
												setEndTimeDate({ ...endTimeDate, date: moment(date).format("ddd, DD MMM YYYY ")})
											}
										/>
										<TimePicker
											className='ml-4'
											format={"HH:mm:s"}
											onChange={(time, timeString) =>
												// timeString
												setEndTimeDate({ ...endTimeDate, time: moment(time).format("HH:mm:s") })
											}
										/>
									</div>
								</Form.Item>

								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Comment'
									name='comment'>
									<Input placeholder='Comment' />
								</Form.Item>

								<Form.Item
									style={{ marginBottom: "10px" }}
									label='IP Address'
									name='ip'>
									<Input placeholder='127.0.0.1' />
								</Form.Item>
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Location'
									name='ip'>
										
									 {selectedUser ? users.map((item, key)=>{
										  if(item.email === selectedUser){
											return <label key={key}>  
											{ !item.country && !item.state && !item.city && !item.street ? <>No Location </>
											 : <>
											 {item.country && <>{item.country},</>}  {item.state && <>{item.state},</>} {item.city && <>{item.city},</>} {item.street && <>{item.street},</>}
											 </>}
											 </label>
										  }  
									})
								  :<label>No Location</label>} 
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
										disabled={
											startTimeDate.time === null ||
											endTimeDate.time === null 
										}
										htmlType='submit'
										block
										loading={loader}>
										Add Attendance
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
			<UserPrivateComponent permission={"readAll-attendance"}>
				<GetAllAttendance load={load}/>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default Attendance;
