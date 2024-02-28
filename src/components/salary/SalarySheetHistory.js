import "bootstrap-icons/font/bootstrap-icons.css";
import {  useState } from "react";
import {  Select, Table, Tag } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadLeaveApplicationByStatus } from "../../redux/rtk/features/leave/leaveSlice";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import {  getSalarySheetHistory} from "../../redux/rtk/features/salary/salaryFieldSlice";
import dayjs from "dayjs";

function CustomTable({ list }) {

	  const dispatch = useDispatch();

    const [status, setStatus] = useState("true");
    const [columnsToShow, setColumnsToShow] = useState([]);
    
    const handleDownload = async (sheetName,filename) => {

      if (filename) {

        const downloadUrl = `${process.env.REACT_APP_API}${filename}`;

        try {
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
      
        // Create an object URL for the blob
        const objectUrl = URL.createObjectURL(blob);
      
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = sheetName; // Use the original filename
      
        // Trigger a click on the link to start the download
        link.click();
      
        // Clean up the object URL
        URL.revokeObjectURL(objectUrl);
        } catch (error) {
        console.error('Error downloading file:', error);
        }
         }
      };
    const columns = [
      {
        id: 2,
        title: "User Name",
        key: "userName",
        dataIndex: "userName",
        render: (userName, record) => <div className="pointer"> 
         <a onClick={()=>handleDownload(record.sheetName,record.sheetLocation)}>{userName}</a>
        </div>,
      },
      {
        id: 3,
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt) => dayjs(createdAt).format("DD-MM-YYYY") ,
  
      },

      {
        id: 5,
        title: "Sheet Name",
        dataIndex: "sheetName",
        key: "sheetName",
        render: (sheetName) =>sheetName,
      },
      {
        id: 6,
        title: "Success",
        dataIndex: "success",
        key: "success",
        render: (success) =>success,
      },
      {
        id: 8,
        title: "Failure",
        dataIndex: "faliure",
        key: "faliure",
        render: (faliure) =>faliure,
      },
      {
        id: 6,
        title: "Fields Added",
        dataIndex: "newFieldsAdded",
        key: "newFieldsAdded",
        render: (newFieldsAdded) =>{
           if(newFieldsAdded.length>0){
            return  newFieldsAdded.map(item => item).join(', ')
           }
          else{
           return '-'
          }
          },
      },
      {
        id: 8,
        title: "Fields Removed",
        dataIndex: "existingFieldRemoved",
        key: "existingFieldRemoved",
        render: (existingFieldRemoved) =>{
          if(existingFieldRemoved.length>0){
            return  existingFieldRemoved.map(item => item.fieldName).join(', ')
          }
          else{
            return '-'
          }
        },
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
			<div className='flex my-2 justify-between'>
				<div className='w-50'>
					<h4 className='text-2xl mb-2'> Salary Sheet History</h4>
				</div>
				{list && (
					<div className='flex justify-end mr-4'>

						{/* <div className='mt-0.5'>
							<CsvLinkBtn>
								<CSVLink
									data={list}
									className='btn btn-dark btn-sm'
									style={{ marginTop: "5px" }}
									filename='leave_applications'>
									Download CSV
								</CSVLink>
							</CsvLinkBtn>
						</div> */}
                      
					</div>
				)}
			</div>
            <div className="flex justify-between pr-[17px]"> 
                    <div className="flex justify-start items-center mb-[20px]"> 
                        {/* {list && (
                            <div style={{ marginBottom: "" }}>
                                <ColVisibilityDropdown
                                    options={columns}
                                    columns={columns}
                                    columnsToShowHandler={columnsToShowHandler}
                                />
                            </div>
                        )} */}
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
          {/* {console.log('salarySheetHistory',salarySheetHistory)} */}
           <CustomTable list={salarySheetHistory}/> 
				</div>
		 </div>
		</UserPrivateComponent>
	);
};

export default SalarySheetHistory;