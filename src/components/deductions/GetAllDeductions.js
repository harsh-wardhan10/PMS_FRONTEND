import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { DatePicker, Segmented, Select, Table, Tag } from "antd";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { GreenLinkBtn } from "../UI/AllLinkBtn";
import BtnAllSvg from "../UI/Button/btnAllSvg";
import {
	countLeaveApplication,
	loadAllLeaveApplication,
	loadLeaveApplicationByStatus,
} from "../../redux/rtk/features/leave/leaveSlice";
import dayjs from "dayjs";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadAllReimbursementApplication, loadReimbursementByStatus } from "../../redux/rtk/features/reimbursement/reimbursement";
import { loadAllDeductionsApplication } from "../../redux/rtk/features/deductions/deductionSlice";
import moment from "moment";

function CustomTable({ list }) {
	const dispatch = useDispatch();
	const [status, setStatus] = useState("true");
	const [columnsToShow, setColumnsToShow] = useState([]);

	const columns = [
		{
			id: 1,
			title: "ID",
			dataIndex: "id",
			key: "id",
		},

		{
			id: 2,
			title: "Name",
			key: "user",
			dataIndex: "user",
			render: ({ firstName, lastName }) => firstName + " " + lastName,
		},
		{
			id: 4,
			title: "Deduction Reason",
			dataIndex: "reason",
			key: "reason",
			render: (reason) => `${reason}`
		},
        {
			id: 4,
			title: "Deduction Amount",
			dataIndex: "amount",
			key: "amount",
			render: (amount) => `${amount}`
		},
		{
			id: 5,
			title: "Deduction Date",
			dataIndex: "date",
			key: "date",
			render: (date) => dayjs(date).format("DD-MM-YYYY"),
		},

		{
			id: 7,
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				if (status === "ACCEPTED") {
					return <Tag color='green'>{status?.toUpperCase()}</Tag>;
				} else if (status === "REJECTED") {
					return <Tag color='red'>{status?.toUpperCase()}</Tag>;
				} else {
					return <Tag color='yellow'>{status?.toUpperCase()}</Tag>;
				}
			},
		},
		// {
		// 	id: 7,
		// 	title: "Action",
		// 	key: "action",
		// 	render: ({ id }) => (
		// 		<ViewBtn
		// 			path={`/admin/deductions/${id}`}
		// 			text='View'
		// 			icon={<BtnViewSvg />}
		// 		/>
		// 	),
		// },
	];
	//make a onChange function
	const onChange = (value) => {
		setStatus(value);
		dispatch(
			loadReimbursementByStatus({ page: 1, limit: 20, status: value })
		);
	};

	useEffect(() => {
		setColumnsToShow(columns);
	}, []);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const onAllClick = () => {
		dispatch(loadAllDeductionsApplication());
		setStatus("all");
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<div className='ant-card p-4 rounded mt-5'>
			<div className='flex my-2 justify-between'>
				<div className='w-50'>
					<h4 className='text-2xl mb-2'> Deductions Applications</h4>
				</div>
				{list && (
					<div className='flex justify-end mr-4'>
						<div className='mt-0.5'>
							<CsvLinkBtn>
								<CSVLink
									data={list}
									className='btn btn-dark btn-sm'
									style={{ marginTop: "5px" }}
									filename='leave_applications'>
									Download CSV
								</CSVLink>
							</CsvLinkBtn>
						</div>

						{/* <div className='ml-2 mt-0.5'>
							<GreenLinkBtn>
								<button onClick={onAllClick}>
									<BtnAllSvg size={15} title={"ALL"} />
								</button>
							</GreenLinkBtn>
						</div> */}

						<div>
							{/* <Segmented
								className='text-center rounded text-500'
								size='middle'
								defaultValue={"accepted"}
								options={[
									{
										label: (
											<span className="text-green-500">
												<i className='bi bi-person-lines-fill text-green-500'></i> Accepted
											</span>
										),
										value: "accepted",
									},
									{
										label: (
											<span className="text-yellow-500">
												<i className='bi bi-person-dash-fill text-yellow-500'></i> Pending
											</span>
										),
										value: "pending",
									},
								]}
								value={status}
								onChange={onChange}
							/> */}
						</div>
					</div>
				)}
			</div>
			{/* {list && (
				<div style={{ marginBottom: "30px" }}>
					<ColVisibilityDropdown
						options={columns}
						columns={columns}
						columnsToShowHandler={columnsToShowHandler}
					/>
				</div>
			)} */}
			<Table
				className='text-center mt-[65px]'
				scroll={{ x: true }}
				loading={!list}
				pagination={{
					defaultPageSize: 20,
					pageSizeOptions: [10, 20, 50, 100, 200],
					showSizeChanger: true,
					total: list ? list?.length : 100,
					onChange: (page, limit) => {
						dispatch(loadLeaveApplicationByStatus({ page, limit, status }));
					},
				}}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllDeductions = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.deductions.list);

	useEffect(() => {
        
		dispatch(loadAllDeductionsApplication());

	}, []);

	// useEffect(() => {
	//   deleteHandler(list, deletedId);
	// }, [deletedId, list]);
	const uniqueNamesWithIds = Array.from(
		list.reduce((map, item) => {
			const userId = item.userId;
			if (!map.has(userId)) {
				map.set(userId, {
					userId,
					name: `${item?.user?.firstName} ${item?.user?.lastName}`
				});
			}
			return map;
		}, new Map()).values()
	);

  const [userId , setuserId] =useState()
  const [filterData, setfilterData] =useState(list)
  const { Option } = Select;
  const handleSelectChange = (value) => {
	setuserId(value);
	if(value==='selectName'){
		setfilterData([])
	}
	setfilterData(list.filter(item => item.userId === value))
};
const handlemonthchange=(value)=>{
	const year = value.year(); 
	const month = value.month() + 1;
	// setcurrentMonth(month)
	// setcurrentYear(year)
 }
 const disabledDate = (current) => {
	// Disable months beyond the previous month
	return current && current > moment().endOf('month').subtract(1, 'months');
  };
const oneMonthAgo = moment().subtract(1, 'months');
	return (
		<UserPrivateComponent permission={"readAll-leaveApplication"}>
			  {/* {console.log('list',list)} */}
			  <div className="absolute z-[999] top-[157px] left-[258px]"> 
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
						<div className="absolute z-[999] top-[157px] left-[453px]"> 
				      <div className="w-[100%] ml-[15px]"> 
                          <DatePicker picker="month"  defaultValue={oneMonthAgo} onChange={handlemonthchange} disabledDate={disabledDate}/>
                      </div>
                </div>
			<div className='card card-custom'>
				<div className='card-body'>
					<CustomTable list={filterData.length>0 ? filterData :list} />
				</div>
			</div>
		</UserPrivateComponent>
	);
};

export default GetAllDeductions;
