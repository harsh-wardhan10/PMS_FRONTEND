import "bootstrap-icons/font/bootstrap-icons.css";
import {  useMemo, useState } from "react";
import {  DatePicker, Select, Table, Tag } from "antd";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { loadLeaveApplicationByStatus } from "../../redux/rtk/features/leave/leaveSlice";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import {  getSalaryHistoryRecordById, getSalarySheetHistory} from "../../redux/rtk/features/salary/salaryFieldSlice";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import moment from "moment";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import PageTitle from "../page-header/PageHeader";

function CustomTable({ parmas, list  ,employeeList}) {

	  const dispatch = useDispatch();

            const [status, setStatus] = useState("true");
            const [columnsToShow, setColumnsToShow] = useState([]);

            const columns = [
        
            {
                id: 2,
                title: "Salary Field Name",
                key: "sfName",
                dataIndex: "sfName",
                render: (sfName) => sfName,
            },
            {
                id: 3,
                title: "Salary Field Value",
                dataIndex: "sfValue",
                key: "sfValue",
                render: (sfValue) => sfValue ,
        
            },
            {
                id: 3,
                title: "User ID",
                dataIndex: "userId",
                key: "userId",
                render: (userId) => userId
                // {
                //    const filterData= employeeList.filter(item => item.id === userId)
                //    return `${filterData[0].firstName} ${filterData[0].lastName}` 
                // } ,
        
            },
            {
                id: 4,
                title: "Created At",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (createdAt) => dayjs(createdAt).format("DD-MM-YYYY"),
            },
            {
                id: 5,
                title: "Year",
                dataIndex: "year",
                key: "year",
                render: (year) =>year,
            },
            {
                id: 5,
                title: "Month",
                dataIndex: "month",
                key: "month",
                render: (month) =>month,
            },
            {
                id: 5,
                title: "Active Status",
                dataIndex: "isActive",
                key: "isActive",
                render: (isActive) =>isActive ? "True" :'False',
            },
            // {
            //     id: 7,
            //     title: "Action",
            //     key: "action",
            //     render: ({ id }) => (
            //     <ViewBtn
            //         path={`/admin/leave/${id}`}
            //         text='View'
            //         icon={<BtnViewSvg />}
            //     />
            //     ),
            // },
            ];

	useEffect(() => {
        // console.log('list', list)
    // setColumnsToShow(columns);
    if (list && list.length > 0) {

        const keys = Object.keys(list[0])
        const filteredKeys = keys.filter(key => key !== 'id'  && key !=='isActive' && key!=='updatedAt' && key !== 'salarySheetHistoryId');
        let columnstwo = filteredKeys.map(key => {
            if (key === 'userId') {
                return {
                    title: 'User Name',
                    dataIndex: 'userId',
                    key: 'userId',
                    render: userId => {
                        const filterData = employeeList?.filter(item => item.id === userId);
                        return `${filterData[0].firstName} ${filterData[0].lastName}`;
                    }
                };
            } else if(key==='createdAt'){
                   return{
                    title: 'Created At',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    render: createdAt => {
                       return dayjs(createdAt).format("DD-MM-YYYY")
                    }
                   }
            } else {
                return {
                    title: key,
                    dataIndex: key,
                    key: key
                };
            }
        });
    

       setColumnsToShow(columnstwo)
  }

	}, [list, setColumnsToShow]);   

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));
  
	return (
		<div className='ant-card p-4 rounded mt-5'>
               <PageTitle title='Back' />
			<div className='flex my-2 justify-between'>
				<div className='w-50'>
                    {/* {console.log('arrayData',arrayData)} */}
					<h4 className='text-2xl mb-2'> Salary Sheet - {parmas.name}</h4>
				</div>
				{list && (
					<div className='flex justify-end mr-4'>
						<div className='mt-0.5'>
							<CsvLinkBtn>
								<CSVLink
									data={list}
									className='btn btn-dark btn-sm'
									style={{ marginTop: "5px" }}
									filename='leave_applications'>
									Download CSV
								</CSVLink>
							</CsvLinkBtn>
						</div>
                      
					</div>
				)}
			</div>
            <div className="flex justify-between pr-[17px]"> 
                    <div className="flex justify-start items-center mb-[20px]"> 
                        {list && (
                            <div style={{ marginBottom: "" }}>
                                <ColVisibilityDropdown
                                    options={columns}
                                    columns={columns}
                                    columnsToShowHandler={columnsToShowHandler}
                                />
                                
                            </div>
                        )}
                    </div>
                 
              <div> 
            </div>
            </div>
  
      <Table
				className='text-center'
				scroll={{ x: true }}
				loading={!list}
				pagination={{
					defaultPageSize: 20,
					pageSizeOptions: [10, 20, 50, 100, 200],
					showSizeChanger: true,
					total: list ? list?.length : 100,
					onChange: (page, limit) => {
						dispatch(loadLeaveApplicationByStatus({ page, limit, status }));
					},
				}}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const SalarySheet = (props) => {

	  const dispatch = useDispatch();
      const parmas= useParams()
      const  { SalaryHistoryRecordId } =useSelector(state=> state.salaryField)
      const users = useSelector((state) => state.users?.list);
      const oneMonthAgo = moment().subtract(1, 'months');
      const [currentMonth,setcurrentMonth] = useState(oneMonthAgo.month()+1)
      const [currentYear ,setcurrentYear] =useState(oneMonthAgo.year())

      useEffect(() => {

        dispatch(loadAllStaff({ status: true }));
        dispatch(getSalaryHistoryRecordById(parseInt(parmas.id)))

      }, []);

      const transformedRecords = useMemo(() => {
        return Object.values(SalaryHistoryRecordId.reduce((acc, record) => {
            const { userId, sfName, sfValue, ...rest } = record;
            acc[userId] = acc[userId] || { userId, ...rest };
            acc[userId][sfName] = sfValue;
            return acc;
        }, {}));
    }, [SalaryHistoryRecordId]);
     
      const disabledDate = (current) => {
          // Disable months beyond the previous month
          return current && current > moment().endOf('month').subtract(1, 'months');
        };
        const handlemonthchange=(value)=>{
          const year = value.year(); 
          const month = value.month() + 1;
          setcurrentMonth(month)
          setcurrentYear(year)
     
       }
	return (
		<UserPrivateComponent permission={"readAll-leaveApplication"}>
	 		<div className='card card-custom'>
				<div className='card-body relative'>
                    {/* {console.log('SalaryHistoryRecordId',SalaryHistoryRecordId,'transformedRecords',transformedRecords)} */}
                    {/* <div className="w-[20%] ml-[15px] absolute z-[999] top-[146px] left-[201px]"> 
                          <DatePicker picker="month" defaultValue={oneMonthAgo} onChange={handlemonthchange} disabledDate={disabledDate}/>
                      </div> */}
                          <CustomTable parmas={parmas} list={transformedRecords} employeeList={users}/> 
				</div>
			</div>
		</UserPrivateComponent>
	);
};

export default SalarySheet;