import { Button, Card, Modal, Popover, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";

import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
import { loadSingleDepartment } from "./departmentApis";

import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ViewBtn from "../Buttons/ViewBtn";
import DepartmentEditPopup from "../UI/PopUp/DepartmentEditPopup";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import axios from "axios";

//PopUp

const CustomTable = ({ list }) => {
	const [columnsToShow, setColumnsToShow] = useState([]);
	const [deletePopup, setDeletePopup] = useState(false)
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
			key: "firstName",
			render: ({ firstName, lastName }) => firstName + " " + lastName,
		},

		{
			id: 6,
			title: "User Name",
			dataIndex: "userName",
			key: "userName",
		},

		{
			id: 5,
			title: "Role",
			dataIndex: "role",
			key: "role",
			render: (role) => role?.name,
		},

		{
			id: 6,
			title: "Designation",
			dataIndex: "designationHistory",
			key: "designationHistory",
			render: (designationHistory) =>
				designationHistory[0]?.designation?.name || "N/A",
		},

		{
			id: 4,
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id) => (
				<UserPrivateComponent permission={"readSingle-user"}>
					<div style={{display:"flex",float:'left'}}>
						<ViewBtn path={`/admin/hr/staffs/${id}/`} />
						<a>
						{/* <BtnDeleteSvg size={20} /> */}
						</a>
					</div>
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
	const handleDeletePopup=()=>{
		setDeletePopup(false)
	}
	// const deleteFooter = (
    //     <div>
    //          <Button key="customButton" type="default" onClick={()=> {setDeletePopup(false)}}>
    //            Cancel
    //       </Button>	
    //        <Button key="customButton" 
    //        type={"primary"} 
    //        onClick={()=>{
	// 		setDeletePopup(false)
	// 		onDelete(seletedItemId)
	// 	   }}
    //        >
    //         Delete
    //       </Button>
    //     </div>
    //   );
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
				        {/* <Modal
							 className="Delete_modal"
							title='Delete Confirmation'
							open={deletePopup}
							onCancel={handleDeletePopup}
							footer={deleteFooter}>
								<div> 
									<p className="text-[14px]"> This will permanently delete the selected option .This action is irreversible .Are you sure you want to delete ?</p>
								</div>
						</Modal> */}
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

const DetailDepartment = () => {
	const { id } = useParams();
	let navigate = useNavigate();
	const [deletePopup, setDeletePopup] = useState(false)
	//dispatch
	const dispatch = useDispatch();
	const [department, setDepartment] = useState(null);
	//Delete Supplier
	const onDelete =async () => {
		try {
			const resp = await axios({
				method: "delete",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `department/${department?.id}`,
			});
			setVisible(false);
			toast.warning(`department Name : ${department.name} is removed `);
			// return navigate("/admin/dashboard");
		} catch (error) {
			console.log(error.message);
		}
	};
	// Delete Supplier PopUp
	const [visible, setVisible] = useState(false);

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
	};

	useEffect(() => {
		loadSingleDepartment(id).then((d) => setDepartment(d.data));
	}, [id]);

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
	
	const handleDeletePopup=()=>{
		setDeletePopup(false)
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

			<UserPrivateComponent permission={"readSingle-department"}>
				<Card className='mr-top mt-5'>
					{department ? (
						<Fragment key={department.id}>
							<div>
								<div className='flex justify-between '>
									<h3 className={"text-xl"}>
									 {department.name} Department
 									</h3>
									<UserPrivateComponent permission={"update-department"}>
										<div className='flex justify-end'>
											<DepartmentEditPopup data={department} />
											{/* <Popover
												className='m-2'
												content={
													<a onClick={onDelete}>
														<Button disabled={true} type='primary' danger>
															Yes Please !
														</Button>
													</a>
												}
												title='Are you sure you want to delete ?'
												trigger='click'
												visible={visible}
												onVisibleChange={handleVisibleChange}>
												<button disabled={true}>
													<BtnDeleteSvg size={30} />
												</button>
											</Popover> */}
								
											   <button onClick={()=>{setDeletePopup(true)}}>
													<BtnDeleteSvg size={30} />
												</button>
										
										</div>
									</UserPrivateComponent>
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
								<CustomTable list={department.user} />
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

export default DetailDepartment;
