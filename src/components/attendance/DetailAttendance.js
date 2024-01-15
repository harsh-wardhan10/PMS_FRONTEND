import Loader from "../loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import tw from "tailwind-styled-components";
import { useLocation, useParams } from "react-router-dom";
import PageTitle from "../page-header/PageHeader";
import { VioletLinkBtn } from "../UI/AllLinkBtn";
import { Card, DatePicker, Segmented, Table, Tag ,Button, Modal} from "antd";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { loadBulkAttendancePaginated } from "../../redux/rtk/features/attendance/attendanceSlice";
import dayjs from "dayjs";
import moment from 'moment';
const DetailAttendance = () => {
	
	
	let startdate = dayjs().startOf("month");
    let enddate = dayjs().endOf("month");
	const { id } = useParams("id");
	// const attendance = useSelector((state) => state.attendance.attendance);
	const dispatch = useDispatch();
    const singleData = useLocation()
	const [attendanceData, setAttendanceData] =useState()
	useEffect(() => {
		// dispatch(loadSingleAttendance(id));

		// return () => {
		// 	dispatch(clearAttendance());
		// };
		setAttendanceData(singleData.state)
	}, []);
	function CustomTable({ list, total, status, setStatus, loading }) {
		const [columnsToShow, setColumnsToShow] = useState([]);
		const [CSVlist, setCSVlist]=useState([])
		const dispatch = useDispatch();
	
		const columns = [

			{
				id: 10,
				title: "Date",
				dataIndex: "date",
				key: "date",
				render: (date) => `${ new Date(date).toDateString()}`,
			},
			{
				id: 2,
				title: "Status",
				dataIndex: "status",
				key: "status",
				render: (status) => `${status}`,
			},
			{
				id: 3,
				title: "Log",
				dataIndex: `log`,
				key: "log",
				render: (log) => `${log}`
					// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
			},
			{
				id: 4,
				title: "Email Id",
				dataIndex: `emailId`,
				key: "emailId",
				render: (emailId) => `${emailId}`
					// dayjs(street).format("DD-MM-YYYY, h:mm A") || "NONE",
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
	
		  const handlecsvclick=()=>{
			setCSVlist(list.map((item)=>{
				return {
					  "ID": item.id,
					  "Email Id":`${item?.emailId}` ,
					  "Date": item.date?item.date:"None",
					  "Log":item.log? item.log:'None',
					  "Status":item.status?item.status:'None',
				}
		   }))
		 }
		return (
			<div className='mt-5'>
				{list && (
					 <div className='text-center my-2 flex justify-end'>
						<CsvLinkBtn onClick={handlecsvclick}>
							<CSVLink data={CSVlist} filename='purchase'>
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
					pagination={{
						defaultPageSize: 30,
						pageSizeOptions: [30, 40, 50, 100, 200],
						showSizeChanger: true,
						total: list ?  list.length : 10,
						onChange: (page, limit) => {
							dispatch(
								loadBulkAttendancePaginated({ page, limit })
							);
						},
					}}
					columns={columnsToShow}
					dataSource={ list?  list : []}
				/>
			</div>
		);
	}
	const { RangePicker } = DatePicker;
	const onCalendarChange = (dates) => {
		if (dates) {

			const startDateObj = moment(dates[0]);
			const endDateObj = moment(dates[1]);
			startdate = startDateObj.format('MM/DD/YYYY');
			enddate = endDateObj.format('MM/DD/YYYY');
			const filteredData = singleData.state.filter(item => {
				const itemDate = moment(item.date, 'MM/DD/YY');
				const startDateObj = moment(startdate, 'MM/DD/YYYY');
				const endDateObj = moment(enddate, 'MM/DD/YYYY');

				return itemDate.isSameOrAfter(startDateObj) && itemDate.isSameOrBefore(endDateObj);
			});
			setAttendanceData(filteredData)
		}
	};

	return (
		<div>
			<PageTitle title='Back' />
			<Card className='mt-4'>
				<div className='text-center mb-4'>
					{" "}
					<h2 className='text-2xl font-semibold text-gray-600'>
						Attendance Status #{singleData.state[0]?.userData[0]?.firstName} {" "} {singleData.state[0]?.userData[0]?.lastName}{" "}
					</h2>
				</div>
				{/* {console.log('singleData',singleData.state)} */}
				<div className='flex justify-end'>
							<RangePicker
								onChange={onCalendarChange}
								// defaultValue={[startdate, enddate]}
								format={"DD-MM-YYYY"}
								className='range-picker mr-3'
								style={{ maxWidth: "400px" }}
							/>
						
						</div>
				{singleData.state?(
					<div className="">
						<ul className='list-inside list-none border-2 border-inherit rounded px-5 py-5 '>
						<CustomTable
						list={attendanceData}
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
