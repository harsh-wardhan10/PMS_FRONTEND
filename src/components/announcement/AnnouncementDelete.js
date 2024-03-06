import React, { useState } from "react";
import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
import { useDispatch } from "react-redux";
import {
	deleteAnnouncement,
	loadAllAnnouncement,
} from "../../redux/rtk/features/announcement/announcementSlice";
import { Button, Modal } from "antd";

const AnnouncementDelete = ({ id }) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const [deletePopup, setDeletePopup] = useState(false)

	const onDelete = async () => {
		setLoading(true);
		try {
			const resp = await dispatch(deleteAnnouncement(id));
			if (resp.payload.message === "success") {
				dispatch(loadAllAnnouncement());
				setLoading(false);
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.log(error.message);
			setLoading(false);
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
		<button
			type='primary'
			onClick={(()=>{setDeletePopup(true)})}
			className={`mr-3 ml-2 ${loading ? "animate-spin" : ""}`}>
			<BtnDeleteSvg size={20} />
		</button>
					<Modal
					className="Delete_modal"
				title='Delete Confirmation'
				open={deletePopup}
				onCancel={handleDeletePopup}
				footer={deleteFooter}>
					<div> 
						<p className="text-[14px]"> This will permanently delete the selected option .This action is irreversible Are you sure you want to delete ?</p>
					</div>
			</Modal>
		</>
		
	);
};
export default AnnouncementDelete;
