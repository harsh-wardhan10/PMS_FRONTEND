import { Card } from "antd";
import Loader from "../loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
	clearLeaveApplication,
	loadSingelLeaveApplication,
} from "../../redux/rtk/features/leave/leaveSlice";
import tw from "tailwind-styled-components";
import { useParams } from "react-router-dom";
import PageTitle from "../page-header/PageHeader";
import dayjs from "dayjs";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import { loadSingelReimbursementApplication } from "../../redux/rtk/features/reimbursement/reimbursement";
import ReviewReimbursementPopup from "../UI/PopUp/ReviewReimbursementPopup";

const DetailReimbursement = () => {
	const { id } = useParams("id");
	const reimbursement = useSelector((state) => state.reimbursement.reimbursement);
	const dispatch = useDispatch();
	const users = useSelector((state) => state.users?.list);
	useEffect(() => {
		dispatch(loadSingelReimbursementApplication(id));
		dispatch(loadAllStaff({ status: true }));
		return () => {
			dispatch(clearLeaveApplication());
		};
	}, []);
	const handleDownload = async (attachment) => {
		if (attachment) {
		  const downloadUrl = `${process.env.REACT_APP_API}/utils/leaves/uploads/${attachment}`;
	  
		  try {
			const response = await fetch(downloadUrl);
			const blob = await response.blob();
	  
			// Create an object URL for the blob
			const objectUrl = URL.createObjectURL(blob);
	  
			// Create a temporary link element
			const link = document.createElement('a');
			link.href = objectUrl;
			link.download = attachment; // Use the original filename
	  
			// Trigger a click on the link to start the download
			link.click();
	  
			// Clean up the object URL
			URL.revokeObjectURL(objectUrl);
		  } catch (error) {
			console.error('Error downloading file:', error);
		  }
		}
	  };
	return (
		<div>
			<PageTitle title='Back' />
			<UserPrivateComponent permission={"readSingle-leaveApplication"}>
				<Card className='mt-4'>
					<div className='text-center mb-4'>
						{" "}
                        {console.log('reimbursement',reimbursement)}
						<h2 className='text-2xl font-semibold text-gray-600'>
							Reimbursement Application #{reimbursement?.id}{" "}
						</h2>
					</div>
					{/* {console.log('leave',leave,'users',users)} */}
					{reimbursement ? (
						<div className='flex justify-center '>
							<ul className='list-inside list-none border-2 border-inherit rounded px-5 py-5 '>
								<ListItem>
									Name :{" "}
									<TextInside>
										{(
											reimbursement?.user.firstName +
											" " +
											reimbursement?.user.lastName
										).toUpperCase()}{" "}
									</TextInside>
								</ListItem>

								<ListItem>
                                Reimbursement Reason :{" "}
									<TextInside>{reimbursement.reason || "No reason"}</TextInside>
								</ListItem>
                                <ListItem>
                                Reimbursement Amount :{" "}
                                    {reimbursement.approveAmount ? 
                                    <TextInside>{reimbursement.approveAmount || "No Amount"}</TextInside>
                                    : <TextInside>{reimbursement.amount || "No Amount"}</TextInside>}
									
								</ListItem>
								<ListItem>
                                Reimbursement Status :{" "}
									<TextInside>
										{reimbursement.status === "PENDING" ? (
											<span className='text-yellow-500'>
												{reimbursement.status.toUpperCase()}
											</span>
										) : reimbursement.status === "ACCEPTED" ? (
											<span className='text-green-500'>
												{reimbursement.status.toUpperCase()}
											</span>
										) : (
											<span className='text-red-500'>
												{reimbursement.status.toUpperCase()}
											</span>
										)}
									</TextInside>
								</ListItem>

								<ListItem>
									Reimbursement Accepted On :{" "}
									<TextInside>
										{reimbursement.date
											? dayjs(reimbursement.date).format("DD-MM-YYYY")
											: "ON REVIEW"}
									</TextInside>
								</ListItem>

								<ListItem>
									Reimbursement Accepted By :{" "}
									<TextInside className='text-green-500'>
									{reimbursement.approveReimbursementBy ? 
										<>
										{users.map((item)=>{
                                             if(item.id === reimbursement.approveReimbursementBy){
												return item.userName
											 } 
										} 
										 )}
										</>
										 :'ON REVIEW'}
										{/* {(reimbursement.acceptLeaveBy?.firstName || "ON") +
											" " +
											(reimbursement.acceptLeaveBy?.lastName || "REVIEW")} */}
									</TextInside>
								</ListItem>

								<ListItem>
									Review Comment :{" "}
									<TextInside>{reimbursement.approveComment || "No comment"}</TextInside>
								</ListItem>

								{/* <ListItem>
									Attachment :{" "}
									<TextInside>
									<span>
										{reimbursement.attachment?.length> 0 ? (
											reimbursement?.attachment?.map((item)=>{
											  return(
												 <div>
												 	{item}	
                                                <a onClick={() => handleDownload(item)} className="text-blue-500">
											     Download
										        </a>
												 </div>
											  )})
										) : (
											"No Attachment"
										)}

										</span>
									</TextInside>
								</ListItem> */}
							</ul>
						</div>
					) : (
						<Loader />
					)}
					<UserPrivateComponent permission={"update-leaveApplication"}>
						{reimbursement?.status === "PENDING" && (
							<div className='flex justify-center items-center'>
								<ReviewReimbursementPopup />
							</div>
						)}
						{reimbursement?.status === "REJECTED" && (
							<div className='flex justify-center items-center'>
								<ReviewReimbursementPopup />
							</div>
						)}
						{reimbursement?.status === "ACCEPTED" && (
							<div className='flex justify-center items-center'>
								<ReviewReimbursementPopup />
							</div>
						)}
					</UserPrivateComponent>
				</Card>
			</UserPrivateComponent>
		</div>
	);

	// "reviewComment": null,
	// "attachment": null,
};

const ListItem = tw.li`
text-sm
text-gray-600
font-semibold
py-2
px-4
bg-gray-100
mb-1.5
rounded
w-96
flex
justify-start
`;

const TextInside = tw.p`
ml-2
text-sm
text-gray-900
`;
export default DetailReimbursement;
