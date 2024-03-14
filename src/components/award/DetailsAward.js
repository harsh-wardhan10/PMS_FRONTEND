import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Popover, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";
import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ViewBtn from "../Buttons/ViewBtn";
import dayjs from "dayjs";
import {
	deleteAward,
	loadSingleAward,
} from "../../redux/rtk/features/award/awardSlice";
import AwardEditPopup from "../UI/PopUp/AwardEditPopup";
import BtnLoader from "../loader/BtnLoader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import moment from "moment";
import AwardHistoryEditSinglePopup from "../UI/PopUp/AwardHistoryEditSinglePopup";

//PopUp

const CustomTable = ({ list }) => {
	const [columnsToShow, setColumnsToShow] = useState([]);
	const getMonthName=(currentCSVMonth)=>{
		switch(currentCSVMonth){
		  case 0:
			return 'January'
		  case 1:
			return "february"
		  case 2:
			return "March"
		  case 3:
			return "April"
		  case 4:
			return "May"
		  case 5:
			return "June"    
			case 6:
			  return 'July'
			case 7:
			  return "August"
			case 8:
			  return "September"
			case 9:
			  return "October"
			case 10:
			  return "November"
			case 11:
			  return "December"  
			default:
			  return "NAN"   
		  }
	  }
	const columns = [
		{
			id: 1,
			title: "ID",
			dataIndex: "id",
			key: "id",
		},

		{
			id: 2,
			title: " Name",
			key: "user",
			dataIndex: "user",
			render: (user) => user?.firstName + " " + user?.lastName,
		},

		{
			id: 6,
			title: "Awarded Month",
			dataIndex: "awardedDate",
			key: "awardedDate",
			render: (awardedDate) => `${getMonthName(moment(awardedDate).month())} ${moment(awardedDate).year()}` ,
		},

		{
			id: 5,
			title: "Comment",
			dataIndex: "comment",
			key: "comment",
		},

		{
			id: 4,
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id , record) => (
				<UserPrivateComponent permission={"readSingle-user"}>
					{/* <ViewBtn path={`/admin/hr/staffs/${id}/`} /> */}
					<AwardHistoryEditSinglePopup data={record}/>
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
				<h5 className='award-list-title text-color-2 text-xl mb-2'>
					Employee List
				</h5>

				{/* {list && (
					<div>
						<CsvLinkBtn>
							<CSVLink data={list} filename='user_award'>
								Download CSV
							</CSVLink>
						</CsvLinkBtn>
					</div>
				)} */}
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

const DetailAward = () => {
	const { id } = useParams();
	let navigate = useNavigate();
	const { award, loading } = useSelector((state) => state.award);

	//dispatch
	const dispatch = useDispatch();
	const [deletePopup, setDeletePopup] = useState(false)
	//Delete Supplier
	const onDelete = async () => {
		try {
			const resp = await dispatch(deleteAward(id));
			if (resp.payload.message === "success") {
				return navigate(-1);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		dispatch(loadSingleAward(id));
	}, []);
	const handleDeletePopup=()=>{
		setDeletePopup(false)
	}
	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
	const deleteFooter = (
        <div>
             <Button key="customButton" type="default" onClick={()=> {setDeletePopup(false)}}>
               Cancel
          </Button>	
           <Button key="customButton" 
           type={"primary"} 
           onClick={()=>{
			setDeletePopup(false)
			onDelete()
		   }}
           >
            Delete
          </Button>
        </div>
      );
	return (
		<div>
			<PageTitle title=' Back  ' />

			<UserPrivateComponent permission={"readSingle-award"}>
				<Card className='mr-top mt-5'>
					{award ? (
						<Fragment key={award.id}>
							<div>
								<div className='flex justify-between '>
									<h3 className="text-xl font-bold">
										Award Type-  {award.name}
									</h3>
									<div className='flex justify-end'>
										{/* <AwardEditPopup data={award} /> */}
										{!loading ? (
											<button className='ml-4 mr-2' onClick={()=>{setDeletePopup(true)}}>
												<BtnDeleteSvg size={30} />
											</button>
										) : (
											<BtnLoader />
										)}
									</div>
									<Modal
										className="Delete_modal"
										title='Delete Confirmation'
										open={deletePopup}
										onCancel={handleDeletePopup}
										footer={deleteFooter}>
											<div> 
												<p className="text-[14px]"> This will permanently delete the selected option .This action is irreversible. Are you sure you want to delete ?</p>
											</div>
									</Modal>
								</div>
								<CustomTable list={award?.awardHistory} />
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

export default DetailAward;
