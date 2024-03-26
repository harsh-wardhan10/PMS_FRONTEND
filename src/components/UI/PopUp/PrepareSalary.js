import { Button, DatePicker, Modal } from 'antd'
import moment from 'moment';
import React, { useMemo, useState } from 'react'
import { CsvLinkBtn } from '../CsvLinkBtn';
import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';

const PrepareSalary = () => {

    const oneMonthAgo = moment().subtract(1, 'months');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [CSVlist, setCSVlist] =useState([])
    const users = useSelector((state) => state.users?.list);
    const oneMonthAgoMonth = oneMonthAgo.month()+1; 
    const oneMonthAgoYear =  oneMonthAgo.year(); 
    const [currentMonth, setcurrentMonth] =useState(oneMonthAgoMonth)
    const [currentYear, setcurrentYear] =useState(oneMonthAgoYear)

    const handlemonthchange=(value)=>{
        const year = value.year(); 
        const month = value.month() + 1;
        setcurrentMonth(month)
        setcurrentYear(year)
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
     const disabledDate = (current) => {
        // Disable months beyond the previous month
        return current && current > moment().endOf('month').subtract(1, 'months');
      };
      const showModal = () => {
        setIsModalOpen(true);
        // handledownloadcsv()
      };
      const handleOk = () => {
        setIsModalOpen(false);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
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
                });
  
                // Return the new object for this user
                return newObj;
            });
        }
        return null; // or an empty array if preferred
    }, [users,currentMonth,currentYear]); 
    
    const handledownloadcsv = () => {
      const filteredKeys = ['firstName', 'lastName', 'employeeId', 'email', 'bankName', 'accountNumber', 'IFSCCode', 'currentMonth', 'currentYear', 'Payable Monthly Salary'];
  
      const csvData = memoizedData.map(item => {
          const rowData = {};
  
          const employee = users.find(emp => emp.id === item.id);
          if (employee) {
              // Set specific keys for user details
              rowData['User Name'] = `${employee.firstName} ${employee.lastName}`;
              rowData['Employee Id'] = employee.employeeId;
              rowData['Email Id'] = employee.email;
              rowData['Bank Name'] = employee.bankName;
              rowData['Account Number'] = employee.accountNumber.replace(/"/g, '');
              rowData['IFSC Code'] = employee.IFSCCode;
              rowData['Month'] = getMonthName(currentMonth);
              rowData['Year'] = currentYear;
          }
  
          // Populate other columns if they are in filteredKeys
          Object.keys(item).forEach(key => {
              if (filteredKeys.includes(key)) {
                  rowData[key] = item[key] || 0;
              }
          });
  
          return rowData;
      });
  
      // Update the keys array with only filtered keys
      const newKeys = ['User Name', ...filteredKeys.filter(key => key !== 'firstName' && key !== 'lastName'), 'Employee Id', 'Email Id'];
  
      setCSVlist(csvData, newKeys);
      setTimeout(()=>{
        setIsModalOpen(false);
      }, 3000)
  };
    const customFooterTwo = (
      <div className="flex items-center justify-end">
           <Button key="customButton" type="default" onClick={handleCancel} className='mr-[10px]'>
             Cancel
        </Button>	
              <CsvLinkBtn onClick={handledownloadcsv} className='ml-[10px]'>
                  <CSVLink
                    data={CSVlist}
                    className='btn btn-dark btn-sm'
                    style={{ marginTop: "5px" }}
                    filename='Salary_sheet'>
                      Prepare Salary 
                  </CSVLink>
              </CsvLinkBtn>
      </div>
    );
  return (
    <>

           <CsvLinkBtn onClick={showModal} className='ml-[10px] cursor-pointer'>
                  Prepare Salary 
           </CsvLinkBtn>
            <Modal
                width={"50%"}
                title="Prepare Salary"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={customFooterTwo}
            >

                Select Month and Year :

           <DatePicker picker="month"  defaultValue={oneMonthAgo} onChange={handlemonthchange} disabledDate={disabledDate}/>
              
            </Modal>  </>
  )
}

export default PrepareSalary
