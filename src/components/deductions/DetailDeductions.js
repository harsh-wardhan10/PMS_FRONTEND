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
import ReviewReimbursementPopup from "../UI/PopUp/ReviewReimbursementPopup";
import { loadSingelDeductionsApplication } from "../../redux/rtk/features/deductions/deductionSlice";
import ReviewDeductionPopup from "../UI/PopUp/ReviewDeductionPopup";

const DetailDeductions = () => {
	const { id } = useParams("id");
	const deduction = useSelector((state) => state.deductions.deduction);
	const dispatch = useDispatch();
	const users = useSelector((state) => state.users?.list);
	useEffect(() => {
		dispatch(loadSingelDeductionsApplication(id));
		dispatch(loadAllStaff({ status: true }));
		return () => {
			dispatch(clearLeaveApplication());
		};
	}, []);
	const handleDownload = async (attachment) => {
		if (attachment) {
		  const downloadUrl = `${process.env.REACT_APP_API}/utils/deductions/uploads/${attachment}`;
	  
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
			<UserPrivateComponent permission={"readSingle-deductions"}>
				<Card className='mt-4'>
					<div className='text-center mb-4'>
						{" "}
						<h2 className='text-2xl font-semibold text-gray-600'>
                         Deduction Application #{deduction?.id}{" "}
						</h2>
					</div>
					{/* {console.log('leave',leave,'users',users)} */}
                    {/* {console.log('deduction',deduction)} */}
					{deduction ? (
						<div className='flex justify-center '>
							<ul className='list-inside list-none border-2 border-inherit rounded px-5 py-5 '>
								<ListItem>
									Name :{" "}
									<TextInside>
										{(
											deduction?.user.firstName +
											" " +
											deduction?.user.lastName
										)?.toUpperCase()}{" "}
									</TextInside>
								</ListItem>

								<ListItem>
                                Deduction Reason :{" "}
									<TextInside>{deduction.reason || "No reason"}</TextInside>
								</ListItem>
                                <ListItem>
                                Deduction Amount :{" "}
                                    {deduction.approveAmount ? 
                                    <TextInside>{deduction.approveAmount || "No Amount"}</TextInside>
                                    : <TextInside>{deduction.amount || "No Amount"}</TextInside>}
									
								</ListItem>
								<ListItem>
                                Deduction Status :{" "}
									<TextInside>
										{deduction.status === "PENDING" ? (
											<span className='text-yellow-500'>
												{deduction.status?.toUpperCase()}
											</span>
										) : deduction.status === "ACCEPTED" ? (
											<span className='text-green-500'>
												{deduction.status?.toUpperCase()}
											</span>
										) : (
											<span className='text-red-500'>
												{deduction.status?.toUpperCase()}
											</span>
										)}
									</TextInside>
								</ListItem>

								<ListItem>
                                Deduction Accepted On :{" "}
									<TextInside>
										{deduction.date
											? dayjs(deduction.date).format("DD-MM-YYYY")
											: "ON REVIEW"}
									</TextInside>
								</ListItem>

								<ListItem>
                                Deduction Accepted By :{" "}
									<TextInside className='text-green-500'>
									{deduction.approveDeductionBy ? 
										<>
										{users.map((item)=>{
                                             if(item.id === deduction.approveDeductionBy){
												return item.userName
											 } 
										} 
										 )}
										</>
										 :'ON REVIEW'}
										{/* {(deduction.acceptLeaveBy?.firstName || "ON") +
											" " +
											(deduction.acceptLeaveBy?.lastName || "REVIEW")} */}
									</TextInside>
								</ListItem>

								<ListItem>
									Review Comment :{" "}
									<TextInside>{deduction.approveComment || "No comment"}</TextInside>
								</ListItem>

								<ListItem>
									Attachment :{" "}
									<TextInside>
									<span>
										{deduction.attachment?.length> 0 ? (
											deduction?.attachment?.map((item)=>{
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
					<UserPrivateComponent permission={"update-deductions"}>
						{deduction?.status === "PENDING" && (
							<div className='flex justify-center items-center'>
								<ReviewDeductionPopup />
							</div>
						)}
						{deduction?.status === "REJECTED" && (
							<div className='flex justify-center items-center'>
								<ReviewDeductionPopup />
							</div>
						)}
						{deduction?.status === "ACCEPTED" && (
							<div className='flex justify-center items-center'>
								<ReviewDeductionPopup />
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
export default DetailDeductions;
