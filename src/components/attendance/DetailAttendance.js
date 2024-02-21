import Loader from "../loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import tw from "tailwind-styled-components";
import { useLocation, useParams } from "react-router-dom";
import PageTitle from "../page-header/PageHeader";
import { VioletLinkBtn } from "../UI/AllLinkBtn";
import { Card, DatePicker, Segmented, Table,Divider, Radio, Tag ,Button, Modal} from "antd";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { deleteAttendanceData, getAttendanceDataByEmail, loadAllbulkAttendance, loadBulkAttendancePaginated } from "../../redux/rtk/features/attendance/attendanceSlice";
import dayjs from "dayjs";
import moment from 'moment';
import { loadAllAccount } from "../../redux/rtk/features/account/accountSlice";
import { loadAllAppSettings } from "../../redux/rtk/features/appSettings/appSettingsSlice";
import _debounce from 'lodash/debounce';

const DetailAttendance = () => {
	
	
	// let startdate = dayjs().startOf("month");
    // let enddate = dayjs().endOf("month");
	const last30days = () => {
		const currentDate = new Date();
		const yesterday = new Date(currentDate);
		yesterday.setDate(currentDate.getDate() - 30);
		return yesterday
	  };
	const [enddate, setenddate] = useState(new Date());
    const [startdate, setstartdate] = useState(last30days());
	const appSettings = useSelector((state) => state.appsetting);
    const [isfilter, setisfilter] =useState(false)
	const { id } = useParams("id");
	// const attendance = useSelector((state) => state.attendance.attendance);
	const dispatch = useDispatch();
    const singleData = useLocation()
	const [attendanceData, setAttendanceData] =useState()
	const { singleAttendanceData } = useSelector((state)=> state.attendance)
	useEffect(() => {
		// dispatch(loadSingleAttendance(id));

		// return () => {
		// 	dispatch(clearAttendance());
		// };
	    
	   const sortedDatafilter =singleAttendanceData?.data?.attendanceData
	//    console.log('sortedDatafilter',sortedDatafilter)
		dispatch(loadAllAppSettings())

             if(!isfilter){
				if (!Array.isArray(sortedDatafilter)) {
					// console.error('attendanceData is not an array:', attendanceData);
					return;
				}
			
				const sortedData = [...sortedDatafilter]?.sort((a, b) => {
					// Extract date components from the string (assuming "MM/DD/YY" format)
					const [monthA, dayA, yearA] = a.date.split('/').map(Number);
					const [monthB, dayB, yearB] = b.date.split('/').map(Number);
			
					// Create Date objects
					const dateA = new Date(yearA, monthA - 1, dayA); // Month is 0-indexed
					const dateB = new Date(yearB, monthB - 1, dayB); // Month is 0-indexed
			
					// Compare dates
					return dateA - dateB;
				});
				setAttendanceData(sortedData)
				// setisfilter(true)
			 }
	}, [singleAttendanceData]);


	useEffect(()=>{
		
		// console.log('singleAttendanceData',singleAttendanceData)

		dispatch(getAttendanceDataByEmail(singleData.state[0]?.emailId))

	},[singleData.state[0]?.emailId])
	function CustomTable({ list, total, status, setStatus, loading }) {

		const [columnsToShow, setColumnsToShow] = useState([]);
		const [CSVlist, setCSVlist]=useState([])
		const dispatch = useDispatch();
		const [select, setSelect] = useState({
			selectedRowKeys: [],
			loading: false,
		  });
		const [selectedRowKeys, setSelectedRowKeys] = useState();

		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
			  setSelectedRowKeys(selectedRowKeys);
			},
			onSelect: (record, selected, selectedRows) => {
			  const keys = selected ? [record.id] : [];
			  setSelectedRowKeys(keys);
			//   console.log('selectedRowKeys',selectedRowKeys)
			},
			onSelectAll: (selected, selectedRows, changeRows) => {
			  const keys = selected ? changeRows.map(row => row.id) : [];
			  setSelectedRowKeys(keys);
			//   console.log('selectedRowKeys',selectedRowKeys)
			},
		  };
		  const handleDeleteSelected = () => {
			// Handle delete action for selected items
			// console.log('Selected Row Keys:', selectedRowKeys);
			const filteredList = list.filter(item => selectedRowKeys.includes(item.id));
		
            // console.log('filteredList',filteredList)
			dispatch(deleteAttendanceData(filteredList))
			dispatch(loadAllbulkAttendance())
			setTimeout(()=>{
				dispatch(getAttendanceDataByEmail(singleData.state[0]?.emailId))
			}, 3000)
			
			// Dispatch action to delete selected items
		  };
		
		
		const columns = [
		   {
				title: "Date",
				dataIndex: "date",
				key: "date",
				render: (date) => `${ new Date(date).toDateString()}`,
			},
			{
				
				title: "Status",
				dataIndex: "status",
				key: "status",
				render: (status) => `${status}`,
			},
			{
				
				title: "Log",
				dataIndex: `log`,
				key: "log",
				render: (log) => `${log ? log : "-"}`
					// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
			},
			{
			
				title: "Shift",
				dataIndex: `shift`,
				key: "shift",
				render: (shift) => `${singleData.state[0]?.shift?.name}`
					// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
			}
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
	
		  const handlecsvclick=()=>{
			setCSVlist(list.map((item)=>{
				return {
					  "ID": item.id,
					  "User Name":`${item.userData[0].firstName} ${item.userData[0].lastName}`,
					  "Email Id":item?.emailId,
					  "Employee Id":item.employeeId,
					  "Company Name":appSettings.list.company_name,
					  "Date": item.date?item.date:"None",
					  "Log":item.log? item.log:'None',
					  "Status":item.status?item.status:'None',
					  "Shift":item.shift.name,
					  "Date":`${new Date(item.date).toDateString()}`	
				}
		   }))
		 }
		return (
			<div className='mt-5'>
				{list && (
					< div className="flex justify-between items-center">
					
					<div style={{ marginBottom: "30px" }}>
					<ColVisibilityDropdown
						options={columns}
						columns={columns}
						columnsToShowHandler={columnsToShowHandler}
					  />
					  </div>
					  <div className='text-center my-2 flex justify-end'>
							
					         {/* <CsvLinkBtn onClick={handleDeleteSelected}>
									Delete Selected Rows
							</CsvLinkBtn> */}
							<CsvLinkBtn onClick={handlecsvclick}>
								<CSVLink data={CSVlist} filename='Attendance_list'>
									Download CSV
								</CSVLink>
							</CsvLinkBtn>
						</div>
				 </div>
				)}
                  
				<Table
					scroll={{ x: true }}
					loading={loading}
					pagination={{
						defaultPageSize: 30,
						pageSizeOptions: [30, 40, 50, 100, 200],
						showSizeChanger: true,
						total: list ?  list.length : 10,
						// onChange: (page, limit) => {
						// 	dispatch(
						// 		loadBulkAttendancePaginated({ page, limit })
						// 	);
						// },
					}}
					// rowSelection={{
					// 	type: 'checkbox',
					// 	...rowSelection
					//   }}
					columns={columnsToShow}
					dataSource={ list?  list : []}
				/>
			</div>
		);
	}
	const { RangePicker } = DatePicker;
	const onCalendarChange = _debounce((dates) => {
		if (dates) {
		  const startDateObj = moment(dates[0], 'DD-MM-YYYY');
		  const endDateObj = moment(dates[1],'DD-MM-YYYY');
		  const newStartDate = startDateObj.format('DD/MM/YYYY');
		  const newEndDate = endDateObj.format('DD/MM/YYYY');
	
		    const filteredData = singleData.state?.filter((item) => {
				
			const itemDate = moment(item.date, 'MM/DD/YY');
			const startDateObj = moment(newStartDate, 'DD/MM/YYYY');
			const endDateObj = moment(newEndDate, 'DD/MM/YYYY');
			return (
			  itemDate.isSameOrAfter(startDateObj) && itemDate.isSameOrBefore(endDateObj)
			);
		  });
		  setisfilter(true)
		
		   setAttendanceData(filteredData);
		}
	  },300);
	  useEffect(() => {
		const filteredData = singleData.state.filter((item) => {
		  const itemDate = moment(item.date, 'MM/DD/YY');
		  const startDateObj = moment(startdate, 'DD/MM/YYYY');
		  const endDateObj = moment(enddate, 'DD/MM/YYYY');
		  return itemDate.isSameOrAfter(startDateObj) && itemDate.isSameOrBefore(endDateObj);
		});
		setAttendanceData(filteredData);
	  }, [startdate, enddate]);
	  const convertoHours=(shiftworkHour)=>{
		const workHourInMinutes = shiftworkHour;
		const hours = Math.floor(workHourInMinutes / 60);
		const minutes = workHourInMinutes % 60;

		const formattedWorkHour = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
		return formattedWorkHour
   }


	return (
		<div>
			<PageTitle title='Back' />
			<Card className='mt-4'>
				<div className='text-center mb-4'>
					{" "}
					<h2 className='text-2xl font-semibold text-gray-600'>
						Attendance Status #{singleData.state[0]?.userData[0]?.firstName} {" "} {singleData.state[0]?.userData[0]?.lastName}{" "}
					    
					</h2>
					{/* {console.log('singleData.state',singleData.state)} */}
				</div>
				   <div className="grid grid-cols-3 mb-[15px]"> 
				   <p className="text-gray-600 font-semibold"> EmailId - {singleData.state[0]?.emailId}</p>
					<p className="text-gray-600 font-semibold"> Shift - {singleData.state[0]?.shift.name}</p>
					<p className="text-gray-600 font-semibold"> Employee Id - {singleData.state[0]?.employeeId}</p>
					<p className="text-gray-600 font-semibold"> Shift Start Time  - {moment(singleData.state[0]?.shift?.startTime).format('h:mm:ss A')}</p>
					<p className="text-gray-600 font-semibold"> Shift End Time  - {moment(singleData.state[0]?.shift?.endTime).format('h:mm:ss A') }</p>
					<p className="text-gray-600 font-semibold"> Shift Work Hour  - {convertoHours(singleData.state[0]?.shift?.workHour)} hrs</p>
				   </div>
				{/* {console.log('attendanceData',attendanceData)} */}
				<div className='flex justify-end'>
					{/* {console.log('startdate',moment(startdate, 'DD/MM/YYYY') , 'enddate',moment(enddate, 'DD/MM/YYYY'))} */}
					<RangePicker
						onChange={onCalendarChange}
						defaultValue={[
							moment(startdate, 'DD/MM/YYYY'),
							moment(enddate, 'DD/MM/YYYY'),
						]}
						format="DD-MM-YYYY"
						className="range-picker mr-3"
						style={{ maxWidth: '400px', marginBottom:"10px" }}
						/>
						</div>
                {/* {console.log('singleData.state',singleData.state)} */}
				 {singleData.state?(
					<div className="">
						<ul className='list-inside list-none border-2 border-inherit rounded px-5 py-5 '>
						<CustomTable
						list={attendanceData?.map(item => {
							return { ...item, key: item.id };
						  })}
						total={100}
					/>
						</ul>
					</div>
				) : (
					<Loader />
				)}
			</Card>
		</div>
	);
};

const ListItem = tw.li`
text-sm
text-gray-600
font-semibold
py-2
px-4
bg-gray-100
mb-1.5
rounded
w-96
flex
justify-start
`;

const TextInside = tw.p`
ml-2
text-sm
text-gray-900
`;
export default DetailAttendance;
