import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceDataByEmail, loadAllbulkAttendance } from "../redux/rtk/features/attendance/attendanceSlice";
import { useEffect, useState } from "react";
import moment from "moment";
import { loadAllPublicHoliday } from "../redux/rtk/features/publicHoliday/publicHolidaySlice";



const TotalPayableDays = (email ,month, year , attendancelist, publicHolidayList ,list) => {

//    const dispatch= useDispatch()
//    const [workingdays, setworkingdays] = useState()

        // console.log('attendancelist',attendancelist,'publicHolidayList',publicHolidayList,'list',list)
const calculateLateComingAndTotalAbsentiesTime=(startdate , enddate)=>{
    //   console.log('users',users)
	const userMap = new Map(list.map(user => [user.email, user]));
    
	const formattedList = attendancelist?.reduce((result, item) => {
     const user = userMap.get(item.emailId);
 
      if (user) {
			const { shift,weeklyHoliday ,employeeId , leaveApplication} = user;
			const newItem = { ...item, shift,weeklyHoliday,employeeId,leaveApplication };
		
			const existingEntry = result.find(entry => entry.emailId === item.emailId);
				if (existingEntry) {
				  existingEntry.data.push({
					id: newItem.id,
					date: newItem.date,
					status: newItem.status,
					log: newItem.log,
					emailId: newItem.emailId,
					userData: newItem.userData,
					shift: newItem.shift,
					weeklyHoliday:newItem.weeklyHoliday,
					employeeId:employeeId
				});
				} else {
				result.push({
					emailId: newItem.emailId,
					data: [{
					id: newItem.id,
					date: newItem.date,
					status: newItem.status,
					log: newItem.log,
					emailId: newItem.emailId,
					userData: newItem.userData,
					shift: newItem.shift,
					weeklyHoliday:newItem.weeklyHoliday,
					employeeId:employeeId
					}],
					leaveApplication: leaveApplication,
				});
				}
   			}
 
  		 return result;
 		}, []);
		//  console.log('formattedList',formattedList)
    const updatedAttendanceList = formattedList?.map(entry => {

		const { emailId, data, leaveApplication } = entry;

	    //    console.log('leaveApplication',leaveApplication,'data',data)
		let totalAbsenties = 0;
		let totalLateComings = 0;
		let totalLongBreaks=0;
		let totalHalfDays = 0;
		let totalSickLeaves=0;
		let totalCausalLeaves=0;
		let totalPaidLeaves=0;
		let totalUnPaidLeaves=0;
		let totalPaidLeavesX=0;
        let totaldaysWorked=0;
        let totalPayableDays=0
		// Create an array of all dates within the specified range, excluding Saturdays and Sundays
		
		const allDates = [];
		let currentDate = moment(startdate, 'DD/MM/YYYY');
		const endDate = moment(enddate, 'DD/MM/YYYY');
		const weeklyHolidayStartDay = data.length > 0 ? data[0].weeklyHoliday?.startDay : 0;
		const weeklyHolidayEndDay = data.length > 0 ? data[0].weeklyHoliday?.endDay : 0;
        let excludeStartDay
		let excludeEndDay 
        if(weeklyHolidayStartDay==='Sunday'){
			excludeStartDay=0
		}else  if(weeklyHolidayStartDay==='Monday' ){
			excludeStartDay=1
		} else  if(weeklyHolidayStartDay==='Tuesday' ){
			excludeStartDay=2
		} else  if(weeklyHolidayStartDay==='Wednesday'){
			excludeStartDay=3
		} else  if(weeklyHolidayStartDay==='Thursday' ){
			excludeStartDay=4
		} else  if(weeklyHolidayStartDay==='Friday' ){
			excludeStartDay=5
		}
		else  if(weeklyHolidayStartDay==='Saturday'){
			excludeStartDay=6
		}

		if(weeklyHolidayEndDay==='Sunday'){
			excludeEndDay=0
		}else  if(weeklyHolidayEndDay==='Monday' ){
			excludeEndDay=1
		} else  if(weeklyHolidayEndDay==='Tuesday' ){
			excludeEndDay=2
		} else  if(weeklyHolidayEndDay==='Wednesday'){
			excludeEndDay=3
		} else  if(weeklyHolidayEndDay==='Thursday' ){
			excludeEndDay=4
		} else  if(weeklyHolidayEndDay==='Friday' ){
			excludeEndDay=5
		}
		else  if(weeklyHolidayEndDay==='Saturday'){
			excludeEndDay=6
		}
		const publicHolidays = publicHolidayList.list.map(holiday => moment(holiday.date).format('MM/DD/YY'));
		while (currentDate.isSameOrBefore(endDate)) {
		  // Exclude Saturdays (day 6) and Sundays (day 0)

		  if (![excludeStartDay, excludeEndDay].includes(currentDate.day()) && !publicHolidays.includes(currentDate.format('MM/DD/YY'))) {
			allDates.push(currentDate.format('MM/DD/YY'));
		}
		  currentDate = currentDate.add(1, 'days');
		}


		function calculateTotalMinutes(timeString) {
			if (!timeString) {
				return 0;
			}
	
			const [hours, minutes] = timeString.split(':').map(Number);
			return hours * 60 + minutes;
		}

	          
		
		  
		   // Calculate totalUnpaidLeaves
				allDates.forEach(date => {
					const dateExists = data.some(item => item.date === date);
					if (!dateExists) {
						totalUnPaidLeaves+=1;
					}
				});
				            
				const remainingDates = allDates.filter(date => !data.some(item => item.date === date));
				data.forEach(item => {
					if (allDates.includes(item.date)) {
						// Date matches, check status
						if (item.status ==='Uninformed' || item.status==='UnApproved leave' || item.status==='sickLeave(UnPaid)' || item.status==="causalLeave(UnPaid)") {
							// Do something based on the status
							totalUnPaidLeaves+=1;
						}
					}
				});

				// Calculate totalPaidLeaves
				data.forEach(item => {
					if (allDates.includes(item.date)) {
						// Date matches, check status
						if (item.status==='sickLeave(Paid)' || item.status==="causalLeave(Paid)") {
							// Do something based on the status
							totalPaidLeaves+=1;
						}
					}
				});

				// console.log('remainingDates',remainingDates,'leaveApplication',leaveApplication) 
				remainingDates.forEach(date => {
					leaveApplication.forEach(item => {
						const leaveFrom = new Date(item.acceptLeaveFrom);
						const leaveTo = new Date(item.acceptLeaveTo);
						const currentDate = new Date(date);
						
							currentDate.setHours(0, 0, 0, 0)
							leaveFrom.setHours(0, 0, 0, 0);
							leaveTo.setHours(0, 0, 0, 0);

						if (currentDate >= leaveFrom && currentDate <= leaveTo && item.status === "ACCEPTED" && item.paidOrUnpaid==='Paid') {
							totalPaidLeaves+=1;
							totalPaidLeavesX+=1;
						}
						else if(currentDate >= leaveFrom && currentDate <= leaveTo && item.status === "ACCEPTED" && item.paidOrUnpaid==='UnPaid'){
							totalUnPaidLeaves+=1
						}

					});
				});
               


             
		    //  Calculate totalSickleaves
			
			
			data.forEach(item => {
				if (allDates.includes(item.date)) {
					// Date matches, check status
					if (item.status==='sickLeave(Paid)' || item.status==='sickLeave(UnPaid)') {
						// Do something based on the status
						totalSickLeaves+=1;
					}
				}
			});

             //    console.log('leaveApplication',leaveApplication)
			remainingDates.forEach(date => {
				leaveApplication.forEach(item => {
					const leaveFrom = new Date(item.acceptLeaveFrom);
					const leaveTo = new Date(item.acceptLeaveTo);
					const currentDate = new Date(date);
						currentDate.setHours(0, 0, 0, 0)
						leaveFrom.setHours(0, 0, 0, 0);
						leaveTo.setHours(0, 0, 0, 0);

					if (currentDate >= leaveFrom && currentDate <= leaveTo && item.status === "ACCEPTED" && item.leaveType==='sickLeave') {
						totalSickLeaves+=1;
					}
				});
			});


			// Iterate over each date in alldates array
			 allDates.forEach(date => {
				const entriesForDate = data.filter(item => moment(item.date, 'MM/DD/YY').format('MM/DD/YY') === moment(date, 'MM/DD/YY').format('MM/DD/YY'));
				// entriesForDate.sort((a, b) => moment(a.log, 'h:mm:ss A').diff(moment(b.log, 'h:mm:ss A')));
				
				let totalTimeWorked = 0;
				let totalBreakTime = 0;
				let ishalfday=false
				// console.log('entriesForDate ',entriesForDate)
				let breakDuration=0
                // logic for reset StartTime and endTime
				const updatedEntries = entriesForDate.map((entry, index, array) => {
					const shiftStartTime = moment(data[0]?.shift?.startTime).format('h:mm:ss A');
					const formattedStartTime=moment(shiftStartTime,'h:mm:ss A');
					const shiftEndTime = moment(data[0]?.shift?.endTime).format('h:mm:ss A');
					const formattedEndTime=moment(shiftEndTime,'h:mm:ss A');
					const outGraceTime = moment.duration(data[0]?.shift?.outgraceTime, 'minutes');
					const inGraceTime = moment.duration(data[0]?.shift?.outgraceTime, 'minutes');
					const logTime = moment(entry.log, 'h:mm:ss A');
				
					if (index === 0 && logTime.isBefore(formattedStartTime)) {
						// Update the log time to the shift's start time
						 if(data[0]?.shift?.graceTimeCheckbox && logTime.isAfter(formattedStartTime.add(inGraceTime))){
							ishalfday=true
						   }
						return { ...entry, log: formattedStartTime.format('h:mm:ss A') };
					}
					if (index === array.length - 1 && logTime.isAfter(formattedEndTime.add(outGraceTime))) {
						// Update the log time to the shift's end time + out grace time
						return { ...entry, log: formattedEndTime.add(outGraceTime).format('h:mm:ss A') };
					}
					return entry;
				});
				
			//    console.log('updatedEntries ',updatedEntries)
				// Iterate over entries to calculate total time worked and break time
				for (let index = 0; index < updatedEntries.length; index++) {
					const entry = updatedEntries[index];
					const logTime = moment(entry.log, 'h:mm:ss A');
			
					if (entry.status === 'In' && index < updatedEntries.length - 1) {
						const nextEntry = updatedEntries[index + 1];
			
						if (nextEntry.status === 'Out') {
							const outTime = moment(nextEntry.log, 'h:mm:ss A');
							const duration = moment.duration(outTime.diff(logTime));
							// console.log('duration.asMinutes()',duration.asMinutes())
							totalTimeWorked += duration.asMinutes();
						}
					} 
					// console.log('totalTimeWorked',totalTimeWorked)
					// Add break time if the entry has a breakTime defined
					const breakTime = calculateTotalMinutes(entry?.shift?.breakTime);
					totalBreakTime += breakTime;
				}
			
				const shiftbreakTime = parseInt(data[0]?.shift?.breakTime);
				const graceTime =data[0]?.shift ? data[0]?.shift?.ingraceTime:""
				// const graceTimeMinutes = graceTime.minute();
				const shiftWorkhours = updatedEntries[0]?.shift ? data[0]?.shift?.workHour : 0;
				const formattedShiftworkHours = parseInt(shiftWorkhours) - shiftbreakTime;
				const totalShiftworkMinutes = formattedShiftworkHours - parseInt(graceTime);
			  
				

				let loopLength = (updatedEntries.length - 2)/2
				let i=0
				let index=1
				let indextwo=2
				while(i < loopLength){
					const entry = updatedEntries[index];
					const logTimeIn = moment(entry.log, 'h:mm:ss A');
					const logTimeOut = moment(updatedEntries[indextwo].log, 'h:mm:ss A');
					const duration = moment.duration(logTimeOut.diff(logTimeIn));
					breakDuration += duration.asMinutes();	
					index =index +2
					indextwo =indextwo+2
					i=i+1
				}

			    // console.log('data[0]?.shift?.breakTimeCheckbox',data[0]?.shift?.breakTimeCheckbox , 'breakDuration',breakDuration,'shiftbreakTime',shiftbreakTime)
				if((data[0]?.shift?.breakTimeCheckbox && (breakDuration > shiftbreakTime))){
					totalHalfDays +=1
				 }
				
				// Compare total time worked with total shift work minutes
				else if ((totalTimeWorked < totalShiftworkMinutes) && !ishalfday ) {
					// If yes, increment totalHalfDays
					totalHalfDays += 1;
				}

			//   console.log('totalTimeWorked',totalTimeWorked,'totalShiftworkMinutes',totalShiftworkMinutes,entriesForDate)
			});
			
		  
			allDates.forEach(date => {
				const entriesForDate = data.filter(item => moment(item.date, 'MM/DD/YY').format('MM/DD/YY') === moment(date, 'MM/DD/YY').format('MM/DD/YY'));
				let breakDuration=0


                // logic for reset StartTime and endTime
				const updatedEntries = entriesForDate.map((entry, index, array) => {
					const shiftStartTime = moment(data[0]?.shift?.startTime).format('h:mm:ss A');
					const formattedStartTime=moment(shiftStartTime,'h:mm:ss A');
					const shiftEndTime = moment(data[0]?.shift?.endTime).format('h:mm:ss A');
					const formattedEndTime=moment(shiftEndTime,'h:mm:ss A');
					const outGraceTime = moment.duration(data[0]?.shift?.outgraceTime, 'minutes');
				
					const logTime = moment(entry.log, 'h:mm:ss A');
				
					if (index === 0 && logTime.isBefore(formattedStartTime)) {
						// Update the log time to the shift's start time
						return { ...entry, log: formattedStartTime.format('h:mm:ss A') };
					}
					if (index === array.length - 1 && logTime.isAfter(formattedEndTime.add(outGraceTime))) {
						// Update the log time to the shift's end time + out grace time
						return { ...entry, log: formattedEndTime.add(outGraceTime).format('h:mm:ss A') };
					}
					return entry;
				});



				// Ignore the first and last entries
				let loopLength = (updatedEntries.length - 2)/2
				let i=0
				let index=1
				let indextwo=2
				while(i < loopLength){
					const entry = updatedEntries[index];
					const logTimeIn = moment(entry.log, 'h:mm:ss A');
					const logTimeOut = moment(updatedEntries[indextwo].log, 'h:mm:ss A');
					const duration = moment.duration(logTimeOut.diff(logTimeIn));
					breakDuration += duration.asMinutes();	
					index =index +2
					indextwo =indextwo+2
					i=i+1
				}

				// console.log('breakDuration',breakDuration,entriesForDate,'loopLength',loopLength)
				const shiftbreakTime = parseInt(data[0]?.shift?.breakTime);
				const shiftbreakTimeMinutes = shiftbreakTime
			    // console.log('shiftbreakTimeMinutes',shiftbreakTimeMinutes)
	
				 if (breakDuration > shiftbreakTimeMinutes) {
				   // If break time exceeds the threshold, increment totalLongBreaks
				   totalLongBreaks += 1;
			   }
			});
		// Check each date in the range
		// console.log('allDates',allDates)
	
		allDates.forEach(date => {
			const inEntry = data.find(item =>
				{  
                   return (moment(item.date, 'MM/DD/YY').isSame(date, 'day') && item.status === 'In')
				}
				
			);
		    // console.log('inEntry',inEntry, 'data',data,'allDates',allDates)
	
		  if (inEntry) {
			const shiftStartTime = moment(inEntry.shift ? inEntry.shift.startTime: '').format('h:mm:ss A')
            const graceTime = inEntry.shift ? parseInt(inEntry.shift.ingraceTime):'' 
			// const graceTimeMinutes = graceTime.minute();
			const formatedStarttime = moment(shiftStartTime,'h:mm:ss A');
			const formatedStartWithGrace = formatedStarttime.clone().add('minute',parseInt(graceTime))
			const logTime = moment(inEntry.log, 'h:mm:ss A');
			// console.log('logTimelogTime',logTime,'formatedStartWithGrace',formatedStartWithGrace)
			if (logTime.isAfter(formatedStartWithGrace)) {
				 // If yes, increment totalLateComings
				 totalLateComings += 1;
			}
            totaldaysWorked +=1;
		  } else {
			    // If no data for the date, increment totalAbsenties
			    totalAbsenties += 1;
		  }
		})
		totalUnPaidLeaves = totalUnPaidLeaves - totalPaidLeavesX
        totalPayableDays = totaldaysWorked + totalPaidLeaves
		// Return a new object with the existing properties, totalAbsenties, and totalLateComings
		return { emailId, data, totalAbsenties, totalLateComings, totalSickLeaves, totalCausalLeaves, totalHalfDays , totalLongBreaks, totalPaidLeaves, totalUnPaidLeaves,totaldaysWorked,totalPayableDays };
	  });
	  return updatedAttendanceList
	//   console.log('updatedAttendanceList',updatedAttendanceList);
	//   dispatch(setAttendanceList(updatedAttendanceList))
  }


function formatDate(date) {
            // Format the date as dd/mm/yyyy
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    
        function getMonthStartAndEndDate(month, year) {
            // Create a new Date object for the given month and year
            const startDate = new Date(year, month - 1, 1); // Month is zero-based, so we subtract 1
            const endDate = new Date(year, month, 0); // Get the last day of the month
    
            // Format the dates
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
    
            return { startDate: formattedStartDate, endDate: formattedEndDate };
        }
    
    
    const { startDate, endDate } = getMonthStartAndEndDate(month, year);
    
    // console.log("Start Date:", startDate);
    // console.log("End Date:", endDate);

        
   const updatedList= calculateLateComingAndTotalAbsentiesTime(startDate,endDate)
   const filteredUpdatedList=updatedList.filter(item => item.emailId === email)

//    console.log('updatedList',updatedList,'filteredUpdatedList',filteredUpdatedList,'email',email)
   if(filteredUpdatedList){
    return filteredUpdatedList[0]?.totalPayableDays ? filteredUpdatedList[0]?.totalPayableDays :0
   }
   else {
    return 0
   }
};

export default TotalPayableDays;
