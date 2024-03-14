import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Popover } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	clearDesignation,
	deleteDesignation,
	loadAllDesignationByEmployee,
	loadAllEmployeeByDesignationId,
	loadSingleDesignation,
} from "../../redux/rtk/features/designation/designationSlice";
import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";
import UserListCard from "./List/UserListCard";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
//PopUp

const DetailDesignation = () => {
	const { id } = useParams();
	let navigate = useNavigate();
	const [deletePopup, setDeletePopup] = useState(false)
	//dispatch
	const dispatch = useDispatch();
	const { designation, loading } = useSelector((state) => state.designations);
    const employeeList = useSelector(state => state.designations.employeeList)
	//Delete Supplier
	const onDelete = () => {
		try {

			dispatch(deleteDesignation(id));
			setVisible(false);
			toast.warning(`Designation : ${designation.name} is removed `);
			return navigate("/admin/designation");
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
		dispatch(loadSingleDesignation(id));
		dispatch(loadAllDesignationByEmployee())
		// dispatch(loadAllEmployeeByDesignationId(id))
		return () => {
			dispatch(clearDesignation());
		};
	}, []);

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
			<PageTitle title=' Back ' subtitle=' ' />
               {/* {console.log('employeeList',employeeList)} */}
			<div className='mr-top'>
				<UserPrivateComponent permission={"readSingle-designation"}>
					{designation ? (
						<Fragment key={designation.id}>
							<Card bordered={false} style={{}}>
								<div className='flex justify-between items-center' style={{ padding: 0 ,marginBottom:"20px"}}>
									<div className='w-50'>
										<h2 className="text-[15px] font-bold">
											Employee List
										</h2>
									</div>
									<div className='text-end w-50 flex items-center'>
										<UserPrivateComponent permission={"update-designation"}>
											<Link
												className='mr-3 d-inline-block'
												to={`/admin/designation/${designation.designationId}/update`}
												state={{ data: designation }}>
												<Button
													type='primary'
													shape='round'
													icon={<EditOutlined />}></Button>
											</Link>
										</UserPrivateComponent>
										<UserPrivateComponent permission={"delete-designation"}>
									
											<button onClick={()=>{setDeletePopup(true)}}>
													<BtnDeleteSvg size={30} />
												</button>
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
								</div>
                                          {/* {console.log('designation',designation)} */}
								<UserListCard list={designation.employee} loading={loading} />
							</Card>
						</Fragment>
					) : (
						<Loader />
					)}
				</UserPrivateComponent>
			</div>
		</div>
	);
};

export default DetailDesignation;
