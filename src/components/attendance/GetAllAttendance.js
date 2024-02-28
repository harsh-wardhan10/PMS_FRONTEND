import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, DatePicker, Segmented, Table, Tag ,Button, Modal, Checkbox, Form} from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn, TableHeraderh2 } from "../UI/CsvLinkBtn";
import { loadAllAttendancePaginated,clearAttendanceList, addManualAttendance, addBulkAttendance, loadBulkAttendancePaginated, loadAllAttendance, loadAllbulkAttendance, getAttendanceDataByEmail, addoverwriteAttendance } from "../../redux/rtk/features/attendance/attendanceSlice";
import BtnSearchSvg from "../UI/Button/btnSearchSvg";
import { VioletLinkBtn } from "../UI/AllLinkBtn";
import Papa from 'papaparse';
import * as XLSX  from 'xlsx';
import AttendanceSummary from "./AttendanceSummary";
import { AttendanceSampleData } from "../../sample-data/pos-product";
import { loadAttendanceList, setAttendanceList } from "../../redux/rtk/features/attendance/attendancelistSlice";
//Date fucntinalities
import moment from 'moment';
import { loadAllPublicHoliday } from "../../redux/rtk/features/publicHoliday/publicHolidaySlice";
import _debounce from 'lodash/debounce';

function CustomTable({ list, total, status, setStatus, loading , refresh , setrefresh, setSummaryData , summaryData ,startdate ,enddate}) {
	const [columnsToShow, setColumnsToShow] = useState([]);
	const [CSVlist, setCSVlist]=useState([])
	const dispatch = useDispatch();
    const [arrayData, setarrayData] = useState([])
	const navigate =useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [dropZoneContent, setDropZoneContent] = useState('');
	const [dropZone, setDropZone] = useState(false);
	const [isUpload, setisUpload]=  useState(false)
	const [excludedDataEntries, setExcludedDataEntries] =useState()
	const [overwriteData, setoverwriteData] =useState(false)
	const showModal = () => {
	  setIsModalOpen(true);
	};
	const users = useSelector((state) => state.users?.list);
	const publicHolidayList = useSelector((state) => state.publicHoliday);
	const [sampleData, setSampleData] = useState([])
  
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
			title: "Name",
			dataIndex: "data",
			key: "data",
			render: (data, record) => {
				const htmlContent = data[0]?.userData?.map(user => (
				  `${user.firstName} ${user.lastName} 
				  <p class="span-text"> (${record?.data[0]?.employeeId}) </p>`
				)).join(', ');
		  
				return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
			  }
		},
		{
			id: 2,
			title: "Sick Leaves",
			dataIndex: "totalSickLeaves",
			key: "totalSickLeaves",
			render: (totalSickLeaves) => `${totalSickLeaves}`,
		},
		{
			id: 4,
			title: "Paid Leaves",
			dataIndex: "totalPaidLeaves",
			key: "totalPaidLeaves",
			render: (totalPaidLeaves) => `${totalPaidLeaves}`,
		},
		{
			id: 5,
			title: "UnPaid Leaves",
			dataIndex: "totalUnPaidLeaves",
			key: "totalUnPaidLeaves",
			render: (totalUnPaidLeaves) => `${totalUnPaidLeaves}`,
		},
		{
			id: 6,
			title: "Absentees",
			dataIndex: "totalAbsenties",
			key: "totalAbsenties",
			render: (totalAbsenties) => `${totalAbsenties}`,
		},
		{
			id: 7,
			title: "Half Days",
			dataIndex: `totalHalfDays`,
			key: "totalHalfDays",
			render: (totalHalfDays) => `${totalHalfDays}`
				// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
		},
		{
			id: 8,
			title: "Long Breaks",
			dataIndex: `totalLongBreaks`,
			key: "totalLongBreaks",
			render: (totalLongBreaks) => `${totalLongBreaks}`
				// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
		},
		{
			id: 9,
			title: "Late Coming",
			dataIndex: `totalLateComings`,
			key: "totalLateComings",
			render: (totalLateComings) => `${totalLateComings}`
				// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
		},
		{
			id: 10,
			title: "Action",
			dataIndex: "data",
			key: "data",
			render: (data) => (
				<button onClick={()=>{
					// dispatch(getAttendanceDataByEmail(data[0].emailId))
					navigate(`/admin/attendance/${data[0].emailId}`,{state:data})}}>
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


	function formatDate(dateString) {
		// Split the date string by '/' to get day, month, and year
		const [day, month, year] = dateString.split('/');
	  
		// Add leading zeros to day and month if necessary
		const formattedDay = day.padStart(2, '0');
		const formattedMonth = month.padStart(2, '0');
	  
		// Return the formatted date string
		return `${formattedDay}/${formattedMonth}/${year}`;
	  }
	  
	const createNewObject = (item, key, email) => {
    const newObj = {
        date: formatDate(item.Date),
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
                const email = key.trim(); // Trim the key to remove leading and trailing whitespaces
                const newObj = createNewObject(item, key, email);
                newData.push(newObj);
            }
        });
    });

    return newData;
};
	const processedData = processData(arrayData);
	    //  const CleanData=  rejectUncompleteEntry(processedData)
	    //  console.log('CleanData',CleanData)
	     const getAllDatesData = getAllDates(processedData)
		 const CleanData=  rejectUncompleteEntry(getAllDatesData)

		// console.log('CleanData',CleanData)
		if(overwriteData){
			const bulkUploadResult= dispatch(addoverwriteAttendance(CleanData))
		    setSummaryData(bulkUploadResult)
		}
		else{

			const bulkUploadResult=  dispatch(addBulkAttendance(CleanData))
			setSummaryData(bulkUploadResult)
		
		}

	  handleCancel()
	  handleOpenSecondModal()	
   }

   const rejectUncompleteEntry = (processedData) => {
	if (processedData) {
	  const groupedData = processedData?.reduce((groups, entry) => {
		const date = entry.date;
		const emailId = entry.emailId;
  
		if (!groups[date]) {
		  groups[date] = {};
		}
  
		if (!groups[date][emailId]) {
		  groups[date][emailId] = [];
		}
  
		groups[date][emailId].push(entry);
		return groups;
	  }, {});
  
	  // Filter out unwanted entries and store both filtered and excluded data
	  const { filteredData, excludedData } = Object.values(groupedData)?.reduce(
		(result, dateGroup) => {
		  Object.values(dateGroup).forEach((emailGroup) => {
			const firstStatus = emailGroup[0]?.status;
			const lastStatus = emailGroup[emailGroup.length - 1]?.status;
  
			// Check if the first and last status are equal to "In" and "Out" respectively
			// console.log('emailGroup',emailGroup)
			if ((firstStatus === 'In' && lastStatus === 'Out') || emailGroup[0].status==='Uninformed' || emailGroup[0].status==='UnApproved leave' || emailGroup[0].status=== "Weekend" || emailGroup[0].status==='Public Holiday' || emailGroup[0].status==='causalLeave' || emailGroup[0].status==='causalLeave(Paid)' || emailGroup[0].status==='causalLeave(UnPaid)' || emailGroup[0].status==='sickLeave' || emailGroup[0].status==='sickLeave(Paid)' || emailGroup[0].status==='sickLeave(UnPaid)') {
				const isValidDates = emailGroup.every(item => {
					let itemDate = moment(item.date, "MM-DD-YYYY").format("MM-DD-YYYY")
					return moment(itemDate, 'MM-DD-YYYY', true).isValid();
				})
				if (isValidDates) {
					// Include all entries for this email and date in filteredData
					result.filteredData.push(...emailGroup);
				} else {
					// Include in excludedData if any date format is not valid
					result.excludedData.push(...emailGroup);
				}
			} else {
			  // Exclude all entries for this email and date in excludedData
			  result.excludedData.push(...emailGroup);
			}
		  });
  
		  return result;
		},
		{ filteredData: [], excludedData: [] }
	  );
      //   console.log('excludedData',excludedData)
	  setExcludedDataEntries(excludedData);
	  return filteredData;
	}
  };

  const getAllDates=(data)=>{
    let rejectedDateEntries=[]
	function standardizeDateFormat(item) {
		let itemDate = moment(item.date, "MM-DD-YYYY").format("MM-DD-YYYY")
	if(moment(itemDate, 'MM-DD-YYYY', true).isValid()){
		const [month, day, year] = item.date?.split('/');
		return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
	  }
	  else {
		rejectedDateEntries.push(item)
	  } 
	}
	setExcludedDataEntries(rejectedDateEntries);
	// Find the startDate and endDate
	
	const dates = data.map(item => new Date(standardizeDateFormat(item)));
	const startDate = new Date(Math.min(...dates));
	const endDate = new Date(Math.max(...dates));
	
	// Function to get formatted date string (MM/DD/YY)
	function getFormattedDate(date) {
		const year = date.getFullYear().toString().slice(-2);
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${month}/${day}/${year}`;
	}
	
	// Create an array of all dates between startDate and endDate
	const allDates = [];
	let currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		allDates.push(getFormattedDate(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}
	
	// Group the data by emailId
	const groupedData = {};
	data.forEach(item => {
		if (!groupedData[item.emailId]) {
			groupedData[item.emailId] = [];
		}
		groupedData[item.emailId].push(standardizeDateFormat(item));
	});
	
	// Create the result array with "Absent" entries for missing dates

	const result = [];
	for (const emailId in groupedData) {
		const emailDates = groupedData[emailId];
		// console.log('emailDates',emailDates,'allDates',allDates,groupedData ,'groupedData',groupedData[emailId])
		const missingDates = allDates.filter(date => !emailDates.includes(date));
		
		missingDates.forEach(date => {
			result.push({
				date,
				status: getAbsentStatus(date,emailId),
				emailId,
				log:''
			});
		});
		//  console.log('result',result)
		result.push(...data.filter(item => item.emailId === emailId));
	}
	
	// Sort the result based on the date
	result.sort((a, b) => new Date(a.date) - new Date(b.date));
	// console.log('result',result);
	return result
  } 
  const getAbsentStatus=(date, emailId)=>{
				const dateStr = date;
			const dateObj = new Date(dateStr);
			// Get the day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
			const dayOfWeekNumber = dateObj.getDay();

			// Convert the day of the week number to a string
			const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			const CurrentDay= daysOfWeek[dayOfWeekNumber];

	  let weeklyHoliday
	  let leaveApplication

	  users.map((item)=>{
        if(item.email === emailId){
			weeklyHoliday = item.weeklyHoliday
			leaveApplication=item.leaveApplication
	    }
	  })
	//   console.log('leaveApplication',leaveApplication)
	  const formatDate = (dateString) => {
		const dateObj = new Date(dateString);
		const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
		const day = dateObj.getDate().toString().padStart(2, '0');
		const year = dateObj.getFullYear().toString().slice(-2);
		return `${month}/${day}/${year}`;
	};
	if(CurrentDay===weeklyHoliday.startDay ||  CurrentDay===weeklyHoliday.endDay){
	   return "Weekend"	
	}
	else if (publicHolidayList.list.some(item => formatDate(item.date) === date)) {
		return 'Public Holiday';
	}
	else {
        const leaveType = getLeaveTypeForDate(date, leaveApplication);
        // console.log('leaveType',leaveType,date,emailId)
        if (leaveType) {
            return leaveType;
        }    
		else {
			return "Uninformed"
		}
	}

 }
 const getLeaveTypeForDate = (date, leaveApplication) => {
    const checkDate = new Date(date);

    for (const leave of leaveApplication) {
		
			const leaveFromDate = new Date(leave.acceptLeaveFrom ? leave.acceptLeaveFrom : leave.leaveFrom);
			const leaveToDate = new Date(leave.acceptLeaveTo ? leave.acceptLeaveTo :leave.leaveTo);
			checkDate.setHours(0, 0, 0, 0)
			leaveFromDate.setHours(0, 0, 0, 0);
            leaveToDate.setHours(0, 0, 0, 0);
			
            if (checkDate >= leaveFromDate && checkDate <= leaveToDate) {
              if(leave.status ==='REJECTED' || leave.status==='PENDING'){
				return 'UnApproved leave'
			  }
			  else{
				return `${leave.leaveType}${leave.paidOrUnpaid || leave.paidOrUnpaid !== '' ?`(${leave.paidOrUnpaid})`:'' }`;
			  } 
        }
    }
    return null;
}
      const handlecsvclick=()=>{
		// console.log('list', list)
		setCSVlist(list.map((item)=>{
			return {
				  "Name":`${item.data[0]?.userData[0]?.firstName} ${item.data[0]?.userData[0]?.lastName}` ,
				  "Email ID":item.emailId,
				  "Employee Id":item.data[0]?.employeeId,
				  "Shift":item.data[0]?.shift?.name,
				  "Absenties": item.totalAbsenties?item.totalAbsenties :0,
				  "HalfDays":item.totalHalfDays? item.totalHalfDays:0,
				  "Long Breaks":item.totalLongBreaks?item.totalLongBreaks:0,
				  "Late Comings":item.totalLateComings?item.totalLateComings :0,
				  "Date":`${startdate.toDateString()} - ${enddate.toDateString()}`	  
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
					 Upload Sheet
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
			    	Upload Attendance
		    	 </CsvLinkBtn>
				   <div className="absolute w-[145px]"> {dropZoneContent}</div>
					</div>
		         <Modal title="Choose Or Drag drop file to upload" open={isModalOpen} 
			     	onCancel={handleCancel}
					 footer={customFooter}
					 className='w-[750px]'
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
					<div> 
					<a href="/Sample_file.xlsx" download="Sample_file.xlsx">Download Sample File</a>
					</div>
				      	<Form>
                          <Form.Item
										style={{ marginBottom: "10px", marginTop: "10px"}}
										label=''
										name=''
										rules={[
											{
												required: false,
												message: "Please check overwrite date",
											},
										]} 
										>
											
										 <Checkbox className="margin-auto" label="" onChange={(e)=>{
											setoverwriteData(e.target.checked)
										}}>
											Overwrite existing data entries for same date
										</Checkbox>
									</Form.Item>
									</Form>
					<Tag color="rgb(229, 246, 253)" style={{padding:'5px', marginBottom:'5px',marginTop:'5px'}} ><p className="text-[13px] text-[#014361]"><i class="bi bi-info-circle text-[#0288d1] text-[15px] mr-[3px]" ></i>  Date should be in DD-MM-YYYY </p></Tag>
					<Tag color="#fdeded" style={{padding:'5px', marginBottom:'5px',marginTop:'5px'}} >
					<p className="text-[13px] text-[#5f2120]">
				    <i class="bi bi-info-circle text-[#d32f2f] text-[15px] mr-[8px]" ></i> 
					In case of any date being left unentered between the earliest date in the sheet and the latest date <br/>in the sheet, the system will automatically classify it as follows:
					<br/><br/>
					<ul>
						 <li>-If the date corresponds to a holiday listed in the system, it will be marked as a "Holiday." </li>
						 <li>-If the date corresponds to a weekly off day as per the shift schedule, it will be marked as a "Weekly Off." </li>
						 <li>-If the date corresponds to an approved leave request then it will be marked accordingly. </li>
						 <li>-If the date does not match any of the above criteria, it will be marked as an "Unapproved Leave." </li>
						 <br/>
						 This automated classification ensures accurate tracking and management of employee <br/> schedules and absences.
					</ul>
					
                   </p>
			   </Tag>

				 </div>
					} 		  
	     		</Modal>
			     	 <AttendanceSummary
				    	summaryData={summaryData}
						excludedDataEntries={excludedDataEntries}
						refresh={refresh}
				        visible={isSecondModalVisible}
				    	onClose={() => {
							setrefresh(!refresh)
							setIsSecondModalVisible(false)}}
					       
					/> 
					<CsvLinkBtn onClick={handlecsvclick}>
						<CSVLink data={CSVlist} filename='Attendance_Summary'>
							Download CSV
						</CSVLink>
					</CsvLinkBtn>
                    
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
				// pagination={{
				// 	defaultPageSize: 30,
				// 	pageSizeOptions: [30, 40, 50, 100, 200],
				// 	showSizeChanger: true,
				// 	total:  list ?  list.length : 10,

				// 	onChange: (page, limit) => {
				// 		dispatch(
				// 			loadBulkAttendancePaginated({ page, limit })
				// 		);
				// 	},
				// }}
				columns={columnsToShow}
				dataSource={ list? list: []}
			/>
		</div>
	);
}

const GetAllAttendance = (props) => {
	const dispatch = useDispatch();
    
	const { list, loading } = useSelector((state) => state.attendance);
	const publicHolidayList = useSelector((state) => state.publicHoliday);
	const { attendanceList } =useSelector((state)=>state.attendanceList)
	const users = useSelector((state) => state.users?.list);
	const [status, setStatus] = useState("true");
    const [refresh , setrefresh] =useState(false)
	const [summaryData, setSummaryData] =useState()

	const { RangePicker } = DatePicker;

	const last30days = () => {
		const currentDate = new Date();
		const yesterday = new Date(currentDate);
		yesterday.setDate(currentDate.getDate() - 30);
		return yesterday
	  };

	const [enddate, setenddate] = useState(new Date());
	const [startdate, setstartdate] = useState(last30days());

	useEffect(() => {
	
		dispatch(loadAllbulkAttendance())
		dispatch(loadAllPublicHoliday());

		
	}, [refresh , props.load]);
  
//   useEffect(()=>{   

// 	const userMap = new Map(users.map(user => [user.email, user]));

//    const formattedList = list?.reduce((result, item) => {
//   const user = userMap.get(item.emailId);

//   if (user) {
//     const { shift , weeklyHoliday,employeeId } = user;
//     const newItem = { ...item, shift , weeklyHoliday,employeeId};

//     const existingEntry = result.find(entry => entry.emailId === item.emailId);

//     if (existingEntry) {
//       existingEntry.data.push({
//         id: newItem.id,
//         date: newItem.date,
//         status: newItem.status,
//         log: newItem.log,
//         emailId: newItem.emailId,
//         userData: newItem.userData,
//         shift: newItem.shift,
// 		weeklyHoliday:newItem.weeklyHoliday,
// 		employeeId:employeeId
//       });
//     } else {
//       result.push({
//         emailId: newItem.emailId,
//         data: [{
//           id: newItem.id,
//           date: newItem.date,
//           status: newItem.status,
//           log: newItem.log,
//           emailId: newItem.emailId,
//           userData: newItem.userData,
//           shift: newItem.shift,
// 		  weeklyHoliday:newItem.weeklyHoliday,
// 		  employeeId:employeeId
//         }],
//       });
//     }
//   }

//   return result;
// }, []);

// 	 dispatch(setAttendanceList(formattedList))   
	
//   },[users,refresh , list,setAttendanceList])
 

  const calculateLateComingAndTotalAbsentiesTime=(startdate , enddate)=>{
    //   console.log('users',users)
	const userMap = new Map(users.map(user => [user.email, user]));
    
	const formattedList = list?.reduce((result, item) => {
     const user = userMap.get(item.emailId);
 
      if (user) {
			const { shift,weeklyHoliday ,employeeId , leaveApplication} = user;
			const newItem = { ...item, shift,weeklyHoliday,employeeId,leaveApplication };
		
			const existingEntry = result.find(entry => entry.emailId === item.emailId);
				if (existingEntry) {
				  existingEntry.data.push({
					id: newItem.id,
					date: newItem.date,
					status: newItem.status,
					log: newItem.log,
					emailId: newItem.emailId,
					userData: newItem.userData,
					shift: newItem.shift,
					weeklyHoliday:newItem.weeklyHoliday,
					employeeId:employeeId
				});
				} else {
				result.push({
					emailId: newItem.emailId,
					data: [{
					id: newItem.id,
					date: newItem.date,
					status: newItem.status,
					log: newItem.log,
					emailId: newItem.emailId,
					userData: newItem.userData,
					shift: newItem.shift,
					weeklyHoliday:newItem.weeklyHoliday,
					employeeId:employeeId
					}],
					leaveApplication: leaveApplication,
				});
				}
   			}
 
  		 return result;
 		}, []);
		//  console.log('formattedList',formattedList)
    const updatedAttendanceList = formattedList?.map(entry => {

		const { emailId, data, leaveApplication } = entry;

	    //    console.log('leaveApplication',leaveApplication,'data',data)
		let totalAbsenties = 0;
		let totalLateComings = 0;
		let totalLongBreaks=0;
		let totalHalfDays = 0;
		let totalSickLeaves=0;
		let totalCausalLeaves=0;
		let totalPaidLeaves=0;
		let totalUnPaidLeaves=0;
		let totalPaidLeavesX=0
		// Create an array of all dates within the specified range, excluding Saturdays and Sundays
		
		const allDates = [];
		let currentDate = moment(startdate, 'DD/MM/YYYY');
		const endDate = moment(enddate, 'DD/MM/YYYY');
		const weeklyHolidayStartDay = data.length > 0 ? data[0].weeklyHoliday?.startDay : 0;
		const weeklyHolidayEndDay = data.length > 0 ? data[0].weeklyHoliday?.endDay : 0;
        let excludeStartDay
		let excludeEndDay 
        if(weeklyHolidayStartDay==='Sunday'){
			excludeStartDay=0
		}else  if(weeklyHolidayStartDay==='Monday' ){
			excludeStartDay=1
		} else  if(weeklyHolidayStartDay==='Tuesday' ){
			excludeStartDay=2
		} else  if(weeklyHolidayStartDay==='Wednesday'){
			excludeStartDay=3
		} else  if(weeklyHolidayStartDay==='Thursday' ){
			excludeStartDay=4
		} else  if(weeklyHolidayStartDay==='Friday' ){
			excludeStartDay=5
		}
		else  if(weeklyHolidayStartDay==='Saturday'){
			excludeStartDay=6
		}

		if(weeklyHolidayEndDay==='Sunday'){
			excludeEndDay=0
		}else  if(weeklyHolidayEndDay==='Monday' ){
			excludeEndDay=1
		} else  if(weeklyHolidayEndDay==='Tuesday' ){
			excludeEndDay=2
		} else  if(weeklyHolidayEndDay==='Wednesday'){
			excludeEndDay=3
		} else  if(weeklyHolidayEndDay==='Thursday' ){
			excludeEndDay=4
		} else  if(weeklyHolidayEndDay==='Friday' ){
			excludeEndDay=5
		}
		else  if(weeklyHolidayEndDay==='Saturday'){
			excludeEndDay=6
		}
		const publicHolidays = publicHolidayList.list.map(holiday => moment(holiday.date).format('MM/DD/YY'));
		while (currentDate.isSameOrBefore(endDate)) {
		  // Exclude Saturdays (day 6) and Sundays (day 0)

		  if (![excludeStartDay, excludeEndDay].includes(currentDate.day()) && !publicHolidays.includes(currentDate.format('MM/DD/YY'))) {
			allDates.push(currentDate.format('MM/DD/YY'));
		}
		  currentDate = currentDate.add(1, 'days');
		}


		function calculateTotalMinutes(timeString) {
			if (!timeString) {
				return 0;
			}
	
			const [hours, minutes] = timeString.split(':').map(Number);
			return hours * 60 + minutes;
		}

	          
		
		  
		   // Calculate totalUnpaidLeaves
				allDates.forEach(date => {
					const dateExists = data.some(item => item.date === date);
					if (!dateExists) {
						totalUnPaidLeaves+=1;
					}
				});
				            
				const remainingDates = allDates.filter(date => !data.some(item => item.date === date));
				data.forEach(item => {
					if (allDates.includes(item.date)) {
						// Date matches, check status
						if (item.status ==='Uninformed' || item.status==='UnApproved leave' || item.status==='sickLeave(UnPaid)' || item.status==="causalLeave(UnPaid)") {
							// Do something based on the status
							totalUnPaidLeaves+=1;
						}
					}
				});

				// Calculate totalPaidLeaves
				data.forEach(item => {
					if (allDates.includes(item.date)) {
						// Date matches, check status
						if (item.status==='sickLeave(Paid)' || item.status==="causalLeave(Paid)") {
							// Do something based on the status
							totalPaidLeaves+=1;
						}
					}
				});

				// console.log('remainingDates',remainingDates,'leaveApplication',leaveApplication) 
				remainingDates.forEach(date => {
					leaveApplication.forEach(item => {
						const leaveFrom = new Date(item.acceptLeaveFrom);
						const leaveTo = new Date(item.acceptLeaveTo);
						const currentDate = new Date(date);
						
							currentDate.setHours(0, 0, 0, 0)
							leaveFrom.setHours(0, 0, 0, 0);
							leaveTo.setHours(0, 0, 0, 0);

						if (currentDate >= leaveFrom && currentDate <= leaveTo && item.status === "ACCEPTED" && item.paidOrUnpaid==='Paid') {
							totalPaidLeaves+=1;
							totalPaidLeavesX+=1;
						}
						else if(currentDate >= leaveFrom && currentDate <= leaveTo && item.status === "ACCEPTED" && item.paidOrUnpaid==='UnPaid'){
							totalUnPaidLeaves+=1
						}

					});
				});
               


             
		    //  Calculate totalSickleaves
			
			
			data.forEach(item => {
				if (allDates.includes(item.date)) {
					// Date matches, check status
					if (item.status==='sickLeave(Paid)' || item.status==='sickLeave(UnPaid)') {
						// Do something based on the status
						totalSickLeaves+=1;
					}
				}
			});

             //    console.log('leaveApplication',leaveApplication)
			remainingDates.forEach(date => {
				leaveApplication.forEach(item => {
					const leaveFrom = new Date(item.acceptLeaveFrom);
					const leaveTo = new Date(item.acceptLeaveTo);
					const currentDate = new Date(date);
						currentDate.setHours(0, 0, 0, 0)
						leaveFrom.setHours(0, 0, 0, 0);
						leaveTo.setHours(0, 0, 0, 0);

					if (currentDate >= leaveFrom && currentDate <= leaveTo && item.status === "ACCEPTED" && item.leaveType==='sickLeave') {
						totalSickLeaves+=1;
					}
				});
			});


			// Iterate over each date in alldates array
			 allDates.forEach(date => {
				const entriesForDate = data.filter(item => moment(item.date, 'MM/DD/YY').format('MM/DD/YY') === moment(date, 'MM/DD/YY').format('MM/DD/YY'));
				// entriesForDate.sort((a, b) => moment(a.log, 'h:mm:ss A').diff(moment(b.log, 'h:mm:ss A')));
				
				let totalTimeWorked = 0;
				let totalBreakTime = 0;
				let ishalfday=false
				// console.log('entriesForDate ',entriesForDate)
				let breakDuration=0
                // logic for reset StartTime and endTime
				const updatedEntries = entriesForDate.map((entry, index, array) => {
					const shiftStartTime = moment(data[0]?.shift?.startTime).format('h:mm:ss A');
					const formattedStartTime=moment(shiftStartTime,'h:mm:ss A');
					const shiftEndTime = moment(data[0]?.shift?.endTime).format('h:mm:ss A');
					const formattedEndTime=moment(shiftEndTime,'h:mm:ss A');
					const outGraceTime = moment.duration(data[0]?.shift?.outgraceTime, 'minutes');
					const inGraceTime = moment.duration(data[0]?.shift?.outgraceTime, 'minutes');
					const logTime = moment(entry.log, 'h:mm:ss A');
				
					if (index === 0 && logTime.isBefore(formattedStartTime)) {
						// Update the log time to the shift's start time
						 if(data[0]?.shift?.graceTimeCheckbox && logTime.isAfter(formattedStartTime.add(inGraceTime))){
							ishalfday=true
						   }
						return { ...entry, log: formattedStartTime.format('h:mm:ss A') };
					}
					if (index === array.length - 1 && logTime.isAfter(formattedEndTime.add(outGraceTime))) {
						// Update the log time to the shift's end time + out grace time
						return { ...entry, log: formattedEndTime.add(outGraceTime).format('h:mm:ss A') };
					}
					return entry;
				});
				
			//    console.log('updatedEntries ',updatedEntries)
				// Iterate over entries to calculate total time worked and break time
				for (let index = 0; index < updatedEntries.length; index++) {
					const entry = updatedEntries[index];
					const logTime = moment(entry.log, 'h:mm:ss A');
			
					if (entry.status === 'In' && index < updatedEntries.length - 1) {
						const nextEntry = updatedEntries[index + 1];
			
						if (nextEntry.status === 'Out') {
							const outTime = moment(nextEntry.log, 'h:mm:ss A');
							const duration = moment.duration(outTime.diff(logTime));
							// console.log('duration.asMinutes()',duration.asMinutes())
							totalTimeWorked += duration.asMinutes();
						}
					} 
					// console.log('totalTimeWorked',totalTimeWorked)
					// Add break time if the entry has a breakTime defined
					const breakTime = calculateTotalMinutes(entry?.shift?.breakTime);
					totalBreakTime += breakTime;
				}
			
				const shiftbreakTime = parseInt(data[0]?.shift?.breakTime);
				const graceTime =data[0]?.shift ? data[0]?.shift?.ingraceTime:""
				// const graceTimeMinutes = graceTime.minute();
				const shiftWorkhours = updatedEntries[0]?.shift ? data[0]?.shift?.workHour : 0;
				const formattedShiftworkHours = parseInt(shiftWorkhours) - shiftbreakTime;
				const totalShiftworkMinutes = formattedShiftworkHours - parseInt(graceTime);
			  
				

				let loopLength = (updatedEntries.length - 2)/2
				let i=0
				let index=1
				let indextwo=2
				while(i < loopLength){
					const entry = updatedEntries[index];
					const logTimeIn = moment(entry.log, 'h:mm:ss A');
					const logTimeOut = moment(updatedEntries[indextwo].log, 'h:mm:ss A');
					const duration = moment.duration(logTimeOut.diff(logTimeIn));
					breakDuration += duration.asMinutes();	
					index =index +2
					indextwo =indextwo+2
					i=i+1
				}

			    // console.log('data[0]?.shift?.breakTimeCheckbox',data[0]?.shift?.breakTimeCheckbox , 'breakDuration',breakDuration,'shiftbreakTime',shiftbreakTime)
				if((data[0]?.shift?.breakTimeCheckbox && (breakDuration > shiftbreakTime))){
					totalHalfDays +=1
				 }
				
				// Compare total time worked with total shift work minutes
				else if ((totalTimeWorked < totalShiftworkMinutes) && !ishalfday ) {
					// If yes, increment totalHalfDays
					totalHalfDays += 1;
				}

			//   console.log('totalTimeWorked',totalTimeWorked,'totalShiftworkMinutes',totalShiftworkMinutes,entriesForDate)
			});
			
		  
			allDates.forEach(date => {
				const entriesForDate = data.filter(item => moment(item.date, 'MM/DD/YY').format('MM/DD/YY') === moment(date, 'MM/DD/YY').format('MM/DD/YY'));
				let breakDuration=0


                // logic for reset StartTime and endTime
				const updatedEntries = entriesForDate.map((entry, index, array) => {
					const shiftStartTime = moment(data[0]?.shift?.startTime).format('h:mm:ss A');
					const formattedStartTime=moment(shiftStartTime,'h:mm:ss A');
					const shiftEndTime = moment(data[0]?.shift?.endTime).format('h:mm:ss A');
					const formattedEndTime=moment(shiftEndTime,'h:mm:ss A');
					const outGraceTime = moment.duration(data[0]?.shift?.outgraceTime, 'minutes');
				
					const logTime = moment(entry.log, 'h:mm:ss A');
				
					if (index === 0 && logTime.isBefore(formattedStartTime)) {
						// Update the log time to the shift's start time
						return { ...entry, log: formattedStartTime.format('h:mm:ss A') };
					}
					if (index === array.length - 1 && logTime.isAfter(formattedEndTime.add(outGraceTime))) {
						// Update the log time to the shift's end time + out grace time
						return { ...entry, log: formattedEndTime.add(outGraceTime).format('h:mm:ss A') };
					}
					return entry;
				});



				// Ignore the first and last entries
				let loopLength = (updatedEntries.length - 2)/2
				let i=0
				let index=1
				let indextwo=2
				while(i < loopLength){
					const entry = updatedEntries[index];
					const logTimeIn = moment(entry.log, 'h:mm:ss A');
					const logTimeOut = moment(updatedEntries[indextwo].log, 'h:mm:ss A');
					const duration = moment.duration(logTimeOut.diff(logTimeIn));
					breakDuration += duration.asMinutes();	
					index =index +2
					indextwo =indextwo+2
					i=i+1
				}

				// console.log('breakDuration',breakDuration,entriesForDate,'loopLength',loopLength)
				const shiftbreakTime = parseInt(data[0]?.shift?.breakTime);
				const shiftbreakTimeMinutes = shiftbreakTime
			    // console.log('shiftbreakTimeMinutes',shiftbreakTimeMinutes)
	
				 if (breakDuration > shiftbreakTimeMinutes) {
				   // If break time exceeds the threshold, increment totalLongBreaks
				   totalLongBreaks += 1;
			   }
			});
		// Check each date in the range
		// console.log('allDates',allDates)
	
		allDates.forEach(date => {
			const inEntry = data.find(item =>
				{  
                   return (moment(item.date, 'MM/DD/YY').isSame(date, 'day') && item.status === 'In')
				}
				
			);
		    // console.log('inEntry',inEntry, 'data',data,'allDates',allDates)
	
		  if (inEntry) {
			const shiftStartTime = moment(inEntry.shift ? inEntry.shift.startTime: '').format('h:mm:ss A')
            const graceTime = inEntry.shift ? parseInt(inEntry.shift.ingraceTime):'' 
			// const graceTimeMinutes = graceTime.minute();
			const formatedStarttime = moment(shiftStartTime,'h:mm:ss A');
			const formatedStartWithGrace = formatedStarttime.clone().add('minute',parseInt(graceTime))
			const logTime = moment(inEntry.log, 'h:mm:ss A');
			// console.log('logTimelogTime',logTime,'formatedStartWithGrace',formatedStartWithGrace)
			if (logTime.isAfter(formatedStartWithGrace)) {
				 // If yes, increment totalLateComings
				 totalLateComings += 1;
			}
		  } else {
			    // If no data for the date, increment totalAbsenties
			    totalAbsenties += 1;
		  }
		})
		totalUnPaidLeaves = totalUnPaidLeaves - totalPaidLeavesX
		// Return a new object with the existing properties, totalAbsenties, and totalLateComings
		return { emailId, data, totalAbsenties, totalLateComings, totalSickLeaves, totalCausalLeaves, totalHalfDays , totalLongBreaks, totalPaidLeaves, totalUnPaidLeaves };
	  });
	  
	//   console.log('updatedAttendanceList',updatedAttendanceList);
	  dispatch(setAttendanceList(updatedAttendanceList))
  }

  const calculateTotalHours = (shiftBreakTime) => {
	if (shiftBreakTime?.includes("-")) {
	  // Format: "02:01:00-13:02:00"
	  const [startTime, endTime] = shiftBreakTime?.split("-").map((time) => {
		const [hours, minutes, seconds] = time.split(":").map(Number);
		return hours + minutes / 60 + seconds / 3600;
	  });
	  return endTime - startTime;
	} else {
	  // Format: "01:00:00"
	  const [hours, minutes, seconds] = shiftBreakTime?.split(":").map(Number);
	  return hours + minutes / 60 + seconds / 3600;
	}
  };
  useEffect(()=>{

	const startDateObj = moment(startdate, 'DD-MM-YYYY');
	const endDateObj = moment(enddate,'DD-MM-YYYY');
	const newStartDate = startDateObj.format('DD/MM/YYYY');
	const newEndDate = endDateObj.format('DD/MM/YYYY');

    console.log('newStartDate',newStartDate,'newEndDate',newEndDate)
	// calculateTotalAbsenties(newStartDate , newEndDate) 
	calculateLateComingAndTotalAbsentiesTime(newStartDate,newEndDate)


  },[startdate,enddate,list,users])

	const onCalendarChange = _debounce((dates) => {
		if (dates) {
			const startDateObj = moment(dates[0], 'DD-MM-YYYY');
			const endDateObj = moment(dates[1],'DD-MM-YYYY');
			const newStartDate = startDateObj.format('DD/MM/YYYY');
			const newEndDate = endDateObj.format('DD/MM/YYYY');
			// calculateTotalAbsenties(newStartDate,newEndDate) 
			calculateLateComingAndTotalAbsentiesTime(newStartDate,newEndDate)
		  }
	},300)

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
						<TableHeraderh2>Attendance Summary</TableHeraderh2>
						<div className='flex justify-end'>
						<RangePicker
						onChange={onCalendarChange}
						defaultValue={[
							moment(startdate, 'DD/MM/YYYY'),
							moment(enddate, 'DD/MM/YYYY'),
						]}
						format="DD-MM-YYYY"
						className="range-picker mr-3"
						style={{ maxWidth: '400px' }}
						/>
							{/* <VioletLinkBtn>
								<button onClick={onClickSearch}>
									<BtnSearchSvg size={25} title={"SEARCH"} loading={loading} />
								</button>
							</VioletLinkBtn> */}
						</div>
					</div>
					{/*TODO : ADD TOTAL AMOUNT HERE */}
		             {/* {console.log('attendanceList', attendanceList)} */}
					<CustomTable
						list={attendanceList}
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
