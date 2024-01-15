import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';

const AttendanceSummary = ({ visible, onClose , summaryData }) => {

   const [errorData , setErrorData] =useState([])
   const [successCount , setSuccessCount] = useState(0)
   const [errorCount , setErrorCount]= useState(0)


  useEffect(()=>{
    summaryData?.then((res)=>{
     errorData.push({
          message:res.payload.message,
          data:res.payload.data
       })
       errorData[0]?.data?.map((item)=>{
        if(item.success){
            setSuccessCount(successCount=> successCount+1)
        }
        else{
            setErrorCount(errorCount=>errorCount+1) 
        }})
    })?.catch((error)=>{
       console.log("Error in Bulk Data" ,error)
    })
  } ,[summaryData,errorData])
  return (
    <Modal
      title={<h1 className='text-[20px] font-bold'>Summary of Attendance Insert Into Database</h1>}
      visible={visible}
      onCancel={onClose}
      footer={null}  // If you don't want a footer
      className='w-[850px]'
      cancelText="Close"
    >
      <h1 className='text-red-500'> {errorData[0]?.message}</h1>
      <div className='flex justify-between'> 
       <div> 
          <h1 className='text-green-500 font-bold text-[15px]'> Success - {successCount}</h1>
                 {errorData[0]?.data?.map((item)=>{
                if(item.success){
                    return <p className='text-green-500'> {item.message}</p>
                }
         })}
       </div>
         <div> 
           <h1 className='text-red-500 font-bold text-[15px]'> Errors - {errorCount} </h1>
           {errorData[0]?.data?.map((item)=>{
                if(!item.success){
                    return <p className='text-red-500'> {item.message}</p>
                }
            })}
         </div>
     </div>
    </Modal>
  );
};

export default AttendanceSummary;