import React, { useEffect, useMemo, useState } from "react";
import ViewBtn from "../Buttons/ViewBtn";
import dayjs from "dayjs";
import { Card, DatePicker, Table, Tag } from "antd";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import PageTitle from "../page-header/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
	loadAttendanceByUserId,
	clearAttendanceList,
} from "../../redux/rtk/features/attendance/attendanceSlice";

import { useParams } from "react-router-dom";
import Loader from "../loader/loader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import moment from "moment";
import _debounce from 'lodash/debounce';
function CustomTable({ list, loading }) {
	const [columnsToShow, setColumnsToShow] = useState([]);

	const columns = [
		{
			id: 2,
			title: "Email Id",
			dataIndex: "emailId",
			key: "emailId",
			render: (emailId) => emailId,
		},

		{
			id: 4,
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => status,
		},
		{
			id: 3,
			title: "Log",
			dataIndex: "log",
			key: "log",
			render: (log) =>log,
		},
		{
			id: 6,
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: (date) => {return new Date(date).toDateString()},
		},
	];

	useEffect(() => {
		setColumnsToShow(columns);
	}, []);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr?.map((i) => ({ ...i, key: i.id }));

	return (
		<Card className='mt-5'>
			<div className='text-center my-2 flex justify-between'>
				<h5 className='department-list-title text-color-2 text-xl mb-2'>
					Attendance History
				</h5>
				{list && (
					<div>
						<CsvLinkBtn>
							<CSVLink
								data={list}
								className='btn btn-dark btn-sm mb-1'
								filename='attendance_user'>
								Download CSV
							</CSVLink>
						</CsvLinkBtn>
					</div>
				)}
			</div>
				<div style={{ marginBottom: "30px" }}>
					<ColVisibilityDropdown
						options={columns}
						columns={columns}
						columnsToShowHandler={columnsToShowHandler}
					/>
				</div>
			<Table
				scroll={{ x: true }}
				loading={loading}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
				pagination={{ pageSize: 20 }}
			/>
		</Card>
	);
}

const UserAttendance = () => {
	const { list, loading } = useSelector((state) => state.attendance);

	const [filteredData, setfilterData] = useState()

	const { id } = useParams("id");

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAttendanceByUserId(id));
		
		return () => {
			dispatch(clearAttendanceList());
		};
	}, [id]);
	
	useMemo(()=>{
		setfilterData(list)
	},[list])

	const handlemonthchange=(value)=>{

		const yearchange = value.year(); 
		const monthchange = value.month() + 1;

        setfilterData(list.filter(item => {
			// Parse the date string to extract year and month
			const [month, day, year] = item.date.split('/');
			const itemYear = parseInt(year);
			const itemMonth = parseInt(month);
			const strippedYearString = year.slice(-2);

			// console.log('itemMonth',itemMonth,'itemYear',itemYear,'strippedYearString',strippedYearString,month)
			// Check if the year and month match the current year and month
			return parseInt(itemYear) === parseInt(strippedYearString) && parseInt(itemMonth) === parseInt(monthchange);
		}))
	 }
	 const disabledDate = (current) => {
        // Disable months beyond the previous month
        return current && current > moment().endOf('month').subtract(1, 'months');
      };
	 
	return (
		<UserPrivateComponent permission='readSingle-attendance'>
			<div className="relative">
				<PageTitle title='Back' />
				{/* {console.log('list',list,'filteredData',filteredData)} */}
				<div className="w-[25%] absolute top-[170px] left-[223px] z-[99]"> 
      				<DatePicker picker="month" onChange={handlemonthchange} disabledDate={disabledDate}/>
				</div>
				{!loading ? <CustomTable list={filteredData?.length > 0? filteredData :null} loading={loading} /> : <Loader />}
			</div>
		</UserPrivateComponent>
	);
};

export default UserAttendance;
