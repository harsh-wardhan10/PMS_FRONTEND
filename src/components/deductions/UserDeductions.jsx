import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Tag } from "antd";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";

import dayjs from "dayjs";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import { useParams } from "react-router-dom";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadSingleReimbursementHistory } from "../../redux/rtk/features/reimbursement/reimbursement";
import { loadSingleDeductionsHistory } from "../../redux/rtk/features/deductions/deductionSlice";

function CustomTable({ list, loading }) {
	const [columnsToShow, setColumnsToShow] = useState([]);

	const columns = [
		// {
		// 	id: 1,
		// 	title: "ID",
		// 	dataIndex: "id",
		// 	key: "id",
		// },

		{
			id: 3,
			title: "Deductions Reason",
			dataIndex: "reason",
			key: "reason",
		},
		{
			id: 4,
			title: "Deductions amount",
			dataIndex: "amount",
			key: "amount",
			render: (amount) => `${amount}`,
		},
		{
			id: 5,
			title: "Deductions Date",
			dataIndex: "date",
			key: "date",
			render: (date) => dayjs(date).format("DD-MM-YYYY"),
		},
		{
			id: 6,
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				if (status === "ACCEPTED") {
					return <Tag color='green'>{status.toUpperCase()}</Tag>;
				} else if (status === "REJECTED") {
					return <Tag color='red'>{status.toUpperCase()}</Tag>;
				} else {
					return <Tag color='yellow'>{status.toUpperCase()}</Tag>;
				}
			},
		},

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

	useEffect(() => {
		setColumnsToShow(columns);
	}, []);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<div className='ant-card p-4 rounded mt-5'>
			<div className='flex my-2 justify-between'>
				<div className='w-50'>
					<h4 className='text-2xl mb-2'> My Deductions</h4>
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
				loading={loading}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const UserDeductions = (props) => {
	const { id } = useParams("id");
	const dispatch = useDispatch();
	const list = useSelector((state) => state.deductions.deductionHistory);
	const loading = useSelector((state) => state.deductions.loading);

	useEffect(() => {
		dispatch(loadSingleDeductionsHistory(id));
	}, []);

	return (
		<UserPrivateComponent permission={"readSingle-leaveApplication"}>
			<div className='card'>
				<div className='card-body'>
					<CustomTable list={list?.singleDeduction} loading={loading} />
				</div>
			</div>
		</UserPrivateComponent>
	);
};

export default UserDeductions;
