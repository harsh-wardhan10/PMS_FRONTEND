import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';

const AttendanceSummary = ({ visible, onClose , summaryData,refresh,excludedDataEntries }) => {

   const [errorData , setErrorData] =useState([])
   const [successCount , setSuccessCount] = useState(0)
   const [errorCount , setErrorCount]= useState(0)
   const [attendanceSummarylist , setAttendanceSummaryList] = useState(false)
   const [showSuccess, setShowSuccess] =useState(false)
   const [showError, setShowError] =useState(false)
   const [showExcludedData, setExcludedData] =useState(false)
  const handlesummarylist=()=>{
      setAttendanceSummaryList(false)
  }
  const handleattendanceSummaryList=()=>{
      setAttendanceSummaryList(true)
  }

  useEffect(()=>{

    summaryData?.then((res)=>{
      // console.log('res',res)

     errorData.push({
          message:res.payload.message,
          data:res.payload.data,
          excludedData:res.payload.excludedData
       })
       errorData[errorData.length-1]?.data?.results?.map((item)=>{
        if(item.success){
            setSuccessCount(successCount=> successCount+1)
        }
        else {
            setErrorCount(errorCount=>errorCount+1) 
        }})
    })?.catch((error)=>{
       console.log("Error in Bulk Data" ,error)
    })
 
     
  } ,[summaryData,errorData,refresh])
  return (
    <Modal
      title={<h1 className='text-[20px] font-bold'>Summary of Attendance Upload</h1>}
      visible={visible}
      onCancel={()=>{  
        onClose()
       }}
      footer={null}  // If you don't want a footer
      className='w-[550px]'
      cancelText="Close"
    >
      {/* <h1 className='text-red-500'> Message -{errorData[errorData.length-1]?.message}</h1> */}
      <div className=''> 
       <div> 
          <h1 className='text-green-500 font-bold text-[15px]' onClick={()=>{
                    handleattendanceSummaryList()
                    setShowSuccess(true)
                    setShowError(false)
                    setExcludedData(false)
          }}> Success - {successCount}</h1>
            {/* {console.log('errorData',errorData)} */}
       </div>
         <div> 
           <h1 className='text-red-500 font-bold text-[15px]' onClick={()=>{
                   handleattendanceSummaryList()
                   setShowSuccess(false)
                   setShowError(true)
                   setExcludedData(false)
           }}> Errors - {errorCount} </h1>
          
         </div>
         <div> 
             <h1 className='text-red-500 font-bold text-[15px]' onClick={()=>{
                   handleattendanceSummaryList()
                   setShowSuccess(false)
                   setShowError(false)
                   setExcludedData(true)
             }}> InCompleted Entries - {excludedDataEntries?.length>0 ? excludedDataEntries?.length:0} </h1>
         </div>
         
         <Modal
          title={<h1 className='text-[20px] font-bold'>Detailed list of records</h1>}
          visible={attendanceSummarylist}
          onCancel={handlesummarylist}
          footer={null}  // If you don't want a footer
          className='w-[850px]'
          cancelText="Close"
        >
         {showSuccess && <>
           {errorData[errorData.length-1]?.data?.results?.map((item)=>{
                if(item.success){
                    return <p className='text-green-500'> {item.message}</p>
                }
              })}
         </>} 
         {showError && 
         <>
          {errorData[errorData.length-1]?.data?.results?.map((item)=>{
                if(!item.success){
                    return <p className='text-red-500'> {item.message}</p>
                }
            })}</>}
         {showExcludedData && <>
          {excludedDataEntries?.length > 0 && 
              <div> 
              <h1 className='text-red-500 font-bold text-[15px]' onClick={handleattendanceSummaryList}> InCompleted Entries - {excludedDataEntries?.length} </h1>
              {excludedDataEntries?.map((item)=>{
                      return <p className='text-red-500'> The format is not proper for entry {item.emailId} with date {item.date}, status {item.status} and log {item.log}</p>
              })}
          </div>
         }
         </> }
          
        </Modal>
     </div>
    </Modal>
  );
};

export default AttendanceSummary;