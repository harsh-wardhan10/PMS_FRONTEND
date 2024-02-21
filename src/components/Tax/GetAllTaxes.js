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
import { loadAllTaxes } from "../../redux/rtk/features/tax/taxSlice";
import TaxEditPopup from "../UI/PopUp/TaxEditPopup";

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
			title: "Tax Name",
			key: "taxName",
			dataIndex: "taxName",
			render: (taxName) => taxName,
		},
		{
			id: 4,
			title: "Tax Comment",
			dataIndex: "comment",
			key: "comment",
			render: (comment) => `${comment}`
		},

		{
			id: 7,
			title: "Action",
			key: "action",
			render: (action,record) => (
                <button> 
                    <TaxEditPopup data={record}/>
                </button>
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
					<h4 className='text-2xl mb-2'> Tax List</h4>
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

						<div className='ml-2 mt-0.5'>
							<GreenLinkBtn>
								<button onClick={onAllClick}>
									<BtnAllSvg size={15} title={"ALL"} />
								</button>
							</GreenLinkBtn>
						</div>

						<div>
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
				loading={!list}
				// pagination={{
				// 	defaultPageSize: 20,
				// 	pageSizeOptions: [10, 20, 50, 100, 200],
				// 	showSizeChanger: true,
				// 	total: list ? list?.length : 100,
				// 	onChange: (page, limit) => {
				// 		dispatch(loadLeaveApplicationByStatus({ page, limit, status }));
				// 	},
				// }}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllTaxes = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.taxList.list);

	useEffect(() => {
		dispatch(loadAllTaxes());
	}, []);

	// useEffect(() => {
	//   deleteHandler(list, deletedId);
	// }, [deletedId, list]);

	return (
		<UserPrivateComponent permission={"readAll-tax"}>
			  {/* {console.log('list',list)} */}
			<div className='card card-custom'>
				<div className='card-body'>
					<CustomTable list={list} />
				</div>
			</div>
		</UserPrivateComponent>
	);
};

export default GetAllTaxes;
