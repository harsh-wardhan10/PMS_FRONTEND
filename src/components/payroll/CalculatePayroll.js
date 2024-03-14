import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Radio, Select, Table, Tooltip } from "antd";
import React, { useCallback, useMemo, useRef } from "react";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import PageTitle from "../page-header/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
	addPayslip,
	loadAllPayslip,
	updatePayslip,
	clearPayroll,
} from "../../redux/rtk/features/payroll/payrollSlice";
import { useNavigate } from "react-router-dom";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import PaySlipRequest from "../UI/PopUp/PaySlipRequest";
import { loadAllPayslipRequest, updatePayslipRequest, updatePayslipRequestAttachment, uploadPayslipFile } from "../../redux/rtk/features/payslip/paySlipSlice";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import {  EditOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getSalaryHistoryRecordByUserId, loadAllBulkSalaryFields } from "../../redux/rtk/features/salary/salaryFieldSlice";
import getSetting from "../../api/getSettings";
import moment from "moment";

function CustomTable({ list, loading , users}) {

	 const [columnsToShow, setColumnsToShow] = useState([]);
     const [isModalVisibletwo, setisModalVisibletwo] =useState(false)
     const [isModalVisiblethree, setisModalVisiblethree] =useState(false)

   	 const dispatch = useDispatch();
	 const [form] = Form.useForm();
     const [showCommentBox, setshowCommentBox ] = useState(false)
     const [paySlipStatus, setpaySlipStatus] = useState()
	 const [rejectComment, setRejectComment] =useState()
	 const [selectedId , setSelectedId] = useState()
	 const [seletedUserId, setSelectedUserId] =useState()
	 const [paySlipMonth, setpaySlipMonth] = useState()
	 const [paySlipYear, setpaySlipYear] = useState()
     const [comapanyDetail, setCompanyDetail] =useState()
     const salaryHistoryRecordUser = useSelector(state=> state.salaryField.salaryHistoryRecordUser)
	 const salaryFieldList =useSelector(state=> state.salaryField.list)
	 const pdfContainerRef = useRef(null);
     const [selectedUser , setselectedUser] =useState([])
	 const [earningsRecords, setearningsRecords] =useState([])
	 const [deductionsRecords , setdeductionsRecords] =useState([])
	 const [neutralRecords, setneutralRecords] =useState([])
	 const [netEarnings, setNetEarnings] =useState(0)
	 const [netDeductions, setNetDeductions] = useState(0)
	 const [blobCheck, setblobcheck] = useState(false)
	const { monthYear } =useSelector((state) => state.payslipRequest);
	 const getMonthName=(currentCSVMonth)=>{
		switch(currentCSVMonth){
		  case 1:
			return 'January'
		  case 2:
			return "february"
		  case 3:
			return "March"
		  case 4:
			return "April"
		  case 5:
			return "May"
		  case 6:
			return "June"    
			case 7:
			  return 'July'
			case 8:
			  return "August"
			case 9:
			  return "September"
			case 10:
			  return "October"
			case 11:
			  return "November"
			case 12:
			  return "December"  
			default:
			  return "NAN"   
		  }
	  }

	  const handlepaySlipSave=()=>{

		const data={
			selectedId:selectedId,
			paySlipStatus:paySlipStatus,
			rejectComment:rejectComment
		}

        if(paySlipStatus==='ACCEPTED'){
      			downloadPaySlip()
			setpaySlipStatus('REJECTED')
	  	}     
            //  console.log('data',data)
		dispatch(getSalaryHistoryRecordByUserId({ userId: seletedUserId , month : paySlipMonth, year: paySlipYear }))
		dispatch(updatePayslipRequest(data))
		dispatch(loadAllBulkSalaryFields())
		dispatch(loadAllPayslipRequest());
		getSetting().then((data) => setCompanyDetail(data.result));
		setisModalVisibletwo(false)
		setpaySlipStatus('ACCEPTED')
	  }
	  const customFooter = (
        <div>
             <Button key="customButton" type="default" onClick={()=>{ setisModalVisibletwo(false)}}>
                 Cancel
             </Button>	
		  {paySlipStatus==='ACCEPTED' ?  
		     <Button key="customButton" 
			 type="primary" onClick={handlepaySlipSave} > Save & Download Payslip</Button> 
			 :
			  <Button key="customButton" 
			 type="primary"
			 onClick={handlepaySlipSave}
			 >
			   Save 
			</Button> }
        </div>
      );
	  

	  const downloadPaySlip =()=>{
		let userData= users.filter(item=> item.id===seletedUserId)
		
		    // console.log(neutralRecords, earningsRecords, deductionsRecords ,'deductionsRecords')
			
		  if (!pdfContainerRef.current) return;

			setTimeout(() => {
				html2canvas(pdfContainerRef.current, {
				  x: 0,
				  y: 0,
				  width: pdfContainerRef.current.offsetWidth,
				  // height: pdfContainerRef.current.offsetHeight,
				  scale: 1,
				//   useCORS: true,
				}).then(canvas => {

				  const imgData = canvas.toDataURL('image/png', 1.0);
				  // Create a new jsPDF instance
				  const customPageSize = [210, 200]; // Width and height in millimeters for A4 size
				  const pdf = new jsPDF('p', 'mm', customPageSize);

						// Add the image (canvas) to the PDF
					     	pdf.addImage(imgData, 'PNG', 10, 10, 180, 150);
				            // Dispatch the action to upload the PDF file
	
							const pdfDataURI = pdf.output('datauristring');
							// Convert data URI to Blob
							const byteCharacters = atob(pdfDataURI.split(',')[1]);
							const byteNumbers = new Array(byteCharacters.length);
							for (let i = 0; i < byteCharacters.length; i++) {
							byteNumbers[i] = byteCharacters.charCodeAt(i);
							}
							const byteArray = new Uint8Array(byteNumbers);
							const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
	
							// Create a File object
							const pdfFile = new File([pdfBlob], `${userData[0].firstName}${userData[0].lastName}_${paySlipMonth}_${paySlipYear}_paySlip.pdf`, { type: 'application/pdf' });
							 const formData = new FormData();
						    // console.log('pdfFile',pdfFile)
							formData.append('files', pdfFile,`${userData[0].firstName}${userData[0].lastName}_${paySlipMonth}_${paySlipYear}_paySlip.pdf`);
							dispatch(updatePayslipRequestAttachment({attachment:`${userData[0].firstName}${userData[0].lastName}_${paySlipMonth}_${paySlipYear}_paySlip.pdf` , id:selectedId}))
							dispatch(uploadPayslipFile(formData));
							dispatch(loadAllPayslipRequest())
				
						// Now you can use pdfFile as a File object

				        pdf.save(`${userData[0].firstName}${userData[0].lastName}_${paySlipMonth}_${paySlipYear}_paySlip.pdf`);

				}).catch((err)=>{
                    console.log('err in pdf', err)
				})
			  }, 3000);
	
	  }

	   const getformattedDate=(createdAtString)=>{

		// Create a Date object from the createdAtString
		const createdAtDate = new Date(createdAtString);

		// Get the day, month, and year from the Date object
		const day = createdAtDate.getDate();
		const month = createdAtDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index (0 for January)
		const year = createdAtDate.getFullYear();

		// Format the day, month, and year to have leading zeros if necessary
		const formattedDay = String(day).padStart(2, "0");
		const formattedMonth = String(month).padStart(2, "0");

		// Concatenate the formatted day, month, and year in the desired format
		const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
		return formattedDate
	   }
			// console.log('users',users)	

			const handleDownload = async (attachment) => {
				if (attachment) {
                  console.log('AjayMeena_8_2022__paySlip.pdf',attachment)   
				  const downloadUrl = `${process.env.REACT_APP_API}/utils/payslip/uploads/${attachment}`;

				  try {
					const response = await fetch(downloadUrl);
					const blob = await response.blob();
			  
					// Create an object URL for the blob
					const objectUrl = URL.createObjectURL(blob);
			  
					// Create a temporary link element
					const link = document.createElement('a');
					link.href = objectUrl;
					link.download = attachment; // Use the original filename
			  
					// Trigger a click on the link to start the download
					link.click();
			  
					// Clean up the object URL
					URL.revokeObjectURL(objectUrl);
				  } catch (error) {
					console.error('Error downloading file:', error);
				  }
				}
			  };
	const columns = [
		// {
		// 	title: "ID",
		// 	dataIndex: "id",
		// 	key: "id",
		// },
		{
			title: "Date",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (createdAt) => {
				 return getformattedDate(createdAt)

			},
		},
		{
			title: "Created By",
			dataIndex: "createdBy",
			key: "createdBy",
			render: (createdBy) => {
				const filtereduser=users.filter(item=> item.id === createdBy)
				//    console.log('filtereduser',filtereduser,users)
					return `${filtereduser[0]?.userName}`
			},
		},
		{
			title: "User Name",
			key: "userId",
			dataIndex: "userId",
			render: (userId) => {
			  const filtereduser=users.filter(item=> item.id === userId)
			    return `${filtereduser[0]?.firstName} ${filtereduser[0]?.lastName}`
			},
		},

		{
			title: "Comment",
			dataIndex: "reason",
			key: "reason",
		},

		{
			title: "Month Year",
			dataIndex: "monthYear",
			key: "monthYear",
			render: (monthYear) => {
				const date = new Date(monthYear);
					const month = date.getMonth() + 1; 
					const year = date.getFullYear();
					
	            return `${getMonthName(month)} , ${year}`
			},
		},

		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status, record) => {
				  return <Tooltip title={record.rejectionComment}>
							 {status}
					  </Tooltip>
			},
		},
		{
			title: "Attachment",
			dataIndex: "attachment",
			key: "attachment",
			render: (attachment) => {
				return <a className="text-blue-500" onClick={()=>handleDownload(attachment)}> {attachment}</a>
			},
		},
		{
			id: 7,
			title: "Action",
			key: "action",
			render: ({ id ,monthYear}, record) => (

			        <div onClick={()=>{
						setisModalVisibletwo(true)
						setSelectedId(id)
						setSelectedUserId(record.userId)
							const date = new Date(monthYear);
							const month = date.getMonth() + 1; 
							const year = date.getFullYear();
							setpaySlipMonth(month)
					        setpaySlipYear(year)
						}}>
		            <EditOutlined/>
					</div>	
			),
		  }

	];

	useEffect(() => {
		setColumnsToShow(columns);

		setselectedUser(users.filter(item=> item.id===seletedUserId))
					
		setearningsRecords(salaryHistoryRecordUser.filter(record => {
				const correspondingField = salaryFieldList?.data?.find(field => {
				return field.fieldName === record.sfName && field.fieldType === 'Earnings';
			});
			return correspondingField;
		}))
		setNetEarnings(earningsRecords.reduce((accu , item)=>{
			return accu + item.sfValue
		},0))
		
		setdeductionsRecords(salaryHistoryRecordUser.filter(record => {
			const correspondingField = salaryFieldList?.data?.find(field => {
				return field.fieldName === record.sfName && field.fieldType === 'Deductions';
			});
			return correspondingField;
			}))

		setNetDeductions(deductionsRecords.reduce((accum, item)=>{
				return accum + item.sfValue
		},0))

		setneutralRecords(salaryHistoryRecordUser.filter(record => {
			const correspondingField = salaryFieldList?.data?.find(field => {
			return field.fieldName === record.sfName && field.fieldType === 'Neutral';
			});
			return correspondingField;
		}))
	    // console.log('users',users)
	}, [monthYear, earningsRecords ,  neutralRecords , deductionsRecords , netDeductions, netEarnings]);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));
    const closeModal=()=>{
		setisModalVisibletwo(false)
	}
	const closeModalthree = () => {
		setisModalVisiblethree(false);
	  };
	return (
		<div className='mt-5'>
			<div className='text-center my-2 flex justify-between'>
		</div>
			{/* <Modal title="Please change the status of the PaySlip"
                        visible={isModalVisiblethree}
                        onCancel={closeModalthree}
                        footer={customFooterTwo}
                        className='w-[550px]'> 
						THe payslip will be generated and downloaded on the system
		  </Modal> */}
             <Modal title="Please change the status of the PaySlip"
                        visible={isModalVisibletwo}
                        onCancel={closeModal}
                        footer={customFooter}
                        className='w-[550px]'> 
						
                     <Form
						className='list-inside list-none border-2 border-inherit rounded px-5 py-5 m-5 mt-10'
						form={form}
						style={{ marginBottom: "40px" }}
						name='basic'
						labelCol={{
							span: 7,
						}}
						wrapperCol={{
							span: 12,
						}}
						autoComplete='off'>
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
                                        setpaySlipStatus(e.target.value)
                                        if(e.target.value==='REJECTED'){
                                            setshowCommentBox(true)
                                        }
                                        else{
                                            setshowCommentBox(false)
											setRejectComment('')
                                        }
                                        }}>
									<Radio.Button value='ACCEPTED'>ACCEPT</Radio.Button>
									<Radio.Button value='REJECTED'>REJECT</Radio.Button>
								</Radio.Group>
							</Form.Item>
							
							 {showCommentBox ? 
							 	<Form.Item
									style={{ marginBottom: "20px" }}
									label='Comment'
									name='reason'
									rules={[
										{
											required: true,
											message: "Please input your reason for rejecting",
										},
									]}>
										    <TextArea
												placeholder="Rejecting Reason"
												autoSize={{
												minRows: 3,
												maxRows: 5,
												}}
											   onChange={(e)=>{ setRejectComment(e.target.value) }}
											/>
									</Form.Item> :null }
						</Form>
						{/* position: 'absolute', left: '-9999px'     */}
			 </Modal>
			<div ref={pdfContainerRef} className="text-center Pdf_container_div" id="elementId" style={{ width: '100%',position: 'absolute', left: '-9999px' }}>
			 {/* style={{ position: 'absolute', left: '-9999px' }} */}
			 <div className="text-center mb-[55px]">
			              <div className="CompanyDetail"> 
						        <h1> SALARY SLIP </h1>
								<div>  
									<h4> {comapanyDetail?.company_name} </h4>
								    <p>  {comapanyDetail?.address} </p>
									<p>  {comapanyDetail?.phone}   </p>
								</div>
						  </div> 
						  {/* {console.log('deductionsRecords',deductionsRecords ,'earningsRecords',earningsRecords , 'neutralRecords',neutralRecords)} */}
 					 <table className="payslip_table">
			             <tbody>
						     <tr className="payslip_table_tr"> 
								<td className="payslip_table_td" style={{borderTop:'0px', borderLeft:"0px"}}> Employee Name :</td>
								<td className="payslip_table_td" style={{borderTop:'0px'}}> {selectedUser[0]?.firstName} {selectedUser[0]?.lastName}</td>
								<td className="payslip_table_td" style={{borderTop:'0px'}}> Employee ID : </td>
								<td className="payslip_table_td" style={{borderTop:'0px', borderRight:"0px"}}> {selectedUser[0]?.employeeId} </td>
						    </tr>	
						    <tr className="payslip_table_tr"> 
								<td className="payslip_table_td" style={{ borderLeft:"0px"}}> Email :</td>
								<td className="payslip_table_td"> {selectedUser[0]?.email} </td>
								<td className="payslip_table_td"> Address </td>
								<td className="payslip_table_td" style={{ borderRight:"0px"}}> {selectedUser[0]?.country} {selectedUser[0]?.state}  {selectedUser[0]?.city}</td>
						    </tr>
						    <tr className="payslip_table_tr"> 
								<td className="payslip_table_td" style={{ borderLeft:"0px"}}> Contact No :</td>
								<td className="payslip_table_td"> {selectedUser[0]?.phone} </td>
								<td className="payslip_table_td"> Department :</td>
								<td className="payslip_table_td" style={{ borderRight:"0px"}}> {selectedUser[0]?.department?.name} </td>
						    </tr>
						 </tbody>
					      </table>

						  <table className="payslip_table">
						{/* <thead>
						<tr className="payslip_table_tr"> 
							<th className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white",  width:"60%"}}> Neutral</th>
							<th className="payslip_table_td"style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white", width:"60%"}} > value</th>
						</tr>	
						</thead> */}
						<tbody> 
							{neutralRecords.map((item)=>{
                                return(
									<tr className="payslip_table_tr"> 
										<td className="payslip_table_td"> {item.sfName}</td> 
										<td className="payslip_table_td"> {item.sfValue} </td> 
									</tr>
						           )
							})}
						</tbody>
					  </table>
						<div className="flex items-center justify-between w-[95%] m-auto"> 
						<table className="payslip_table mr-[10px]">
							<thead>
							<tr className="payslip_table_tr"> 
								<th className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white" , width:"60%"}}> Earnings</th>
								<th className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff",border:"1px solid white",  width:"60%"}}> Value </th>
							</tr>	
							</thead>
								<tbody> 
										{earningsRecords.map((item)=>{
											return (
											<tr className="payslip_table_tr"> 
												<td className="payslip_table_td"> {item.sfName}</td> 
												<td className="payslip_table_td"> {item.sfValue} </td> 
											</tr>
											) 
										})}
										 <tr className="payslip_table_tr"><td className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white" , width:"60%"}}> Gross Pay</td> 
										 <td className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white" , width:"60%"}}> {netEarnings} </td> 
										</tr>
										
								</tbody>
							</table>	
				       <table className="payslip_table ml-[10px]">
						<thead>
						<tr className="payslip_table_tr"> 
							<th className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white", width:"60%" }}> Deductions</th>
							<th className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white" ,width:"60%"}}> value</th>
						</tr>	
						</thead>
						<tbody> 
							{deductionsRecords.map((item)=>{
                                return(
									<tr className="payslip_table_tr"> 
										<td className="payslip_table_td"> {item.sfName}</td> 
										<td className="payslip_table_td"> {item.sfValue} </td> 
									</tr>
						           )
							})}
							 <tr className="payslip_table_tr">	   
							            <td className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white" , width:"60%"}}> Total Deductions</td> 
										<td className="payslip_table_td" style={{ backgroundColor:'#043470', color:"#fff", border:"1px solid white" , width:"60%"}}> {netDeductions}</td> 
										</tr>
						</tbody>
					</table>
				
							</div>  

							<div className="m-auto w-[95%]"> 
							<table className="payslip_table_last  ">
										<thead>
										<tr className="payslip_table_tr"> 
											<th className="payslip_table_td" style={{ backgroundColor:'#01264F', color:"#fff", border:"1px solid white", width:"60%" }}> Payable Month Salary</th>
											<th className="payslip_table_td" style={{ backgroundColor:'#01264F', color:"#fff", border:"1px solid white" ,width:"60%"}}> {neutralRecords?.filter(item => item.sfName==="Payable Monthly Salary")[0]?.sfValue}</th>
										</tr>	
										</thead>
				          	</table>
					</div>
					<div className="Table_footer"> 
                         <div className="Table_footer_div">
                            Date :							
						 </div>
						 <div className="Table_footer_div_two mr-[187px]"> 
							Signature:
						 </div>
					</div>
				    </div>     
			</div>
			<Table
				scroll={{ x: true }}
				loading={loading}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
				// expandable={{
				// 	expandedRowRender: (record) => (
				// 		<div className='flex justify-start'>
				// 			<div className='flex flex-col mr-10'>
				// 				<div className='flex justify-between'>
				// 					<div className='font-bold'>Paid Leave : </div>
				// 					<div>{record.paidLeave}</div>
				// 				</div>
				// 				<div className='flex justify-between'>
				// 					<div className='font-bold'>Unpaid Leave : </div>
				// 					<div className='ml-2'>{record.unpaidLeave}</div>
				// 				</div>
				// 			</div>
				// 			<div className='flex flex-col mr-10'>
				// 				<div className='flex justify-between '>
				// 					<div className='font-bold'>M-Holiday : </div>
				// 					<div>{record.monthlyHoliday}</div>
				// 				</div>
				// 				<div className='flex justify-between'>
				// 					<div className='font-bold'>P-Holiday : </div>
				// 					<div>{record.publicHoliday}</div>
				// 				</div>
				// 			</div>

				// 			<div className='flex flex-col mr-10'>
				// 				<div className='flex justify-between'>
				// 					<div className='font-bold'>Work Day : </div>
				// 					<div className='ml-2'>{record.workDay}</div>
				// 				</div>
				// 				<div className='flex justify-between'>
				// 					<div className='font-bold'> Shift W.H : </div>
				// 					<div>{record.shiftWiseWorkHour}</div>
				// 				</div>
				// 			</div>
				// 			<div className='flex flex-col mr-10'>
				// 				<div className='flex justify-between'>
				// 					<div className='font-bold'>Month W.H : </div>
				// 					<div className='ml-2'>{record.monthlyWorkHour}</div>
				// 				</div>
				// 				<div className='flex justify-between'>
				// 					<div className='font-bold'>H Salary : </div>
				// 					<div className='ml-2'>{record.hourlySalary}</div>
				// 				</div>
				// 			</div>
				// 		</div>
				// 	),
				// 	rowExpandable: (record) => record.name !== "Not Expandable",
				// }}
			/>
		</div>
	);
}

const CalculatePayroll = () => {
	const [month, setMonth] = useState(dayjs().format("M"));
	const [year, setYear] = useState(dayjs().format("YYYY"));
	const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
	const payslipRequest = useSelector((state) => state.payslipRequest.list);
	const loader = useSelector((state) => state.payslipRequest.loading);

	const dispatch = useDispatch();
	const [payslips, setPayslips] = useState([]);
	const users = useSelector((state) => state.users?.list);

	useEffect(() => {

		dispatch(loadAllPayslipRequest());
		dispatch(loadAllStaff({ status: true }));

		return () => {
			dispatch(clearPayroll());
		};
	}, []);

	useEffect(() => {
		setPayslips(payslipRequest);
	}, [payslipRequest]);

	const onMonthChange = (date, dateString) => {
		setMonth(dateString);
		dispatch(loadAllPayslip({ month: dateString, year }));
	};

	const onYearChange = (date, dateString) => {
		setYear(dateString);
		dispatch(loadAllPayslip({ month, year: dateString }));
	};

	const navigate = useNavigate();

	const OnSubmit = async () => {
		setLoading(true);
		const dataArray = payslips.map((i) => ({
			userId: i.id,
			salaryMonth: parseInt(month),
			salaryYear: parseInt(year),
			salary: i.salary,
			paidLeave: i.paidLeave,
			unpaidLeave: i.unpaidLeave,
			monthlyHoliday: i.monthlyHoliday,
			publicHoliday: i.publicHoliday,
			workDay: i.workDay,
			shiftWiseWorkHour: i.shiftWiseWorkHour,
			monthlyWorkHour: i.monthlyWorkHour,
			hourlySalary: i.hourlySalary,
			bonus: i.bonus,
			bonusComment: i.bonusComment,
			deduction: i.deduction,
			deductionComment: i.deductionComment,
			totalPayable: i.totalPayable,
			workingHour: i.workingHour,
			salaryPayable: i.salaryPayable,
		}));

		try {
			const resp = await dispatch(addPayslip(dataArray));
			if (resp.payload.message === "success") {
				setLoading(false);
				navigate("/admin/payroll/list");
			} else {
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	const showModaltwo = () => {
		setIsModalVisible(true);
	  };
	  
	  const closeModaltwo = () => {
		setIsModalVisible(false);
	  };
	  const { Option } = Select;


	  const uniqueNamesWithIds = Array.from(
		payslipRequest.reduce((map, item) => {
			const userId = item.userId;
			if (!map.has(userId)) {
				     const filtereduser=users.filter(item=> item.id === userId)
					 let userName= `${filtereduser[0]?.firstName} ${filtereduser[0]?.lastName}`
				map.set(userId, {
					userId,
					name: userName
				});
			}
			return map;
		}, new Map()).values()
	);


	  const [userId , setuserId] =useState()
	  const [filterData, setfilterData] =useState()
	//   useEffect(()=>{
	// 	setfilterData(payslipRequest)
	//   },[payslipRequest])
	  useMemo(() => {
		setfilterData(payslipRequest)
	}, [payslipRequest]);	
	  
	  const handleSelectChange = (value) => {
					setuserId(value);
					
					if(value==='selectName'){
						setfilterData(payslipRequest)
					}
					setfilterData(payslipRequest.filter(item => item.userId === value))
				};

			const disabledDate = (current) => {
				// Disable months beyond the previous month
				return current && current > moment().endOf('month').subtract(1, 'months');
			};

const handlemonthchange=(value)=>{

	const year = value.year(); 
	const month = value.month() + 1;

	const filteredDatatwo = payslipRequest.filter(item => {
		const createdAtDate = moment(item.monthYear);

		return (createdAtDate.year() === year && createdAtDate.month() + 1 === month) && item.userId ===userId ;
	  });
	//   console.log('filteredDatatwo',filteredDatatwo)
	  setfilterData(filteredDatatwo);
 }
	return (
		<div>
			<PageTitle title='Back' />
			<UserPrivateComponent permission={"readAll-payroll"}>
				<Card className='mt-5'>
            <div className="flex justify-between items-center"> 
				<div className="flex items-center">
					 <div className="z-[999] top-[157px] left-[258px]"> 
								<Select
										defaultValue="Select Name"
										placeholder='Select Name'
										style={{ width: 200, marginRight: 16 }}
										onChange={handleSelectChange}
										value={userId}
									>
										<Option value="selectName">Select All</Option>
										{uniqueNamesWithIds.map((item)=>{
											return  <Option value={item.userId}>{item?.name}</Option>
										})}
									</Select>
							</div>
							<div className="w-[50%] ml-[15px]"> 
                              <DatePicker picker="month" onChange={handlemonthchange} disabledDate={disabledDate}/>
                           </div> 

				</div>
				
					<div className='flex justify-end'>
						
					   <CsvLinkBtn onClick={() => {
                              // navigate('/admin/salary/sheet/history')
                             showModaltwo()

                            }} className="cursor-pointer ml-[10px] text-center">
                           Request Payslip
                       </CsvLinkBtn>
						      <Modal
                        title=""
                        visible={isModalVisible}
                        onCancel={closeModaltwo}
                        footer={null}
                        className='w-[750px]'
                      >
                        <PaySlipRequest isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>

                      </Modal>
					</div>
				 </div>
                           {/* {console.log('filterData',filterData)} */}
                    {users.length>0 ? 
						<CustomTable list={userId==='selectName' ?  payslipRequest :filterData} loading={loader} users={users}/>
						:null
						} 
					{/* <div className='flex justify-end'>
						<Button
							loading={loading}
							type='primary'
							size='large'
							htmlType='sumbit'
							onClick={OnSubmit}
							className='mt-5 text-end'>
							Generate Payslip
						</Button>
					</div> */}
				</Card>
			
			</UserPrivateComponent>
		</div>
	);
};

export default CalculatePayroll;
