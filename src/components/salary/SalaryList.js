import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Segmented, Table, Tag } from "antd";
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
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";

function CustomTable({ list }) {
	const dispatch = useDispatch();
	const [status, setStatus] = useState("true");
	const [columnsToShow, setColumnsToShow] = useState([]);

	const columns = [

		{
			id: 1,
			title: "Name",
			dataIndex: "userName",
			key: "userName",
			render: (userName, record) => {
				const htmlContent = 
				  `${record.firstName} ${record.lastName} 
				  <p class="span-text"> (${record?.employeeId ? record?.employeeId:'-'}) </p>`
		  
				return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
			  }
		},
        {
			id: 3,
			title: "TDS",
			key: "salaryHistory",
			dataIndex: "salaryHistory",
			render: (salaryHistory, record) => `${record?.salaryHistory[0]?.TDS ? record?.salaryHistory[0]?.TDS :0}` 
		},
        {
			id: 4,
			title: "PF",
			key: "salaryHistory",
			dataIndex: "salaryHistory",
			render: (salaryHistory, record) => `${record?.salaryHistory[0]?.PF ? record?.salaryHistory[0]?.PF:0}` 
		},
        {
			id: 5,
			title: "ESIC",
			key: "salaryHistory",
			dataIndex: "salaryHistory",
			render: (salaryHistory, record) => `${record?.salaryHistory[0]?.ESIC ? record?.salaryHistory[0]?.ESIC:0}` 
		},
        {
            id: 6,
            title: "Taxes",
            key: "salaryHistory",
            dataIndex: "salaryHistory",
            render: (salaryHistory, record) => {
              const htmlContent =
                record?.salaryHistory[0]?.taxes?.length > 0
                  ? record?.salaryHistory[0]?.taxes?.map((item) => {
                      return `<p> Type - ${item.taxType}, Amount-${item.amount} </p>`;
                    }).join('') // Use join to concatenate the array into a single string
                  : 0;
          
              return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
            },
          },
        {
			id: 7,
			title: "UnPaid Leaves",
			key: "leaveApplication",
			dataIndex: "leaveApplication",
			render: (leaveApplication, record) =>{
                const totalUnpaid = leaveApplication.reduce(
                    (count, item) => (item.paidOrUnpaid === 'UnPaid' ? count + 1 : count),
                    0
                  );
                  return totalUnpaid
            }  
		},
        {
			id: 8,
			title: "Deductions",
			key: "deductions",
			dataIndex: "deductions",
            render: (deductions, record) => {
                const htmlContent =
                  record?.deductions?.length > 0
                    ? record?.deductions?.map((item) => {
                        return `<p>  ${item.reason}</p>`;
                      }).join('') // Use join to concatenate the array into a single string
                    : '-';
            
                return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
              },
		},
        {
			id: 8,
			title: "Reimbursement",
			key: "reimbursements",
			dataIndex: "reimbursements",
            render: (deductions, record) => {
                const htmlContent =
                  record?.reimbursement?.length > 0
                    ? record?.reimbursement?.map((item) => {
                        return `<p>  ${item.reason}</p>`;
                      }).join('') // Use join to concatenate the array into a single string
                    : '-';
            
                return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
              },
		},

		// {
		// 	id: 7,
		// 	title: "Status",
		// 	dataIndex: "status",
		// 	key: "status",
		// 	render: (status) => {
		// 		if (status === "ACCEPTED") {
		// 			return <Tag color='green'>{status.toUpperCase()}</Tag>;
		// 		} else if (status === "REJECTED") {
		// 			return <Tag color='red'>{status.toUpperCase()}</Tag>;
		// 		} else {
		// 			return <Tag color='yellow'>{status.toUpperCase()}</Tag>;
		// 		}
		// 	},
		// },

		{
			id: 7,
			title: "Action",
			key: "action",
			render: ({ id }) => (
				<ViewBtn
					path={`/admin/reimbursement/${id}`}
					text='View'
					icon={<BtnViewSvg />}
				/>
			),
		},
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
		dispatch(loadAllReimbursementApplication());
		setStatus("all");
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<div className='ant-card p-4 rounded mt-5'>
			<div className='flex my-2 justify-between'>
				<div className='w-50'>
					<h4 className='text-2xl mb-2'> Employee List</h4>
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

						{/* <div>
							<Segmented
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
							/>
						</div> */}
					</div>
				)}
			</div>
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
				className='text-center'
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

const SalaryList = (props) => {
	const dispatch = useDispatch();
    const users = useSelector((state) => state.users?.list);

	useEffect(() => {
		dispatch(loadAllStaff({ status: true }));
	}, []);

	return (
		<UserPrivateComponent permission={"readAll-leaveApplication"}>
		   {console.log('users',users)}
			<div className='card card-custom'>
				<div className='card-body'>
					<CustomTable list={users} />
				</div>
			</div>
		</UserPrivateComponent>
	);
};

export default SalaryList;