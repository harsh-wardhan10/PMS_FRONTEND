import { Button, DatePicker, Drawer, Form, Input, Radio, Select, Tag } from "antd";

import { useEffect, useMemo, useState } from "react";
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
import { loadAllbulkAttendance, updateBulkAttendance } from "../../../redux/rtk/features/attendance/attendanceSlice";
import { loadAllStaff, updateUtilizeLeaveUser } from "../../../redux/rtk/features/user/userSlice";

const ReviewLeavePopup = ({ handleLoading }) => {
	const { id } = useParams("id");
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [loader, setLoader] = useState(false);
	const data = useSelector((state) => state.leave.leave);
	const { list, loading } = useSelector((state) => state.attendance);
	const userId = getUserFromToken();
	const [status, setStatus] = useState(data.status);
	const { TextArea } = Input;
	const [initialValues, setInitialValues] = useState({});
	const [initialState, setinitialState] = useState(false)
    const [userData, setuserData] = useState()
	const { Option } = Select;
    const users = useSelector((state) => state.users?.list)
	const [loadingStatus, setloading] = useState(false)
	useEffect(() => {
		setInitialValues({
			...data,
			userId: userId,
			status: status,
			acceptLeaveFrom: moment(data?.leaveFrom),
			acceptLeaveTo: moment(data?.leaveTo),
		});
		setStatus(data.status)
		setinitialState(data.status)
		dispatch(loadAllbulkAttendance())
		dispatch(loadAllStaff({ status: true }));
		// console.log('status',status)
	}, [data]);

		useMemo(()=>{

		  const getUser= users?.filter((item)=>item.id===data.userId)
		  setuserData(getUser)
		//   console.log('users',users)
		//   if(data.leaveType==='sickLeave'){
		// 	   const diff= getUserLeavePolicy?.sickLeaves - getUser[0]?.utilizeSickleave
        //       if(data.leaveDuration > diff){
		// 		setshowExceedLimit(true) 
		// 		const extraLeaves= (data?.leaveDuration+getUser[0]?.utilizeSickleave)-getUserLeavePolicy?.sickLeaves
		// 		setextraLeaves(extraLeaves)              
		// 	  }         
		//   }
		//   else {
		// 	const diff= getUserLeavePolicy?.causalLeaves - getUser[0]?.utilizeCausalleave
		// 	if(data.leaveDuration > diff){
		// 	  setshowExceedLimit(true) 
		// 	  const extraLeaves= ( getUser[0]?.utilizeCausalleave+data?.leaveDuration)-getUserLeavePolicy?.causalLeaves
		// 	  setextraLeaves(extraLeaves)
		// 	}   
		//   }
     
		},[users])

	const onFinish = async (values) => {
		const FormData = {
			...values,
		};
		
		   // console.log('data',data)
		//    console.log('FormData',FormData, data.leaveType)
		   dispatch(updateUtilizeLeaveUser({id:data.userId, leaveType:data.leaveType ,initialState:initialState, values }))

		   const resp = await dispatch(reviewLeaveApplication({ id: id, values: FormData }));

		if (resp.payload.message === "success") {
			setOpen(false);
			dispatch(loadSingelLeaveApplication(id));
			setLoader(false);
			setStatus(null);

			if (values.status === 'ACCEPTED') {

				const leavesTo = values.acceptLeaveTo;
				const leavesFrom = values.acceptLeaveFrom;
				
                // code for updating utilizeSick leaves and causal Leaves in user model
				
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
						item.emailId === data.user.email
					);
				});
				const modifiedLeaves = filteredLeaves.map(item => {
					return {
						...item,
						status: `${data.leaveType}(${values.paidOrUnpaid})`  // Assuming values.paidOrUnpaid contains the desired status
					};
				});
				// console.log('Modified Leaves:', modifiedLeaves);
				dispatch(updateBulkAttendance(modifiedLeaves))
				dispatch(loadAllbulkAttendance())
			}
			else if(values.status === 'REJECTED'){
				const leavesTo = values.acceptLeaveTo;
				const leavesFrom = values.acceptLeaveFrom;
				const filteredLeaves = list.filter(item => {
					const itemDate = new Date(item.date);
					const fromDate = new Date(leavesFrom);
					fromDate.setDate(fromDate.getDate() - 1);
					const toDate = new Date(leavesTo);
					return (
						itemDate >= fromDate &&
						itemDate <= toDate &&
						(item.status === 'sickLeave(UnPaid)' || item.status==='sickLeave(Paid)' || item.status==='causalLeave(Paid)' || item.status=== 'causalLeave(UnPaid)' || item.status === 'Uninformed') &&
						item.log === '' &&
						item.emailId === data.user.email
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
			}
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
		handleLoading()
	};

	return (
		<>
			<Button onClick={showDrawer} className='mt-4' type='primary'>
				Review Leave
			</Button>
			{data && (
				<Drawer
					width={720}
					title='Leave Review'
					placement='right'
					onClose={onClose}
					open={open}>
					<h2 className='text-2xl font-semibold mb-4 text-center mt-5'>
						Approve Leave
					</h2>
					{/* {console.log('users',users)} */}
					{/* {console.log('list',list)} */}
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
							{/* {console.log('data', data)} */}

							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Accept From'
								name='acceptLeaveFrom'
								rules={[
									{
										required: true,
										message: "Please input Date !",
									},
								]}>
								<DatePicker format={"DD-MM-YYYY"} />
							</Form.Item>
                            {data.leaveFor !=='halfDay' && 
								<Form.Item
								style={{ marginBottom: "10px" }}
								label='Accept To'
								name='acceptLeaveTo'
								rules={[
									{
										required: true,
										message: "Please input Date!",
									},
								]}>
								<DatePicker format={"DD-MM-YYYY"} />
							</Form.Item>
							}  
						
							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Comment'
								name='reviewComment'>
								       <TextArea
												placeholder="Review Comment"
												autoSize={{
												minRows: 3,
												maxRows: 5,
												}}
									/>
							</Form.Item>

							{/* {status === null && (
								<p className='text-red-500 text-center mb-3'>
									Please select status
								</p>
							)} */}
                              {/* {console.log('data',data)} */}
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

										<Radio.Button value='REJECTED'>REJECTED</Radio.Button>
										<Radio.Button value='ACCEPTED'>ACCEPTED</Radio.Button>

								</Radio.Group>
							</Form.Item>
                                {status==='ACCEPTED' &&  
									<Form.Item
									style={{ marginBottom: "10px" }}
									label='Leave Type'
									name='paidOrUnpaid'
									rules={[
										{
											required: true,
											message: "Please select Leave Type!",
										},
									]}
									>
									<Select
										mode='single'
										placeholder='Leave Type'
										optionFilterProp='children'
										style={{
											width: "100%",
										}}
										>
										 <Select.Option key='Paid' value="Paid">Paid</Select.Option>
										 <Select.Option key='UnPaid' value="UnPaid">UnPaid</Select.Option>
									</Select>
								</Form.Item>
								}
								 
								  
							<Form.Item
								style={{ marginBottom: "10px" }}
								wrapperCol={{
									offset: 7,
									span: 12,
								}}>
								<Button
									onClick={() => setLoader(true)}
									type={status === null || status===data.status? '' : 'primary'}
									size='middle'
									htmlType='submit'
									block
									disabled={status === null || status===data.status}
									loading={loader}>
									Review Leave
								</Button>
							</Form.Item>
							<Form.Item
								style={{ marginBottom: "10px", textAlign:'center' }}
								label=''
								name=''
							>
                              <Tag color="rgb(229, 246, 253)" style={{padding:'5px', marginLeft:'78px', marginTop:'15px'}} ><p className="text-[13px] text-[#014361]"><i class="bi bi-info-circle text-[#0288d1] text-[15px] mr-[3px]" ></i> 
								    {userData && 
									  <>
									   {data?.user?.firstName} {data?.user?.lastName} has utilized {data.leaveType ==='sickLeave' ? userData[0]?.utilizeSickleave: userData[0]?.utilizeCausalleave} out of {data.leaveType ==='sickLeave' ? userData[0]?.leavePolicy?.sickLeaves : userData[0]?.leavePolicy?.causalLeaves} assigned {data.leaveType ==='sickLeave' ? "Sick" :'Causal'} leaves in this cycle
									  </>
									}
 								  </p>
								  </Tag>
								</Form.Item>
								
						</div>
					</Form>
				</Drawer>
			)}
		</>
	);
};
export default ReviewLeavePopup;
