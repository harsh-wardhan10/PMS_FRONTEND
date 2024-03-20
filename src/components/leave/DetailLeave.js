import { Card } from "antd";
import Loader from "../loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
	clearLeaveApplication,
	loadSingelLeaveApplication,
} from "../../redux/rtk/features/leave/leaveSlice";
import tw from "tailwind-styled-components";
import { useParams } from "react-router-dom";
import PageTitle from "../page-header/PageHeader";
import dayjs from "dayjs";
import ReviewLeavePopup from "../UI/PopUp/ReviewLeavePopup";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";

const DetailLeave = () => {
	const { id } = useParams("id");
	const leave = useSelector((state) => state.leave.leave);
	const dispatch = useDispatch();
	const users = useSelector((state) => state.users?.list);
	const [loading, setloading] =useState(false)
	useEffect(() => {
		dispatch(loadSingelLeaveApplication(id));
		dispatch(loadAllStaff({ status: true }));
		return () => {
			dispatch(clearLeaveApplication());
		};
	}, [loading]);

	const handleLoading=()=>{
		setloading(!loading)
	}

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
						<h2 className='text-2xl font-semibold text-gray-600'>
							Leave Application #{leave?.id}{" "}
						</h2>
					</div>
					{/* {console.log('leave',leave,'users',users)} */}
					{leave ? (
						<div className='flex justify-center '>
							<ul className='list-inside list-none border-2 border-inherit rounded px-5 py-5 '>
								<ListItem>
									Name :{" "}
									<TextInside>
										{(
											leave?.user.firstName +
											" " +
											leave?.user.lastName
										).toUpperCase()}{" "}
									</TextInside>
								</ListItem>
								<ListItem>
									Leave Type : <TextInside>{leave.leaveType}{leave.paidOrUnpaid ? `(${leave.paidOrUnpaid})`:''}</TextInside>
								</ListItem>
								<ListItem>
									Leave From :{" "}
									<TextInside>
										{dayjs(leave.leaveFrom).format("DD-MM-YYYY")}
									</TextInside>
								</ListItem>
								<ListItem>
									Leave For :{" "}
									<TextInside>
										{leave.leaveFor}
									</TextInside>
								</ListItem>
								<ListItem>
									Leave To :{" "}
									<TextInside>
										{dayjs(leave.leaveTo).format("DD-MM-YYYY")}
									</TextInside>
								</ListItem>

								<ListItem>
									Leave Duration :{" "}
									<TextInside className='text-red-500'>
										{leave.leaveDuration} Days
									</TextInside>
								</ListItem>

								<ListItem>
									Leave Reason :{" "}
									<TextInside>{leave.reason || "No reason"}</TextInside>
								</ListItem>

								<ListItem>
									Leave Status :{" "}
									<TextInside>
										{leave.status === "PENDING" ? (
											<span className='text-yellow-500'>
												{leave.status.toUpperCase()}
											</span>
										) : leave.status === "ACCEPTED" ? (
											<span className='text-green-500'>
												{leave.status.toUpperCase()}
											</span>
										) : (
											<span className='text-red-500'>
												{leave.status.toUpperCase()}
											</span>
										)}
									</TextInside>
								</ListItem>

								<ListItem>
									Leave Accepted From :{" "}
									<TextInside>
										{leave.acceptLeaveFrom
											? dayjs(leave.acceptLeaveFrom).format("DD-MM-YYYY")
											: "ON REVIEW"}
									</TextInside>
								</ListItem>

								<ListItem>
									Leave Accepted To :{" "}
									<TextInside>
										{leave.acceptLeaveTo
											? dayjs(leave.acceptLeaveTo).format("DD-MM-YYYY")
											: "ON REVIEW"}
									</TextInside>
								</ListItem>
                               {/* {console.log('leave.acceptLeaveTo',leave.acceptLeaveTo,dayjs(leave.acceptLeaveTo).format("DD-MM-YYY"))} */}
								<ListItem>
									Leave Accepted By :{" "}
									<TextInside className='text-green-500'>
									{leave.acceptLeaveBy ? 
										<>
										{users.map((item)=>{
                                             if(item.id === leave.acceptLeaveBy){
												return item.userName
											 } 
										} 
										 )}
										</>
										 :'ON REVIEW'}
										{/* {(leave.acceptLeaveBy?.firstName || "ON") +
											" " +
											(leave.acceptLeaveBy?.lastName || "REVIEW")} */}
									</TextInside>
								</ListItem>

								<ListItem>
									Review Comment :{" "}
									<TextInside>{leave.reviewComment || "No comment"}</TextInside>
								</ListItem>

								<ListItem>
									Attachment :{" "}
									<TextInside>
									<span>
										{leave.attachment?.length> 0 ? (
											leave?.attachment?.map((item)=>{
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
								</ListItem>
							</ul>
						</div>
					) : (
						<Loader />
					)}
					<UserPrivateComponent permission={"update-leaveApplication"}>
						{leave?.status === "PENDING" && (
							<div className='flex justify-center items-center'>
								<ReviewLeavePopup handleLoading={handleLoading}/>
							</div>
						)}
						{leave?.status === "REJECTED" && (
							<div className='flex justify-center items-center'>
								<ReviewLeavePopup handleLoading={handleLoading}/>
							</div>
						)}
						{leave?.status === "ACCEPTED" && (
							<div className='flex justify-center items-center'>
								<ReviewLeavePopup handleLoading={handleLoading}/>
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
export default DetailLeave;
