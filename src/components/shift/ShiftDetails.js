import { Button, Card, Popover, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";
import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ViewBtn from "../Buttons/ViewBtn";
import dayjs from "dayjs";
import DepartmentEditPopup from "../UI/PopUp/DepartmentEditPopup";
import {
	deleteShift,
	loadSingleShift,
} from "../../redux/rtk/features/shift/shiftSlice";
import ShifDelete from "./shiftDelete";
import ShiftEditPopup from "../UI/PopUp/ShiftEditPopup";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import moment from "moment";

//PopUp

const CustomTable = ({ list }) => {
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
			key: "firstName",
			render: ({ firstName, lastName }) => firstName + " " + lastName,
		},

		{
			id: 6,
			title: "Email Id",
			dataIndex: "email",
			key: "email",
		},
		{
			id: 7,
			title: "Address",
			dataIndex: "country",
			key: "country",
			render: (country,record) => `${country} ,${record.state}, ${record.city}, ${record.street}`,
		},
		{
			id: 8,
			title: "Shift",
			dataIndex: "shift",
			key: "shift",
			render: (shift) => `${shift.name}`,
		},
		{
			id: 4,
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id) => (
				<UserPrivateComponent permission={"readSingle-user"}>
					<ViewBtn path={`/admin/hr/staffs/${id}/`} />
				</UserPrivateComponent>
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
		<div>
			<div className='text-center my-2 flex justify-between'>
				<h5 className='department-list-title text-color-2 text-xl mb-2'>
					Employee List
				</h5>

				{list && (
					<div>
						<CsvLinkBtn>
							<CSVLink data={list} filename='user_department'>
								Download CSV
							</CSVLink>
						</CsvLinkBtn>
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
				loading={!list}
				columns={columnsToShow}
				dataSource={addKeys(list)}
				pagination={{ pageSize: 5 }}
				scroll={{ x: 720 }}
			/>
		</div>
	);
};

const DetailShift = () => {
	const { id } = useParams();
	let navigate = useNavigate();

	//dispatch
	const dispatch = useDispatch();
	const shift = useSelector((state) => state.shift.shift);
	//Delete Supplier

	// Delete Supplier PopUp
	const [visible, setVisible] = useState(false);

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
	};

	useEffect(() => {
		dispatch(loadSingleShift(id));
	}, []);

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
   const convertoHours=(shiftworkHour)=>{
		const workHourInMinutes = shiftworkHour;
		const hours = Math.floor(workHourInMinutes / 60);
		const minutes = workHourInMinutes % 60;

		const formattedWorkHour = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
		return formattedWorkHour
   }
	return (
		<div>
			<PageTitle title=' Back  ' />
               {/* {console.log('shift',shift)} */}
			<UserPrivateComponent permission={"readSingle-shift"}>
				<Card className='mr-top mt-5'>
					{shift ? (
						<Fragment key={shift.id}>
							<div>
								<div className='flex justify-between '>
									    <h3 className={"text-xl"}>ID : {shift.id} | {shift.name} </h3>
									<div className='flex justify-end'>
										<UserPrivateComponent permission={"update-shift"}>
											<ShiftEditPopup data={shift} />
										</UserPrivateComponent>

										<UserPrivateComponent permission={"delete-shift"}>
											<ShifDelete id={id} />
										</UserPrivateComponent>
									</div>
								</div>
								<div className="grid grid-cols-3"> 
								        <div> <p> <b> Shift Start Time :</b>{moment(shift.startTime).format('h:mm:ss A')}</p></div>
										<div> <p> <b> Shift End Time : </b>{moment(shift.endTime).format('h:mm:ss A')} </p></div>
										<div> <p> <b> Shift Break Time : </b> {shift.breakTime} mins</p></div> 
										<div> <p> <b> Shift In Grace Time :</b>{shift.ingraceTime} mins</p></div>
										<div> <p> <b> Shift Out Grace Time :</b>{shift.outgraceTime} mins</p></div>
										<div> <p> <b> Shift Work Hours : </b>{convertoHours(shift.workHour)} mins</p></div>
										
								</div>
								<CustomTable list={shift.user} />
							</div>
						</Fragment>
					) : (
						<Loader />
					)}
				</Card>
			</UserPrivateComponent>
		</div>
	);
};

export default DetailShift;
