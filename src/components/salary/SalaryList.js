import "bootstrap-icons/font/bootstrap-icons.css";
import { useCallback, useMemo, useState } from "react";
import { Button, Checkbox, DatePicker, Form, Modal, Popover, Segmented, Select, Table, Tag, Tooltip } from "antd";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import BtnAllSvg from "../UI/Button/btnAllSvg";
import {
	loadLeaveApplicationByStatus,
} from "../../redux/rtk/features/leave/leaveSlice";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { loadAllReimbursementApplication, loadReimbursementByStatus, loadSingelReimbursementApplication, loadSingleReimbursementHistory } from "../../redux/rtk/features/reimbursement/reimbursement";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import moment from "moment";
import { useRef } from "react";
import Papa, { unparse } from 'papaparse';
import * as XLSX  from 'xlsx';
import { loadAllDeductionsApplication, loadSingelDeductionsApplication, loadSingleDeductionsHistory } from "../../redux/rtk/features/deductions/deductionSlice";
import { UploadSalaryHistoryRecords, createSalaryHistoryRecord, createSalarySheetHistory, getSalaryHistoryRecord, getinitialSalaryHistoryRecord, loadAllBulkSalaryFields, updateSalaryFields, updateSalarySheetHistory, uploadSalarySheetFile } from "../../redux/rtk/features/salary/salaryFieldSlice";
import TotalPayableDays from "../../utils/TotalPayableDays";
import { getAttendanceDataByEmail, loadAllbulkAttendance } from "../../redux/rtk/features/attendance/attendanceSlice";
import { loadAllPublicHoliday } from "../../redux/rtk/features/publicHoliday/publicHolidaySlice";
import { useNavigate } from "react-router-dom";
import SalarySheetHistory from "./SalarySheetHistory";
import dayjs from "dayjs";
import ExcelJS from 'exceljs';


function CustomTable({ list , setcurrentYear , setcurrentMonth, employeeList }) {

	  const dispatch = useDispatch();
    const navigate = useNavigate()
    const [status, setStatus] = useState("true");
    const [columnsToShow, setColumnsToShow] = useState([]);
    const { Option } = Select;
    const [currentCSVMonth, setcurrentCSVMonth] =useState()
    const [currentCSVYear , setcurrentCSVYear] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [overwriteData, setoverwriteData] =useState(false)
    const [arrayData, setarrayData] = useState([])
    const [isUpload, setisUpload]=  useState(false)
    const [sampleFileDownload, setsamplefileDownload] =useState(false)
    const [sampleFiledisabled,setsamplefiledisabled] =useState(true)
 
    const  reimbursementList  = useSelector(state=> state.reimbursement.list)
    const deductionsList =useSelector(state=> state.deductions.list)
    const salaryFieldList =useSelector(state=> state.salaryField.list)
    // const { salaryFileLocation }  = useSelector(state=> state.salaryField)
    const [updatedCSVList, setupdatedCSVList] =useState()
    const [updatedSalaryHistoryList, setupdatedSalaryHistoryList] = useState()
    const [UploadCSvMsg, setUploadCSVMsg]=useState()
    const [UploadCSvwarningMsg, setUploadCSvwarningMsg]=useState()
    const [uploadextraFieldsMsg, setuploadextraFieldsMsg] =useState()
    const [monthlySalaryErrorMsg, setmonthlySalaryErrorMsg] =useState()
    const oneMonthAgo = moment().subtract(1, 'months');
    const attendancelist = useSelector((state) => state.attendance.list);
    const publicHolidayList = useSelector((state) => state.publicHoliday);
    const [sheetName, setsheetName] = useState()
    const [showFooter, setshowFooter] =useState(false) 
    const [seletedSalaryFile ,setSelectedSalaryFile] = useState()
    const [CSVlist, setCSVlist]=useState([])
    let finalContent ='No Reimbursement'
    let finalContentTwo='No Deductions'
    // const salaryHistoryRecordData = useSelector(state=> state.salaryField.salaryHistoryRecord)
    const reimbursementlist = useSelector((state) => state.reimbursement.list);
    const deductionslist = useSelector((state) => state.deductions.list);
    const showModal = () => {
        setIsModalOpen(true);
      };

      const [dropZone, setDropZone] = useState(false);
      const [dropZoneContent, setDropZoneContent] = useState('');
     useEffect(()=>{
        dispatch(loadAllReimbursementApplication())
        dispatch(loadAllDeductionsApplication())
     },[])

      const handleToolTipContent =  (Reimbursement, record) => {
        
            let tooltipContent = '';
             const filteredData= reimbursementlist.filter(item => item.userId ===record.id)

             if(filteredData.length>0){

                  tooltipContent= filteredData.map((item, index)=>{

                              const oneMonthAgoMonth = oneMonthAgo.month()+1; 
                              const oneMonthAgoYear =  oneMonthAgo.year(); 
                              const acceptDateMonth = moment(item.acceptDate).month() + 1;    
                              const acceptDateYear = moment(item.acceptDate).year();
                        //  console.log('acceptDateYear',acceptDateYear,'acceptDateMonth',acceptDateMonth,'oneMonthAgoYear',oneMonthAgoYear,'oneMonthAgoMonth',oneMonthAgoMonth)
                        //  console.log('item', item)
                        if(item.status==='ACCEPTED' && (acceptDateMonth === oneMonthAgoMonth && acceptDateYear === oneMonthAgoYear)){
                          return `<div key={index}>
                                    <span> ${dayjs(item.acceptDate).format('DD/MM/YYYY')} -</span>
                                    <span> ₹ ${item.approveAmount}</span>
                                   </div>`
                            // `Amount ${item.approveAmount} on ${dayjs(item.acceptDate)}`;
                        }
                  }).join('');
                  finalContent=tooltipContent
             }
             else{
              finalContent="No Reimbursement"
             }
               return finalContent
    }

    const handleToolTipContentDeduction =(deductions, record)=>{
    
      let tooltipContent = '';
      
      const filteredData= deductionslist.filter(item => item.userId ===record.id)

      if(filteredData.length>0){

           tooltipContent= filteredData.map((item,index)=>{

                       const oneMonthAgoMonth = oneMonthAgo.month()+1; 
                       const oneMonthAgoYear =  oneMonthAgo.year(); 
                       const acceptDateMonth = moment(item.date).month() + 1;    
                       const acceptDateYear = moment(item.date).year();
                 //  console.log('acceptDateYear',acceptDateYear,'acceptDateMonth',acceptDateMonth,'oneMonthAgoYear',oneMonthAgoYear,'oneMonthAgoMonth',oneMonthAgoMonth)
                  // console.log('item', item)
                 if(item.status==='ACCEPTED' && (acceptDateMonth === oneMonthAgoMonth && acceptDateYear === oneMonthAgoYear)){
                   return `<div key={index}>
                            <span>${dayjs(item.date).format('DD/MM/YYYY')} -</span>
                            <span>   ₹ ${item.approveAmount}</span>
                          </div>`
                //  `Amount ${item.approveAmount} on ${dayjs(item.date)}`;
                 }
           }).join('');
           finalContentTwo=tooltipContent
      }
      else{
        finalContentTwo="No Deductions"
      }

         return finalContentTwo
    }
	  useEffect(() => {

       if (list && list.length > 0) {

              const keys = Object.keys(list[0])
              const filteredKeys = keys.filter(key => key !== 'id');
              
              let columnstwo = filteredKeys.map(key => {

                 if(key ==='userName'){
                  return {
                    title: 'User Name',
                    dataIndex: 'userName',
                    key: 'userName',
                    render: (userName, record) => {
                        return <div className="pointer" onClick={()=>{ navigate(`/admin/hr/staffs/${record.id}`)}}> 
                                     {userName}
                                  </div>
                    }
                };
                 }
                 else if (key === 'Reimbursement') {
                    return {
                        title: 'Reimbursement',
                        dataIndex: 'Reimbursement',
                        key: 'Reimbursement',
                        render: (Reimbursement, record) => {
                            return <Tooltip title={()=>{
                                const tooltipContent=handleToolTipContent(Reimbursement, record)
                              return <span dangerouslySetInnerHTML={{ __html: tooltipContent }} />
                            }}>
                                      <div className=""> 
                                         {Reimbursement}
                                      </div>
                                  </Tooltip>
                        }
                    };
                }
                else if (key === 'Deductions') {
                  return {
                      title: 'Deductions',
                      dataIndex: 'Deductions',
                      key: 'Deductions',
                      render: (Deductions, record) => {
                          return <Tooltip title={()=>{
                            const tooltipContent=handleToolTipContentDeduction(Deductions, record)
                            return <span dangerouslySetInnerHTML={{ __html: tooltipContent }} />
                          }}
                          >
                                    <div className=""> 
                                       {Deductions}
                                    </div>
                                </Tooltip>
                      }
                  };
              } 
                else {
                    return {
                        title: key,
                        dataIndex: key,
                        key: key
                    };
                }
            });

              columnstwo.push({
                id: 7,
                title: "Action",
                key: "action",
                render: ({ id }) => (
                  <ViewBtn
                    path={`/admin/reimbursement/${id}`}
                    text='View'
                    icon={<BtnViewSvg />}
                  />
                ),
              })
             setColumnsToShow(columnstwo)
        }
          dispatch(loadAllReimbursementApplication())
          dispatch(loadAllDeductionsApplication())
          dispatch(loadAllBulkSalaryFields())
          dispatch(loadAllbulkAttendance())
          dispatch(loadAllPublicHoliday());


	}, [list, setColumnsToShow]);   

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const onAllClick = () => {
		dispatch(loadAllReimbursementApplication());
		setStatus("all");
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));
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
      const handlemonthchangetwo =(value)=>{

        setsamplefiledisabled(false)
        const year = value.year(); 
        const month = value.month() + 1;

        setcurrentCSVMonth(month)
        setcurrentCSVYear(year)
        let salaryHistoryRecordData
        const salaryHistoryReducer=dispatch(getSalaryHistoryRecord({ month:month, year:year }))
     
        salaryHistoryReducer.then((res)=>{
          salaryHistoryRecordData= res.payload.data.salaryHistoryRecords

          if(salaryHistoryRecordData?.length>0){
            const updatedList = employeeList.map(item => {
              const userName = `${item.firstName} ${item.lastName}`;
              const employeeId = item.employeeId;
          
              // Find salary history records for the current user
              const userSalaryHistory = salaryHistoryRecordData.filter(record => record.userId === item.id && record.isActive);
          
              // Construct object for the current item
              const updatedItem = {
                  userName,
                  employeeId,
                  // Extract sfName and sfValue pairs from userSalaryHistory
                  ...userSalaryHistory.reduce((acc, record) => {
                      acc[record.sfName] = record.sfValue;
                      return acc;
                  }, {})
              };
          
              return updatedItem;
          });
          setupdatedCSVList(updatedList)
          } 
          else{

            const newList = employeeList.map(item => {
              const userName = `${item.firstName} ${item.lastName}`;
              const employeeId = item.employeeId
              
              // Calculate reimbursement only for items with acceptDate in the current CSV month and year
              const userReimbursement = reimbursementList
                  .filter(reim => {
                      if (reim.userId === item.id && reim.status==='ACCEPTED') {
                          const acceptDate = new Date(reim.acceptDate);
                          const reimbMonth = acceptDate.getMonth();
                          const reimbYear = acceptDate.getFullYear();
                          return reimbMonth+1 === month && reimbYear === year;
                      }
                      return false;
                  })
                  .reduce((total, reim) => total + reim.amount, 0);
                  const userDeduction = deductionsList
                  .filter(reim => {
                      if (reim.userId === item.id) {
                          const acceptDate = new Date(reim.date);
                          const reimbMonth = acceptDate.getMonth();
                          const reimbYear = acceptDate.getFullYear();
                          return reimbMonth+1 === month && reimbYear === year;
                      }
                      return false;
                  })
                  .reduce((total, reim) => total + reim.amount, 0);
              return {
                  userName,
                  employeeId,
                  Reimbursement: userReimbursement,
                  Deductions:userDeduction,
                  "Monthly Salary":item.baseSalary,
                  "Payable days": TotalPayableDays(item.email,month, year , attendancelist , publicHolidayList, employeeList)
              };
          });
          const updatedSalaryFieldList = salaryFieldList?.data?.filter(item => item.fieldName !== "Reimbursement" && item.fieldName !== "Deductions" && item.isActive && item.fieldName !== "Monthly Salary" && item.fieldName!=='Payable days');
  
          const fieldNames = updatedSalaryFieldList?.map(field => field.fieldName);
  
          // Adding field names to every item in the newList array
          const updatedList = newList.map(item => ({
              ...item,
              ...fieldNames.reduce((acc, fieldName) => {
                  acc[fieldName] = 0;
                  return acc;
              }, {})
          }));  
          setupdatedCSVList(updatedList)
          }

        }).catch((err)=>{
          console.log('err',err)
        })
         

        const newListSalary = employeeList.map(item => {
            const userName = `${item.firstName} ${item.lastName}`;
            const employeeId = item.employeeId
            const id = item.id
            // Calculate reimbursement only for items with acceptDate in the current CSV month and year
            const userReimbursement = reimbursementList
            .filter(reim => {
                if (reim.userId === item.id && reim.status==='ACCEPTED') {
                    const acceptDate = new Date(reim.acceptDate);
                    const reimbMonth = acceptDate.getMonth();
                    const reimbYear = acceptDate.getFullYear();
                    return reimbMonth+1 === month && reimbYear === year;
                }
                return false;
            })
            .reduce((total, reim) => total + reim.amount, 0);
            const userDeduction = deductionsList
            .filter(reim => {
                if (reim.userId === item.id) {
                    const acceptDate = new Date(reim.date);
                    const reimbMonth = acceptDate.getMonth();
                    const reimbYear = acceptDate.getFullYear();
                    return reimbMonth+1 === month && reimbYear === year;
                }
                return false;
            })
            .reduce((total, reim) => total + reim.amount, 0);
            return {
                userName,
                employeeId,
                id,
                Reimbursement: {  value:userReimbursement, isActive:true},
                Deductions:{  value:userDeduction, isActive:true}
            };
        });
        const updatedSalaryFieldList = salaryFieldList?.data?.filter(item => item.fieldName !== "Reimbursement" && item.fieldName !== "Deductions" && item.fieldName!=='id');
        // const fieldNamesSalary = updatedSalaryFieldList?.map(field => field.fieldName);
        const fieldNamesSalaryObject = updatedSalaryFieldList?.map(field => ({ fieldName: field.fieldName, isActive: field.isActive }));
        const fieldNamesMonth = month;
        const fieldNamesYear = year;
        // console.log('fieldNamesSalary',fieldNamesSalary,'newListSalary',newListSalary,'fieldNamesSalaryObject',fieldNamesSalaryObject)
        // Adding field names to every item in the newList array
        const updatedListSalary = newListSalary.map(item => {
          const dynamicFields = fieldNamesSalaryObject.reduce((acc, fieldNameObj) => {
              acc[fieldNameObj.fieldName] = { value: 0, isActive: fieldNameObj.isActive };
              return acc;
          }, {});
      
          return {
              ...item,
              month: fieldNamesMonth,
              year: fieldNamesYear,
              ...dynamicFields
          };
      });
      //  console.log('updatedListSalary',updatedListSalary)
       setupdatedSalaryHistoryList(updatedListSalary) 
    }
  const getMonthName=(currentCSVMonth)=>{
    switch(currentCSVMonth){
      case 1:
        return 'January'
      case 2:
        return "february"
      case 3:
        return "March"
      case 4:
        return "April"
      case 5:
        return "May"
      case 6:
        return "June"    
        case 7:
          return 'July'
        case 8:
          return "August"
        case 9:
          return "September"
        case 10:
          return "October"
        case 11:
          return "November"
        case 12:
          return "December"  
        default:
          return "NAN"   
      }
  }
      const handlecsvclick = () => {

        // Extract column names from the first item in the list
        const columnNames = Object.keys(updatedCSVList[0]?updatedCSVList[0]:[]);
        // Additional column names for Month and Year
        columnNames.push("Month", "Year");
    
        // Create the CSV data array starting with column names
        const csvData = [columnNames];
    
        // Iterate over the updatedCSVList and include the data for each item
        updatedCSVList.forEach(item => {
            // Extract data for each item
            const rowData = [];
    
            // Add data for each column
            columnNames.forEach(column => {
                // Special handling for known fields
                if (column === "userName") {
                    rowData.push(`${item.userName} (${item.employeeId || ''})`);
                } else if (column === "Month") {
                   const monthName= getMonthName(currentCSVMonth)
                    rowData.push(monthName);
                } else if (column === "Year") {
                    rowData.push(currentCSVYear);
                } else {
                    // Include other fields dynamically
                    rowData.push(item[column]);
                }
            });
    
            // Add data for the current item to the CSV data array
            csvData.push(rowData);
        });

       //   Protected CSV File    
    //   console.log('csvData',csvData)    // Create a new workbook

    // // Create a new workbook
    // const workbook = new ExcelJS.Workbook();
    
    // // Add a worksheet
    // const sheet = workbook.addWorksheet('Sheet1');

    // // Add headers from the first row of csvData
    // if (csvData.length > 0) {
    //   const headers = csvData[0];
    //   sheet.addRow(headers);
    // }

    // // Add rows from csvData
    // csvData.slice(1).forEach((rowData) => {
    //   sheet.addRow(rowData);
    // });

    // // Protect specific columns
    // const protectedColumns = ['Month', 'Year', 'Reimbursement', 'Deductions'];
    // protectedColumns.forEach((columnName) => {
    //   const columnIndex = csvData[0].indexOf(columnName);
    //   if (columnIndex !== -1) {
    //     sheet.getColumn(columnIndex + 1).eachCell((cell, rowNumber) => {
    //       // Skip the header row
    //       if (rowNumber !== 1) {
    //         cell.protection = {
    //           locked: true,
    //           lockText:true
    //         };
    //       }
    //     });
    //   }
    // });

    // // Write the workbook to a buffer
    // workbook.xlsx.writeBuffer()
    //   .then((buffer) => {
    //     // Create a blob from the buffer
    //     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
    //     // Create a download link
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'protected_columns.xlsx';
        
    //     // Trigger a click event to start the download
    //     a.click();
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
        
        const config = {
            fields: columnNames.map(column => {
                if (column === "Month" || column === "Year" || column==="reimbursement" || column==="deductions") {
                    return { label: column, value: '', parser: (value) => ({ data: value, meta: { editable: false } }) };
                }
                return column;
            })
        };
        // Convert the data to CSV string using papaparse
        const csvString = unparse(csvData,config);

        // Create a Blob object and set its MIME type
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);
    
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Sample_salary_list.csv');
    
        // Trigger the download
        document.body.appendChild(link);
        link.click();
    
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // console.log('updatedSalaryHistoryList',updatedSalaryHistoryList )
        //  dispatch(createSalaryHistoryRecord(updatedSalaryHistoryList))
    }
    
     const handleCancel = () => {
        setIsModalOpen(false);
        setDropZone(false)
        setDropZoneContent('')
        setUploadCSVMsg('')
        setUploadCSvwarningMsg('')
        setuploadextraFieldsMsg('')
        setmonthlySalaryErrorMsg('')
        setsamplefileDownload(false)
        // setIsSecondModalVisible(false);
      };
      const handleBulkupload= ()=>{

        let activeFields=[]
        let inActiveFields=[]

          // console.log('arrayData',arrayData ,list)
          
          const filteredarrayData = arrayData.filter(item => item.userName !=='')

          const updatedArrayData = filteredarrayData.map(dataItem => {
            const correspondingListItem = employeeList.find(listItem => listItem.employeeId === dataItem.employeeId || dataItem.employeeId==='');
            if (correspondingListItem) {
                return { ...dataItem, id: correspondingListItem.id };
            } else {
                return dataItem;
            }
          });

          let dataMonth = parseInt(updatedArrayData[0].month) 
          let dataYear  = parseInt(updatedArrayData[0].year)

          const newList = employeeList.map(item => {
            const userName = `${item.firstName} ${item.lastName}`;
            const employeeId = item.employeeId
            
            // Calculate reimbursement only for items with acceptDate in the current CSV month and year
            const userReimbursement = reimbursementList
                .filter(reim => {
                    if (reim.userId === item.id && reim.status==='ACCEPTED') {
                        const acceptDate = new Date(reim.acceptDate);
                        const reimbMonth = acceptDate.getMonth();
                        const reimbYear = acceptDate.getFullYear();
                        return reimbMonth + 1  === dataMonth && reimbYear === dataYear;
                    }
                    return false;
                })
                .reduce((total, reim) => total + reim.amount, 0);
                const userDeduction = deductionsList
                .filter(reim => {
                    if (reim.userId === item.id) {
                        const acceptDate = new Date(reim.date);
                        const reimbMonth = acceptDate.getMonth();
                        const reimbYear = acceptDate.getFullYear();
                        return reimbMonth + 1 === dataMonth && reimbYear === dataYear;
                    }
                    return false;
                })
                .reduce((total, reim) => total + reim.amount, 0);
            return {
                id: item.id,
                userName,
                employeeId,
                Reimbursement: userReimbursement,
                Deductions:userDeduction,
                "Monthly Salary":item.baseSalary,
                "Payable days": TotalPayableDays(item.email,dataMonth, dataYear , attendancelist , publicHolidayList, employeeList)
            };
        });
        const updatedSalaryFieldList = salaryFieldList?.data?.filter(item => item.fieldName !== "Reimbursement" && item.fieldName !== "Deductions" && item.isActive && item.fieldName !== "Monthly Salary" && item.fieldName!=='Payable days');

        const fieldNames = updatedSalaryFieldList?.map(field => field.fieldName);

        // Adding field names to every item in the newList array
        const updatedList = newList.map(item => ({
            ...item,
            ...fieldNames.reduce((acc, fieldName) => {
                acc[fieldName] = 0;
                return acc;
            }, {})
        }));  
          // console.log('updatedList',updatedList)
          // console.log('updatedArrayData',updatedArrayData);
          const updatedArrayDataWithOverrides = updatedArrayData.map(dataItem => {
              // Find the corresponding item in updatedList by ID
            const listItem = updatedList.find(listItem => listItem.id === dataItem.id);
        
            if (listItem) {
                // Create a new object for the updated item
                const updatedItem = { ...dataItem };
        
                // Compare specified fields
                if (parseInt(dataItem.Reimbursement) !== listItem.Reimbursement) {
                    updatedItem.Reimbursement = {
                        originalValue: listItem.Reimbursement,
                        isOverridden: true,
                        value: dataItem.Reimbursement
                    };
                }
                if (parseInt(dataItem.Deductions) !== listItem.Deductions) {
                  updatedItem.Deductions = {
                      originalValue: listItem.Deductions,
                      isOverridden: true,
                      value: dataItem.Deductions
                  };
                }
                if(parseInt(dataItem['Payable Monthly Salary']) !== listItem['Payable Monthly Salary']){
                  updatedItem['Payable Monthly Salary'] = {
                    originalValue: listItem['Payable Monthly Salary'],
                    isOverridden: true,
                    value: dataItem['Payable Monthly Salary']
                };
                 }
                 if(parseInt(dataItem['Payable days']) !== listItem['Payable days']){
                  updatedItem['Payable days'] = {
                    originalValue: listItem['Payable days'],
                    isOverridden: true,
                    value: dataItem['Payable days']
                };
                 }
                if (parseInt(dataItem['Monthly Salary']) !== listItem['Monthly Salary']) {
                    updatedItem['Monthly Salary'] = {
                        originalValue: listItem['Monthly Salary'],
                        isOverridden: true,
                        value: dataItem['Monthly Salary']
                    };
                }
                // Add more comparisons for other fields as needed
        
                return updatedItem;
            }
        
            return dataItem;
        });
          // console.log('updatedArrayDataWithOverrides',updatedArrayDataWithOverrides)
          const hasZeroMonthlySalary = updatedArrayDataWithOverrides.some(item => parseInt(item['Monthly Salary']) === 0);
          const keys = Object.keys(updatedArrayDataWithOverrides[0]).filter(key => !['userName', 'Month', 'Year',"employeeId", "id"].includes(key));
          // console.log('keys', keys,salaryFieldList.data)
           activeFields = salaryFieldList.data.filter(item => !item.isNew && !keys.includes(item.fieldName));
           inActiveFields = salaryFieldList.data.filter(item => !item.isActive && !keys.includes(item.fieldName));
          
        
           if(inActiveFields.length>0){
            const missingFieldsMsg = inActiveFields.map(item => item.fieldName).join(', ');
             setUploadCSvwarningMsg(`Active Salary Fields : ${missingFieldsMsg} are missing from the upload file and are not added to this months Salary History. If you wish to deactivate the fields then do so from the Salary Fields Section. If you wish to add these fields then reupload the file with updated data.`);
           }
           if(hasZeroMonthlySalary){
             setmonthlySalaryErrorMsg('Monthly Salary cannot be 0. If the user is not active then please update the status from Employee List Section')
           }
          else if(activeFields.length > 0) {
            const missingFieldsMsg = activeFields.map(item => item.fieldName).join(', ');
             setUploadCSVMsg(`Mandatory field : ${missingFieldsMsg} are missing in the upload file`);
           }
          else {
            const extraFields = keys.filter(key => !salaryFieldList.data.some(item => item.fieldName === key));
            const filteredExtraFields=extraFields.filter(key => !['Month','Year'].includes(key));
            const filteredExtraFieldsWithObjects = filteredExtraFields.map(fieldName => ({
              fieldName,
              isActive: false,
              isNew: true
            }));

            const formData = new FormData();

            // console.log('seletedSalaryFile',seletedSalaryFile[0])
          
            formData.append("files", seletedSalaryFile[0]); 

            // const selectedFilesArray = Array.from(formData);
                   const mappedExtrafields=filteredExtraFields.map(item => item).join(', ');
                   const missingFieldsMsg = activeFields.map(item => item.fieldName).join(', ');
                   
              if(filteredExtraFieldsWithObjects.length>0) {

                       const SalarySheetLocation=dispatch(uploadSalarySheetFile(formData))

                          SalarySheetLocation.then((res)=>{
                            // console.log('res', res)

                           const salarysheetResponse=dispatch(createSalarySheetHistory({sheetName ,overwriteData, salaryFileLocation:res.payload.data.location}))

                           salarysheetResponse.then((res)=>{
   
                           const salarySheetHistoryId=res.payload.data.data
                           const salaryHistoryResponse =dispatch(UploadSalaryHistoryRecords({ updatedArrayDataWithOverrides , overwriteData ,salarySheetHistoryId }))
                           salaryHistoryResponse.then((res)=>{
                            const { data } = res.payload;

                            const result = data.results.reduce((acc, item) => {

                                if (item.success) {
                                    acc.successCount++;
                                } else {
                                    acc.failureCount++;
                                }
                                return acc;
                            }, { successCount: 0, failureCount: 0 });

                                dispatch(updateSalarySheetHistory({success:result.successCount , failure:result.failureCount , totalCounts:result.successCount +result.failureCount , salarySheetHistoryId:salarySheetHistoryId ,newFieldsAdded:filteredExtraFields ,existingFieldRemoved:activeFields}))
                          
                              })

                           dispatch(updateSalaryFields({ filteredExtraFieldsWithObjects,salarySheetHistoryId }))
   
                         }).catch((err)=>{
                             console.log('Error in salarysheet history', err)
                         })
                       })
                    
                      setuploadextraFieldsMsg(`New Fields :${mappedExtrafields} are added to the salary sheet, these fields are added to your “Create Salary Field” section with inactive status.`)
                  
              }
              else{

                     const SalarySheetLocation=dispatch(uploadSalarySheetFile(formData))

                       SalarySheetLocation.then((res)=>{
                        console.log('res', res)
                           setsamplefileDownload(true)

                           const salarysheetResponse= dispatch(createSalarySheetHistory({sheetName ,overwriteData,salaryFileLocation:res.payload.data.location}))
                           salarysheetResponse.then((res)=>{
                           const salarySheetHistoryId=res.payload.data.data
                           const salaryHistoryResponse = dispatch(UploadSalaryHistoryRecords({ updatedArrayDataWithOverrides , overwriteData ,salarySheetHistoryId }))
                           salaryHistoryResponse.then((res)=>{
                            const { data } = res.payload;
                            const result = data.results.reduce((acc, item) => {
                                if (item.success) {
                                    acc.successCount++;
                                } else {
                                    acc.failureCount++;
                                }
                                return acc;
                            }, { successCount: 0, failureCount: 0 });

                              dispatch(updateSalarySheetHistory({success:result.successCount , failure:result.failureCount , totalCounts:result.successCount +result.failureCount , salarySheetHistoryId:salarySheetHistoryId ,newFieldsAdded:filteredExtraFields ,existingFieldRemoved:activeFields}))
                           })

                          }).catch((err)=>{
                              console.log('Error in salarysheet history', err)
                          })
                       })
              }
              setshowFooter(true)

          }
       
        
      }
      const customFooter = (
        <div>
             <Button key="customButton" type="default" onClick={handleCancel}>
               Cancel
          </Button>	
           <Button key="customButton" 
           type={isUpload? "primary":"default"} disabled={!isUpload} 
           onClick={handleBulkupload}
           >
             Upload Button
          </Button>
        </div>
      );
      const customFooterTwo = (
        <div>
             <Button key="customButton" type="default" onClick={handleCancel}>
               Cancel
          </Button>	
           <Button key="customButton" 
           type={isUpload? "primary":"default"} disabled={!isUpload} 
           onClick={()=>{
            setIsModalOpen(false)
            setsamplefileDownload(false)
            setshowFooter(false)}
          }
           >
             ok
          </Button>
        </div>
      );
      const fileInputRef = useRef(null);

      const fileReader = new FileReader();
      const handleAutoUpload = () => {
        fileInputRef.current.click();
      };
    
      const handleFileRead = () => {
        const text = fileReader.result;
        handleOnSubmit(text);
      };
    
      const handleFileReadError = (error) => {
        console.error('Error reading file:', error);
      };
  function handleFileInputChange() {
		setisUpload(true)
		const selectedFile = fileInputRef.current.files[0];
		// setFile(selectedFile);
    // console.log('selectedFile',selectedFile)
    setSelectedSalaryFile(fileInputRef.current.files)
    setsheetName(selectedFile.name)
		if (selectedFile) {
			 if (selectedFile.name.endsWith('.xlsx')) {
				setDropZoneContent(selectedFile.name)
				readFile(selectedFile);
				setDropZone(true)
			 }
			 else if(selectedFile.name.endsWith('.csv')){
				    handleAutoUpload()
					setDropZone(true)
					setDropZoneContent(selectedFile.name)
					fileReader.onload = handleFileRead;
					fileReader.onerror = handleFileReadError;
					fileReader.readAsText(selectedFile);
			 }
		  }
	  }

      function handleDragOver(e) {
		e.preventDefault();
	  }

	  function handleDrop(e) {
		setisUpload(true)
		e.preventDefault();
		const droppedFile = e.dataTransfer.files[0];
		// setFile(droppedFile);
    // console.log('droppedFile',droppedFile)
    setsheetName(droppedFile.name)
    setSelectedSalaryFile(e.dataTransfer.files)
		if (droppedFile) {

			 if(droppedFile.name.endsWith('.xlsx')){
				setDropZoneContent(droppedFile.name)
				// readFile(droppedFile);
				setDropZone(true)
			 }
			 else{
				setDropZone(true)
				setDropZoneContent(droppedFile.name)
				fileReader.onload = handleFileRead;
				fileReader.onerror = handleFileReadError;
				fileReader.readAsText(droppedFile);
			 }
		
		}
	  }
      const readFile = (file) => {
		const reader = new FileReader();
	
		reader.onload = (e) => {
		  const data = e.target.result;
		  const workbook = XLSX.read(data, { type: 'binary' });

		  // Assuming the first sheet is the one you want to convert
      
		  const sheetName = workbook.SheetNames[0];
		  const worksheet = workbook.Sheets[sheetName];
		 
		  // Convert the worksheet to JSON
		  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
			raw: false,
			dateNF: 'YYYY-MM-DD',
			cellDates: true,
		  });

		  setarrayData(jsonData)
		};
	
		reader.readAsBinaryString(file);
	  };
  const handleOnSubmit = (text) => {

		  // Check if it's a CSV file (you might want to improve this check)
		  Papa.parse(text, {
			header: true,
			complete: (result) => {
			  setarrayData(result.data);
			},
		  });  
   };

   const showModaltwo = () => {
    setIsModalVisible(true);
  };
  
  const closeModaltwo = () => {
    setIsModalVisible(false);
  };

  const handledownloadcsv = () => {
    // Extract all keys from the list objects
    const keys = list.reduce((allKeys, obj) => {
        Object.keys(obj).forEach(key => {
            if (!allKeys.includes(key)) {
                allKeys.push(key);
            }
        });
        return allKeys;
    }, []);

    const csvData = list.map(item => {
        const rowData = {};
        keys.forEach(key => {
            rowData[key] = item[key] || 0;
        });
        return rowData;
    });

    setCSVlist(csvData);
};
	return (
		<div className='ant-card p-4 rounded mt-5'>
			<div className='flex my-2 justify-between'>
				<div className='w-50'>
                    {/* {console.log('arrayData',arrayData)} */}
					<h4 className='text-2xl mb-2'> Salary Sheet</h4>
				</div>
				{list && (
            <div className='flex justify-end mr-4'>
              <div className='mt-0.5'>
                <CsvLinkBtn onClick={handledownloadcsv}>
                  <CSVLink
                    data={CSVlist}
                    className='btn btn-dark btn-sm'
                    style={{ marginTop: "5px" }}
                    filename='Salary_sheet'>
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
                                    options={columnsToShow}
                                    columns={columnsToShow}
                                    columnsToShowHandler={columnsToShowHandler}
                                />
                                
                            </div>
                        )}
                      <div className="w-[100%] ml-[15px]"> 
                          <DatePicker picker="month"  defaultValue={oneMonthAgo} onChange={handlemonthchange} disabledDate={disabledDate}/>
                      </div>
                      
                    </div>
              <div> 
                    <CsvLinkBtn onClick={() => {
                          showModal()
                            }} className="cursor-pointer text-center">
                          Upload Salary
                    </CsvLinkBtn>


                    <CsvLinkBtn onClick={() => {
                              // navigate('/admin/salary/sheet/history')
                             showModaltwo()
                            }} className="cursor-pointer mt-[15px] mb-[15px] text-center">
                           Salary Sheet History 
                     </CsvLinkBtn>
                     <Modal
                        title=""
                        visible={isModalVisible}
                        onCancel={closeModaltwo}
                        footer={null}
                        className='w-[1150px]'
                      >
                        <SalarySheetHistory />
                      </Modal>
            </div>
            </div>
            <Modal title="Upload Salary Sheet" open={isModalOpen} 
			     	onCancel={handleCancel}
					 footer={showFooter ? customFooterTwo  : customFooter}
					 className='w-[750px]'
					>
				    {dropZone ? <>
						{dropZoneContent}
            <br/>
            <>
            <p className="text-red-500"> {monthlySalaryErrorMsg}</p>
            <p className="text-red-500"> {UploadCSvMsg} </p>
            <p className="text-orange-500"> {UploadCSvwarningMsg} </p>
            <p className="text-green-500"> {uploadextraFieldsMsg}</p>
            </>
					 
					</>  : 
                    <>
         {sampleFileDownload ? 
                    <div className="modal-content">
					{/* File Input with Drag and Drop */}
					<input
						ref={fileInputRef}
						style={{ display: 'none' }}
						type="file"
						accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
						onChange={handleFileInputChange}
					/>
					<div
						className="drop-zone"
						onDragOver={(e) => handleDragOver(e)}
						onDrop={(e) => handleDrop(e)}
					>
						Drag & Drop 
					</div>
					<button className="mt-[15px] ant-btn ant-btn-primary ant-btn-md ant-btn-block" onClick={() => fileInputRef.current.click()}> Or  Choose File</button>
				      	<Form>
                          <Form.Item
										style={{ marginBottom: "10px", marginTop: "10px"}}
										label=''
										name=''
										rules={[
											{
												required: false,
												message: "Please check overwrite date",
											},
										]} 
										>
										 <Checkbox className="margin-auto" label="" onChange={(e)=>{
											setoverwriteData(e.target.checked)
										}}>

											Overwrite existing data entries for same date
										</Checkbox>
									</Form.Item>
									</Form>
					<Tag color="rgb(229, 246, 253)" style={{padding:'5px', marginBottom:'5px',marginTop:'5px'}} ><p className="text-[13px] text-[#014361]"><i class="bi bi-info-circle text-[#0288d1] text-[15px] mr-[3px]" ></i>  Date should be in DD-MM-YYYY </p></Tag>
					<Tag color="#fdeded" style={{padding:'5px', marginBottom:'5px',marginTop:'5px'}} >
					<p className="text-[13px] text-[#5f2120]">
				    <i class="bi bi-info-circle text-[#d32f2f] text-[15px] mr-[8px]" ></i> 
					In case of any date being left unentered between the earliest date in the sheet and the latest date <br/>in the sheet, the system will automatically classify it as follows:
					<br/><br/>
					<ul>
						 <li>-If the date corresponds to a holiday listed in the system, it will be marked as a "Holiday." </li>
						 <li>-If the date corresponds to a weekly off day as per the shift schedule, it will be marked as a "Weekly Off." </li>
						 <li>-If the date corresponds to an approved leave request then it will be marked accordingly. </li>
						 <li>-If the date does not match any of the above criteria, it will be marked as an "Unapproved Leave." </li>
						 <br/>
						 This automated classification ensures accurate tracking and management of employee <br/> schedules and absences.
					</ul>
					
                   </p>
			   </Tag>
				 </div>
                     :	
                     
                     <div className="w-[90%]"> 
                        <p> Please download the format file for the month before uploading the Monthly Salary.</p>
                           <div className="w-[40%] m-[15px]"> 
                              <DatePicker picker="month" onChange={handlemonthchangetwo} disabledDate={disabledDate}/>
                            </div>
                     <CsvLinkBtn onClick={()=>{
                         if(sampleFiledisabled){

                         }
                         else{
                            handlecsvclick()
                            setsamplefileDownload(true)
                         }
                         }}
                         disabled={sampleFiledisabled}
                         className={sampleFiledisabled ?"cursor-not-allowed m-[15px] w-[40%]" :"cursor-pointer w-[40%] m-[15px]"}
                         >
                                 Download Sample File
                         </CsvLinkBtn>
                    </div>
                    }
				  </>
					} 		  
          {/* {console.log('salaryHistoryRecordData',salaryHistoryRecordData)} */}
	     		</Modal>
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

const SalaryList = (props) => {
	  const dispatch = useDispatch();
    const [newData, setNewData] = useState([])
    const users = useSelector((state) => state.users?.list);
    const oneMonthAgo = moment().subtract(1, 'months');
    const  { initialSalaryHistoryRecord }=useSelector(state=> state.salaryField) 
    const oneMonthAgoMonth = oneMonthAgo.month(); // Month (0-indexed)
    const oneMonthAgoYear = oneMonthAgo.year(); // Year
    
    const [currentMonth, setcurrentMonth] =useState(oneMonthAgoMonth+1)
    const [currentYear, setcurrentYear] = useState(oneMonthAgoYear)
	useEffect(() => {

		dispatch(loadAllStaff({ status: true }));
    dispatch(getinitialSalaryHistoryRecord({ month:oneMonthAgoMonth, year:oneMonthAgoYear }))

	}, []);


  // Memoize the mapped data
  const memoizedData = useMemo(() => {
      if (users) {
          return users.map(user => {
              // Destructure user object
              const { userName, salaryHistory , id } = user;

              // Create a new object with userName as the first key
              const newObj = { userName , id};
              // Iterate over salaryHistory array and add sfName: sfValue to the object
              salaryHistory.forEach(history => {
                  if(history.month ===currentMonth && history.year ===currentYear) {
                        newObj[history.sfName] = history.sfValue;
                  }
                  // else{
                  //   newObj[history.sfName] = 0
                  // }
              });

              // Return the new object for this user
              return newObj;
          });
      }
      return null; // or an empty array if preferred
  }, [users,currentMonth,currentYear]); 


  const uniqueNamesWithIds = Array.from(
		users.reduce((map, item) => {
			const userId = item.id;
			if (!map.has(userId)) {
				map.set(userId, {
					userId,
					name: `${item?.firstName} ${item?.lastName}`
				});
			}
			return map;
		}, new Map()).values()
	);

  const [userId , setuserId] =useState()
  const [filterData, setfilterData] =useState(memoizedData)

  const handleSelectChange = (value) => {

      setuserId(value);
      if(value==='selectName'){
        setfilterData([])
      }
      setfilterData(memoizedData.filter(item => item.id === value))

   };

	return (
		<UserPrivateComponent permission={"readAll-leaveApplication"}>
			<div className='card card-custom'>
				<div className='card-body relative'>
           {/* {console.log('users', users)}   */}
           <div className="absolute  z-[999] top-[91px] left-[384px]"> 
                                       <Select
                                            defaultValue="Select Name"
                                            placeholder='Select Name'
                                            style={{ width: 200, marginRight: 16 }}
                                            onChange={handleSelectChange}
                                            value={userId}
                                           >
                                            <Option value="selectName">Select All</Option>
                                               {uniqueNamesWithIds.map((item)=>{
                                  return  <Option  value={item.userId}>{item?.name}</Option>
                              })}
                                          </Select>
                        </div>
                        {/* {console.log('filterData',filterData)} */}
           {/* {console.log('currentMonth',currentMonth,'oneMonthAgoMonth',oneMonthAgoMonth ,oneMonthAgoYear)} */}
          {newData ? <CustomTable list={filterData.length > 0 ? filterData :memoizedData} employeeList={users} setcurrentMonth={setcurrentMonth} setcurrentYear={setcurrentYear}/> : null}
          {/* {console.log('memoizedData',memoizedData)} */}
				</div>
			</div>
		</UserPrivateComponent>
	);
};

export default SalaryList;