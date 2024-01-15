import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, DatePicker, Segmented, Table, Tag ,Button, Modal} from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn, TableHeraderh2 } from "../UI/CsvLinkBtn";
import { loadAllAttendancePaginated,clearAttendanceList, addManualAttendance, addBulkAttendance, loadBulkAttendancePaginated } from "../../redux/rtk/features/attendance/attendanceSlice";
import BtnSearchSvg from "../UI/Button/btnSearchSvg";
import { VioletLinkBtn } from "../UI/AllLinkBtn";
import Papa from 'papaparse';
import * as XLSX  from 'xlsx';
import AttendanceSummary from "./AttendanceSummary";
//Date fucntinalities
let startdate = dayjs().startOf("month");
let enddate = dayjs().endOf("month");

function CustomTable({ list, total, status, setStatus, loading , refresh , setrefresh, setSummaryData , summaryData}) {
	const [columnsToShow, setColumnsToShow] = useState([]);
	const [CSVlist, setCSVlist]=useState([])
	const dispatch = useDispatch();
    const [arrayData, setarrayData] = useState([])
	const navigate =useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [dropZoneContent, setDropZoneContent] = useState('');
	const [dropZone, setDropZone] = useState(false);
	const [isUpload, setisUpload]=  useState(false)
	const showModal = () => {
	  setIsModalOpen(true);
	};
  
	const handleOk = () => {
	  setIsModalOpen(false);
	  setDropZone(false)
	};
   

	const handleCancel = () => {
	  setIsModalOpen(false);
	  setDropZone(false)
	  setDropZoneContent('')
	  setIsSecondModalVisible(false);
	};
	const [file, setFile] = useState(null);
	const onChange = (value) => {
		setStatus(value);
		dispatch(
			loadAllAttendancePaginated({
				page: 1,
				limit: 30,
				startdate,
				enddate,
			})
		);
	};
	
    
	const columns = [
		{
			id: 10,
			title: "User Name",
			dataIndex: "data",
			key: "data",
			render: (data) =>{
				return data[0]?.userData?.map(user => `${user.firstName} ${user.lastName}`).join(', ') 
			}
		},
		{
			id:1,
			title:"Email Id",
			dataIndex:'emailId',
			key:"emailId",
			render:(emailId)=>`${emailId}`
		},

		{
			id: 2,
			title: "Total Absentees",
			dataIndex: "email",
			key: "email",
			render: (email) => `${email}`,
		},
		{
			id: 3,
			title: "Total Half Days",
			dataIndex: `street`,
			key: "street",
			render: (street) => `${street}`
				// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
		},
		{
			id: 4,
			title: "Long Breaks",
			dataIndex: `street`,
			key: "street",
			render: (street) => `${street}`
				// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
		},
		{
			id: 5,
			title: "Late Coming",
			dataIndex: `street`,
			key: "street",
			render: (street) => `${street}`
				// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
		},
		{
			id: 6,
			title: "Action",
			dataIndex: "data",
			key: "data",
			render: (data) => (
				<button onClick={()=>{navigate(`/admin/attendance/${data[0].emailId}`,{state:data})}}>
				 View
				</button>
			),
		},
	];

	useEffect(() => {
		setColumnsToShow(columns);
		//  CSVlist = list.length?list:[].map((i) => ({
		// 	...i,
		// 	supplier: i?.supplier?.name,

	}, [list]);
  
	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));
	
	
	
	// Upload CSV File code 
	
	const fileReader = new FileReader();
	const fileInputRef = useRef(null);
	const handleOnSubmit = (text) => {
		// Check if it's a CSV file (you might want to improve this check)
		  Papa.parse(text, {
			header: true,
			complete: (result) => {
			  const updatedList = result.data.map((item, index) => ({
				id: item.id,
				userName: `${item.firstName} ${item.lastName}`,
				email: item.email,
				street: item.street,
			  }));
			  setarrayData(updatedList);
			},
		  });
	  };
  
	const handleAutoUpload = () => {
	  fileInputRef.current.click();
	};
  
	const handleFileRead = () => {
	  const text = fileReader.result;
	  handleOnSubmit(text);
	};
  
	const handleFileReadError = (error) => {
	  console.error('Error reading file:', error);
	};
  
	 function handleDragOver(e) {
		e.preventDefault();
	  }

	
	  
	  function handleDrop(e) {
		setisUpload(true)
		e.preventDefault();
		const droppedFile = e.dataTransfer.files[0];
		setFile(droppedFile);
		if (droppedFile) {

			 if(droppedFile.name.endsWith('.xlsx')){
				setDropZoneContent(droppedFile.name)
				readFile(droppedFile);
				setDropZone(true)
			 }
			 else{
				setDropZone(true)
				setDropZoneContent(droppedFile.name)
				fileReader.onload = handleFileRead;
				fileReader.onerror = handleFileReadError;
				fileReader.readAsText(droppedFile);
			 }
		
		}
	  }
	  function handleFileInputChange() {
		setisUpload(true)
		const selectedFile = fileInputRef.current.files[0];
		setFile(selectedFile);
		if (selectedFile) {
			 if (selectedFile.name.endsWith('.xlsx')) {
				setDropZoneContent(selectedFile.name)
				readFile(selectedFile);
				setDropZone(true)
			 }
			 else if(selectedFile.name.endsWith('.csv')){
				    handleAutoUpload()
					setDropZone(true)
					setDropZoneContent(selectedFile.name)
					fileReader.onload = handleFileRead;
					fileReader.onerror = handleFileReadError;
					fileReader.readAsText(selectedFile);
			 }
		  }
	  }
	
	  const readFile = (file) => {
		const reader = new FileReader();
	
		reader.onload = (e) => {
		  const data = e.target.result;
		  const workbook = XLSX.read(data, { type: 'binary' });
	
		  // Assuming the first sheet is the one you want to convert
		  const sheetName = workbook.SheetNames[0];
		  const worksheet = workbook.Sheets[sheetName];
		 
		  // Convert the worksheet to JSON
		  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
			raw: false,
			dateNF: 'YYYY-MM-DD',
			cellDates: true,
		  });

		  setarrayData(jsonData)
		};
	
		reader.readAsBinaryString(file);
	  };

  useEffect(()=>{

    //  console.log('arrayData', arrayData)
  
	},[arrayData])
  const handleBulkupload= ()=>{

	const createNewObject = (item, key, email) => {
		
		const newObj = {
			date: item.Date,
			status: item.Status,
			log: item[key],
			emailId: email,
		};
		return newObj;
	};
	
	const processData = (data) => {
		const newData = [];
	
		data.forEach(item => {
			// Iterate over the keys of the item
			Object.keys(item).forEach(key => {
				// Check if the key is neither 'Date' nor 'Status'
				if (key.toLowerCase() !== 'date' && key.toLowerCase() !== 'status') {
					const newObj = createNewObject(item, key, key); // Assuming key is the email in this case
					newData.push(newObj);
				}
			});
		});
	
		return newData;
	};
	const processedData = processData(arrayData);
      const bulkUploadResult=  dispatch(addBulkAttendance(processedData))
	  setSummaryData(bulkUploadResult)
      
	  handleCancel()
	  handleOpenSecondModal()
	}

	  const handlecsvclick=()=>{
		setCSVlist(list.map((item)=>{
			return {
				 "ID": item.id,
				 "Name":`${item.user?.firstName} ${item.user?.lastName}` ,
				  "In Time": item.inTime?item.inTime:"None",
				  "Out Time":item.outTime? item.outTime:'None',
				  "In Status":item.inTimeStatus?item.inTimeStatus:'None',
				  "Out Status":item.outTimeStatus?item.outTimeStatus :'None',
				  "Total Hours":item.totalHour?item.totalHour:'None',
				  "Punch By":`${item.punchBy[0]?.firstName} ${item.punchBy[0]?.lastName}`
			}
	   }))
	 }
	 const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
			const handleOpenSecondModal = () => {
				setIsSecondModalVisible(true);
			};
			const customFooter = (
				<div>
			     	<Button key="customButton" type="default" onClick={handleCancel}>
				  	 Cancel
				  </Button>	
				   <Button key="customButton" type={isUpload? "primary":"default"} disabled={!isUpload} onClick={handleBulkupload}>
					 Upload Button
				  </Button>
				</div>
			  );
	return (
		<div className='mt-5'>
			{list && (
			 	<div className='text-center my-2 flex justify-end'>
			      <div className="relative"> 
				  <CsvLinkBtn className="cursor-pointer" onClick={() => {
							// handleAutoUpload();
							//  handleFileInputChange();
							
							showModal()
       					 }} >
			    	Upload CSV
		    	 </CsvLinkBtn>
				   <div className="absolute w-[145px]"> {dropZoneContent}</div>
					</div>
			   
				
					{/* File Upload Modal */}
		         <Modal title="Choose Or Drag drop file to upload" open={isModalOpen} 
			     	onCancel={handleCancel}
					 footer={customFooter}
					>
				    {dropZone ? <>
						{dropZoneContent}
					 
					</>  : 
					<div className="modal-content">
					{/* File Input with Drag and Drop */}
					<input
						ref={fileInputRef}
						style={{ display: 'none' }}
						type="file"
						accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
						onChange={handleFileInputChange}
					/>
					<div
						className="drop-zone"
						onDragOver={(e) => handleDragOver(e)}
						onDrop={(e) => handleDrop(e)}
					>
						Drag & Drop 
					</div>
					<button className="mt-[15px] ant-btn ant-btn-primary ant-btn-md ant-btn-block" onClick={() => fileInputRef.current.click()}> Or  Choose File</button>
					<a href="/" download="Sample_file.xlsx">Download Sample File</a>
				 </div>
					} 
					
				  
	     		</Modal>
			     	 <AttendanceSummary
				    	summaryData={summaryData}
				        visible={isSecondModalVisible}
				    	onClose={() => {
							setrefresh(!refresh)
							setIsSecondModalVisible(false)}}
					       
					/> 
					<CsvLinkBtn onClick={handlecsvclick}>
						<CSVLink data={CSVlist} filename='purchase'>
							Download CSV
						</CSVLink>
					</CsvLinkBtn>
                    
					{/*<div>
						<Segmented
							className='text-center rounded text-red-500 mt-0.5'
							size='middle'
							options={[
								{
									label: (
										<span>
											<i className='bi bi-person-lines-fill'></i> Active
										</span>
									),
									value: "true",
								},
								{
									label: (
										<span>
											<i className='bi bi-person-dash-fill'></i> Inactive
										</span>
									),
									value: "false",
								},
							]}
							value={status}
							onChange={onChange}
						/>
            </div> */}
				</div>
			)}
           
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
				loading={loading}
				pagination={{
					defaultPageSize: 30,
					pageSizeOptions: [30, 40, 50, 100, 200],
					showSizeChanger: true,
					total:  [...new Set(list.map(item => item.emailId))].map(email => {
						// Filter data for the current email
						const emailData = list.filter(item => item.emailId === email);
						
						// Map the filtered data to the required format
						const formattedData = emailData.map(({ id, date, status, log, emailId ,userData}) => ({ id, date, status, log ,emailId ,userData}));
			
						return { emailId:email, data: formattedData };
					}) ?  [...new Set(list.map(item => item.emailId))].map(email => {
						// Filter data for the current email
						const emailData = list.filter(item => item.emailId === email);
						
						// Map the filtered data to the required format
						const formattedData = emailData.map(({ id, date, status, log,emailId ,userData }) => ({ id, date, status, log,emailId ,userData }));
			
						return { emailId:email, data: formattedData };
					}).length : 10,

					onChange: (page, limit) => {
						dispatch(
							loadBulkAttendancePaginated({ page, limit })
						);
					},
				}}
				columns={columnsToShow}
				dataSource={ [...new Set(list.map(item => item.emailId))].map(email => {
					// Filter data for the current email
					const emailData = list.filter(item => item.emailId === email);
					
					// Map the filtered data to the required format
					const formattedData = emailData.map(({ id, date, status, log ,emailId , userData}) => ({ id, date, status, log ,emailId , userData}));
		
					return { emailId:email, data: formattedData };
				})?  [...new Set(list.map(item => item.emailId))].map(email => {
						// Filter data for the current email
						const emailData = list.filter(item => item.emailId === email);
						
						// Map the filtered data to the required format
						const formattedData = emailData.map(({ id, date, status, log,emailId,userData }) => ({ id, date, status, log,emailId ,userData}));
			
						return { emailId:email, data: formattedData };
					}) : []}
			/>
		</div>
	);
}

const GetAllAttendance = (props) => {
	const dispatch = useDispatch();
    
	const { list, loading } = useSelector((state) => state.attendance);
	const [status, setStatus] = useState("true");
    const [refresh , setrefresh] =useState(false)
	const [summaryData, setSummaryData] =useState()
	const { RangePicker } = DatePicker;
	useEffect(() => {
		// dispatch(
		// 	loadAllAttendancePaginated({
		// 		page: 1,
		// 		limit: 30,
		// 		startdate,
		// 		enddate,
		// 	})
		// );
		dispatch(
			loadBulkAttendancePaginated({
				page: 1,
				limit: 30,
			})
		);
	}, [refresh , props.load]);
  useEffect(()=>{

  },[refresh])
	const onCalendarChange = (dates) => {
		console.log(dates?.[0])
		if(dates)
		{
			startdate = new Date(dates[0]).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' });
			startdate = startdate.split('+')[0];
			enddate = new Date(dates[1]).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' });
			enddate = enddate.split('+')[0]
			// console.log('startdate',startdate)
			// console.log('enddate',enddate)
		}
	};

	const onClickSearch = () => {
		// dispatch(clearAttendanceList());

		dispatch(
			loadBulkAttendancePaginated({
				page: 1,
				limit: 30,
			})
		);
	};

	// TODO : Add Search functionality here

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
	return (
		<>
			<Card className='card card-custom mt-3 '>
				<div className='card-body'>
					<div className='flex justify-between'>
						<TableHeraderh2>Attendance List</TableHeraderh2>
						<div className='flex justify-end'>
							<RangePicker
								onChange={onCalendarChange}
								// defaultValue={[startdate, enddate]}
								format={"DD-MM-YYYY"}
								className='range-picker mr-3'
								style={{ maxWidth: "400px" }}
							/>
							<VioletLinkBtn>
								<button onClick={onClickSearch}>
									<BtnSearchSvg size={25} title={"SEARCH"} loading={loading} />
								</button>
							</VioletLinkBtn>
						</div>
					</div>
					{/*TODO : ADD TOTAL AMOUNT HERE */}
		             {/* {console.log('list', list)} */}
					<CustomTable
						list={list}
						loading={loading}
						setrefresh={setrefresh}
						setSummaryData={setSummaryData}
						summaryData={summaryData}
						refresh={refresh}
						total={100}
						startdate={startdate}
						enddate={enddate}
						status={status}
						setStatus={setStatus}
					/>
				</div>
			</Card>
		</>
	);
};

export default GetAllAttendance;
