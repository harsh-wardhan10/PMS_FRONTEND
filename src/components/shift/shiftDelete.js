import { Button, Modal, Popconfirm } from "antd";
import React, { useState } from "react";
import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
import { useDispatch, useSelector } from "react-redux";
import { deleteShift } from "../../redux/rtk/features/shift/shiftSlice";
import { useNavigate } from "react-router-dom";
const ShifDelete = ({ id }) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const { loading } = useSelector((state) => state.shift);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [deletePopup, setDeletePopup] = useState(false)
	const onDelete = () => {
		try {
			dispatch(deleteShift(id));
			navigate("/admin/shift");
		} catch (error) {
			console.log(error.message);
		}
	};
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
		<>
			<button type='primary' onClick={()=>{setDeletePopup(true)}} className='mr-3 ml-2'>
			<BtnDeleteSvg size={25} />
		    </button>
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
		</>
	
	);
};
export default ShifDelete;
