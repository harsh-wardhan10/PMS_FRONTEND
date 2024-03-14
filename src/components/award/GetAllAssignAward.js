import dayjs from "dayjs";
import { useMemo, useState } from "react";
import ViewBtn from "../Buttons/ViewBtn";
import { useEffect } from "react";
import { Card, Table } from "antd";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/loader";
import { loadAllAwardHistory } from "../../redux/rtk/features/awardHistory/awardHistorySlice";
import moment from "moment";
import { loadAllAward } from "../../redux/rtk/features/award/awardSlice";

function GetAllAssignAward({ users, awardlist}) {
	const [columnsToShow, setColumnsToShow] = useState([]);
	const { list, loading } = useSelector((state) => state.award);
    const  awardHistorylist = useSelector((state) => state.awardHistory.list);
    // const  awardlist  = useSelector((state) => state.award.list);
    // const users = useSelector((state) => state.users?.list)

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
			title: "User Name",
			dataIndex: "userId",
			key: "userId",
            render:(userId) => {
                const filteredUser = users.filter(item=> item.id === userId)
                return  `${filteredUser[0]?.firstName} ${filteredUser[0]?.lastName}`
            }
		},
        {
			id: 2,
			title: "Award Type",
			dataIndex: "awardId",
			key: "awardId",
            render:(awardId) => {
                const filteredUser = awardlist.filter(item=> item.id === awardId)
                return  `${filteredUser[0]?.name}`
            }
		},
		{
			id: 3,
			title: "Description",
			dataIndex: "comment",
			key: "comment",
		},

		{
			id: 3,
			title: "Date",
			dataIndex: "awardedDate",
			key: "awardedDate",
			render: (awardedDate) => `${getMonthName(moment(awardedDate).month())} ${moment(awardedDate).year()}`,
		},
		{
			id: 4,
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id , record) => <ViewBtn path={`/admin/award/${record.awardId}/`} />,
		},
	];

	const dispatch = useDispatch();

	useEffect(() => {
		setColumnsToShow(columns);
	}, []);

	useEffect(() => {
	    dispatch(loadAllAwardHistory())
        dispatch(loadAllAward());
	}, []);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<>
			{/* <PageTitle title='Back' /> */}
			{!loading ? (
				<Card className='mt-5'>
					<div className='text-center my-2 flex justify-between'>
						<h5 className='department-list-title text-color-2 text-xl mb-2'>
							Employee List
						</h5>
                        {/* {console.log('awardHistorylist',awardHistorylist)} */}
						{/* {list && (
							<div>
								<CsvLinkBtn>
									<CSVLink
										data={list}
										className='btn btn-dark btn-sm mb-1'
										filename='awards'>
										Download CSV
									</CSVLink>
								</CsvLinkBtn>
							</div>
						)} */}
					</div>
                    {/* {console.log('awardHistorylist',awardHistorylist)} */}
				{users.length > 0 && awardlist.length>0  && 	<Table
						scroll={{ x: true }}
						loading={!awardHistorylist || loading}
						columns={columnsToShow}
						dataSource={awardHistorylist ? addKeys(awardHistorylist) : []}
					/>}
				</Card>
			) : (
				<Loader />
			)}
		</>
	);
}

export default GetAllAssignAward;
