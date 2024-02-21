import "bootstrap-icons/font/bootstrap-icons.css";
import {  useState } from "react";
import {  Select, Table, Tag } from "antd";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { loadLeaveApplicationByStatus } from "../../redux/rtk/features/leave/leaveSlice";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import {  getSalarySheetHistory} from "../../redux/rtk/features/salary/salaryFieldSlice";
import dayjs from "dayjs";

function CustomTable({ list  }) {

	  const dispatch = useDispatch();

    const [status, setStatus] = useState("true");
    const [columnsToShow, setColumnsToShow] = useState([]);
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
        key: "userName",
        dataIndex: "userName",
        render: (userName) => userName,
      },
      {
        id: 3,
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt) => dayjs(createdAt).format("DD-MM-YYYY") ,
  
      },
      {
        id: 4,
        title: "Updated At",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (updatedAt) => dayjs(updatedAt).format("DD-MM-YYYY"),
      },
      {
        id: 5,
        title: "Sheet Name",
        dataIndex: "sheetName",
        key: "sheetName",
        render: (sheetName) =>sheetName,
      },
      {
        id: 7,
        title: "Action",
        key: "action",
        render: ({ id }, record) => (
          <ViewBtn
            path={`/admin/salary/sheet/history/${id}/${encodeURIComponent(record.sheetName)}`}
            text='View'
            icon={<BtnViewSvg />}
          />
        ),
      },
    ];
	useEffect(() => {
  
    setColumnsToShow(columns);

	}, [list, setColumnsToShow]);   

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};



	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));


	return (
		<div className='ant-card p-4 rounded mt-5'>
      {/* <PageTitle title='Back' /> */}
			<div className='flex my-2 justify-between'>
				<div className='w-50'>
                    {/* {console.log('arrayData',arrayData)} */}
					<h4 className='text-2xl mb-2'> Salary Sheet History</h4>
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

const SalarySheetHistory = (props) => {
	  const dispatch = useDispatch();
    const  { salarySheetHistory } =useSelector(state=> state.salaryField)
      
      useEffect(() => {
        dispatch(getSalarySheetHistory())
      }, []);

	return (
		<UserPrivateComponent permission={"readAll-leaveApplication"}>
			<div className='card card-custom'>
				<div className='card-body relative'>
           <CustomTable list={salarySheetHistory}/> 
				</div>
		 </div>
		</UserPrivateComponent>
	);
};

export default SalarySheetHistory;