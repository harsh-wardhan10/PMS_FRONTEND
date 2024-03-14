import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BtnEditSvg from "../Button/btnEditSvg";
import {
	loadAllAward,
	updateAward,
} from "../../../redux/rtk/features/award/awardSlice";
import { useDispatch } from "react-redux";

const DeleteItemPopup = ({deletePopup, setDeletePopup, isDeleteValue, seisDeleteValue }) => {


	const { id } = useParams("id");

	const [loader, setLoader] = useState(false);

	const showModal = () => {
		setDeletePopup(true);
	};
	const handleOk = () => {
		setDeletePopup(false);
		setLoader(false);
	};
	const handleCancel = () => {
		setDeletePopup(false);
		setLoader(false);
	};
	return (
		<>
			<button onClick={showModal}>
				<BtnEditSvg size={30} />
			</button>
            {console.log('deletePopup',deletePopup)}
			<Modal
				title='Award Edit'
				open={deletePopup}
				onOk={handleOk}
				onCancel={handleCancel}>
                     <div> 
                         <p> “This will permanently delete the selected option .This action is irreversible. Are you sure you want to delete ?“</p>
                          <button onClick={()=>seisDeleteValue(false)}> Cancel</button>
                          <button onClick={()=>{
                            seisDeleteValue(true)
                          }}> Delete</button> 
                     </div>
			</Modal>
		</>
	);
};
export default DeleteItemPopup;
